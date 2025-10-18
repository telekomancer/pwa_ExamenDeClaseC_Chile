# 🚗 PWA Clase C Chile - Estudio Diario

Una aplicación web progresiva (PWA) para estudiar y prepararse para el examen de licencia Clase C en Chile.

## 📱 Características

- **216 preguntas** de estudio con respuestas y explicaciones
- **Múltiples sesiones diarias** sin límites
- **Selector personalizable** de cantidad de preguntas (5, 10, 20, 30, 50 o personalizado)
- **Progreso guardado** localmente en el dispositivo
- **Funciona offline** después de la primera carga
- **Manual del motociclista** disponible para descarga
- **Imágenes** para preguntas que las requieren
- **Preguntas de selección múltiple** y de respuesta única

## 🎯 Categorías de Preguntas

- **Emergencias**: Primeros auxilios y manejo de accidentes
- **Seguridad**: Normas de seguridad vial
- **Señalización**: Interpretación de señales de tránsito
- **Normativa de Tránsito**: Leyes y regulaciones
- **Manejo del vehículo**: Técnicas de conducción
- **Mantenimiento**: Cuidado del vehículo

## 🚀 Despliegue

### GitHub Pages (Recomendado)

1. **Crear repositorio en GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: PWA Clase C Chile"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/pwa-clase-c-chile.git
   git push -u origin main
   ```

2. **Habilitar GitHub Pages:**
   - Ve a Settings → Pages
   - Source: "GitHub Actions"
   - El workflow se ejecutará automáticamente

3. **Acceder a la aplicación:**
   - URL: `https://TU_USUARIO.github.io/pwa-clase-c-chile/`

### Netlify (Alternativa)

1. **Conectar repositorio:**
   - Ve a [netlify.com](https://netlify.com)
   - "New site from Git"
   - Conecta tu repositorio de GitHub

2. **Configuración:**
   - Build command: (dejar vacío)
   - Publish directory: `/` (raíz)
   - Deploy automáticamente

## 📱 Instalación en Dispositivo

### Android
1. Abre la aplicación en Chrome
2. Menú → "Agregar a pantalla de inicio"
3. La app se instalará como una aplicación nativa

### iOS
1. Abre la aplicación en Safari
2. Compartir → "Agregar a pantalla de inicio"
3. La app se instalará como una aplicación nativa

## 🛠️ Desarrollo Local

```bash
# Clonar el repositorio
git clone https://github.com/TU_USUARIO/pwa-clase-c-chile.git
cd pwa-clase-c-chile

# Iniciar servidor local
python3 -m http.server 8000
# o
npx http-server -p 8000

# Abrir en navegador
open http://localhost:8000
```

## 📊 Estadísticas

- **Total de preguntas**: 216
- **Preguntas con imágenes**: 42
- **Preguntas de selección múltiple**: 41
- **Categorías**: 6
- **Niveles de dificultad**: Básica, Intermedia, Avanzada

## 🔧 Tecnologías

- **HTML5** - Estructura
- **CSS3** - Estilos y diseño responsive
- **JavaScript (ES6+)** - Lógica de la aplicación
- **Service Worker** - Funcionalidad offline
- **Web App Manifest** - Instalación como PWA
- **Local Storage** - Persistencia de datos

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Soporte

Si tienes problemas o sugerencias, por favor abre un issue en GitHub.

---

**¡Estudia y obtén tu licencia Clase C! 🚗📚**