# CLEVER — Plataforma Integral de Aprendizaje y Exchange Financiero

CLEVER es una plataforma integral que combina un universo formativo y gamificado (análisis técnico, finanzas, cultura pop, cine, videojuegos, misiones diarias, diagnósticos adaptativos y mentoría con Inteligencia Artificial) junto con un mercado financiero práctico (Exchange Spot) para operar activos de la industria del entretenimiento y los videojuegos en tiempo real.

---

## Arquitectura del Proyecto

```
clever/
├── clever_api/          Backend REST con FastAPI, SQLAlchemy y motor de eventos de mercado
├── clever_web/          Frontend SPA con React 19, TypeScript, Tailwind CSS y Vite
├── prototipo/           Esqueleto funcional inicial y banco de preguntas de referencia
├── .gitignore           Ignorado global de dependencias y artefactos
└── README.md            Guía de inicio y puesta en marcha
```

---

## Requisitos Previos

- **Node.js**: v18.0.0 o superior (se recomienda v20+)
- **pnpm**: v8.0.0 o superior
- **Python**: v3.10 o superior
- Base de datos MySQL / MariaDB compatible

---

## 1. Puesta en Marcha del Backend (clever_api)

El backend expone la API REST en `http://localhost:8000` con documentación interactiva en `/docs`.

### Pasos:

1. Abrir una terminal en la carpeta del backend:
```bash
cd clever_api
```

2. Crear y activar el entorno virtual de Python:

En Windows (PowerShell):
```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

En Linux / macOS:
```bash
python -m venv .venv
.venv\Scripts\activate
```

3. Instalar dependencias requeridas:
```bash
pip install -r requirements.txt
```

4. Configurar variables de entorno:
Copiar el archivo de ejemplo y configurar las credenciales locales:

En Windows (PowerShell):
```powershell
Copy-Item .env.example .env
```

En Linux / macOS / Bash:
```bash
cp .env.example .env
```

5. Iniciar el servidor de desarrollo:
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

---

## 2. Puesta en Marcha del Frontend (clever_web)

El frontend es la aplicación web interactiva que integra todas las rutas de aprendizaje, simulación y exchange.

### Pasos:

1. Abrir una terminal en la carpeta del frontend:
```bash
cd clever_web
```

2. Instalar los paquetes con pnpm:
```bash
pnpm install
```

3. Configurar variables de entorno:
Copiar el archivo de ejemplo para configurar la URL de la API:

En Windows (PowerShell):
```powershell
Copy-Item .env.example .env
```

En Linux / macOS / Bash:
```bash
cp .env.example .env
```

4. Iniciar el servidor de desarrollo Vite:
```bash
pnpm dev
```

5. Abrir en el navegador:
`http://localhost:5173`

---

## 3. Módulos y Secciones Disponibles en CLEVER

- **Inicio (`/`)**: Hub central con catálogo de áreas de conocimiento, acceso a desafíos y panel de misión diaria.
- **Aprender (`/aprender`)**: Mapa de módulos por categoría con seguimiento de avance y desbloqueo de experiencia (XP).
- **Desafíos (`/experiencias`)**: Quizzes adaptativos, retos de cálculo de riesgo y casos prácticos situacionales.
- **Exchange Spot (`/exchange`)**: Bolsa y simulador práctico en vivo con cotizaciones de videojuegos, terminal `/trade/:id`, portafolio e historial.
- **Análisis Técnico (`/analisis`)**: Guías interactivas de lectura de velas japonesas, soportes, resistencias y osciladores RSI.
- **Misiones (`/misiones`)**: Tracker de objetivos diarios y semanales para preservar la racha.
- **Mentor IA (`/mentor`)**: Chatbot pedagógico contextual y widget flotante disponible en toda la plataforma.
- **Ranking (`/ranking`)**: Tabla de clasificación comunitaria basada en experiencia y constancia.
- **Logros (`/logros`)**: Galería de insignias desbloqueables.
- **Comunidad (`/comunidad`)**: Foro por categorías para debatir tesis y compartir análisis.
- **Diagnóstico (`/diagnostico`) & Resultado (`/resultado`)**: Examen adaptativo de evaluación de nivel.
- **Personalización (`/personalizacion`)**: Selector de temas visuales, paletas de acento y avatar.
