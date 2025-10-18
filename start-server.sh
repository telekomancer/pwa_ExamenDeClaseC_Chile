#!/bin/bash

echo "🚗 Iniciando servidor de desarrollo para PWA Clase C Chile..."
echo ""

# Verificar si Python3 está disponible
if command -v python3 &> /dev/null; then
    echo "✅ Python3 encontrado"
    echo "🌐 Iniciando servidor en http://localhost:8000"
    echo "📱 Abre tu navegador y ve a: http://localhost:8000"
    echo ""
    echo "💡 Para detener el servidor, presiona Ctrl+C"
    echo ""
    python3 -m http.server 8000
elif command -v python &> /dev/null; then
    echo "✅ Python encontrado"
    echo "🌐 Iniciando servidor en http://localhost:8000"
    echo "📱 Abre tu navegador y ve a: http://localhost:8000"
    echo ""
    echo "💡 Para detener el servidor, presiona Ctrl+C"
    echo ""
    python -m http.server 8000
else
    echo "❌ Error: Python no encontrado"
    echo "💡 Instala Python para continuar"
    exit 1
fi
