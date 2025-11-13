#!/bin/bash

echo "📦 SAVEUR EVENTOS - Importación de Datos"
echo "========================================="
echo ""

# Verificar que Docker esté corriendo
if ! docker ps &> /dev/null; then
    echo "❌ Docker no está corriendo"
    echo "Por favor, inicia Docker Desktop primero"
    exit 1
fi

# Verificar que el archivo de migración exista
if [ ! -f database-migration.sql ]; then
    echo "❌ No se encontró el archivo database-migration.sql"
    echo "Asegurate de tener el archivo en el directorio actual"
    exit 1
fi

echo "✅ Archivo de migración encontrado ($(wc -l < database-migration.sql) líneas)"
echo ""

# Verificar que el contenedor de base de datos esté corriendo
if ! docker ps | grep -q saveur-database; then
    echo "⚠️  El contenedor saveur-database no está corriendo"
    echo "Levantando servicios con docker-compose..."
    docker-compose up -d database
    echo "Esperando 10 segundos a que PostgreSQL inicie..."
    sleep 10
fi

echo "🗄️  Importando datos a la base de datos..."
echo ""

# Importar el dump
docker exec -i saveur-database psql -U eventos_user -d eventos_db < database-migration.sql

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Datos importados exitosamente!"
    echo ""
    echo "📊 Verificando tablas..."
    docker exec -i saveur-database psql -U eventos_user -d eventos_db -c "\dt"
    echo ""
    echo "🎉 Importación completada!"
    echo ""
    echo "Próximos pasos:"
    echo "  1. Levantar todos los servicios: docker-compose up -d"
    echo "  2. Abrir el navegador en: http://localhost"
else
    echo ""
    echo "❌ Error al importar datos"
    echo "Revisá los logs arriba para más detalles"
    exit 1
fi
