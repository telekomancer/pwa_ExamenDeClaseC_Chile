#!/bin/bash

echo "🚀 Desplegando PWA a Vercel..."

# Verificar que vercel-cli esté instalado
if ! command -v vercel &> /dev/null; then
    echo "📦 Instalando Vercel CLI..."
    npm install -g vercel
fi

# Login a Vercel (si no está logueado)
echo "🔐 Verificando login a Vercel..."
if ! vercel whoami &> /dev/null; then
    echo "🔑 Por favor, inicia sesión en Vercel:"
    vercel login
fi

# Desplegar
echo "🌐 Desplegando a Vercel..."
vercel --prod

echo "✅ ¡Despliegue completado!"
echo "🌐 Tu PWA estará disponible en una URL limpia como:"
echo "   https://pwa-clase-c-chile.vercel.app"
echo ""
echo "📱 Para instalar en tu teléfono:"
echo "   1. Abre la URL en tu navegador móvil"
echo "   2. Menú → 'Agregar a pantalla de inicio'"
echo "   3. ¡Listo!"
