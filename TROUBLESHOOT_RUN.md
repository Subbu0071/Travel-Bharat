# TravelBharat — Normalize run process (Windows)

This repo runs **client (Vite/React)** and **server (Express)** together.
If you see problems like ports changing, processes not starting, or `install:all` failing, follow the steps below.

## 1) Kill old servers (prevents port conflicts)
Open **Command Prompt** (not PowerShell) and run:

```bat
for /f "tokens=5" %a in ('netstat -ano ^| findstr :5174 ^| findstr LISTENING') do taskkill /F /PID %a
for /f "tokens=5" %a in ('netstat -ano ^| findstr :5175 ^| findstr LISTENING') do taskkill /F /PID %a
for /f "tokens=5" %a in ('netstat -ano ^| findstr :5176 ^| findstr LISTENING') do taskkill /F /PID %a
for /f "tokens=5" %a in ('netstat -ano ^| findstr :5000 ^| findstr LISTENING') do taskkill /F /PID %a
```

If you still have issues, restart Windows (fastest).

## 2) Install dependencies (one-time)
Run from repo root:

```bat
cd d:\GITHUB\TravelBharat
npm run install:all
```

## 3) Run in a stable way (recommended)
Start **server** first, then **client**.

### Server
```bat
cd d:\GITHUB\TravelBharat\server
npm run start
```
Server should be on:
- `http://127.0.0.1:5000`

### Client (force a specific port)
Use `5174` first. If it’s busy, choose another free port.

```bat
cd d:\GITHUB\TravelBharat\client
npm run dev -- --port 5174
```
Client should be on:
- `http://127.0.0.1:5174`

## 4) Verify backend
Open in browser:
- `http://127.0.0.1:5000/api/health`

You should see JSON `{ ok: true, service: "TravelBharat API" }`.

## 5) Environment variables (optional)
By default the server uses an **in-memory demo store** when `MONGO_URI` is not set.

- For MongoDB: create `server/.env` from `server/.env.example` and set `MONGO_URI`.
- For admin login: ensure `ADMIN_EMAIL` and `ADMIN_PASSWORD` match your intended demo credentials.

## 6) Why ports change
`npm run dev` uses Vite + auto-port behavior when `5174` is already in use, so you may see `5175`, `5176`, etc.
That’s normal—killing old processes (Step 1) makes the startup stable again.

## 7) One-command helper (added)
To normalize startup and avoid port-hopping, use the scripts added to this repo.

### A) PowerShell (recommended)
```powershell
cd d:\GITHUB\TravelBharat
./run.ps1
```

### B) Command Prompt
```bat
cd d:\GITHUB\TravelBharat
run.bat
```

### What these do
- Kill old listeners on ports **5000, 5174, 5175, 5176**
- Start backend first (Express API)
- Start frontend second (Vite) with `--strictPort` trying **5174**

### Expected URLs
- Frontend: `http://127.0.0.1:5174`
- Backend health: `http://127.0.0.1:5000/api/health`

If `5174` is blocked by some *external* program and `--strictPort` fails, free the port and rerun the script.


