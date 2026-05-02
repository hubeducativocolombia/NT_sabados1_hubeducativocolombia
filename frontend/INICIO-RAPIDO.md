# Guía de Inicio Rápido - Hub Educativo Colombia React

## Requisitos Previos

- Node.js 18+ instalado
- XAMPP con MySQL/MariaDB iniciado
- Puerto 3000 (backend) y 5173 (frontend) disponibles

## 📋 Pasos de Instalación

### 1. Preparar la Base de Datos

```bash
# En phpMyAdmin o en consola MySQL:
mysql -u root -p < doc/db-hub-educativo-colombia-v2.sql
```

La base creada debe llamarse `hub_educativo_colombia`.

### 2. Instalar Dependencias

```bash
cd backend
npm install
cd frontend
npm install
cd ..
npm install
```

El backend ya incluye un archivo `backend/.env` listo para XAMPP local:

```env
PORT=3000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=hub_educativo_colombia
```

## Ejecutar el Proyecto

La forma recomendada es desde la raíz del proyecto:

```bash
npm run dev
```

Eso inicia backend y frontend a la vez.

Si prefieres dos terminales:

### Terminal 1 - Backend

```bash
cd backend
npm start
```

✅ Verás: `Servidor API corriendo en http://localhost:3000`

### Terminal 2 - Frontend

```bash
cd frontend
npm run dev
```

✅ Se abrirá automáticamente: `http://localhost:5173`

## 🎯 Funcionalidades Principales

| Página           | Descripción                        | Endpoint API          |
| ---------------- | ---------------------------------- | --------------------- |
| 📊 Inicio        | Dashboard con estadísticas         | `/api/sincronizacion` |
| 🏢 Instituciones | Crear, ver, eliminar instituciones | `/api/instituciones`  |
| 📚 Programas     | Ver programas académicos           | `/api/programas`      |
| 👥 Usuarios      | Listar usuarios del sistema        | `/api/usuarios`       |
| 🔍 Buscar        | Búsqueda avanzada                  | En memoria local      |

## Troubleshooting

### Error: "Cannot connect to API"

- Verificar que el backend está corriendo en puerto 3000
- Revisar `frontend/.env` - debe tener `VITE_API_URL=http://localhost:3000/api`

### Error: "Database connection error"

- Verificar que MySQL/MariaDB esté iniciado en XAMPP
- Revisar `backend/.env`
- Verificar que exista la base `hub_educativo_colombia`

### Error: "Port already in use"

- Ejecutar desde raíz: `npm run dev` para liberar 3000 y 5173 automáticamente
- O cerrar el proceso que ya esté usando el puerto

## 📦 Build para Producción

```bash
# Frontend
cd frontend
npm run build

# Output en: frontend/dist/
```

## 🌐 URLs Principales

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000/api
- Health Check: http://localhost:3000/api/health

---

**¿Necesitas ayuda?** Revisa los logs de consola en ambas terminales para más detalles del error.
