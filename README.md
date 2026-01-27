# Sistema de Gestión de Egresados - Documentación del Proyecto

## 1. Descripción General
El **Sistema de Gestión de Egresados** es una aplicación web integral diseñada para facilitar la administración y el seguimiento de los egresados de la institución. Este sistema permite mantener una base de datos actualizada de la trayectoria profesional de los exalumnos, fomentando la conexión continua con su alma mater.

### Objetivos
- **Centralización:** Unificar la información de contacto y profesional de los egresados.
- **Autogestión:** Permitir a los egresados mantener sus propios datos actualizados.
- **Análisis:** Proveer a los administradores métricas clave sobre la comunidad de egresados.

### Usuarios
- **Egresados:** Pueden registrarse (mediante invitación o flujo definido), iniciar sesión y actualizar su perfil profesional (empleo actual, contacto, etc.).
- **Administradores:** Tienen acceso a un panel de control con indicadores de gestión y pueden supervisar la actividad de la plataforma.

## 2. Arquitectura del Sistema
El proyecto sigue una arquitectura moderna, desacoplada y basada en microservicios (o servicios contenerizados), diseñada para ser escalable y segura en la nube.

- **Frontend (Cliente):** Una SPA (Single Page Application) construida con React, que interactúa con el backend mediante API REST. Se encarga de la presentación y la experiencia de usuario.
- **Backend (Servidor):** Una API RESTful desarrollada en Node.js con Express, encargada de la lógica de negocio, autenticación y gestión de datos.
- **Base de Datos:** PostgreSQL como sistema de gestión de base de datos relacional, garantizando integridad y estructura robusta.
- **Infraestructura Cloud:** Despliegue en Google Cloud Platform (GCP) utilizando servicios serverless y gestionados.

## 3. Tecnologías Utilizadas

### Backend
- **Node.js (LTS):** Entorno de ejecución de JavaScript.
- **Express.js:** Framework web para la creación de la API.
- **PostgreSQL (`pg`):** Driver para la conexión a base de datos.
- **JWT (Json Web Token):** Estándar para la autenticación segura sin estado.
- **Bcrypt:** Librería para el hashing seguro de contraseñas.

### Frontend
- **React.js:** Librería para construir interfaces de usuario interactivas.
- **React Bootstrap:** Componentes de interfaz responsivos y profesionales.
- **Axios:** Cliente HTTP para realizar peticiones al backend.
- **React Router:** Gestión de navegación y rutas protegidas.

### Cloud & DevOps
- **Google Cloud Run:** Ejecución de contenedores serverless para el backend.
- **Google Cloud SQL:** Servicio gestionado para PostgreSQL.
- **Google Cloud Build:** Integración y entrega continua (CI/CD).
- **Docker:** Contenerización de la aplicación para garantizar consistencia entre entornos.

## 4. Diseño de la Base de Datos
El esquema relacional consta de dos tablas principales:

### Tabla `users`
Almacena las credenciales y el rol de acceso.
- `id` (UUID): Identificador único.
- `email`: Correo electrónico (único).
- `password_hash`: Contraseña encriptada.
- `role`: Rol del usuario ('egresado' o 'admin').

### Tabla `egresados_profiles`
Contiene la información detallada del perfil del egresado.
- `id` (UUID): Identificador del perfil.
- `user_id` (UUID): Clave foránea que referencia a `users`. Relación 1:1.
- `nombre`, `telefono`, `profesion`, `empresa`: Datos personales y profesionales.
- `fecha_actualizacion`: Timestamp para seguimiento de actividad.

## 5. Configuración del Backend (Ejecución Local)

### Requisitos Previos
- Node.js instaladado (v18+).
- Instancia de PostgreSQL corriendo localmente.

### Variables de Entorno (`.env`)
Crear un archivo `.env` en la carpeta `backend/`:
```
PORT=8080
DB_USER=postgres
DB_HOST=localhost
DB_NAME=alumni_db
DB_PASSWORD=tu_password
DB_PORT=5432
JWT_SECRET=tu_secreto_super_seguro
```

### Comandos
1. Navegar al directorio: `cd backend`
2. Instalar dependencias: `npm install`
3. Iniciar servidor: `npm start` (o `npm run dev` para desarrollo).

## 6. Configuración del Frontend (Ejecución Local)

### Instalación
1. Navegar al directorio: `cd frontend`
2. Instalar dependencias: `npm install`

### Ejecución
1. Iniciar aplicación: `npm start`
2. Acceder en el navegador a: `http://localhost:3000`

## 7. Despliegue en Google Cloud Platform

El sistema está optimizado para GCP:

1.  **Cloud Run:** Aloja el contenedor Docker del backend. Escala automáticamente a cero cuando no hay tráfico.
2.  **Cloud SQL:** Proporciona una instancia de PostgreSQL gestionada, con copias de seguridad automáticas y alta disponibilidad.
3.  **Secret Manager:** (Recomendado) Para almacenar credenciales de base de datos y secretos JWT, inyectándolos como variables de entorno en tiempo de ejecución.
4.  **Cloud Build:** Automatiza el proceso de construcción de la imagen Docker y despliegue a Cloud Run cada vez que se detectan cambios en el repositorio.

## 8. Consideraciones de Seguridad
- **Autenticación JWT:** Cada petición protegida requiere un token válido en la cabecera `Authorization`.
- **Encriptación:** Las contraseñas nunca se guardan en texto plano; se utiliza `bcrypt` con "salt" para su almacenamiento.
- **Protección de Rutas:** Middleware en backend y frontend (`PrivateRoute`) aseguran que solo usuarios autorizados accedan a recursos sensibles.
- **Validación:** Se valida la integridad de datos en los controladores antes de interactuar con la base de datos.

## 9. Estructura del Proyecto

```
/
├── backend/                # API REST
│   ├── src/
│   │   ├── config/         # Configuración (DB, Env)
│   │   ├── controllers/    # Lógica de negocio
│   │   ├── middlewares/    # Auth, manejo de errores
│   │   ├── models/         # Acceso a datos
│   │   ├── routes/         # Definición de endpoints
│   │   ├── app.js          # Configuración de Express
│   │   └── server.js       # Punto de entrada
│   ├── Dockerfile          # Definición de imagen contenedor
│   └── cloudbuild.yaml     # Pipeline CI/CD
│
├── frontend/               # Aplicación React
│   ├── src/
│   │   ├── components/     # Componentes UI reutilizables
│   │   ├── pages/          # Vistas principales (Login, Dashboard)
│   │   ├── services/       # Comunicación con API (Axios)
│   │   └── routes/         # Configuración de rutas
│   └── package.json
│
└── database/               # Scripts SQL
    ├── schema.sql          # Creación de tablas
    └── seed.sql            # Datos iniciales
```

## 10. Mejoras Futuras
- **Módulo de Ofertas Laborales:** Permitir a empresas publicar vacantes para egresados.
- **Registro Público:** Flujo de registro abierto con validación por correo electrónico.
- **Reportes Avanzados:** Exportación de métricas a PDF/Excel.
- **Notificaciones:** Alertas por correo sobre eventos o actualizaciones de perfil.
