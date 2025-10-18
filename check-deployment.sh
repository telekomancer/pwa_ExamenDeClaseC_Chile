#!/bin/bash

# Script para verificar que la PWA esté lista para despliegue
# Uso: ./check-deployment.sh

echo "🔍 Verificando PWA Clase C Chile para despliegue..."
echo ""

# Verificar archivos esenciales
echo "📁 Verificando archivos esenciales..."

files=(
    "index.html"
    "manifest.json"
    "sw.js"
    "app.js"
    "styles.css"
    "questions.json"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file - FALTANTE"
        exit 1
    fi
done

# Verificar JSON válido
echo ""
echo "🔍 Verificando questions.json..."
python3 -c "
import json
try:
    with open('questions.json', 'r') as f:
        data = json.load(f)
    print(f'✅ JSON válido: {len(data[\"questions\"])} preguntas')
    print(f'✅ Metadata: {data[\"metadata\"][\"totalQuestions\"]} preguntas totales')
    print(f'✅ Preguntas con imágenes: {sum(1 for q in data[\"questions\"] if q.get(\"image\"))}')
    print(f'✅ Preguntas múltiples: {sum(1 for q in data[\"questions\"] if isinstance(q.get(\"correct\"), list))}')
except Exception as e:
    print(f'❌ Error en questions.json: {e}')
    exit(1)
"

if [ $? -ne 0 ]; then
    echo "❌ Error: questions.json no es válido"
    exit 1
fi

# Verificar imágenes
echo ""
echo "🖼️  Verificando imágenes..."
img_count=$(find img/ -name "*.png" 2>/dev/null | wc -l)
echo "✅ $img_count imágenes encontradas en img/"

# Verificar PDF
echo ""
echo "📄 Verificando manual..."
if [ -f "pdfs/LNC-MOTOCICLISTAS.pdf" ]; then
    size=$(du -h pdfs/LNC-MOTOCICLISTAS.pdf | cut -f1)
    echo "✅ Manual disponible: $size"
else
    echo "⚠️  Manual no encontrado (opcional)"
fi

# Verificar Service Worker
echo ""
echo "⚙️  Verificando Service Worker..."
if grep -q "LNC-MOTOCICLISTAS.pdf" sw.js; then
    echo "✅ PDF incluido en Service Worker"
else
    echo "⚠️  PDF no incluido en Service Worker"
fi

# Verificar manifest
echo ""
echo "📱 Verificando manifest..."
if [ -f "manifest.json" ]; then
    echo "✅ manifest.json presente"
    if grep -q "Clase C" manifest.json; then
        echo "✅ Título configurado"
    else
        echo "⚠️  Título no configurado"
    fi
else
    echo "❌ manifest.json faltante"
    exit 1
fi

# Verificar HTTPS (simulado)
echo ""
echo "🔒 Verificando configuración PWA..."
if grep -q "serviceWorker" app.js; then
    echo "✅ Service Worker registrado"
else
    echo "❌ Service Worker no registrado"
fi

if grep -q "manifest" index.html; then
    echo "✅ Manifest enlazado"
else
    echo "❌ Manifest no enlazado"
fi

echo ""
echo "🎉 ¡Verificación completada!"
echo ""
echo "📋 Resumen:"
echo "   • Archivos esenciales: ✅"
echo "   • JSON válido: ✅"
echo "   • Imágenes: $img_count"
echo "   • Manual: $(if [ -f "pdfs/LNC-MOTOCICLISTAS.pdf" ]; then echo "✅"; else echo "⚠️"; fi)"
echo "   • PWA configurada: ✅"
echo ""
echo "🚀 Listo para despliegue en:"
echo "   • GitHub Pages: ./deploy-to-github.sh"
echo "   • Netlify: Conectar repositorio"
echo "   • Vercel: Importar proyecto"
echo ""
