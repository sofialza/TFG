#!/bin/bash

# Script de ayuda para levantar SAVEUR EVENTOS con Docker

echo "🎉 SAVEUR EVENTOS - Docker Helper"
echo "=================================="
echo ""

# Verificar si Docker está instalado
if ! command -v docker &> /dev/null
then
    echo "❌ Docker no está instalado"
    echo "Descargalo desde: https://www.docker.com/products/docker-desktop"
    exit 1
fi

# Verificar si docker-compose está instalado
if ! command -v docker-compose &> /dev/null
then
    echo "❌ Docker Compose no está instalado"
    exit 1
fi

echo "✅ Docker instalado correctamente"
echo ""

# Verificar si existe .env
if [ ! -f .env ]; then
    echo "📝 Creando archivo .env desde .env.example..."
    cp .env.example .env
    echo "✅ Archivo .env creado"
    echo "⚠️  Recordá editar .env si necesitás cambiar contraseñas"
    echo ""
fi

echo "🚀 Levantando servicios..."
echo ""

# Levantar servicios
docker-compose up -d

echo ""
echo "⏳ Esperando que los servicios estén listos..."
sleep 10

# Verificar estado
echo ""
echo "📊 Estado de los servicios:"
docker-compose ps

echo ""
echo "✅ Sistema levantado!"
echo ""
echo "🌐 Accedé a: http://localhost"
echo ""
echo "📝 Comandos útiles:"
echo "  • Ver logs:         docker-compose logs -f"
echo "  • Detener:          docker-compose down"
echo "  • Reiniciar:        docker-compose restart"
echo "  • Reconstruir:      docker-compose up -d --build"
echo ""
