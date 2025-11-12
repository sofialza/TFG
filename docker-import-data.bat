@echo off
REM Script para importar datos desde Replit a Docker (Windows CMD)

echo ============================================
echo SAVEUR EVENTOS - Importacion de Datos
echo ============================================
echo.

REM Verificar que Docker este corriendo
docker ps >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker no esta corriendo
    echo Por favor, inicia Docker Desktop primero
    pause
    exit /b 1
)

REM Verificar que el archivo de migracion exista
if not exist database-migration.sql (
    echo [ERROR] No se encontro el archivo database-migration.sql
    echo Asegurate de tener el archivo en el directorio actual
    pause
    exit /b 1
)

echo [OK] Archivo de migracion encontrado
echo.

REM Verificar que el contenedor de base de datos este corriendo
docker ps | find "saveur-database" >nul
if errorlevel 1 (
    echo [ADVERTENCIA] El contenedor saveur-database no esta corriendo
    echo Levantando servicios con docker-compose...
    docker-compose up -d database
    echo Esperando 10 segundos a que PostgreSQL inicie...
    timeout /t 10 /nobreak >nul
)

echo Importando datos a la base de datos...
echo.

REM Importar el dump
docker exec -i saveur-database psql -U eventos_user -d eventos_db < database-migration.sql

if errorlevel 0 (
    echo.
    echo [OK] Datos importados exitosamente!
    echo.
    echo Verificando tablas...
    docker exec -i saveur-database psql -U eventos_user -d eventos_db -c "\dt"
    echo.
    echo ============================================
    echo IMPORTACION COMPLETADA!
    echo ============================================
    echo.
    echo Proximos pasos:
    echo   1. Levantar todos los servicios: docker-compose up -d
    echo   2. Abrir el navegador en: http://localhost
    echo.
) else (
    echo.
    echo [ERROR] Error al importar datos
    echo Revisa los logs arriba para mas detalles
    pause
    exit /b 1
)

pause
