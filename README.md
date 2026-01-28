# Sistema de Gestión de Egresados - EgreX 🎓

El **Sistema de Gestión de Egresados (EgreX)** es una plataforma integral diseñada para la administración estratégica de la comunidad de graduados. Permite el seguimiento detallado de la trayectoria laboral, la gestión de eventos institucionales y la generación de reportes avanzados para la toma de decisiones.

## 🚀 Características Principales

- **Gestión Autónoma de Base de Datos:** El sistema se inicializa solo. No requiere scripts manuales; el backend asegura la estructura al arrancar.
- **Reportes Avanzados:** Exportación completa de datos de egresados a Excel (20+ dimensiones) y PDF.
- **Seguimiento Laboral:** Ficha técnica expandida con información de empresa, sector, rango salarial y méritos.
- **Gestión de Eventos:** Registro y control de asistencia con descarga de participantes.
- **Diseño Premium:** Interfaz minimalista, profesional y responsiva basada en los colores institucionales.

## 🛠️ Arquitectura y Tecnologías

- **Frontend:** React.js con Framer Motion para animaciones y React Bootstrap para el diseño.
- **Backend:** Node.js / Express con arquitectura modular y autónoma.
- **Base de Datos:** PostgreSQL (Contenerizado o Cloud SQL).
- **Contenerización:** Docker & Docker Compose para despliegue instantáneo.

## 📦 Despliegue Rápido (Docker)

La forma más sencilla de poner el sistema a prueba es usando Docker:

1. **Clonar el repositorio.**
2. **Ejecutar el comando de arranque:**
   ```bash
   docker-compose up --build -d
   ```
3. **Acceder al sistema:**
   - **Frontend:** `http://localhost`
   - **Backend API:** `http://localhost:8080/api`

### 🔑 Credenciales por Defecto
El sistema crea automáticamente un administrador inicial:
- **Usuario (Email/ID):** `admin` (en el campo de login)
- **Contraseña:** `admin`

## ⚙️ Configuración Manual (Desarrollo)

### Backend
1. Ir a `/backend`, crear un `.env` basado en las variables de `docker-compose.yml`.
2. Ejecutar `npm install` y luego `npm start`.
3. El servidor se encargará de crear las tablas si la DB está vacía.

### Frontend
1. Ir a `/frontend`.
2. Ejecutar `npm install` y luego `npm start`.
3. La aplicación estará en `http://localhost:3000`.

## 📁 Estructura del Proyecto

```
/
├── backend/                # API REST Autónoma
│   ├── src/
│   │   ├── config/         # Inicialización de DB e Init seguro
│   │   ├── controllers/    # Lógica de Egresados y Eventos
│   │   ├── models/         # Modelos de datos
│   │   └── server.js       # Punto de entrada autónomo
│   └── Dockerfile
│
├── frontend/               # Aplicación React Premium
│   ├── src/
│   │   ├── pages/          # AdminUsers, Events, Profile, etc.
│   │   └── services/       # Comunicación con API
│   └── Dockerfile
│
└── docker-compose.yml      # Orquestación de servicios
```

## ✅ Objetivos Cumplidos
- [x] **Reportes:** Exportación avanzada a Excel y PDF.
- [x] **Seguridad:** Autenticación JWT y roles protegidos.
- [x] **Autonomía:** DB autogestionada por el backend.
- [x] **UX:** Diseño minimalista con iconos y tooltips.

---
Institución de Educación Superior FESC - 2026
