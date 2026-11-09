@echo off
setlocal
title CampusX Backend
cd /d "%~dp0backend"

echo.
echo ==========================================
echo  CampusX Backend - Spring Boot
echo ==========================================
echo Project folder: %CD%
echo.

where java >nul 2>nul
if errorlevel 1 (
  echo ERROR: Java was not found in PATH.
  echo Install Java 17 or newer and reopen VS Code.
  pause
  exit /b 1
)

where mvn >nul 2>nul
if errorlevel 1 (
  echo ERROR: Apache Maven was not found in PATH.
  echo Install Maven and reopen VS Code.
  pause
  exit /b 1
)

echo Java version:
java -version
echo.
echo Starting Spring Boot on http://localhost:8080
echo Keep this window OPEN while using CampusX.
echo.
call mvn spring-boot:run

echo.
echo Backend stopped or failed. Read the messages above.
pause
