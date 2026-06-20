@echo off
setlocal enabledelayedexpansion

REM TravelBharat normalized run script (Windows CMD)
REM - Kills previous server/client on common ports
REM - Starts backend then frontend with fixed ports when available

cd /d d:\GITHUB\TravelBharat

echo [1/3] Killing old processes (ports: 5000, 5174-5176)...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000 ^| findstr LISTENING') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5174 ^| findstr LISTENING') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5175 ^| findstr LISTENING') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5176 ^| findstr LISTENING') do taskkill /F /PID %%a >nul 2>&1

echo.
echo [2/3] Starting backend...
start "tb-server" cmd /k "cd /d d:\GITHUB\TravelBharat\server && npm run start"

echo.
echo [3/3] Starting frontend (try 5174, fallback 5175/5176)...
start "tb-client" cmd /k "cd /d d:\GITHUB\TravelBharat\client && npm run dev -- --port 5174 --strictPort"

echo.
echo Done.
echo Backend:   http://127.0.0.1:5000
echo Frontend:  http://127.0.0.1:5174  (if strictPort fails, try 5175/5176 by rerunning with another port)

