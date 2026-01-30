# 🎨 EgreX Frontend - Interfaz Premium de Gestión 🎓

El **Frontend de EgreX** es una aplicación moderna y elegante construida con **React**, diseñada para ofrecer una experiencia de usuario fluida y profesional. Utiliza animaciones avanzadas y un diseño basado en los colores institucionales para transmitir confianza y eficiencia.

---

## 🛠️ Stack Tecnológico

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Bootstrap](https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)
![React Icons](https://img.shields.io/badge/React_Icons-EB4D4B?style=for-the-badge&logo=react-icons&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)

---

## ✨ Características Principales

- **💎 Diseño Premium:** Interfaz minimalista con micro-animaciones dinámicas gracias a Framer Motion.
- **🌗 Soporte de Temas:** Implementación de modo claro y oscuro para comodidad del usuario.
- **📊 Visualización de Datos:** Tablas interactivas con filtrado, búsqueda y acciones masivas.
- **📥 Exportación Inteligente:** Descarga de reportes detallados en formatos Excel y PDF con un solo clic.
- **📱 Responsividad Total:** Adaptado para una visualización perfecta en dispositivos móviles, tablets y escritorio.

---

## 🏗️ Estructura del Aplicativo

```text
src/
├── components/     # Componentes reutilizables (Botones, Modales, Navs).
├── core/           # Casos de uso y lógica de dominio.
├── hooks/          # Hooks personalizados de React.
├── pages/          # Páginas principales (Login, Dashboard, Eventos, Perfil).
├── services/       # Comunicación con la API del Backend.
├── assets/         # Imágenes, logos y recursos estáticos.
└── App.js          # Configuración de rutas y proveedores.
```

---

## 🚦 Guía de Desarrollo Local

### Requisitos Previos
- Node.js (v18+)

### Instalación
1. **Clonar y entrar:**
   ```bash
   cd egrex-frontend
   ```
2. **Instalar dependencias:**
   ```bash
   npm install
   ```
3. **Configuración de la API:**
   El frontend busca por defecto la API en `http://localhost:8080/api`. Si necesitas cambiarlo, asegúrate de configurar las variables de entorno correspondientes.

4. **Arrancar:**
   ```bash
   npm start
   ```

---

## 🐳 Despliegue con Docker

Para levantar el ecosistema completo desde este repositorio:

1. Asegúrate de tener el repositorio del backend en el mismo nivel de carpeta.
2. Ejecuta desde la carpeta del frontend:
   ```bash
   docker compose up --build -d
   ```

> [!IMPORTANT]
> El sistema creará un usuario administrador por defecto:
> - **Usuario:** `admin`
> - **Contraseña:** `admin`

---

## 🤝 Créditos

Desarrollado para la **Institución de Educación Superior FESC (2026)**.

---
⚡ *EgreX Frontend - Experiencia visual de alta gama para egresados.*
