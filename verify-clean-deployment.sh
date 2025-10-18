#!/bin/bash

echo "🔍 Verificando deployment limpio para Netlify..."

# Verificar que no hay referencias al subdirectorio
echo "📋 Verificando referencias al subdirectorio..."
if grep -r "pwa_ExamenDeClaseC" . --exclude-dir=.git --exclude="debug-manifest.html" --exclude="verify-clean-deployment.sh"; then
    echo "❌ Se encontraron referencias al subdirectorio"
    exit 1
else
    echo "✅ No hay referencias al subdirectorio"
fi

# Verificar manifest.json
echo "📱 Verificando manifest.json..."
if grep -q '"start_url": "/"' manifest.json && grep -q '"scope": "/"' manifest.json; then
    echo "✅ Manifest.json configurado correctamente"
else
    echo "❌ Manifest.json no está configurado correctamente"
    exit 1
fi

# Verificar Service Worker
echo "⚙️ Verificando Service Worker..."
if grep -q "clase-c-chile-v2.0.0" sw.js; then
    echo "✅ Service Worker actualizado a v2.0.0"
else
    echo "❌ Service Worker no está actualizado"
    exit 1
fi

# Verificar archivos esenciales
echo "📁 Verificando archivos esenciales..."
required_files=("index.html" "manifest.json" "sw.js" "app.js" "styles.css" "questions.json")
for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file existe"
    else
        echo "❌ $file no existe"
        exit 1
    fi
done

# Verificar iconos
echo "🎨 Verificando iconos..."
if [ -d "icons" ] && [ -f "icons/icon-192x192.png" ]; then
    echo "✅ Iconos disponibles"
else
    echo "❌ Iconos no encontrados"
    exit 1
fi

echo ""
echo "✅ ¡Verificación completada!"
echo "🌐 Tu PWA está listo para Netlify:"
echo "   https://pwa-clase-c-chile.netlify.app/"
echo ""
echo "📱 Para instalar en tu teléfono:"
echo "   1. Abre la URL en tu navegador móvil"
echo "   2. Menú → 'Agregar a pantalla de inicio'"
echo "   3. ¡Listo!"
