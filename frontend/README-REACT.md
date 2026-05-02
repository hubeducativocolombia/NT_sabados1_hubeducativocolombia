# Hub Educativo Colombia - React

Proyecto migrado de JavaScript Vanilla a React con Vite.

## 📁 Estructura del Proyecto

```
HubEducativoColombia/
├── frontend/              # Aplicación React con Vite
│   ├── src/
│   │   ├── pages/        # Páginas principales (Inicio, Instituciones, etc.)
│   │   ├── services/     # Servicios de API
│   │   ├── App.jsx       # Componente principal
│   │   └── main.jsx      # Punto de entrada
│   ├── package.json
│   └── vite.config.js
├── backend/              # API Express.js
│   ├── server.js
│   └── package.json
├── doc/                  # Documentación y SQL
├── css/                  # Estilos originales
└── js/                   # Código JavaScript original
```

## 🚀 Instalación y Ejecución

### 1. Backend (Express.js)

```bash
cd backend
npm install
npm start
# El servidor corre en http://localhost:3000
```

### 2. Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
# La aplicación abre en http://localhost:5173
```

### 3. Base de Datos

Ejecutar el script SQL:

```bash
# Importar doc/db-hub-educativo-colombia-v2.sql en tu MySQL
```

## 📚 Páginas Disponibles

- **Inicio**: Dashboard con estadísticas
- **Instituciones**: Listado y gestión de instituciones educativas
- **Programas**: Catálogo de programas académicos
- **Usuarios**: Administración de usuarios
- **Buscar**: Búsqueda avanzada

## 🔌 Configuración de la API

Editar `frontend/.env` si el backend corre en otro puerto:

```
VITE_API_URL=http://localhost:3000/api
```

## 📦 Dependencias Principales

### Frontend

- React 18.2
- React Router DOM 6.20
- Vite 5.0

### Backend

- Express 4.21
- MySQL2 3.14
- CORS 2.8

## 📝 Notas

- La aplicación es una SPA (Single Page Application)
- Usa React Router para navegación
- Los estilos están organizados por componente
- El backend proporciona API REST para todas las operaciones

## 👥 Autores

Diana Zapata Ortega, Yuliana Chica Correa, Samuel Zapata Valcarcel, Edwin Rios Sanchez

Marzo 2026
