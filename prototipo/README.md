# Nexus — Esqueleto funcional del prototipo

Este es un **prototipo navegable** (HTML + CSS básico + JS sencillo, sin frameworks ni build tools).
Ábrelo directamente en el navegador: `index.html` es el punto de entrada.

> No hay backend real. Todo el estado (usuarios, progreso, XP, diagnóstico, personalización,
> operaciones del simulador) se guarda en `localStorage` del navegador para poder recorrer
> el flujo completo sin servidor.

## Cómo probarlo

1. Abre `index.html` en tu navegador (doble clic funciona, no requiere servidor).
2. Haz clic en **Registrarse** y crea una cuenta (los datos se guardan localmente).
3. Completa el **Onboarding** (elige intereses, estilo de aprendizaje, meta).
4. Completa el **Diagnóstico** (preguntas ficticias, formatos variados).
5. Verás tu **Resultado** con estadísticas y ruta recomendada.
6. Llegarás al **Dashboard**, desde donde puedes navegar a todas las secciones
   (Explorar, Aprender, Misiones, Experiencias, Progreso, Logros, Ranking, Mentor IA,
   Comunidad, Perfil, Personalización, Configuración).
7. Si elegiste **Trading y Finanzas** como interés, verás además Simulador, Mercados y Análisis
   en el sidebar.
8. El botón flotante 🤖 (NEXUS AI) está disponible en todas las páginas internas.

Para probar el flujo de otra persona (por ejemplo, alguien interesado solo en Cine),
cierra sesión desde el sidebar o Configuración y regístrate con otra cuenta.

## Estructura de archivos

```
/index.html            Landing
/register.html         Registro
/login.html            Inicio de sesión
/onboarding.html        Selección de intereses y preferencias
/diagnostico.html       Diagnóstico adaptativo (banco de preguntas por categoría)
/resultado.html         Resultado del diagnóstico + ruta recomendada
/dashboard.html         Home del dashboard (misión del día, XP, coins, racha)
/explorar.html          Descubrimiento de nuevas categorías
/aprender.html          Mapa de progreso dinámico por categoría
/misiones.html          Misiones diarias/semanales
/experiencias.html      Retos, quizzes, simulaciones, casos prácticos
/progreso.html          Estadísticas de progreso y actividad reciente
/trading.html           Hub de Trading (solo si el usuario lo eligió)
/simulador.html         Simulador de trading con capital virtual
/mercados.html          Activos ficticios (placeholder de API real)
/analisis.html          Educación en análisis técnico
/mentor.html            Chat completo con NEXUS AI
/logros.html            Sistema de logros/insignias
/ranking.html           Ranking por XP y constancia (no por dinero simulado)
/comunidad.html         Publicaciones por categoría
/perfil.html            Perfil del usuario
/personalizacion.html   Tema, color, widgets, foto de perfil, perfil público
/configuracion.html     Cuenta, seguridad, notificaciones, privacidad (placeholders)

/css/style.css          Estilos base + 7 temas (dark, light, midnight, ocean, forest, cyber, minimal)

/js/app.js              Estado global, catálogo de categorías/módulos/misiones/logros, shell (sidebar+topbar)
/js/auth.js             Registro / login simulados
/js/onboarding.js       Wizard de intereses, estilo de aprendizaje y meta
/js/diagnostico.js      Banco de preguntas (10 por categoría con banco propio) + wizard de diagnóstico
/js/dashboard.js        Home del dashboard y misión del día
/js/gamificacion.js     Logros y ranking
/js/personalizacion.js  Tema, color, widgets, foto/portada, perfil público
/js/mentor.js           NEXUS AI: widget flotante + página de chat completa
```

## Dónde se conectará el backend real

Busca los comentarios `<!-- BACKEND -->`, `<!-- BASE DE DATOS -->`, `<!-- AUTENTICACIÓN -->`,
`<!-- API DE MERCADOS -->`, `<!-- API DE IA -->`, `<!-- GRÁFICAS -->`, `<!-- SISTEMA DE
RECOMENDACIONES -->`, `<!-- SISTEMA DE LOGROS -->`, `<!-- COMUNIDAD -->` y `<!-- NOTIFICACIONES -->`
repartidos en el código: marcan exactamente dónde se integrará cada pieza de infraestructura real.

## Diseño de la arquitectura (por qué está organizado así)

- **Todo el catálogo (categorías, módulos, misiones, logros, preguntas de diagnóstico) vive en
  objetos JS al inicio de cada archivo** (`CATEGORIES`, `MODULES_BY_CATEGORY`, etc.) para que
  sea trivial reemplazarlos después por llamadas `fetch()` a una API/base de datos real, sin
  tener que tocar la lógica de renderizado.
- **El sidebar y el mapa de aprendizaje son dinámicos**: se generan según `user.interests`, así
  que agregar una categoría nueva (ej. "Deportes") solo requiere añadir una entrada al catálogo,
  no reconstruir páginas.
- **Trading es una categoría más**, no el centro de la plataforma: su sección (`trading.html`,
  `simulador.html`, `mercados.html`, `analisis.html`) solo aparece si el usuario la eligió.
- **El Mentor IA (`mentor.js`) usa una función `mentorRespond()` centralizada** para que sea
  fácil sustituir las respuestas simuladas por una llamada real a un modelo de lenguaje.

## Próximos pasos sugeridos para el equipo

1. Backend + base de datos para usuarios, progreso y catálogo de contenido.
2. Autenticación real (OAuth con Google/Apple incluido como placeholder).
3. Integración de IA real en `mentor.js` (sustituir `mentorRespond`).
4. API de mercados reales para `mercados.html` / `simulador.html` / `analisis.html`.
5. Sistema de recomendaciones real en `explorar.html` y el dashboard.
6. Backend de comunidad (posts, reacciones, moderación).
7. Diseño visual avanzado una vez validada la arquitectura (esta versión lo evita a propósito).
