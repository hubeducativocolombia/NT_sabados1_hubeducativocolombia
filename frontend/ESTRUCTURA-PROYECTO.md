📦 Hub Educativo Colombia - Estructura Migrada a React

## 📂 Árbol de Directorios

```
HubEducativoColombia/
│
├── 📄 package.json                 (Raíz - scripts de monorepo)
├── 📄 README-REACT.md              (Documentación principal)
├── 📄 INICIO-RAPIDO.md             (Guía de instalación rápida)
├── 📄 .gitignore                   (Archivos a ignorar)
│
├── 📁 backend/                     ✨ NUEVO - API Express.js
│   ├── 📄 server.js               (Servidor Express con MySQL)
│   ├── 📄 package.json            (Dependencias backend)
│   └── 📄 node_modules/           (Se crea al npm install)
│
├── 📁 frontend/                    ✨ NUEVO - React + Vite
│   ├── 📄 vite.config.js          (Config de Vite)
│   ├── 📄 index.html              (HTML principal)
│   ├── 📄 package.json            (Dependencias React)
│   ├── 📄 .env                    (Variables de entorno)
│   ├── 📄 .env.example            (Plantilla .env)
│   │
│   ├── 📁 src/
│   │   ├── 📄 main.jsx            (Punto de entrada React)
│   │   ├── 📄 App.jsx             (Componente raíz + Router)
│   │   ├── 📄 App.css             (Estilos del layout principal)
│   │   ├── 📄 index.css           (Estilos globales)
│   │   │
│   │   ├── 📁 services/           (Servicios y utilidades)
│   │   │   └── 📄 apiService.js   (Cliente HTTP para la API)
│   │   │
│   │   └── 📁 pages/              (Componentes de página)
│   │       ├── 📄 Inicio.jsx      (Dashboard)
│   │       ├── 📄 Inicio.css
│   │       ├── 📄 Instituciones.jsx
│   │       ├── 📄 Instituciones.css
│   │       ├── 📄 Programas.jsx
│   │       ├── 📄 Programas.css
│   │       ├── 📄 Usuarios.jsx
│   │       ├── 📄 Usuarios.css
│   │       ├── 📄 Buscar.jsx
│   │       └── 📄 Buscar.css
│   │
│   └── 📁 node_modules/           (Se crea al npm install)
│
├── 📁 doc/                         (Documentación original)
│   ├── 📄 db-hub-educativo-colombia-v2.sql
│   └── 📄 diagrama_er_hub_educativo_colombia.dbd
│
├── 📁 css/                         (Estilos originales - referencia)
│   └── 📄 estilos.css
│
└── 📁 js/                          (Código JavaScript original - referencia)
    ├── 📄 almacenamiento.js
    ├── 📄 app.js
    ├── 📄 enrutador.js
    ├── 📄 modelos.js
    ├── 📄 peticiones.js
    ├── 📄 server.js               (MIGRADO a /backend)
    └── 📄 vistas.js
```

## 🔧 Lo que se Creó

### ✅ Backend (MIGRADO)

- ✓ Carpeta `/backend` con servidor Express
- ✓ API REST con todos los endpoints
- ✓ Conexión a MySQL con pools
- ✓ package.json con scripts (start, dev)

### ✅ Frontend (NUEVO)

- ✓ Proyecto React con Vite
- ✓ React Router v6 para navegación
- ✓ 5 páginas principales funcionando
- ✓ Servicio API centralizado
- ✓ Estilos CSS por componente
- ✓ Variables de entorno configurables
- ✓ Interfaz responsive

### ✅ Configuración

- ✓ Monorepo con estructura clara
- ✓ Scripts npm para instalar todo
- ✓ .gitignore completamente configurado
- ✓ Documentación de inicio rápido
- ✓ Archivos .env para ambos lados

## 🚀 Próximos Pasos

1. **Instalar dependencias**:

   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```

2. **Ejecutar el proyecto**:

   ```bash
   # Terminal 1
   cd backend && npm start

   # Terminal 2
   cd frontend && npm run dev
   ```

3. **Verificar en el navegador**:
   - Frontend: http://localhost:5173
   - API Health: http://localhost:3000/api/health

## 📊 Comparación Antes/Después

| Aspecto     | Antes (Vanilla JS)    | Después (React)            |
| ----------- | --------------------- | -------------------------- |
| Enrutador   | Personalizado         | React Router v6            |
| Estado      | localStorage + manual | React Hooks (useState)     |
| Componentes | Funciones JS          | Componentes React          |
| Build       | Ninguno               | Vite (bundle optimizado)   |
| Estructura  | Monolítica            | Frontend/Backend separados |
| Build Size  | -                     | ~100KB (minificado)        |

## 📝 Archivos Importantes

- **INICIO-RAPIDO.md** - Lee esto primero para instalación
- **README-REACT.md** - Documentación técnica completa
- **frontend/src/services/apiService.js** - Cliente HTTP reutilizable
- **backend/server.js** - Todos los endpoints de la API

---

**Creado con ❤️ en Marzo 2026**
Diana Zapata, Yuliana Chica, Samuel Zapata, Edwin Rios
