#!/bin/bash

# Despliegue manual a GitHub Pages
# Uso: ./deploy-manual.sh

echo "🚀 Despliegue manual a GitHub Pages..."

# Crear rama gh-pages si no existe
if ! git show-ref --verify --quiet refs/heads/gh-pages; then
    echo "📝 Creando rama gh-pages..."
    git checkout --orphan gh-pages
    git rm -rf .
else
    echo "📝 Cambiando a rama gh-pages..."
    git checkout gh-pages
fi

# Volver a main y copiar archivos
echo "📁 Copiando archivos..."
git checkout main -- .

# Remover archivos innecesarios
echo "🧹 Limpiando archivos innecesarios..."
rm -rf .github/
rm -f deploy-*.sh
rm -f check-*.sh
rm -f netlify.toml
rm -f README.md
rm -f .gitignore

# Commit y push
echo "💾 Creando commit..."
git add .
git commit -m "Deploy PWA Clase C Chile - $(date '+%Y-%m-%d %H:%M:%S')"

echo "🚀 Enviando a GitHub Pages..."
git push origin gh-pages

# Volver a main
git checkout main

echo ""
echo "✅ ¡Despliegue manual completado!"
echo "🌐 Tu PWA estará disponible en:"
echo "   https://telekomancer.github.io/"
echo ""
echo "📱 Para instalar en tu teléfono:"
echo "   1. Abre la URL en tu navegador móvil"
echo "   2. Menú → 'Agregar a pantalla de inicio'"
echo "   3. ¡Listo!"
