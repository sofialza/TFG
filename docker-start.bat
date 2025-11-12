@echo off
REM Script para levantar SAVEUR EVENTOS con Docker (Windows CMD)

echo ============================================
echo SAVEUR EVENTOS - Docker Helper
echo ============================================
echo.

REM Verificar si Docker esta instalado
docker --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker no esta instalado
    echo Descargalo desde: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

echo [OK] Docker instalado correctamente
echo.

REM Verificar si existe .env
if not exist .env (
    echo Creando archivo .env desde .env.example...
    copy .env.example .env >nul
    echo [OK] Archivo .env creado
    echo [ADVERTENCIA] Recorda editar .env si necesitas cambiar contrasenas
    echo.
)

echo Levantando servicios...
echo.

docker-compose up -d

echo.
echo Esperando que los servicios esten listos...
timeout /t 10 /nobreak >nul

echo.
echo Estado de los servicios:
docker-compose ps

echo.
echo ============================================
echo SISTEMA LEVANTADO!
echo ============================================
echo.
echo Accede a: http://localhost
echo.
echo Comandos utiles:
echo   Ver logs:       docker-compose logs -f
echo   Detener:        docker-compose down
echo   Reiniciar:      docker-compose restart
echo   Reconstruir:    docker-compose up -d --build
echo.

pause
