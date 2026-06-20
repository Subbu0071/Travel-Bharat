# TravelBharat normalized run script for PowerShell
# - Kills old processes on common ports
# - Starts backend then frontend with fixed port attempt 5174

$ErrorActionPreference = 'Stop'

$root = 'd:\GITHUB\TravelBharat'
Set-Location $root

Write-Host '[1/3] Killing old processes (ports: 5000, 5174-5176)...' -ForegroundColor Cyan

$ports = @(5000,5174,5175,5176)
foreach ($p in $ports) {
  $pstr = ":$p"
  $pids = @( (netstat -ano | Select-String -Pattern ([regex]::Escape($pstr)) | Select-String -Pattern 'LISTENING' | ForEach-Object { ($_ -split '\s+')[-1] }) | Where-Object { $_ -and $_.Trim() -ne '' } )
  foreach ($pidValue in $pids) {
    cmd /c "taskkill /F /PID $pid" | Out-Null
  }
}

Write-Host '[2/3] Starting backend...' -ForegroundColor Cyan
Start-Process -FilePath 'cmd.exe' -ArgumentList '/c','cd /d d:\GITHUB\TravelBharat\server && npm run start' -WindowStyle Normal

Write-Host '[3/3] Starting frontend (try 5174)...' -ForegroundColor Cyan
Start-Process -FilePath 'cmd.exe' -ArgumentList '/c','cd /d d:\GITHUB\TravelBharat\client && npm run dev -- --port 5174 --strictPort' -WindowStyle Normal

Write-Host ''
Write-Host 'Done.' -ForegroundColor Green
Write-Host 'Backend:  http://127.0.0.1:5000'
Write-Host 'Frontend: http://127.0.0.1:5174 (if blocked, script will fail fast due to --strictPort)'

