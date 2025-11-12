@echo off
REM Script para detener SAVEUR EVENTOS (Windows CMD)

echo ============================================
echo Deteniendo SAVEUR EVENTOS...
echo ============================================
echo.

docker-compose down

echo.
echo [OK] Servicios detenidos
echo.
echo Para levantar de nuevo: docker-start.bat
echo.
echo [NOTA] Los datos de la BD se mantienen (volumen persistente)
echo [ADVERTENCIA] Para eliminar TODO (incluyendo datos): docker-compose down -v
echo.

pause
