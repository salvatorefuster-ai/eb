@echo off
cd /d "%~dp0"
echo.
echo === Fill payment + legal data in .env ===
echo Leave blank to skip a field.
echo.

set /p BIZUM=Bizum phone: 
set /p IBAN=IBAN: 
set /p HOLDER=Account holder: 
set /p ONAME=Operator name: 
set /p ONIF=NIF/CIF: 
set /p OEMAIL=Operator email: 
set /p OADDR=Operator address: 
set /p DOMAIN=Public domain (e.g. https://escortbenidorm.es) leave blank if unknown: 

set ARGS=
if not "%BIZUM%"=="" set ARGS=%ARGS% PAY_BIZUM=%BIZUM%
if not "%IBAN%"=="" set ARGS=%ARGS% PAY_IBAN=%IBAN%
if not "%HOLDER%"=="" set ARGS=%ARGS% PAY_HOLDER="%HOLDER%"
if not "%ONAME%"=="" set ARGS=%ARGS% OPERATOR_NAME="%ONAME%"
if not "%ONIF%"=="" set ARGS=%ARGS% OPERATOR_NIF=%ONIF%
if not "%OEMAIL%"=="" set ARGS=%ARGS% OPERATOR_EMAIL=%OEMAIL%
if not "%OADDR%"=="" set ARGS=%ARGS% OPERATOR_ADDRESS="%OADDR%"
if not "%DOMAIN%"=="" set ARGS=%ARGS% SITE_URL=%DOMAIN%

if "%ARGS%"=="" (
  echo Nothing to update.
  pause
  exit /b 0
)

node server\patch-env.js %ARGS%
echo.
echo Restart the server after this (close npm start and run start.bat again).
pause
