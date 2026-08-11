@echo off
chcp 65001 >nul
cd /d "%~dp0"
title EscortBenidorm - Nivel 3
echo.
echo  ========================================
echo   NIVEL 3 — Configurar negocio real
echo  ========================================
echo  Te hare preguntas sencillas (nombre, NIF,
echo  Bizum, IBAN...). Al final se guarda todo.
echo.
echo  Necesitas tener a mano:
echo   - Tu NIF o el de tu empresa
echo   - Email de contacto
echo   - Movil de Bizum
echo   - IBAN de la cuenta
echo.
pause
node server\setup-nivel3.js
if errorlevel 1 (
  echo.
  echo  ERROR. Asegurate de tener Node.js instalado.
  pause
  exit /b 1
)
echo.
echo  Ahora arranca la web con start.bat
echo.
set /p RUN=Quieres arrancar start.bat ahora? (s/n): 
if /i "%RUN%"=="s" (
  start "" "%~dp0start.bat"
)
echo.
echo  Abre tambien NIVEL-3.md para el dia a dia.
start "" notepad "%~dp0NIVEL-3.md"
pause
