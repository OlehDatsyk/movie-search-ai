# 🎬 CineMind — AI Movie Assistant (V3)

CineMind is a full-stack **AI-powered movie assistant** built with **Python, Flask, the TMDb API, and an AI model (OpenAI or Claude)**. It can search movies, chat with you conversationally, recommend films, explain *why* you'd like a movie, compare two movies side-by-side, suggest similar titles, and recommend movies based on your mood — all wrapped in a responsive, dark-mode-friendly chat-style interface.

This README assumes **zero prior experience**. If the only thing you have installed is Visual Studio Code, you will still be able to follow this guide from start to finish.

---

## Table of Contents

1. [What You're Building](#1-what-youre-building)
2. [Features](#2-features)
3. [Project Folder Structure](#3-project-folder-structure)
4. [Prerequisites](#4-prerequisites)
5. [Step 1 — Install Python](#5-step-1--install-python)
6. [Step 2 — Install Git (optional but recommended)](#6-step-2--install-git-optional-but-recommended)
7. [Step 3 — Get the Project Files into VS Code](#7-step-3--get-the-project-files-into-vs-code)
8. [Step 4 — Open the Project in VS Code](#8-step-4--open-the-project-in-vs-code)
9. [Step 5 — Create a Virtual Environment](#9-step-5--create-a-virtual-environment)
10. [Step 6 — Activate the Virtual Environment](#10-step-6--activate-the-virtual-environment)
11. [Step 7 — Install Dependencies](#11-step-7--install-dependencies)
12. [Step 8 — Get Your API Keys](#12-step-8--get-your-api-keys)
13. [Step 9 — Set Up the .env File](#13-step-9--set-up-the-env-file)
14. [Step 10 — Run the Application](#14-step-10--run-the-application)
15. [Using the App](#15-using-the-app)
16. [Troubleshooting](#16-troubleshooting)
17. [Deployment Guide](#17-deployment-guide)
18. [How the Project Works (Architecture)](#18-how-the-project-works-architecture)
19. [API Endpoints Reference](#19-api-endpoints-reference)
20. [License & Credits](#20-license--credits)

---

## 1. What You're Building

A locally-run web application with:

- A **Flask** backend (Python) that exposes a REST API.
- A **vanilla HTML/CSS/JavaScript** frontend (no build tools required — just open your browser).
- A connection to **TMDb** (The Movie Database) for real movie data — posters, ratings, cast, genres.
- A connection to an **AI model** (OpenAI's GPT models or Anthropic's Claude) that powers the conversational assistant, recommendations, and explanations. The AI is given real "tools" it can call to search TMDb itself, so it never has to guess or make up movie facts.

When finished, you'll run **one command** in VS Code's terminal, and a website will be available at `http://127.0.0.1:5000`.

---

## 2. Features

| Feature | Description |
|---|---|
| 🔍 **Movie Search** | Search TMDb's full catalog by title. |
| 💬 **Chat Interface** | Natural conversation with an AI movie expert that can look up real movies. |
| ⌨️ **Typing Animation** | The assistant's replies appear with a smooth typing effect. |
| 🧠 **Conversation History** | Chat history is saved in your browser (`localStorage`) and persists across page reloads. |
| ✨ **AI Recommendations** | Ask for recommendations by genre, actor, mood, or "movies like X". |
| 🤔 **"Why would I like this?"** | Click any movie for an AI-written, personalized explanation. |
| ⚖️ **Compare Movies** | Pick two movies and get an AI breakdown of similarities, differences, and which to pick. |
| 🔗 **Similar Movies** | Get AI-curated "if you liked this, try these" suggestions. |
| 🎭 **Suggest by Mood** | Click a mood chip (Happy, Scared, Romantic, etc.) or type your own mood. |
| 🌙 **Dark Mode** | Toggle between light and dark themes; your choice is remembered. |
| 📱 **Responsive Design** | Works on desktop, tablet, and mobile screens. |

---

## 3. Project Folder Structure

After following this guide, your folder will look like this:

```
movie-ai-assistant/
│
├── app.py                     # Main Flask application (routes / API endpoints)
├── config.py                  # Loads and centralizes all environment variables
├── requirements.txt           # Python dependencies
├── .env.example                # Template for your secret API keys (safe to commit)
├── .env                        # YOUR real API keys (you create this — NEVER commit it)
├── .gitignore                  # Tells Git which files to ignore (like .env)
├── README.md                   # This file
│
├── services/
│   ├── __init__.py
│   ├── tmdb_service.py         # All TMDb API calls live here
│   └── ai_service.py           # All OpenAI / Claude API calls live here
│
├── templates/
│   └── index.html              # The single HTML page (Flask "template")
│
└── static/
    ├── css/
    │   └── style.css           # All styling, including dark mode
    └── js/
        └── app.js               # All frontend logic (tabs, chat, fetch calls)
```

---

## 4. Prerequisites

You need:

- A Windows, macOS, or Linux computer.
- **Visual Studio Code** installed (you said you already have this ✅).
- An internet connection (to install Python packages and call the APIs).
- A free **TMDb** account (for movie data).
- A free/paid **OpenAI** account *or* **Anthropic (Claude)** account (for the AI features).

You do **not** need to know Python already — every command below is copy-pasteable.

---

## 5. Step 1 — Install Python

CineMind requires **Python 3.10 or newer**.

### Check if Python is already installed

1. Open VS Code.
2. Open the built-in terminal: menu **Terminal → New Terminal** (or press `` Ctrl+` `` on Windows/Linux, `` Cmd+` `` on macOS).
3. Type the following and press Enter:

   ```bash
   python --version
   ```

   If that doesn't work, try:

   ```bash
   python3 --version
   ```

4. If you see something like `Python 3.11.4`, you're good — skip to [Step 2](#6-step-2--install-git-optional-but-recommended).
   If you see `command not found` or a version below `3.10`, continue below.

### Installing Python

**Windows:**
1. Go to [https://www.python.org/downloads/](https://www.python.org/downloads/).
2. Click the yellow "Download Python 3.x.x" button.
3. Run the installer.
4. ⚠️ **VERY IMPORTANT:** On the first installer screen, check the box that says **"Add python.exe to PATH"** before clicking Install. If you miss this, Windows won't recognize the `python` command later.
5. Click "Install Now" and wait for it to finish.
6. Close and reopen VS Code's terminal, then re-run `python --version` to confirm.

**macOS:**
1. Go to [https://www.python.org/downloads/](https://www.python.org/downloads/) and download the macOS installer.
2. Run the `.pkg` installer and follow the prompts.
3. Reopen the VS Code terminal and run `python3 --version` to confirm.
   (On macOS, you will likely use `python3` and `pip3` instead of `python` and `pip` throughout this guide.)

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install python3 python3-venv python3-pip -y
python3 --version
```

### Also install the VS Code Python extension

1. Click the **Extensions** icon in VS Code's left sidebar (or press `Ctrl+Shift+X` / `Cmd+Shift+X`).
2. Search for **"Python"** (the official one published by Microsoft).
3. Click **Install**.

This gives you syntax highlighting, IntelliSense, and lets VS Code auto-detect your virtual environment later.

---

## 6. Step 2 — Install Git (optional but recommended)

Git is only needed if you plan to clone this project from a repository or push it to GitHub/GitLab later (see [Deployment Guide](#17-deployment-guide)). If you already have the project files as a ZIP folder, you can **skip this step**.

**Windows:** Download and install from [https://git-scm.com/download/win](https://git-scm.com/download/win) (accept the default options).

**macOS:** Run `git --version` in the terminal — macOS will prompt you to install Xcode Command Line Tools if Git isn't present. Accept the prompt.

**Linux:**
```bash
sudo apt install git -y
```

Verify with:
```bash
git --version
```

---

## 7. Step 3 — Get the Project Files into VS Code

You should have received (or downloaded) a folder called `movie-ai-assistant`. Place it somewhere easy to find, for example:

- Windows: `C:\Users\<YourName>\Documents\movie-ai-assistant`
- macOS/Linux: `~/Documents/movie-ai-assistant`

If instead you're starting from a Git repository:
```bash
git clone <repository-url>
cd movie-ai-assistant
```

---

## 8. Step 4 — Open the Project in VS Code

1. Open VS Code.
2. Go to **File → Open Folder…**
3. Select the `movie-ai-assistant` folder.
4. VS Code will reload with the project's files visible in the left-hand Explorer panel.
5. Open a terminal inside VS Code: **Terminal → New Terminal**. This terminal automatically opens **inside your project folder**, which is important — every command below assumes you're there.

You can confirm you're in the right place by running:

```bash
dir      # Windows (Command Prompt/PowerShell)
ls       # macOS / Linux / Git Bash
```

You should see `app.py`, `requirements.txt`, `templates/`, etc.

---

## 9. Step 5 — Create a Virtual Environment

A **virtual environment** ("venv") is an isolated Python installation just for this project, so its dependencies don't clash with other Python projects on your computer. This is standard practice and strongly recommended.

In the VS Code terminal, run:

**Windows:**
```bash
python -m venv venv
```

**macOS / Linux:**
```bash
python3 -m venv venv
```

This creates a new folder called `venv/` inside your project (it's already excluded from Git via `.gitignore`, so don't worry about it cluttering things up).

> 🕒 This can take 10–30 seconds. If nothing appears to happen, that's normal — wait for the terminal prompt to return.

---

## 10. Step 6 — Activate the Virtual Environment

Activating tells your terminal "use the Python and pip inside `venv/`, not the system-wide one."

**Windows (Command Prompt):**
```bash
venv\Scripts\activate.bat
```

**Windows (PowerShell):**
```powershell
venv\Scripts\Activate.ps1
```

> If PowerShell blocks the script with an error like *"running scripts is disabled on this system"*, run this once first, then try activating again:
> ```powershell
> Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
> ```

**macOS / Linux:**
```bash
source venv/bin/activate
```

### How do I know it worked?

Your terminal prompt will now show `(venv)` at the beginning, like this:

```
(venv) C:\Users\YourName\Documents\movie-ai-assistant>
```
or
```
(venv) yourname@MacBook movie-ai-assistant %
```

Keep this terminal open and **activated** for every step from here on. If you ever close and reopen the terminal, you must run the activation command again before running the app.

---

## 11. Step 7 — Install Dependencies

With the virtual environment activated, install all required Python packages in one command:

```bash
pip install -r requirements.txt
```

(On macOS, if `pip` isn't recognized, use `pip3` instead, or `python3 -m pip install -r requirements.txt`.)

You should see output ending in something like:

```
Successfully installed Flask-3.0.3 Werkzeug-3.0.4 python-dotenv-1.0.1 requests-2.32.3 openai-1.51.0 anthropic-0.36.2 ...
```

This installs:

| Package | Purpose |
|---|---|
| `Flask` | The web server framework |
| `python-dotenv` | Loads your `.env` file's variables |
| `requests` | Makes HTTP calls to the TMDb API |
| `openai` | Official OpenAI Python SDK (used if `AI_PROVIDER=openai`) |
| `anthropic` | Official Anthropic Python SDK (used if `AI_PROVIDER=anthropic`) |
| `Werkzeug` | Flask's underlying WSGI toolkit |

You only strictly need whichever AI SDK matches your chosen provider, but both are installed by default so you can switch providers anytime without reinstalling.

---

## 12. Step 8 — Get Your API Keys

CineMind needs **two** kinds of API keys: one for movie data (TMDb) and one for AI (OpenAI **or** Anthropic — you only need one of these two).

### 12.1 TMDb API Key (required)

1. Go to [https://www.themoviedb.org/](https://www.themoviedb.org/) and click **Sign Up** (top right) to create a free account. Verify your email if asked.
2. Once logged in, click your profile icon → **Settings**.
3. In the left menu, click **API**.
4. Click **Create** (or **Request an API Key**) under "Request an API Key".
5. Choose **Developer** (free, for non-commercial personal projects like this one).
6. Fill out the short form (application name can be "CineMind", URL can be `http://localhost:5000`, and describe it as a personal learning project).
7. Once approved (usually instant), you'll see an **"API Key (v3 auth)"** — a string like `8f3a1c2e9b7d4f6a1e2b3c4d5f6a7b8c`. Copy it.

### 12.2 AI API Key — choose ONE provider

**Option A — OpenAI (default):**
1. Go to [https://platform.openai.com/](https://platform.openai.com/) and sign up / log in.
2. Go to [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys).
3. Click **Create new secret key**, give it a name (e.g. "CineMind"), and click **Create**.
4. **Copy the key immediately** — OpenAI only shows it once. It looks like `sk-proj-...`.
5. Note: new OpenAI accounts may need billing details added at [https://platform.openai.com/settings/organization/billing](https://platform.openai.com/settings/organization/billing) before API calls succeed, even for small amounts of usage.

**Option B — Anthropic (Claude):**
1. Go to [https://console.anthropic.com/](https://console.anthropic.com/) and sign up / log in.
2. Go to **Settings → API Keys**.
3. Click **Create Key**, name it, and copy the value (starts with `sk-ant-...`).
4. Add billing details if prompted.

You only need to obtain the key for the provider you intend to use, set with `AI_PROVIDER` in your `.env` file (see next step).

---

## 13. Step 9 — Set Up the .env File

The `.env` file stores your secret keys **locally** — it is never uploaded to GitHub (thanks to `.gitignore`) and never sent anywhere except to the APIs you're calling.

1. In VS Code's Explorer panel, find the file **`.env.example`**.
2. Right-click it → **Copy**, then right-click the `movie-ai-assistant` folder → **Paste**.
3. Rename the copy to exactly: **`.env`** (no `.example`, and note the leading dot — it has no filename before the dot).

   Alternatively, do this from the terminal:

   **Windows:**
   ```bash
   copy .env.example .env
   ```
   **macOS/Linux:**
   ```bash
   cp .env.example .env
   ```

4. Open `.env` in VS Code (click it in the Explorer) and fill in your real values:

   ```env
   TMDB_API_KEY=your_actual_tmdb_key_here

   AI_PROVIDER=openai
   OPENAI_API_KEY=your_actual_openai_key_here
   OPENAI_MODEL=gpt-4o-mini

   ANTHROPIC_API_KEY=
   ANTHROPIC_MODEL=claude-sonnet-5

   FLASK_SECRET_KEY=any_random_string_you_like
   FLASK_DEBUG=True
   PORT=5000
   ```

   - If you're using **Claude instead of OpenAI**, set `AI_PROVIDER=anthropic` and fill in `ANTHROPIC_API_KEY` instead — you can leave `OPENAI_API_KEY` blank.
   - `FLASK_SECRET_KEY` can be literally any random text — it's used internally by Flask for session security. Example: `FLASK_SECRET_KEY=cinemind-super-secret-42`.
   - Save the file (`Ctrl+S` / `Cmd+S`).

5. Double-check there are **no quotation marks** around the values and **no spaces** around the `=` sign. Correct: `TMDB_API_KEY=abc123`. Incorrect: `TMDB_API_KEY = "abc123"`.

---

## 14. Step 10 — Run the Application

With your virtual environment still activated (you should still see `(venv)` in the prompt) and your `.env` file filled in, run:

```bash
python app.py
```

(macOS may require `python3 app.py`.)

### Expected terminal output

```
 * Serving Flask app 'app'
 * Debug mode: on
WARNING: This is a development server. Do not use it in a production deployment.
 * Running on all addresses (0.0.0.0)
 * Running on http://127.0.0.1:5000
 * Running on http://192.168.1.23:5000
Press CTRL+C to quit
 * Restarting with stat
 * Debugger is active!
 * Debugger PIN: 123-456-789
```

### Open the app

1. Hold `Ctrl` (or `Cmd` on Mac) and click the `http://127.0.0.1:5000` link in the terminal, **or**
2. Open your browser manually and go to: **http://127.0.0.1:5000**

You should see the CineMind interface with the Chat tab active.

To stop the server at any time, click into the terminal and press `Ctrl+C`.

---

## 15. Using the App

- **Chat tab** — type a question like *"Recommend a feel-good comedy from the 2010s"* or click one of the suggestion chips. The AI will use real TMDb data to answer and may show poster cards you can click for more detail.
- **Search tab** — search any movie title; click a result to open its detail modal, where you can ask "Why would I like this?" or "Find similar movies".
- **Mood tab** — click a mood chip (😄 Happy, 👻 Scared, etc.) or type your own mood description.
- **Compare tab** — search and select two movies, then click **Compare Movies** for an AI breakdown.
- **🌙/☀️ button** (top right) — toggles dark/light mode; your preference is remembered on this device.
- **Clear conversation** (below the chat box) — wipes your saved chat history.

---

## 16. Troubleshooting

| Problem | Likely Cause & Fix |
|---|---|
| `'python' is not recognized as an internal or external command` (Windows) | Python wasn't added to PATH during install. Reinstall Python and check **"Add python.exe to PATH"**, or use `py` instead of `python`. |
| `python: command not found` (macOS/Linux) | Use `python3` instead of `python` everywhere in this guide. |
| `ModuleNotFoundError: No module named 'flask'` | Your virtual environment isn't activated, or dependencies weren't installed. Run the activation command from [Step 6](#10-step-6--activate-the-virtual-environment), then `pip install -r requirements.txt` again. |
| `pip: command not found` | Try `pip3` or `python -m pip install -r requirements.txt`. |
| PowerShell: *"running scripts is disabled on this system"* | Run `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser` once, then re-activate. |
| Page loads but search/chat shows *"TMDb API key is missing"* | Your `.env` file is missing, misnamed, or `TMDB_API_KEY` wasn't filled in. Confirm the file is named exactly `.env` (not `.env.example` or `.env.txt`) and restart the server after editing it. |
| Chat/AI features return *"AI request failed"* | Check that `AI_PROVIDER` matches the key you filled in (`openai` needs `OPENAI_API_KEY`; `anthropic` needs `ANTHROPIC_API_KEY`), and that the key is correct and has billing enabled on the provider's site. |
| `401 Unauthorized` from TMDb | Your TMDb key is wrong or not yet approved. Re-copy it from your TMDb account settings. |
| `Address already in use` / port 5000 busy | Another program is using port 5000 (common on macOS due to AirPlay Receiver). Either disable AirPlay Receiver (System Settings → General → AirDrop & Handoff) or change `PORT=5001` in `.env` and restart. |
| Changes to code don't show up in the browser | Make sure `FLASK_DEBUG=True` is set in `.env` (enables auto-reload), then hard-refresh your browser (`Ctrl+Shift+R` / `Cmd+Shift+R`). |
| Terminal shows `(venv)` disappeared after closing VS Code | Virtual environments must be re-activated every new terminal session. Just re-run the activation command from Step 6. |
| `ImportError` mentioning `openai` or `anthropic` version mismatch | Run `pip install --upgrade -r requirements.txt` inside the activated virtual environment. |
| Blank white page / 500 error | Check the VS Code terminal for a red Python traceback — it will point to the exact file and line. Also try visiting `http://127.0.0.1:5000/api/health` to confirm your keys are detected (`tmdb_configured` and `ai_configured` should both say `true`). |
| Nothing happens when clicking movie cards | Open your browser's Developer Tools (`F12`) → Console tab, and check for red errors; this usually points to a JavaScript issue worth reporting. |

Still stuck? Visit `http://127.0.0.1:5000/api/health` in your browser while the server is running — it returns a small JSON status report telling you exactly which configuration is missing:

```json
{
  "status": "ok",
  "tmdb_configured": true,
  "ai_provider": "openai",
  "ai_configured": true
}
```

---

## 17. Deployment Guide

The instructions above run the app **locally** for development. To make it accessible on the internet, here are two common, free-tier-friendly options.

### Option A — Deploy to Render.com (simplest)

1. Push your project to a GitHub repository (create one at [github.com](https://github.com), then in your project folder):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<your-username>/movie-ai-assistant.git
   git push -u origin main
   ```
   (`.env` will **not** be pushed, thanks to `.gitignore` — this is intentional and safe.)
2. Go to [https://render.com](https://render.com), sign up, and click **New → Web Service**.
3. Connect your GitHub repository.
4. Configure:
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn app:app`
   - **Environment Variables:** add `TMDB_API_KEY`, `AI_PROVIDER`, `OPENAI_API_KEY` (or `ANTHROPIC_API_KEY`), `FLASK_SECRET_KEY`, `FLASK_DEBUG=False` in Render's dashboard (these mirror your `.env` file).
5. Add `gunicorn` to `requirements.txt` before deploying:
   ```bash
   pip install gunicorn
   pip freeze > requirements.txt
   ```
6. Click **Create Web Service**. Render will build and deploy automatically, giving you a public URL.

### Option B — Deploy to a VPS (e.g. AWS EC2, DigitalOcean Droplet)

1. SSH into your server and install Python 3.10+, `pip`, and `venv` (see [Step 1](#5-step-1--install-python)'s Linux instructions).
2. Clone your repository and repeat Steps 5–9 of this guide on the server.
3. Install a production WSGI server: `pip install gunicorn`.
4. Run persistently with a process manager, e.g.:
   ```bash
   gunicorn --bind 0.0.0.0:8000 --workers 3 app:app
   ```
5. Put **Nginx** in front as a reverse proxy for HTTPS (recommended), or use a service like **Caddy** for automatic SSL certificates.
6. Set `FLASK_DEBUG=False` in production — the built-in debugger must never be exposed publicly.

### General production notes

- Always set `FLASK_DEBUG=False` when deploying publicly.
- Never commit your `.env` file — configure secrets through your hosting provider's environment variable settings instead.
- TMDb and OpenAI/Anthropic both enforce rate limits; for a public deployment, watch your usage dashboards to avoid unexpected costs.
- Consider adding a simple caching layer (e.g. Flask-Caching) if you expect heavy traffic on `/api/search` or `/api/movie/<id>`.

---

## 18. How the Project Works (Architecture)

```
Browser (templates/index.html + static/js/app.js)
        │  fetch() calls
        ▼
Flask app.py  ──────────────►  services/tmdb_service.py ──► TMDb API
        │                              (movie search, details, discover)
        │
        └────────────────────►  services/ai_service.py  ──► OpenAI or Anthropic API
                                       (chat, comparisons, explanations)
```

- **`app.py`** defines all `/api/*` routes and coordinates calls to the two service modules. It never talks to TMDb or the AI provider directly.
- **`services/tmdb_service.py`** wraps every TMDb endpoint used by the app and returns clean, simplified dictionaries.
- **`services/ai_service.py`** wraps the AI provider. The **chat endpoint** uses real function calling / tool use: the AI model is given tools like `search_movies` and `get_movie_details`, and it decides on its own when to call them before answering — so recommendations are always grounded in real TMDb data instead of the model's memory.
- **`static/js/app.js`** handles all UI interactivity purely with `fetch()` calls to the Flask backend — there is no separate frontend framework or build step.
- **`config.py`** is the single source of truth for reading `.env` values, so no other file calls `os.getenv()` directly.

---

## 19. API Endpoints Reference

| Method | Endpoint | Body | Description |
|---|---|---|---|
| GET | `/api/health` | — | Reports whether TMDb/AI keys are configured. |
| GET | `/api/search?q=<query>&page=<n>` | — | Search movies by title. |
| GET | `/api/movie/<id>` | — | Full movie details (cast, genres, runtime, keywords). |
| GET | `/api/popular` | — | Currently popular movies. |
| POST | `/api/why-like` | `{ "movie_id": 27205, "preferences": "" }` | AI explanation of why you'd like a movie. |
| POST | `/api/compare` | `{ "movie_id_1": 27205, "movie_id_2": 155 }` | AI comparison of two movies. |
| POST | `/api/similar` | `{ "movie_id": 27205 }` | Similar movies + AI-written reasoning. |
| POST | `/api/mood` | `{ "mood": "romantic" }` | Movies matching a mood + AI reasoning. |
| POST | `/api/chat` | `{ "history": [{"role":"user","content":"..."}] }` | Main AI chat endpoint (tool-calling). |

---

## 20. License & Credits

- Movie data provided by **[TMDb](https://www.themoviedb.org/)**. This product uses the TMDb API but is not endorsed or certified by TMDb.
- AI responses powered by **OpenAI** or **Anthropic (Claude)**, depending on your configuration.
- Built as an educational, production-quality reference project — feel free to modify and extend it.

Enjoy CineMind! 🍿
