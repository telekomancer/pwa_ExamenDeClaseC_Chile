#!/bin/bash

echo "🚀 Deploy Súper Rápido a Surge.sh..."

# Verificar que surge esté instalado
if ! command -v surge &> /dev/null; then
    echo "📦 Instalando Surge CLI..."
    npm install -g surge
fi

# Deploy
echo "🌐 Desplegando a Surge..."
surge . pwa-clase-c-chile.surge.sh

echo "✅ ¡Deploy completado!"
echo "🌐 Tu PWA estará disponible en:"
echo "   https://pwa-clase-c-chile.surge.sh"
echo ""
echo "📱 Para instalar en tu teléfono:"
echo "   1. Abre la URL en tu navegador móvil"
echo "   2. Menú → 'Agregar a pantalla de inicio'"
echo "   3. ¡Listo!"
