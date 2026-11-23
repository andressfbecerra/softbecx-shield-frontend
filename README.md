# SoftBecX Shield

**Plataforma inteligente para la detección y prevención de fraudes digitales.**

SoftBecX Shield es una aplicación web orientada a la ciberseguridad empresarial. Su propósito es facilitar la identificación de posibles amenazas digitales, el registro y seguimiento de incidentes, el análisis de riesgos y la consulta de recomendaciones preventivas.

El proyecto busca proporcionar una herramienta centralizada para apoyar la detección de señales sospechosas y mejorar la gestión de incidentes de seguridad.

## 1. Objetivo del proyecto

Desarrollar una plataforma web que permita gestionar incidentes de seguridad digital, consultar análisis de riesgo y visualizar recomendaciones que ayuden a prevenir posibles fraudes, ataques de phishing y otras amenazas informáticas.

## 2. Funcionalidades implementadas

Actualmente, el frontend cuenta con las siguientes funcionalidades:

- **Panel principal:** visualización de indicadores y accesos a las funcionalidades del sistema.
- **Centro de alertas:** consulta de incidentes registrados, búsqueda y filtrado de información.
- **Gestión de incidentes:** registro, consulta, actualización de estado y eliminación de incidentes mediante la API REST.
- **Análisis de riesgo:** visualización del método de análisis, nivel de riesgo, puntaje y explicación correspondiente.
- **Recomendaciones de seguridad:** consulta de recomendaciones asociadas a los análisis de riesgo.
- **Detalle de incidentes:** presentación organizada de la información del incidente, su análisis y sus recomendaciones.
- **Seguimiento:** selección y consulta de incidentes para facilitar su seguimiento desde la interfaz.

## 3. Tecnologías utilizadas

| Tecnología | Utilización |
|---|---|
| React | Construcción de la interfaz mediante componentes reutilizables. |
| JavaScript | Implementación de la lógica de la aplicación. |
| Vite | Entorno de desarrollo y construcción del frontend. |
| HTML5 | Estructura de la aplicación. |
| CSS3 | Diseño visual y adaptación a diferentes pantallas. |
| Axios | Comunicación HTTP con el backend. |
| React Router DOM | Navegación entre páginas. |
| Context API | Gestión del estado compartido de seguimiento. |
| Git y GitHub | Control de versiones y almacenamiento del código fuente. |

## 4. Arquitectura del proyecto

SoftBecX Shield utiliza una arquitectura Full Stack compuesta por:

- **Frontend:** aplicación desarrollada con React y Vite.
- **Backend:** API REST desarrollada con Java y Spring Boot.
- **Base de datos:** MySQL para la persistencia de la información.

El frontend consume los servicios del backend mediante solicitudes HTTP utilizando Axios.

## 5. Requisitos previos

Para ejecutar el frontend se necesita:

- Node.js instalado.
- npm, incluido con Node.js.
- Visual Studio Code u otro editor de código.
- Acceso al repositorio del proyecto.

Para utilizar las funcionalidades que consultan información real también se necesita:

- Backend SoftBecX Shield ejecutándose con Spring Boot.
- Base de datos MySQL configurada y disponible.
- Conexión entre el backend y la base de datos.
- Configuración CORS que permita las solicitudes desde el frontend.

## 6. Instalación y ejecución

### 6.1. Clonar el repositorio

```bash
git clone https://github.com/andressfbecerra/softbecx-shield-frontend.git
```

### 6.2. Ingresar a la carpeta

```bash
cd softbecx-shield-frontend
```

### 6.3. Instalar las dependencias

```bash
npm install
```

### 6.4. Iniciar el servidor de desarrollo

```bash
npm run dev
```

Vite mostrará en la terminal la dirección local para abrir la aplicación en el navegador. Normalmente es:

```text
http://localhost:5173
```

## 7. Conexión con el backend

La comunicación con la API REST se centraliza en:

```text
src/services/api.js
```

La configuración actual utiliza Axios y establece como dirección base:

```text
http://localhost:8080/api
```

Entre los recursos utilizados por el frontend se encuentran:

| Recurso | Función |
|---|---|
| `/incidentes` | Consulta y gestión de incidentes. |
| `/analisis-riesgo` | Consulta de análisis de riesgo. |
| `/recomendaciones` | Consulta de recomendaciones de seguridad. |

El backend debe estar disponible para que las operaciones que dependen de la API funcionen correctamente.

## 8. Estructura principal del frontend

```text
softbecx-frontend/
│
├── public/
│   ├── img/
│   │   ├── panel/
│   │   └── ...
│   ├── favicon.svg
│   └── icons.svg
│
├── src/
│   ├── assets/
│   │
│   ├── components/
│   │   ├── AlertaCard.jsx
│   │   └── Header.jsx
│   │
│   ├── context/
│   │   ├── SeguimientoContext.jsx
│   │   ├── SeguimientoProvider.jsx
│   │   └── useSeguimiento.js
│   │
│   ├── pages/
│   │   ├── AlertasPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── RegistroPage.jsx
│   │   ├── RecuperarContrasenaPage.jsx
│   │   ├── MantenimientoPage.jsx
│   │   ├── PanelPage.jsx
│   │   ├── ReportarIncidentePage.jsx
│   │   └── SeguimientoPage.jsx
│   │
│   ├── services/
│   │   └── api.js
│   │
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
│
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

### Descripción de las carpetas

- `components/`: componentes reutilizables de la interfaz.
- `context/`: administración del estado compartido de seguimiento.
- `pages/`: páginas principales de la aplicación.
- `services/`: configuración y comunicación con la API REST.
- `assets/`: recursos utilizados por los componentes.
- `public/`: imágenes e iconos públicos de la aplicación.

## 9. Comandos disponibles

| Comando | Descripción |
|---|---|
| `npm install` | Instala las dependencias del proyecto. |
| `npm run dev` | Inicia el servidor de desarrollo. |
| `npm run build` | Genera la versión de producción. |
| `npm run lint` | Comprueba el código mediante ESLint. |
| `npm run preview` | Permite previsualizar la compilación de producción. |

## 10. Consideraciones y limitaciones actuales

SoftBecX Shield se encuentra en desarrollo como producto mínimo viable (MVP).

Actualmente deben tenerse en cuenta las siguientes consideraciones:

- Las pantallas de inicio de sesión y registro son demostrativas y todavía no realizan autenticación ni registro de usuarios mediante el backend.
- La recuperación de contraseña es una interfaz demostrativa; todavía no envía correos ni realiza cambios de contraseña.
- La información de seguimiento gestionada mediante Context API se conserva localmente en el navegador utilizando localStorage.
- El funcionamiento de las consultas y operaciones conectadas a la API depende de la disponibilidad del backend y de la base de datos.
- La aplicación continúa en proceso de integración, pruebas y documentación.

## 11. Identidad del proyecto

**Marca:** SoftBecX

**Nombre:** SoftBecX Shield

**Eslogan:** Inteligencia que protege tu mundo digital.

**Enfoque:** ciberseguridad, detección de riesgos digitales y prevención de fraudes.

---

*Proyecto desarrollado en el marco del proceso formativo del SENA, Tecnología en Análisis y Desarrollo de Software.*