# INSTRUCTION.md - Complete Beginner's Setup Guide for CineMind

This guide assumes you have **never used** Python, Visual Studio Code, Git, a terminal, virtual
environments, or an API before. Every step is spelled out - just follow along in order and
copy-paste the commands exactly as shown.

> 💡 **Tip:** Keep this file open in one window and Visual Studio Code open in another so you
> can follow along step by step.

---

## Table of Contents

1. [What This App Is](#1-what-this-app-is)
2. [What You'll Need](#2-what-youll-need)
3. [Installing Python](#3-installing-python)
4. [Installing Git](#4-installing-git)
5. [Installing Visual Studio Code](#5-installing-visual-studio-code)
6. [Required VS Code Extensions](#6-required-vs-code-extensions)
7. [Opening the Project in VS Code](#7-opening-the-project-in-vs-code)
8. [Creating a Virtual Environment](#8-creating-a-virtual-environment)
9. [Activating the Virtual Environment](#9-activating-the-virtual-environment)
10. [Installing Dependencies](#10-installing-dependencies)
11. [Creating the .env File](#11-creating-the-env-file)
12. [Getting Your API Keys](#12-getting-your-api-keys)
13. [Running the Application](#13-running-the-application)
14. [Testing the Application](#14-testing-the-application)
15. [Using Every Feature](#15-using-every-feature)
16. [Troubleshooting](#16-troubleshooting)
17. [FAQ](#17-faq)
18. [Common Mistakes](#18-common-mistakes)
19. [Security Recommendations](#19-security-recommendations)
20. [Next Learning Steps](#20-next-learning-steps)

---

## 1. What This App Is

**CineMind** is a website that runs on your own computer. It lets you:

- Chat with an AI about movies and get real recommendations.
- Search a real movie database.
- Get AI explanations of why you might like a movie.
- Compare two movies side by side.
- Get movie suggestions based on your mood.

It's built with **Python** (a programming language) using a tool called **Flask** (which lets
Python display web pages), plus two external services: **TMDb** (a movie database) and an
**AI provider** (OpenAI or Anthropic/Claude) that powers the smart features.

---

## 2. What You'll Need

- A Windows, macOS, or Linux computer.
- An internet connection.
- About 20-30 minutes for first-time setup.
- A free email address (to sign up for TMDb and your chosen AI provider).

You do **not** need any prior programming experience. Every command below is
copy-and-paste ready.

---

## 3. Installing Python

Python is the programming language this app is written in. You need **Python 3.10 or newer**.

### Step 3.1 - Check if you already have it

1. Open a terminal:
   - **Windows:** Press the `Windows` key, type `cmd`, press Enter.
   - **macOS:** Press `Cmd + Space`, type `Terminal`, press Enter.
   - **Linux:** Press `Ctrl+Alt+T`, or open your Terminal app from the applications menu.
2. Type this and press Enter:
   ```bash
   python --version
   ```
   If that gives an error, try:
   ```bash
   python3 --version
   ```
3. If you see something like `Python 3.11.4`, you already have Python - skip to
   [Section 4](#4-installing-git).
   If you see an error like "command not found," or a version lower than `3.10`, continue below.

### Step 3.2 - Install Python

**Windows:**
1. Go to [https://www.python.org/downloads/](https://www.python.org/downloads/).
2. Click the big yellow **"Download Python 3.x.x"** button.
3. Run the downloaded installer.
4. ⚠️ **CRITICAL STEP:** On the very first screen of the installer, check the box that says
   **"Add python.exe to PATH"** before clicking anything else. If you skip this, your computer
   won't know how to find Python later.
5. Click **"Install Now"** and wait for it to finish.
6. Close and reopen your terminal, then run `python --version` again to confirm it worked.

**macOS:**
1. Go to [https://www.python.org/downloads/](https://www.python.org/downloads/) and download
   the macOS installer.
2. Open the downloaded `.pkg` file and click through the installer (default options are fine).
3. Close and reopen Terminal, then run `python3 --version` to confirm.
4. On macOS, you'll use `python3` and `pip3` (with the "3") throughout this guide, not
   `python`/`pip`.

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install python3 python3-venv python3-pip -y
python3 --version
```

---

## 4. Installing Git

Git is a tool for downloading and managing code projects. You only strictly need it if you're
getting this project from a GitHub repository (rather than a ZIP file someone sent you).

**Windows:**
1. Go to [https://git-scm.com/download/win](https://git-scm.com/download/win) - the download
   starts automatically.
2. Run the installer and click "Next" through the default options.

**macOS:**
1. Open Terminal and type `git --version`.
2. If Git isn't installed, macOS will offer to install "Xcode Command Line Tools" - click
   **Install** and wait a few minutes.

**Linux:**
```bash
sudo apt install git -y
```

**Verify it worked (all platforms):**
```bash
git --version
```
You should see something like `git version 2.42.0`.

---

## 5. Installing Visual Studio Code

Visual Studio Code (VS Code) is the program you'll use to view and edit the project's files
and run commands.

1. Go to [https://code.visualstudio.com/](https://code.visualstudio.com/).
2. Click the big **Download** button (it detects your operating system automatically).
3. Run the installer and accept the default options.
4. Open VS Code once installation finishes.

---

## 6. Required VS Code Extensions

1. In VS Code, click the **Extensions** icon in the left-hand sidebar (it looks like four
   squares, one slightly detached), or press `Ctrl+Shift+X` (Windows/Linux) / `Cmd+Shift+X`
   (macOS).
2. Search for **"Python"** and install the official one published by **Microsoft**. This gives
   you syntax highlighting, auto-complete, and lets VS Code detect your virtual environment
   automatically.
3. (Optional but helpful) Search for **"Pylance"** and install it - it's a companion extension
   that improves Python auto-complete and error checking.

---

## 7. Opening the Project in VS Code

1. Make sure you have the project's folder (`movie-search-ai` or similarly named) saved
   somewhere easy to find, e.g.:
   - Windows: `C:\Users\<YourName>\Documents\movie-search-ai`
   - macOS/Linux: `~/Documents/movie-search-ai`

   If you're starting from a Git repository instead of a ZIP file:
   ```bash
   git clone <repository-url>
   cd movie-search-ai
   ```

2. In VS Code, go to **File -> Open Folder…**
3. Select the `movie-search-ai` folder and click **Select Folder** (Windows/Linux) or
   **Open** (macOS).
4. VS Code will reload with the project's files listed in the Explorer panel on the left.
5. Open a terminal **inside VS Code**: menu **Terminal -> New Terminal**, or press
   `` Ctrl+` `` (Windows/Linux) or `` Cmd+` `` (macOS). This opens a terminal that's already
   pointed at your project folder - every command below assumes you're using this terminal.

You can double-check you're in the right folder by running:
```bash
dir      # Windows
ls       # macOS / Linux
```
You should see `app.py`, `requirements.txt`, `templates/`, `static/`, and `services/` listed.

---

## 8. Creating a Virtual Environment

A **virtual environment** is an isolated, self-contained copy of Python just for this project.
It keeps this project's dependencies separate from anything else on your computer, so nothing
conflicts. This is standard practice for every Python project.

In the VS Code terminal, run:

**Windows:**
```bash
python -m venv venv
```

**macOS / Linux:**
```bash
python3 -m venv venv
```

This creates a new folder called `venv/` inside your project. It may take 10-30 seconds - if
nothing seems to happen, that's normal; just wait for the terminal prompt to return.

---

## 9. Activating the Virtual Environment

"Activating" tells your terminal: "use the Python installed inside `venv/`, not the one
installed system-wide."

**Windows (Command Prompt):**
```bash
venv\Scripts\activate.bat
```

**Windows (PowerShell):**
```powershell
venv\Scripts\Activate.ps1
```
> If you see an error like *"running scripts is disabled on this system,"* run this once, then
> try activating again:
> ```powershell
> Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
> ```

**macOS / Linux:**
```bash
source venv/bin/activate
```

### How do you know it worked?

Your terminal prompt will now start with `(venv)`, like:
```
(venv) C:\Users\YourName\Documents\movie-search-ai>
```
or
```
(venv) yourname@MacBook movie-search-ai %
```

Keep this terminal open and activated for the rest of the setup. If you close the terminal and
open a new one later, you'll need to run the activation command again before running the app.

---

## 10. Installing Dependencies

With the virtual environment activated (you should see `(venv)` in your prompt), install all
the Python packages this project needs, in one command:

```bash
pip install -r requirements.txt
```

(On macOS, if `pip` isn't recognized, use `pip3 install -r requirements.txt` or
`python3 -m pip install -r requirements.txt`.)

Wait for it to finish - you'll see a line ending in something like:
```
Successfully installed Flask-3.0.3 Werkzeug-3.0.4 python-dotenv-1.0.1 requests-2.32.3 openai-1.51.0 anthropic-0.36.2
```

This installs:

| Package | What it does |
|---|---|
| `Flask` | Runs the web server that powers the app |
| `python-dotenv` | Reads your secret keys from the `.env` file |
| `requests` | Lets the app talk to the TMDb movie database |
| `openai` | Lets the app talk to OpenAI (if you choose that AI provider) |
| `anthropic` | Lets the app talk to Claude/Anthropic (if you choose that AI provider) |
| `Werkzeug` | A supporting library Flask depends on internally |

---

## 11. Creating the .env File

The `.env` file stores your **secret API keys** on your own computer only. It is never uploaded
anywhere and is automatically excluded from Git (via `.gitignore`).

1. In the VS Code Explorer panel (left side), find the file named **`.env.example`**.
2. Make a copy of it and rename the copy to exactly **`.env`** (no `.example` at the end, and
   it should still start with a dot).

   You can also do this from the terminal:

   **Windows:**
   ```bash
   copy .env.example .env
   ```
   **macOS/Linux:**
   ```bash
   cp .env.example .env
   ```

3. Click the new `.env` file in the Explorer panel to open it. You'll fill in the real values
   in the next section.

---

## 12. Getting Your API Keys

This app needs **two kinds of keys**: one for movie data (TMDb - required), and one for AI
(OpenAI **or** Anthropic/Claude - pick just one).

### 12.1 TMDb API Key (required)

1. Go to [https://www.themoviedb.org/](https://www.themoviedb.org/) and click **Sign Up**
   (top right). Create a free account and verify your email if asked.
2. Once logged in, click your profile icon (top right) -> **Settings**.
3. In the left-hand menu, click **API**.
4. Click **Create** (or **Request an API Key**).
5. Choose **Developer** (free, for personal/non-commercial projects like this one).
6. Fill out the short form - application name can be `CineMind`, URL can be
   `http://localhost:5001`, and description can say it's a personal learning project.
7. Once approved (usually instant), you'll see an **"API Key (v3 auth)"** - a string that
   looks like `8f3a1c2e9b7d4f6a1e2b3c4d5f6a7b8c`. Copy it.

### 12.2 AI API Key - choose ONE provider

**Option A - OpenAI:**
1. Go to [https://platform.openai.com/](https://platform.openai.com/) and sign up / log in.
2. Go to [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys).
3. Click **Create new secret key**, name it (e.g. "CineMind"), click **Create**.
4. **Copy the key immediately** - it's only shown once. It starts with `sk-proj-...`.
5. Note: new OpenAI accounts often need billing details added before API calls will work, even
   for very small usage - go to
   [https://platform.openai.com/settings/organization/billing](https://platform.openai.com/settings/organization/billing).

**Option B - Anthropic (Claude):**
1. Go to [https://console.anthropic.com/](https://console.anthropic.com/) and sign up / log in.
2. Go to **Settings -> API Keys**.
3. Click **Create Key**, name it, and copy the value (starts with `sk-ant-...`).
4. Add billing details if prompted.

### 12.3 Fill in your `.env` file

Open `.env` in VS Code and fill it in like this:

```env
TMDB_API_KEY=your_actual_tmdb_key_here

AI_PROVIDER=openai
OPENAI_API_KEY=your_actual_openai_key_here
OPENAI_MODEL=gpt-4o-mini

ANTHROPIC_API_KEY=
ANTHROPIC_MODEL=claude-sonnet-5

FLASK_SECRET_KEY=any_random_string_you_like
FLASK_DEBUG=True
PORT=5001
```

- If you're using **Claude instead of OpenAI**, set `AI_PROVIDER=anthropic` and fill in
  `ANTHROPIC_API_KEY` instead - leave `OPENAI_API_KEY` blank.
- `FLASK_SECRET_KEY` can be any random text you like, e.g. `cinemind-super-secret-42`.
- Double-check there are **no quotation marks** and **no spaces** around the `=` sign.
  Correct: `TMDB_API_KEY=abc123`. Incorrect: `TMDB_API_KEY = "abc123"`.
- Save the file with `Ctrl+S` (Windows/Linux) or `Cmd+S` (macOS).

---

## 13. Running the Application

Make sure your virtual environment is still active (you should still see `(venv)` in your
terminal prompt) and your `.env` file is filled in.

Run:
```bash
python app.py
```
(On macOS you may need `python3 app.py`.)

### What you should see

```
 * Serving Flask app 'app'
 * Debug mode: on
WARNING: This is a development server. Do not use it in a production deployment.
 * Running on all addresses (0.0.0.0)
 * Running on http://127.0.0.1:5001
Press CTRL+C to quit
```

### Open the app in your browser

- Hold `Ctrl` (or `Cmd` on Mac) and click the `http://127.0.0.1:5001` link in the terminal, or
- Open your browser and go to **http://127.0.0.1:5001** manually.

You should see the CineMind interface. To stop the server, click into the terminal and press
`Ctrl+C`.

---

## 14. Testing the Application

Before diving into features, verify everything is wired up correctly:

1. With the server running, open **http://127.0.0.1:5001/api/health** in your browser.
2. You should see something like:
   ```json
   {
     "status": "ok",
     "tmdb_configured": true,
     "ai_provider": "openai",
     "ai_configured": true
   }
   ```
3. If either `tmdb_configured` or `ai_configured` shows `false`, go back to
   [Section 12](#12-getting-your-api-keys) and double-check your `.env` file - a value is
   likely missing, mistyped, or the file wasn't saved.
4. Go back to the main app (`http://127.0.0.1:5001`) and try a simple search (e.g. "Inception")
   in the **Search** tab. If a result appears with a poster, TMDb is working. If you send a
   chat message and get a reply, your AI provider is working too.

---

## 15. Using Every Feature

- **💬 Chat tab** - Type a question like *"Recommend a feel-good comedy from the 2010s"* or
  click one of the suggested prompts. The AI looks up real movies from TMDb before answering,
  and may show clickable poster cards alongside its reply.
- **🔍 Search tab** - Search any movie by title. Click a result to open its detail view, where
  you can ask *"Why would I like this?"* or *"Find similar movies."*
- **🎭 Mood tab** - Click a mood chip (😄 Happy, 👻 Scared, 💕 Romantic, etc.) or type your own
  mood in your own words, then click **Get Picks**.
- **⚖️ Compare tab** - Search for and select two movies, then click **Compare Movies** for an
  AI-written breakdown of how they differ and which one might suit you better.
- **🌙/☀️ toggle** (top right) - Switches between dark and light mode; your choice is
  remembered on this device.
- **Clear conversation** - Below the chat box; wipes your saved chat history from this browser.

---

## 16. Troubleshooting

| Problem | Likely Cause & Fix |
|---|---|
| `'python' is not recognized...` (Windows) | Python wasn't added to PATH during install. Reinstall Python and check "Add python.exe to PATH," or try `py` instead of `python`. |
| `python: command not found` (macOS/Linux) | Use `python3` instead of `python` everywhere in this guide. |
| `ModuleNotFoundError: No module named 'flask'` | Your virtual environment isn't activated, or dependencies weren't installed. Re-run [Section 9](#9-activating-the-virtual-environment), then [Section 10](#10-installing-dependencies). |
| `pip: command not found` | Try `pip3` or `python -m pip install -r requirements.txt`. |
| PowerShell: *"running scripts is disabled on this system"* | Run `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser` once, then re-activate. |
| Page loads but search shows *"TMDb API key is missing"* | Your `.env` file is missing, misnamed, or `TMDB_API_KEY` is empty. Confirm the file is exactly named `.env` (not `.env.example` or `.env.txt`), and restart the server after editing. |
| Chat/AI features say *"AI request failed"* | Check that `AI_PROVIDER` matches the key you filled in (`openai` needs `OPENAI_API_KEY`; `anthropic` needs `ANTHROPIC_API_KEY`), and that the key and billing are valid on the provider's site. |
| `401 Unauthorized` from TMDb | Your TMDb key is wrong, not yet approved, or mistyped. Re-copy it from your TMDb account settings. |
| `Address already in use` / port 5001 busy | Another program is using port 5001 (common on macOS due to AirPlay Receiver). Disable AirPlay Receiver, or change `PORT=5001` in `.env` and restart. |
| Code changes don't show up in the browser | Make sure `FLASK_DEBUG=True` is set in `.env`, then hard-refresh your browser (`Ctrl+Shift+R` / `Cmd+Shift+R`). |
| `(venv)` disappeared after closing VS Code | Virtual environments must be re-activated every new terminal session - re-run [Section 9](#9-activating-the-virtual-environment). |
| Blank white page / 500 error | Check the terminal for a red Python error - it will point to the exact file and line. Also check `http://127.0.0.1:5001/api/health` to confirm your keys are detected. |
| Nothing happens when clicking movie cards | Open your browser's Developer Tools (`F12`) -> Console tab and look for red error messages. |

---

## 17. FAQ

**Do I need both an OpenAI key and an Anthropic key?**
No - just one, matching whatever you set `AI_PROVIDER` to in your `.env` file.

**Is this free to run?**
TMDb's free tier is enough for this app. OpenAI and Anthropic both require you to add billing
details, but a small amount of personal use typically costs very little (fractions of a cent
per request for smaller models). Check each provider's pricing page for current rates.

**Can I use this app without an internet connection?**
No - it needs to reach TMDb and your AI provider over the internet for every search, chat, and
recommendation.

**Do I need to know how to code to use this?**
No - following this guide doesn't require writing any code, only running the commands exactly
as shown and filling in your API keys.

**What happens to my chat history?**
It's stored only in your own browser (`localStorage`), not on any server. Clearing your
browser data or clicking "Clear conversation" will erase it.

**Can two people run this on the same computer?**
Yes, each with their own copy of the project folder and their own `.env` file - the app itself
doesn't have user accounts.

---

## 18. Common Mistakes

- **Forgetting to activate the virtual environment** before running `pip install` or
  `python app.py` - always check for `(venv)` in your prompt first.
- **Renaming `.env.example` incorrectly** - it must be exactly `.env`, not `.env.example.env`
  or `env` (no leading dot).
- **Adding quotes or spaces in `.env`** - `TMDB_API_KEY = "abc123"` will not work;
  `TMDB_API_KEY=abc123` will.
- **Not restarting the server after editing `.env`** - Flask reads environment variables once
  at startup; stop the server (`Ctrl+C`) and re-run `python app.py` after any `.env` change.
- **Committing `.env` to Git** - never do this; it contains your private keys. The included
  `.gitignore` already prevents this by default, but always double-check before pushing.
- **Skipping "Add python.exe to PATH" on Windows** - this is the single most common setup
  failure on Windows.

---

## 19. Security Recommendations

- Never share your `.env` file, or the API keys inside it, with anyone.
- Never commit `.env` to GitHub or any other public place - the project's `.gitignore` already
  excludes it, but always double check before pushing.
- If you ever accidentally expose an API key (e.g. paste it in a public chat or commit it by
  mistake), immediately revoke/regenerate it from the provider's dashboard (TMDb, OpenAI, or
  Anthropic settings).
- Keep `FLASK_DEBUG=True` only while developing on your own computer. If you ever deploy this
  app so it's reachable from the internet, set `FLASK_DEBUG=False` - Flask's debug mode allows
  arbitrary code execution if it's ever exposed publicly.
- If you deploy this app publicly, consider adding request rate limiting so a stranger can't
  run up your AI provider bill by spamming the chat or comparison endpoints.

---

## 20. Next Learning Steps

If this is your first Python/Flask project, here are good next things to explore:

1. **Learn basic Python** - sites like [python.org's official tutorial](https://docs.python.org/3/tutorial/)
   or freeCodeCamp's Python course are solid starting points.
2. **Learn Flask basics** - read Flask's own [Quickstart guide](https://flask.palletsprojects.com/)
   to understand how `app.py`'s routes work.
3. **Try modifying a small feature** - e.g. add a new mood chip in `templates/index.html` and
   a matching entry in `MOOD_TO_GENRES` in `services/tmdb_service.py`, then see it work.
4. **Learn Git basics** - being able to `git init`, `git add`, `git commit`, and `git push` is
   essential once you want to save versions of your work or publish it on GitHub.
5. **Explore the README's "Architecture" and "API Endpoints Reference" sections** - they
   explain how the pieces of this project fit together at a slightly deeper level than this
   guide.

You're all set - enjoy exploring CineMind! 🍿
