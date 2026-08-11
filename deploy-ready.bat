@echo off
chcp 65001 >nul
cd /d "%~dp0"
title EscortBenidorm — deploy ready

echo.
echo  ========================================
echo   PREPARE FOR LIVE (local checklist)
echo  ========================================
echo.

echo  [1/3] Local preflight...
call npm run preflight -- --local
echo.

echo  [2/3] Building upload ZIP...
call npm run pack
echo.

echo  [3/3] Health readiness...
powershell -NoProfile -Command "try { $h = Invoke-RestMethod http://localhost:3456/api/health -TimeoutSec 3; $h | ConvertTo-Json -Depth 5 } catch { Write-Host 'Server OFF — run start.bat first' }"
echo.

echo  ========================================
echo   NEXT (you):
echo   1. fill-payments.bat  (Bizum + legal)
echo   2. Buy domain + VPS
echo   3. When you have them, run:
echo      powershell -File deploy\print-commands.ps1 -Domain YOUR.com -VpsIp 1.2.3.4
echo   4. Full guide: LIVE-TOMORROW.md
echo  ========================================
echo.
pause
