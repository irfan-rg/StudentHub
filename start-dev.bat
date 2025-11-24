@echo off
rem ----------------------------------------------------------------
rem start-dev.bat
rem Opens VS Code and provides instructions to start all services
rem Usage: double-click this file or run from project root
rem ----------------------------------------------------------------

rem Resolve script directory and set working directory to repo root
set SCRIPT_DIR=%~dp0

echo Opening StudentHub in VS Code...
echo.

rem Open VS Code with the workspace
code "%SCRIPT_DIR%"

echo.
echo VS Code opened. To start all services:
echo 1. Press Ctrl+Shift+P (Command Palette)
echo 2. Type "Tasks: Run Task"
echo 3. Select "Start All Services"
echo.
echo This will run frontend, backend, and python-backend in separate integrated terminals.
echo.
pause
