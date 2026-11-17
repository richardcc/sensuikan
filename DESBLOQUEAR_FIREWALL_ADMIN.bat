@echo off
setlocal
title Desbloquear Python en Firewall para Tablet
echo ===================================================================
echo    DESBLOQUEANDO REGLAS DE FIREWALL PARA PYTHON (RED PRIVADA)
echo ===================================================================
echo.
echo Eliminando reglas de bloqueo para C:\python314\python.exe...
netsh advfirewall firewall delete rule name="Python" program="C:\python314\python.exe" >nul 2>&1

echo Agregando permiso de entrada para Python en el puerto 8000...
netsh advfirewall firewall add rule name="Sensuikan Tablet Server 8000" dir=in action=allow protocol=TCP localport=8000 profile=private,public >nul 2>&1
netsh advfirewall firewall add rule name="Python 3.14 Allow" dir=in action=allow program="C:\python314\python.exe" profile=private,public >nul 2>&1

echo.
echo ===================================================================
echo  LISTO: Reglas actualizadas correctamente.
echo  Ya puedes abrir "iniciar_servidor_tablet.bat" y conectar la tablet.
echo ===================================================================
echo.
pause
