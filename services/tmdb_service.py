"""
tmdb_service.py
----------------
A thin, friendly wrapper around The Movie Database (TMDb) API.
Every function returns plain Python dictionaries/lists that are already
"cleaned up" (full poster URLs, readable release years, etc.) so the rest
of the app never has to deal with raw TMDb JSON quirks.
"""

import requests
from config import config

# Maps genre names (lowercase, as a human or the AI might say them) to TMDb genre IDs.
# TMDb's official genre list for movies.
GENRE_NAME_TO_ID = {
    "action": 28,
    "adventure": 12,
    "animation": 16,
    "comedy": 35,
    "crime": 80,
    "documentary": 99,
    "drama": 18,
    "family": 10751,
    "fantasy": 14,
    "history": 36,
    "horror": 27,
    "music": 10402,
    "mystery": 9648,
    "romance": 10749,
    "science fiction": 878,
    "sci-fi": 878,
    "tv movie": 10770,
    "thriller": 53,
    "war": 10752,
    "western": 37,
}

# Simple keyword -> genre-name mapping used by the "Suggest movies by mood" feature.
MOOD_TO_GENRES = {
    "happy": ["comedy", "family", "animation"],
    "cheerful": ["comedy", "family", "animation"],
    "funny": ["comedy"],
    "sad": ["drama", "romance"],
    "heartbroken": ["drama", "romance"],
    "emotional": ["drama"],
    "excited": ["action", "adventure"],
    "adrenaline": ["action", "thriller"],
    "energetic": ["action", "adventure"],
    "scared": ["horror", "thriller"],
    "spooky": ["horror"],
    "creepy": ["horror", "mystery"],
    "romantic": ["romance", "comedy"],
    "love": ["romance"],
    "thoughtful": ["science fiction", "mystery", "drama"],
    "mind-bending": ["science fiction", "mystery"],
    "curious": ["mystery", "documentary"],
    "relaxed": ["comedy", "family", "animation"],
    "chill": ["comedy", "family"],
    "cozy": ["family", "animation", "comedy"],
    "nostalgic": ["family", "animation", "adventure"],
    "adventurous": ["adventure", "fantasy", "action"],
    "inspired": ["drama", "history", "documentary"],
    "motivated": ["drama", "history"],
    "tense": ["thriller", "crime", "mystery"],
    "dark": ["thriller", "crime", "horror"],
    "epic": ["fantasy", "adventure", "war"],
}


class TMDbError(Exception):
    """Raised when a TMDb API call fails."""
    pass


def _get(endpoint, params=None):
    """Internal helper: performs a GET request against the TMDb API."""
    if not config.tmdb_configured():
        raise TMDbError(
            "TMDb API key is missing. Add TMDB_API_KEY to your .env file. "
            "See the README for instructions on getting a free key."
        )

    url = f"{config.TMDB_BASE_URL}{endpoint}"
    query = {"api_key": config.TMDB_API_KEY, "language": "en-US"}
    if params:
        query.update(params)

    try:
        response = requests.get(url, params=query, timeout=10)
    except requests.exceptions.RequestException as exc:
        raise TMDbError(f"Could not reach TMDb (network error): {exc}") from exc

    if response.status_code == 401:
        raise TMDbError("TMDb rejected the API key (401 Unauthorized). Double-check TMDB_API_KEY in your .env file.")
    if response.status_code == 404:
        raise TMDbError("The requested resource was not found on TMDb (404).")
    if not response.ok:
        raise TMDbError(f"TMDb API error {response.status_code}: {response.text[:200]}")

    return response.json()


def _poster_url(path, size=None):
    if not path:
        return None
    return f"{config.TMDB_IMAGE_BASE_URL}{size or config.TMDB_POSTER_SIZE}{path}"


def _year(date_str):
    if date_str and len(date_str) >= 4:
        return date_str[:4]
    return "N/A"


def _simplify_movie(movie):
    """Converts a raw TMDb movie object into a compact, frontend-friendly dict."""
    return {
        "id": movie.get("id"),
        "title": movie.get("title") or movie.get("name") or "Untitled",
        "overview": movie.get("overview") or "No description available.",
        "release_date": movie.get("release_date") or "",
        "year": _year(movie.get("release_date")),
        "rating": round(movie.get("vote_average", 0) or 0, 1),
        "vote_count": movie.get("vote_count", 0),
        "poster_url": _poster_url(movie.get("poster_path")),
        "backdrop_url": _poster_url(movie.get("backdrop_path"), config.TMDB_BACKDROP_SIZE),
        "genre_ids": movie.get("genre_ids", []),
        "popularity": movie.get("popularity", 0),
    }


