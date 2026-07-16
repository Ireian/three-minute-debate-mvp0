@echo off
cd /d "%~dp0"

echo Starting MVP-0 Three-Minute Debate...
start "MVP-0 Server" cmd /k "npm.cmd run dev -- --host 127.0.0.1 --port 4173 --strictPort"
timeout /t 3 /nobreak >nul
start "" "http://127.0.0.1:4173/"

