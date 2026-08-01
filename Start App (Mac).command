#!/bin/bash
# ============================================================
#  Start App (Mac).command  -  CineMind (AI Movie Assistant)
#  Double-click this file in Finder to set up (first run) and
#  launch the application. Safe to run again any time.
#
#  If double-clicking does nothing the first time, right-click
#  this file -> Open, and confirm "Open" on the security prompt.
#  You may also need to make it executable once by running:
#    chmod +x "Start App (Mac).command"
# ============================================================

# Move into the folder this script lives in, no matter where
# it was double-clicked from.
cd "$(dirname "$0")" || exit 1

echo "============================================================"
echo "  CineMind - AI Movie Assistant - Startup"
echo "============================================================"
echo ""

# ------------------------------------------------------------
# 1. Check that Python is installed and available
# ------------------------------------------------------------
echo "[1/6] Checking for Python..."

PYTHON_CMD=""
if command -v python3 >/dev/null 2>&1; then
    PYTHON_CMD="python3"
elif command -v python >/dev/null 2>&1; then
    PYTHON_CMD="python"
fi

if [ -z "$PYTHON_CMD" ]; then
    echo ""
    echo "[ERROR] Python was not found on this computer."
    echo ""
    echo "Please install Python 3.10 or newer from:"
    echo "  https://www.python.org/downloads/"
    echo ""
    echo "After installing, close this window and double-click"
    echo "\"Start App (Mac).command\" again."
    echo ""
    read -n 1 -s -r -p "Press any key to close..."
    exit 1
fi

$PYTHON_CMD --version
echo "  Python found: OK"
echo ""

# ------------------------------------------------------------
# 2. Create the virtual environment if it doesn't exist yet
# ------------------------------------------------------------
echo "[2/6] Checking for virtual environment..."

if [ ! -f "venv/bin/activate" ]; then
    echo "  No virtual environment found. Creating one now (this may take a minute)..."
    $PYTHON_CMD -m venv venv
    if [ $? -ne 0 ]; then
        echo ""
        echo "[ERROR] Failed to create the virtual environment."
        echo "Please check your Python installation and try again."
        echo ""
        read -n 1 -s -r -p "Press any key to close..."
        exit 1
    fi
    echo "  Virtual environment created: OK"
else
    echo "  Virtual environment already exists: OK"
fi
echo ""

# ------------------------------------------------------------
# 3. Activate the virtual environment
# ------------------------------------------------------------
echo "[3/6] Activating virtual environment..."

# shellcheck disable=SC1091
source "venv/bin/activate"
if [ $? -ne 0 ]; then
    echo ""
    echo "[ERROR] Failed to activate the virtual environment."
    echo ""
    read -n 1 -s -r -p "Press any key to close..."
    exit 1
fi
echo "  Virtual environment activated: OK"
echo ""

# ------------------------------------------------------------
# 4. Install / update dependencies
# ------------------------------------------------------------
echo "[4/6] Checking dependencies (this may take a moment on first run)..."

python -m pip install --upgrade pip --quiet
python -m pip install -r requirements.txt --quiet
if [ $? -ne 0 ]; then
    echo ""
    echo "[ERROR] Failed to install dependencies from requirements.txt."
    echo "Check your internet connection and try again."
    echo ""
    read -n 1 -s -r -p "Press any key to close..."
    exit 1
fi
echo "  Dependencies installed: OK"
echo ""

# ------------------------------------------------------------
# 5. Verify the .env file exists
# ------------------------------------------------------------
echo "[5/6] Checking for .env configuration file..."

if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        echo "  No .env file found. Creating one from .env.example..."
        cp ".env.example" ".env"
        echo ""
        echo "  [ACTION NEEDED] A new .env file was created for you."
        echo "  Open it in VS Code (or TextEdit) and fill in your real"
        echo "  API keys (TMDB_API_KEY and either OPENAI_API_KEY or"
        echo "  ANTHROPIC_API_KEY), then run this script again."
        echo ""
        echo "  See INSTRUCTION.md, section 12, for how to get these keys."
        echo ""
        read -n 1 -s -r -p "Press any key to close..."
        exit 0
    else
        echo ""
        echo "[ERROR] No .env or .env.example file found."
        echo "Please make sure the project files are complete."
        echo ""
        read -n 1 -s -r -p "Press any key to close..."
        exit 1
    fi
else
    echo "  .env file found: OK"
fi
echo ""

# ------------------------------------------------------------
# 6. Launch the application
# ------------------------------------------------------------
echo "[6/6] Starting CineMind..."
echo ""
echo "============================================================"
echo "  The app will start below. Once you see a line like"
echo "  \"Running on http://127.0.0.1:5000\", open that address"
echo "  in your web browser."
echo ""
echo "  Press CTRL+C in this window to stop the server."
echo "============================================================"
echo ""

python app.py
APP_EXIT_CODE=$?

# ------------------------------------------------------------
# If the app exits unexpectedly (crash / error), keep the
# window open so the user can read the error message.
# ------------------------------------------------------------
echo ""
echo "============================================================"
echo "  The application has stopped."
if [ $APP_EXIT_CODE -ne 0 ]; then
    echo "  It looks like it exited with an error (see messages above)."
    echo "  Check INSTRUCTION.md's Troubleshooting section for help."
fi
echo "============================================================"
echo ""
read -n 1 -s -r -p "Press any key to close..."
