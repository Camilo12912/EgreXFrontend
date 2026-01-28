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

Para iniciar todo el sistema (Frontend, Backend y Base de Datos) desde esta carpeta:

1. **Asegúrate de que la carpeta `egrex-backend` esté en el mismo nivel que esta carpeta en tu escritorio.**
2. **Ejecutar el comando de arranque:**
   ```bash
   docker compose up --build -d
   ```
3. **Acceder al sistema:**
   - **Frontend:** `http://localhost`
   - **Backend API:** `http://localhost:8080/api`

### 🔑 Credenciales por Defecto
El sistema crea automáticamente un administrador inicial:
- **Usuario:** `admin`
- **Contraseña:** `admin`

## 📁 Estructura del Proyecto (Actualizado)

```
Escritorio/
├── egrex-backend/          # Repositorio del Backend
│   ├── src/
│   └── Dockerfile
└── egrex-frontend/         # Este Repositorio (Frontend)
    ├── src/
    ├── Dockerfile
    └── docker-compose.yml  # Orquestador global
```


## ✅ Objetivos Cumplidos
- [x] **Reportes:** Exportación avanzada a Excel y PDF.
- [x] **Seguridad:** Autenticación JWT y roles protegidos.
- [x] **Autonomía:** DB autogestionada por el backend.
- [x] **UX:** Diseño minimalista con iconos y tooltips.

---
Institución de Educación Superior FESC - 2026
