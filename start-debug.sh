#!/bin/bash

echo "🔍 Iniciando servidor de debug para PWA Clase C Chile..."
echo ""

# Verificar si Python3 está disponible
if command -v python3 &> /dev/null; then
    echo "✅ Python3 encontrado"
    echo "🌐 Iniciando servidor de debug en http://localhost:8000"
    echo ""
    echo "🔍 Endpoints de debug disponibles:"
    echo "   - http://localhost:8000/debug/21 (Pregunta 21)"
    echo "   - http://localhost:8000/debug/1 (Pregunta 1)"
    echo "   - http://localhost:8000/debug (Todas las preguntas)"
    echo "   - http://localhost:8000/ (PWA principal)"
    echo ""
    echo "💡 Para detener el servidor, presiona Ctrl+C"
    echo ""
    python3 debug-server.py
elif command -v python &> /dev/null; then
    echo "✅ Python encontrado"
    echo "🌐 Iniciando servidor de debug en http://localhost:8000"
    echo ""
    echo "🔍 Endpoints de debug disponibles:"
    echo "   - http://localhost:8000/debug/21 (Pregunta 21)"
    echo "   - http://localhost:8000/debug/1 (Pregunta 1)"
    echo "   - http://localhost:8000/debug (Todas las preguntas)"
    echo "   - http://localhost:8000/ (PWA principal)"
    echo ""
    echo "💡 Para detener el servidor, presiona Ctrl+C"
    echo ""
    python debug-server.py
else
    echo "❌ Error: Python no encontrado"
    echo "💡 Instala Python para continuar"
    exit 1
fi
