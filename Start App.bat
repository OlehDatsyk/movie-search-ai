@echo off
REM ============================================================
REM  Start App.bat  -  CineMind (AI Movie Assistant) launcher
REM  Double-click this file to set up (first run) and launch
REM  the application. Safe to run again any time.
REM ============================================================

setlocal enabledelayedexpansion
cd /d "%~dp0"

echo ============================================================
echo   CineMind - AI Movie Assistant - Startup
echo ============================================================
echo.

REM ------------------------------------------------------------
REM 1. Check that Python is installed and available on PATH
REM ------------------------------------------------------------
echo [1/6] Checking for Python...

set "PYTHON_CMD="
where python >nul 2>nul
if %errorlevel%==0 (
    set "PYTHON_CMD=python"
) else (
    where py >nul 2>nul
    if !errorlevel!==0 (
        set "PYTHON_CMD=py"
    )
)

if not defined PYTHON_CMD (
    echo.
    echo [ERROR] Python was not found on this computer.
    echo.
    echo Please install Python 3.10 or newer from:
    echo   https://www.python.org/downloads/
    echo.
    echo IMPORTANT: During installation, check the box that says
    echo "Add python.exe to PATH" before clicking Install.
    echo.
    echo After installing, close this window and double-click
    echo "Start App.bat" again.
    echo.
    pause
    exit /b 1
)

%PYTHON_CMD% --version
echo   Python found: OK
echo.

REM ------------------------------------------------------------
REM 2. Create the virtual environment if it doesn't exist yet
REM ------------------------------------------------------------
echo [2/6] Checking for virtual environment...

if not exist "venv\Scripts\activate.bat" (
    echo   No virtual environment found. Creating one now ^(this may take a minute^)...
    %PYTHON_CMD% -m venv venv
    if %errorlevel% neq 0 (
        echo.
        echo [ERROR] Failed to create the virtual environment.
        echo Please check the Python installation and try again.
        echo.
        pause
        exit /b 1
    )
    echo   Virtual environment created: OK
) else (
    echo   Virtual environment already exists: OK
)
echo.

REM ------------------------------------------------------------
REM 3. Activate the virtual environment
REM ------------------------------------------------------------
echo [3/6] Activating virtual environment...

call "venv\Scripts\activate.bat"
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Failed to activate the virtual environment.
    echo.
    pause
    exit /b 1
)
echo   Virtual environment activated: OK
echo.

REM ------------------------------------------------------------
REM 4. Install / update dependencies
REM ------------------------------------------------------------
echo [4/6] Checking dependencies ^(this may take a moment on first run^)...

python -m pip install --upgrade pip --quiet
python -m pip install -r requirements.txt --quiet
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Failed to install dependencies from requirements.txt.
    echo Check your internet connection and try again.
    echo.
    pause
    exit /b 1
)
echo   Dependencies installed: OK
echo.

REM ------------------------------------------------------------
REM 5. Verify the .env file exists
REM ------------------------------------------------------------
echo [5/6] Checking for .env configuration file...

if not exist ".env" (
    if exist ".env.example" (
        echo   No .env file found. Creating one from .env.example...
        copy ".env.example" ".env" >nul
        echo.
        echo   [ACTION NEEDED] A new .env file was created for you.
        echo   Open it in VS Code ^(or Notepad^) and fill in your real
        echo   API keys ^(TMDB_API_KEY and either OPENAI_API_KEY or
        echo   ANTHROPIC_API_KEY^), then run this script again.
        echo.
        echo   See INSTRUCTION.md, section 12, for how to get these keys.
        echo.
        pause
        exit /b 0
    ) else (
        echo.
        echo [ERROR] No .env or .env.example file found.
        echo Please make sure the project files are complete.
        echo.
        pause
        exit /b 1
    )
) else (
    echo   .env file found: OK
)
echo.

REM ------------------------------------------------------------
REM 6. Launch the application
REM ------------------------------------------------------------
echo [6/6] Starting CineMind...
echo.
echo ============================================================
echo   The app will start below. Once you see a line like
echo   "Running on http://127.0.0.1:5000", open that address
echo   in your web browser.
echo.
echo   Press CTRL+C in this window to stop the server.
echo ============================================================
echo.

python app.py

REM ------------------------------------------------------------
REM If the app exits unexpectedly (crash / error), keep the
REM window open so the user can read the error message.
REM ------------------------------------------------------------
echo.
echo ============================================================
echo   The application has stopped.
if %errorlevel% neq 0 (
    echo   It looks like it exited with an error ^(see messages above^).
    echo   Check INSTRUCTION.md's Troubleshooting section for help.
)
echo ============================================================
echo.
pause
