#!/bin/bash

echo "🚗 PWA Clase C Chile - Servidor Completo"
echo "========================================"
echo ""

# Verificar si Python3 está disponible
if command -v python3 &> /dev/null; then
    echo "✅ Python3 encontrado"
    echo ""
    echo "🌐 Servidor principal: http://localhost:8000"
    echo "🔍 Debug de preguntas: http://localhost:8000/debug/21"
    echo ""
    echo "📱 Endpoints disponibles:"
    echo "   - http://localhost:8000/ (PWA principal)"
    echo "   - http://localhost:8000/debug/21 (Debug pregunta 21)"
    echo "   - http://localhost:8000/debug/1 (Debug pregunta 1)"
    echo "   - http://localhost:8000/debug (Todas las preguntas)"
    echo ""
    echo "💡 Para detener el servidor, presiona Ctrl+C"
    echo ""
    python3 debug-server.py
elif command -v python &> /dev/null; then
    echo "✅ Python encontrado"
    echo ""
    echo "🌐 Servidor principal: http://localhost:8000"
    echo "🔍 Debug de preguntas: http://localhost:8000/debug/21"
    echo ""
    echo "📱 Endpoints disponibles:"
    echo "   - http://localhost:8000/ (PWA principal)"
    echo "   - http://localhost:8000/debug/21 (Debug pregunta 21)"
    echo "   - http://localhost:8000/debug/1 (Debug pregunta 1)"
    echo "   - http://localhost:8000/debug (Todas las preguntas)"
    echo ""
    echo "💡 Para detener el servidor, presiona Ctrl+C"
    echo ""
    python debug-server.py
else
    echo "❌ Error: Python no encontrado"
    echo "💡 Instala Python para continuar"
    exit 1
fi
