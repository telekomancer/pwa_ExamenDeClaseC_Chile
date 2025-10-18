# 🚗 PWA Clase C Chile - Estudio Diario

[![Deploy Status](https://img.shields.io/badge/Status-Deployed%20Successfully-brightgreen)](https://telekomancer.github.io/pwa_ExamenDeClaseC_Chile/)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-blue)](https://telekomancer.github.io/pwa_ExamenDeClaseC_Chile/)
[![Questions](https://img.shields.io/badge/Questions-216-orange)](https://telekomancer.github.io/pwa_ExamenDeClaseC_Chile/)

Una aplicación web progresiva (PWA) para estudiar y prepararse para el examen de licencia Clase C en Chile.

## 🌐 **Acceso Directo**
**[📱 Abrir PWA en tu navegador](https://telekomancer.github.io/pwa_ExamenDeClaseC_Chile/)**

## 📱 Características

- **216 preguntas** de estudio con respuestas y explicaciones
- **Múltiples sesiones diarias** sin límites
- **Selector personalizable** de cantidad de preguntas (5, 10, 20, 30, 50 o personalizado)
- **Progreso guardado** localmente en el dispositivo
- **Funciona offline** después de la primera carga
- **Manual del motociclista** disponible para descarga
- **Imágenes** para preguntas que las requieren
- **Preguntas de selección múltiple** y de respuesta única
- **Instalable** como aplicación nativa en móviles

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
   - Source: "Deploy from a branch"
   - Branch: "gh-pages"
   - Folder: "/ (root)"

3. **Desplegar manualmente:**
   ```bash
   ./deploy-manual.sh
   ```

4. **Acceder a la aplicación:**
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
1. Abre [la aplicación](https://telekomancer.github.io/pwa_ExamenDeClaseC_Chile/) en Chrome
2. Menú → "Agregar a pantalla de inicio"
3. La app se instalará como una aplicación nativa

### iOS
1. Abre [la aplicación](https://telekomancer.github.io/pwa_ExamenDeClaseC_Chile/) en Safari
2. Compartir → "Agregar a pantalla de inicio"
3. La app se instalará como una aplicación nativa

### 🎯 **Ventajas de la PWA:**
- ✅ **Instalación rápida** sin tiendas de aplicaciones
- ✅ **Actualizaciones automáticas** al abrir la app
- ✅ **Funciona offline** después de la primera carga
- ✅ **Notificaciones** para recordatorios de estudio
- ✅ **Icono personalizado** en la pantalla de inicio

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

## 🔧 Troubleshooting

### Problemas Comunes

#### **La PWA no se instala**
- ✅ Asegúrate de usar **HTTPS** (GitHub Pages lo proporciona automáticamente)
- ✅ Usa **Chrome** en Android o **Safari** en iOS
- ✅ Verifica que el Service Worker esté registrado (DevTools → Application → Service Workers)

#### **Las imágenes no cargan**
- ✅ Verifica que las imágenes estén en la carpeta `img/`
- ✅ Limpia la caché del navegador (Ctrl+Shift+R)
- ✅ Verifica la consola del navegador para errores

#### **El progreso no se guarda**
- ✅ Verifica que el navegador permita Local Storage
- ✅ No uses modo incógnito
- ✅ Verifica que JavaScript esté habilitado

#### **La PWA no funciona offline**
- ✅ Espera a que se complete la primera carga
- ✅ Verifica que el Service Worker esté activo
- ✅ Revisa la pestaña Network en DevTools

### 🛠️ **Comandos Útiles**

```bash
# Verificar que todo esté listo
./check-deployment.sh

# Desplegar actualizaciones
./deploy-manual.sh

# Servidor local para desarrollo
python3 -m http.server 8000
```

## 📞 Soporte

Si tienes problemas o sugerencias, por favor abre un issue en GitHub.

---

**¡Estudia y obtén tu licencia Clase C! 🚗📚**