def search_movies(query, page=1):
    """Searches TMDb for movies matching a text query."""
    if not query or not query.strip():
        return {"results": [], "total_results": 0, "page": 1, "total_pages": 0}

    data = _get("/search/movie", {"query": query.strip(), "page": page, "include_adult": "false"})
    results = [_simplify_movie(m) for m in data.get("results", [])]
    return {
        "results": results,
        "total_results": data.get("total_results", 0),
        "page": data.get("page", 1),
        "total_pages": data.get("total_pages", 0),
    }


def get_movie_details(movie_id):
    """Fetches full details for a single movie, including cast and keywords."""
    data = _get(f"/movie/{movie_id}", {"append_to_response": "credits,keywords,videos"})

    cast = [
        {"name": c.get("name"), "character": c.get("character")}
        for c in data.get("credits", {}).get("cast", [])[:8]
    ]
    directors = [
        c.get("name") for c in data.get("credits", {}).get("crew", [])
        if c.get("job") == "Director"
    ]
    keywords = [k.get("name") for k in data.get("keywords", {}).get("keywords", [])][:10]

    trailer_key = None
    for v in data.get("videos", {}).get("results", []):
        if v.get("site") == "YouTube" and v.get("type") == "Trailer":
            trailer_key = v.get("key")
            break

    simplified = _simplify_movie(data)
    simplified.update({
        "genres": [g["name"] for g in data.get("genres", [])],
        "runtime": data.get("runtime"),
        "tagline": data.get("tagline"),
        "cast": cast,
        "directors": directors,
        "keywords": keywords,
        "trailer_key": trailer_key,
        "original_language": data.get("original_language"),
        "budget": data.get("budget"),
        "revenue": data.get("revenue"),
        "status": data.get("status"),
    })
    return simplified


def get_similar_movies(movie_id, limit=10):
    """Returns TMDb's algorithmic 'similar movies' list for a given movie."""
    data = _get(f"/movie/{movie_id}/similar", {"page": 1})
    results = [_simplify_movie(m) for m in data.get("results", [])[:limit]]
    return results


def get_recommendations(movie_id, limit=10):
    """Returns TMDb's 'recommended if you liked this' list."""
    data = _get(f"/movie/{movie_id}/recommendations", {"page": 1})
    results = [_simplify_movie(m) for m in data.get("results", [])[:limit]]
    return results


def discover_by_genres(genre_names, limit=12, sort_by="popularity.desc"):
    """Finds popular movies matching one or more genre names (e.g. ['comedy', 'family'])."""
    genre_ids = []
    for name in genre_names:
        gid = GENRE_NAME_TO_ID.get(name.strip().lower())
        if gid and gid not in genre_ids:
            genre_ids.append(gid)

    if not genre_ids:
        # Fall back to popular movies if no genre matched.
        return get_popular_movies(limit)

    data = _get("/discover/movie", {
        "with_genres": ",".join(str(g) for g in genre_ids),
        "sort_by": sort_by,
        "vote_count.gte": 100,
        "page": 1,
    })
    results = [_simplify_movie(m) for m in data.get("results", [])[:limit]]
    return results


def get_popular_movies(limit=12):
    data = _get("/movie/popular", {"page": 1})
    return [_simplify_movie(m) for m in data.get("results", [])[:limit]]


def genres_for_mood(mood_text):
    """Looks up which genres best match a free-text mood description."""
    mood_lower = mood_text.strip().lower()
    matched = set()

    for keyword, genres in MOOD_TO_GENRES.items():
        if keyword in mood_lower:
            matched.update(genres)

    if not matched:
        # Also try matching individual words in case of a multi-word mood.
        for word in mood_lower.split():
            if word in MOOD_TO_GENRES:
                matched.update(MOOD_TO_GENRES[word])

    return list(matched)


def suggest_by_mood(mood_text, limit=12):
    """Main entry point for the 'suggest movies by mood' feature."""
    genres = genres_for_mood(mood_text)
    if not genres:
        # Unknown mood: default to a well-rounded, generally-loved mix.
        genres = ["drama", "comedy", "adventure"]
    movies = discover_by_genres(genres, limit=limit)
    return movies, genres
