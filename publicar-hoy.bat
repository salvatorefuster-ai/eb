@echo off
chcp 65001 >nul
cd /d "%~dp0"
title EscortBenidorm PUBLIC

echo.
echo  ========================================
echo   PUBLICAR HOY (tunel temporal a internet)
echo  ========================================
echo.
echo  1) Asegura que la web corre (start.bat)
echo  2) Este script crea una URL publica temporal
echo     con Cloudflare Tunnel (sin VPS ni dominio)
echo.

where cloudflared >nul 2>&1
if errorlevel 1 (
  echo  cloudflared no esta instalado.
  echo.
  echo  Opcion A - Instalar con winget:
  echo    winget install --id Cloudflare.cloudflared -e
  echo.
  echo  Opcion B - Descarga:
  echo    https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/
  echo.
  echo  Opcion C - npx localtunnel (alternativa):
  echo    npx --yes localtunnel --port 3456
  echo.
  pause
  exit /b 1
)

echo  Comprobando servidor local en 3456...
powershell -NoProfile -Command "try { Invoke-RestMethod http://localhost:3456/api/health -TimeoutSec 2 | Out-Null; exit 0 } catch { exit 1 }"
if errorlevel 1 (
  echo  ERROR: primero arranca start.bat y deja la ventana abierta.
  pause
  exit /b 1
)

echo  Servidor OK. Abriendo tunel...
echo  Copia la URL https://....trycloudflare.com que aparezca.
echo  Esa URL es tu web publica de hoy (temporal).
echo.
cloudflared tunnel --url http://localhost:3456
pause
