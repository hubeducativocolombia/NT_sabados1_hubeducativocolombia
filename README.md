# HubEducativoColombia

Proyecto Integrado

## Flujo de conexion implementado

`HTML -> JavaScript (fetch) -> API/Backend (Node + Express) -> MySQL`

- Frontend: `index.html` + `js/app.js` + `js/peticiones.js`
- Backend: `js/server.js`
- Base de datos: `hub_educativo_colombia` (script: `doc/db-hub-educativo-colombia-v2.sql`)

## Requisitos

- Node.js 18+
- MySQL 8+

## 1) Crear la base de datos

Ejecuta en MySQL el archivo:

- `doc/db-hub-educativo-colombia-v2.sql`

Esto crea el esquema y carga datos de prueba.

## 2) Instalar dependencias del backend

```bash
npm install
```

## 3) Iniciar API backend

```bash
npm start
```

Opcional: puedes configurar conexion MySQL por variables de entorno:

- `DB_HOST` (default `localhost`)
- `DB_PORT` (default `3306`)
- `DB_USER` (default `root`)
- `DB_PASSWORD` (default vacio)
- `DB_NAME` (default `hub_educativo_colombia`)

En Windows, si ves `ECONNREFUSED`, usa `DB_HOST=127.0.0.1` para evitar conflicto con `localhost`/IPv6.

La API queda en:

- `http://localhost:3000/api`

Endpoint de prueba:

- `GET http://localhost:3000/api/health`

Si responde error `ECONNREFUSED`, verifica que el servicio MySQL este encendido y que las credenciales coincidan.

## 4) Abrir frontend

Abre `index.html` con Live Server o servidor estatico.

Al cargar, el frontend intenta sincronizar datos con:

- `GET /api/sincronizacion`

Si la API no esta disponible, usa `localStorage` como respaldo.

## Endpoints principales

- `GET /api/sincronizacion`
- `POST /api/instituciones`
- `PUT /api/instituciones/:id`
- `DELETE /api/instituciones/:id`
- `POST /api/sedes`
- `POST /api/usuarios`
- `PUT /api/usuarios/:id`
- `DELETE /api/usuarios/:id`
- `POST /api/programas`
- `PUT /api/programas/:id`
- `DELETE /api/programas/:id`
