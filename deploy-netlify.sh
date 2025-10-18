#!/bin/bash

echo "🚀 Desplegando PWA a Netlify..."

# Verificar que netlify-cli esté instalado
if ! command -v netlify &> /dev/null; then
    echo "📦 Instalando Netlify CLI..."
    npm install -g netlify-cli
fi

# Login a Netlify (si no está logueado)
echo "🔐 Verificando login a Netlify..."
if ! netlify status &> /dev/null; then
    echo "🔑 Por favor, inicia sesión en Netlify:"
    netlify login
fi

# Desplegar
echo "🌐 Desplegando a Netlify..."
netlify deploy --prod --dir .

echo "✅ ¡Despliegue completado!"
echo "🌐 Tu PWA estará disponible en una URL limpia como:"
echo "   https://pwa-clase-c-chile.netlify.app"
echo ""
echo "📱 Para instalar en tu teléfono:"
echo "   1. Abre la URL en tu navegador móvil"
echo "   2. Menú → 'Agregar a pantalla de inicio'"
echo "   3. ¡Listo!"
