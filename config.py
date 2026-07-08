"""
config.py
---------
Central place where all configuration values are loaded from the .env file.
Every other file in this project imports settings from here instead of
reading environment variables directly. This keeps configuration consistent
and makes the app easier to debug.
"""

import os
from dotenv import load_dotenv

# Load variables from the .env file into the environment.
# This MUST run before anything below tries to read os.environ.
load_dotenv()


class Config:
    # ---------- Flask ----------
    SECRET_KEY = os.getenv("FLASK_SECRET_KEY", "dev-secret-key-change-me")
    DEBUG = os.getenv("FLASK_DEBUG", "True").lower() in ("1", "true", "yes")
    PORT = int(os.getenv("PORT", "5000"))

    # ---------- TMDb ----------
    TMDB_API_KEY = os.getenv("TMDB_API_KEY", "")
    TMDB_BASE_URL = "https://api.themoviedb.org/3"
    TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/"
    TMDB_POSTER_SIZE = "w500"
    TMDB_BACKDROP_SIZE = "w1280"

    # ---------- AI Provider ----------
    AI_PROVIDER = os.getenv("AI_PROVIDER", "openai").lower()

    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
    OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")

    ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")
    ANTHROPIC_MODEL = os.getenv("ANTHROPIC_MODEL", "claude-sonnet-5")

    @classmethod
    def tmdb_configured(cls):
        return bool(cls.TMDB_API_KEY and cls.TMDB_API_KEY != "your_tmdb_api_key_here")

    @classmethod
    def ai_configured(cls):
        if cls.AI_PROVIDER == "openai":
            return bool(cls.OPENAI_API_KEY and cls.OPENAI_API_KEY != "your_openai_api_key_here")
        if cls.AI_PROVIDER == "anthropic":
            return bool(cls.ANTHROPIC_API_KEY and cls.ANTHROPIC_API_KEY != "your_anthropic_api_key_here")
        return False


config = Config()
