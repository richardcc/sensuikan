@echo off
title Sensuikan - Reiniciar Campana a Cero
cls
echo ===================================================================
echo     SENSUlKAN: REINICIAR REGISTRO DE PATRULLAS Y COMBATE A CERO
echo ===================================================================
echo.
echo Este proceso borrara todos los contactos de combate, patrullas jugadas,
echo tonelaje y heridas de la tripulacion, dejando el libro en blanco (a 0)
echo listo para comenzar una nueva campana con un nuevo submarino.
echo.
echo Por favor, asegurate de tener cerrado 'Sensuikan_Patrol_Log_Sheet.xlsx'
echo antes de continuar.
echo.
pause
echo.
python scripts\reset_campaign.py Sensuikan_Patrol_Log_Sheet.xlsx
if exist docs\Sensuikan_Patrol_Log_Sheet.xlsx (
    python scripts\reset_campaign.py docs\Sensuikan_Patrol_Log_Sheet.xlsx
)
echo.
pause
