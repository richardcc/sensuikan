@echo off
setlocal enabledelayedexpansion
title Servidor Sensuikan para Tablet
cls

:: Auto-detectar la IP local activa en la red Wi-Fi / LAN
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /i /c:"IPv4" ^| findstr /v "169.254"') do (
    set raw_ip=%%a
    set LOCAL_IP=!raw_ip:~1!
)

:: Puerto libre (evita 8080 que está ocupado por servicios del sistema)
set PORT=8000

echo ===================================================================
echo               SENSUiKAN - ASISTENTE DIGITAL PARA TABLET
echo ===================================================================
echo.
echo 1. Asegurate de que tu tablet esta conectada al mismo Wi-Fi que este PC.
echo.
echo 2. En tu tablet (Safari en iPad o Chrome en Android), abre este enlace:
echo.
echo       http://!LOCAL_IP!:%PORT%
echo.
echo    (Si no conecta con esa IP, prueba con: http://192.168.1.21:%PORT%)
echo.
echo -------------------------------------------------------------------
echo TIP: Puedes pulsar "Compartir -> Anadir a pantalla de inicio" en tu
echo tablet para que se abra a pantalla completa como una app nativa.
echo -------------------------------------------------------------------
echo Presiona Ctrl+C para detener el servidor cuando termines de jugar.
echo.

cd /d "%~dp0app"
python -m http.server %PORT%
pause
