@echo off
cd /d "%~dp0"
echo.
echo === EscortBenidorm: build upload package for VPS ===
echo.
powershell -ExecutionPolicy Bypass -File "%~dp0deploy\package-upload.ps1"
echo.
pause
