@echo off
setlocal
title CampusX Frontend
cd /d "%~dp0frontend"

echo.
echo ==========================================
echo  CampusX Frontend - Vite
echo ==========================================
echo Project folder: %CD%
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo ERROR: Node.js was not found in PATH.
  echo Install Node.js 20.19+ or 22.12+ and reopen VS Code.
  pause
  exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
  echo ERROR: npm was not found in PATH.
  pause
  exit /b 1
)

echo Node version:
node -v
echo npm version:
npm -v
echo.

REM Check the actual Vite executable, not just whether node_modules exists.
if not exist "node_modules\.bin\vite.cmd" (
  echo Vite is missing or frontend dependencies are incomplete.
  echo Installing frontend dependencies...
  call npm install
  if errorlevel 1 (
    echo.
    echo ERROR: npm install failed. Check the network and npm output above.
    pause
    exit /b 1
  )
)

if not exist "node_modules\.bin\vite.cmd" (
  echo.
  echo ERROR: Vite is still missing after npm install.
  echo Try deleting frontend\node_modules and running this file again.
  pause
  exit /b 1
)

echo.
echo Starting CampusX frontend...
echo Open this address: http://127.0.0.1:5173/login
echo Keep this window OPEN while using CampusX.
echo Press Ctrl+C only when you want to stop the frontend.
echo.
call npm run dev

echo.
echo Frontend stopped or failed. Read the messages above.
pause
