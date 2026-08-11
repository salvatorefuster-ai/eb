@echo off
chcp 65001 >nul
cd /d "%~dp0"
title EscortBenidorm

echo.
echo  ========================================
echo   EscortBenidorm — arranque de hoy
echo  ========================================
echo.

if not exist "node_modules\" (
  echo  [1/3] Instalando dependencias...
  call npm install
  if errorlevel 1 (
    echo ERROR: npm install fallo. Instala Node.js 18+ desde https://nodejs.org
    pause
    exit /b 1
  )
) else (
  echo  [1/3] Dependencias OK
)

if not exist ".env" (
  echo  [2/3] Creando modo REAL...
  call npm run real:init -- --force --domain=http://localhost:3456
) else (
  echo  [2/3] Config .env OK
)

echo  [3/3] Arrancando servidor...
echo.
echo  Abre:  http://localhost:3456
echo  Admin: http://localhost:3456/admin.html
echo  PIN:   http://localhost:3456/mi-anuncio.html
echo  Precios: http://localhost:3456/precios.html
echo.
echo  Credenciales admin (si existen): data\ADMIN-CREDENTIALS.txt
echo.
echo  LIVE MANANA:
echo    fill-payments.bat  = Bizum + datos legales
echo    go-live-pack.bat   = ZIP para el VPS
echo    deploy-ready.bat   = checklist completo
echo    LIVE-TOMORROW.md   = guia paso a paso
echo    publicar-hoy.bat   = tunel publico temporal
echo.
echo  Ctrl+C para detener.
echo  ========================================
echo.

REM abrir navegador a los 2s
start "" cmd /c "timeout /t 2 /nobreak >nul & start http://localhost:3456"

call npm start
if errorlevel 1 (
  echo.
  echo El servidor se detuvo con error.
  pause
)
