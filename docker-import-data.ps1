# Script para importar datos desde Replit a Docker (Windows PowerShell)

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "SAVEUR EVENTOS - Importacion de Datos" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Verificar que Docker este corriendo
try {
    docker ps | Out-Null
    Write-Host "[OK] Docker esta corriendo" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Docker no esta corriendo" -ForegroundColor Red
    Write-Host "Por favor, inicia Docker Desktop primero" -ForegroundColor Yellow
    Read-Host "Presiona Enter para salir"
    exit 1
}

# Verificar que el archivo de migracion exista
if (-not (Test-Path "database-migration.sql")) {
    Write-Host "[ERROR] No se encontro el archivo database-migration.sql" -ForegroundColor Red
    Write-Host "Asegurate de tener el archivo en el directorio actual" -ForegroundColor Yellow
    Read-Host "Presiona Enter para salir"
    exit 1
}

$fileSize = (Get-Item "database-migration.sql").Length
$fileSizeKB = [math]::Round($fileSize / 1KB, 2)
Write-Host "[OK] Archivo de migracion encontrado ($fileSizeKB KB)" -ForegroundColor Green
Write-Host ""

# Verificar que el contenedor de base de datos este corriendo
$containerRunning = docker ps | Select-String "saveur-database"
if (-not $containerRunning) {
    Write-Host "[ADVERTENCIA] El contenedor saveur-database no esta corriendo" -ForegroundColor Yellow
    Write-Host "Levantando servicios con docker-compose..." -ForegroundColor Yellow
    docker-compose up -d database
    Write-Host "Esperando 10 segundos a que PostgreSQL inicie..." -ForegroundColor Yellow
    Start-Sleep -Seconds 10
}

Write-Host "Importando datos a la base de datos..." -ForegroundColor Cyan
Write-Host ""

# Importar el dump
Get-Content database-migration.sql | docker exec -i saveur-database psql -U eventos_user -d eventos_db

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "[OK] Datos importados exitosamente!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Verificando tablas..." -ForegroundColor Cyan
    docker exec -i saveur-database psql -U eventos_user -d eventos_db -c "\dt"
    Write-Host ""
    Write-Host "============================================" -ForegroundColor Cyan
    Write-Host "IMPORTACION COMPLETADA!" -ForegroundColor Green
    Write-Host "============================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Proximos pasos:" -ForegroundColor Yellow
    Write-Host "  1. Levantar todos los servicios: docker-compose up -d" -ForegroundColor White
    Write-Host "  2. Abrir el navegador en: http://localhost" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "[ERROR] Error al importar datos" -ForegroundColor Red
    Write-Host "Revisa los logs arriba para mas detalles" -ForegroundColor Yellow
    Read-Host "Presiona Enter para salir"
    exit 1
}

Read-Host "Presiona Enter para continuar"
