@echo off
setlocal
title CampusX Startup

echo.
echo ==========================================
echo  CAMPUSX - START BOTH SERVICES
echo ==========================================
echo.
echo Opening separate backend and frontend windows...
echo Do not close either window while using the app.
echo.

start "CampusX Backend" cmd /k call "%~dp0RUN_BACKEND.bat"
timeout /t 3 /nobreak >nul
start "CampusX Frontend" cmd /k call "%~dp0RUN_FRONTEND.bat"

echo.
echo Startup windows opened.
echo Wait until:
echo   Backend: Tomcat started on port 8080
echo   Frontend: VITE ready at http://127.0.0.1:5173/
echo.
echo Then open: http://127.0.0.1:5173/login
echo.
pause
