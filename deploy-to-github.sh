#!/bin/bash

# Script para desplegar PWA Clase C Chile a GitHub Pages
# Uso: ./deploy-to-github.sh

echo "🚗 Desplegando PWA Clase C Chile a GitHub Pages..."
echo ""

# Verificar que estamos en un repositorio git
if [ ! -d ".git" ]; then
    echo "❌ Error: No estás en un repositorio git"
    echo "💡 Ejecuta primero: git init"
    exit 1
fi

# Verificar que el JSON es válido
echo "🔍 Verificando questions.json..."
python3 -c "
import json
try:
    with open('questions.json', 'r') as f:
        data = json.load(f)
    print(f'✅ JSON válido: {len(data[\"questions\"])} preguntas cargadas')
except Exception as e:
    print(f'❌ Error en questions.json: {e}')
    exit(1)
"

if [ $? -ne 0 ]; then
    echo "❌ Error: questions.json no es válido"
    exit 1
fi

# Agregar todos los archivos
echo "📁 Agregando archivos al repositorio..."
git add .

# Commit
echo "💾 Creando commit..."
git commit -m "Deploy PWA Clase C Chile - $(date '+%Y-%m-%d %H:%M:%S')"

# Verificar si hay un remote configurado
if ! git remote get-url origin >/dev/null 2>&1; then
    echo ""
    echo "⚠️  No hay un remote 'origin' configurado"
    echo "💡 Configura tu repositorio de GitHub primero:"
    echo "   git remote add origin https://github.com/TU_USUARIO/pwa-clase-c-chile.git"
    echo ""
    echo "🔗 Reemplaza 'TU_USUARIO' con tu nombre de usuario de GitHub"
    echo ""
    exit 1
fi

# Push
echo "🚀 Enviando a GitHub..."
git push origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ ¡Despliegue exitoso!"
    echo ""
    echo "🌐 Tu PWA estará disponible en:"
    echo "   https://$(git remote get-url origin | sed 's/.*github.com\///' | sed 's/\.git$//' | sed 's/^/https:\/\/' | sed 's/$/.github.io\/pwa-clase-c-chile\/')"
    echo ""
    echo "📱 Para instalar en tu teléfono:"
    echo "   1. Abre la URL en tu navegador móvil"
    echo "   2. Menú → 'Agregar a pantalla de inicio'"
    echo "   3. ¡Listo! Ya tienes la app instalada"
    echo ""
    echo "⚙️  Para habilitar GitHub Pages:"
    echo "   1. Ve a Settings → Pages en tu repositorio"
    echo "   2. Source: 'GitHub Actions'"
    echo "   3. El workflow se ejecutará automáticamente"
else
    echo "❌ Error al enviar a GitHub"
    exit 1
fi
