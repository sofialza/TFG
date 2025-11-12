#!/bin/bash

# Script para detener SAVEUR EVENTOS

echo "🛑 Deteniendo SAVEUR EVENTOS..."
echo ""

docker-compose down

echo ""
echo "✅ Servicios detenidos"
echo ""
echo "💡 Para levantar de nuevo: ./docker-start.sh"
echo "⚠️  Los datos de la BD se mantienen (volumen persistente)"
echo "🗑️  Para eliminar TODO (incluyendo datos): docker-compose down -v"
echo ""
