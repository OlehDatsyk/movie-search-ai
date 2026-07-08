"""
app.py
------
Entry point for the AI Movie Assistant Flask application.
Run with:  python app.py
"""

from flask import Flask, render_template, request, jsonify
from config import config
from services import tmdb_service, ai_service
from services.tmdb_service import TMDbError

app = Flask(__name__)
app.config["SECRET_KEY"] = config.SECRET_KEY


# ---------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------

def error_response(message, status=400):
    return jsonify({"error": message}), status


# ---------------------------------------------------------------------
# Page routes
# ---------------------------------------------------------------------

@app.route("/")
def index():
    return render_template("index.html")


# ---------------------------------------------------------------------
# Health check (helps with troubleshooting - see README)
# ---------------------------------------------------------------------

@app.route("/api/health")
def health():
    return jsonify({
        "status": "ok",
        "tmdb_configured": config.tmdb_configured(),
        "ai_provider": config.AI_PROVIDER,
        "ai_configured": config.ai_configured(),
    })


# ---------------------------------------------------------------------
# Movie search & details
# ---------------------------------------------------------------------

@app.route("/api/search")
def api_search():
    query = request.args.get("q", "").strip()
    page = request.args.get("page", 1, type=int)

    if not query:
        return error_response("Missing search query. Use ?q=movie+name")

    try:
        data = tmdb_service.search_movies(query, page=page)
        return jsonify(data)
    except TMDbError as exc:
        return error_response(str(exc), 502)


@app.route("/api/movie/<int:movie_id>")
def api_movie_details(movie_id):
    try:
        movie = tmdb_service.get_movie_details(movie_id)
        return jsonify(movie)
    except TMDbError as exc:
        return error_response(str(exc), 502)


@app.route("/api/popular")
def api_popular():
    try:
        movies = tmdb_service.get_popular_movies(limit=12)
        return jsonify({"results": movies})
    except TMDbError as exc:
        return error_response(str(exc), 502)


# ---------------------------------------------------------------------
# AI-powered features
# ---------------------------------------------------------------------

@app.route("/api/why-like", methods=["POST"])
def api_why_like():
    body = request.get_json(silent=True) or {}
    movie_id = body.get("movie_id")
    preferences = (body.get("preferences") or "").strip()

    if not movie_id:
        return error_response("movie_id is required.")

    try:
        movie = tmdb_service.get_movie_details(movie_id)
    except TMDbError as exc:
        return error_response(str(exc), 502)

    try:
        explanation = ai_service.explain_why_like(movie, preferences)
    except Exception as exc:  # noqa: BLE001
        return error_response(f"AI request failed: {exc}", 502)

    return jsonify({"movie": movie, "explanation": explanation})


@app.route("/api/compare", methods=["POST"])
def api_compare():
    body = request.get_json(silent=True) or {}
    movie_id_1 = body.get("movie_id_1")
    movie_id_2 = body.get("movie_id_2")

    if not movie_id_1 or not movie_id_2:
        return error_response("movie_id_1 and movie_id_2 are both required.")

    try:
        movie1 = tmdb_service.get_movie_details(movie_id_1)
        movie2 = tmdb_service.get_movie_details(movie_id_2)
    except TMDbError as exc:
        return error_response(str(exc), 502)

    try:
        comparison = ai_service.compare_movies(movie1, movie2)
    except Exception as exc:  # noqa: BLE001
        return error_response(f"AI request failed: {exc}", 502)

    return jsonify({"movie1": movie1, "movie2": movie2, "comparison": comparison})


@app.route("/api/similar", methods=["POST"])
def api_similar():
    body = request.get_json(silent=True) or {}
    movie_id = body.get("movie_id")

    if not movie_id:
        return error_response("movie_id is required.")

    try:
        source_movie = tmdb_service.get_movie_details(movie_id)
        similar_movies = tmdb_service.get_similar_movies(movie_id)
        if not similar_movies:
            similar_movies = tmdb_service.get_recommendations(movie_id)
    except TMDbError as exc:
        return error_response(str(exc), 502)

    explanation = ""
    if similar_movies:
        try:
            explanation = ai_service.suggest_similar_explained(source_movie, similar_movies)
        except Exception as exc:  # noqa: BLE001
            explanation = f"(AI explanation unavailable: {exc})"

    return jsonify({
        "source_movie": source_movie,
        "similar_movies": similar_movies,
        "explanation": explanation,
    })


@app.route("/api/mood", methods=["POST"])
def api_mood():
    body = request.get_json(silent=True) or {}
    mood = (body.get("mood") or "").strip()

    if not mood:
        return error_response("mood is required.")

    try:
        movies, genres_used = tmdb_service.suggest_by_mood(mood)
    except TMDbError as exc:
        return error_response(str(exc), 502)

    explanation = ""
    if movies:
        try:
            explanation = ai_service.explain_mood_picks(mood, movies, genres_used)
        except Exception as exc:  # noqa: BLE001
            explanation = f"(AI explanation unavailable: {exc})"

    return jsonify({"movies": movies, "genres_used": genres_used, "explanation": explanation})


@app.route("/api/chat", methods=["POST"])
def api_chat():
    body = request.get_json(silent=True) or {}
    history = body.get("history", [])

    if not isinstance(history, list) or not history:
        return error_response("history must be a non-empty list of {role, content} messages.")

    # Basic validation / sanitation of the incoming conversation history.
    cleaned = []
    for msg in history[-20:]:  # keep the last 20 turns to control token usage
        role = msg.get("role")
        content = msg.get("content", "")
        if role in ("user", "assistant") and isinstance(content, str) and content.strip():
            cleaned.append({"role": role, "content": content.strip()})

    if not cleaned:
        return error_response("No valid messages found in history.")

    try:
        result = ai_service.chat_with_tools(cleaned)
    except Exception as exc:  # noqa: BLE001
        return error_response(f"AI request failed: {exc}", 502)

    return jsonify(result)


# ---------------------------------------------------------------------
# Error handlers
# ---------------------------------------------------------------------

@app.errorhandler(404)
def not_found(_e):
    return jsonify({"error": "Not found."}), 404


@app.errorhandler(500)
def server_error(_e):
    return jsonify({"error": "Internal server error."}), 500


if __name__ == "__main__":
    app.run(debug=config.DEBUG, port=config.PORT, host="0.0.0.0")
