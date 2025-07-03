
# Payout Manager - Sistema de Gestión de Pagos Compartidos

Sistema completo para gestionar pagos compartidos de servicios de streaming (Netflix, Spotify, etc.) con frontend en React y backend en Node.js.

## 🏗️ Arquitectura

- **Frontend**: React + Vite + Tailwind CSS (Deploy en Vercel)
- **Backend**: Node.js + Express + SQLite (Deploy en Render)
- **Base de datos**: SQLite con persistencia

## 📁 Estructura del Proyecto

```
/
├── frontend/          # Aplicación React
│   ├── src/
│   │   ├── components/    # Componentes de UI
│   │   ├── services/      # Servicios API
│   │   ├── config/        # Configuración
│   │   └── types/         # Tipos TypeScript
│   └── package.json
├── backend/           # API Node.js
│   ├── src/
│   │   ├── controllers/   # Controladores
│   │   ├── routes/        # Rutas de la API
│   │   ├── middleware/    # Middleware de autenticación
│   │   ├── config/        # Configuración de DB
│   │   └── database/      # Inicialización de DB
│   └── package.json
└── README.md
```

## 🚀 Instalación y Configuración

### 1. Instalar Backend
```bash
cd backend
npm install
npm run init-db  # Crea la base de datos y usuario admin
npm run dev      # Arranca en http://localhost:3001
```

### 2. Instalar Frontend
```bash
cd frontend
npm install
npm run dev      # Arranca en http://localhost:8080
```

## 🔐 Credenciales por defecto

- **Usuario**: admin
- **Contraseña**: admin123

## 📱 Funcionalidades

- ✅ Login con JWT
- ✅ CRUD de perfiles de usuarios
- ✅ Gestión de estados de pago
- ✅ Alertas de pagos próximos
- ✅ Estadísticas y resúmenes
- ✅ Filtrado por plataforma
- ✅ Persistencia en base de datos

## 🌐 Deploy

### Frontend en Vercel
1. Conecta tu repo de GitHub a Vercel
2. Selecciona la carpeta `frontend`
3. Configura la variable de entorno para la API

### Backend en Render
1. Conecta tu repo de GitHub a Render
2. Selecciona la carpeta `backend`
3. Configura las variables de entorno necesarias

## ⚙️ Variables de Entorno

### Backend (.env)
```
PORT=3001
JWT_SECRET=tu_clave_secreta_aqui
FRONTEND_URL=http://localhost:8080
```

### Frontend
```
# En frontend/src/config/api.ts
# Cambiar la URL de producción por tu URL de Render
```

## 🛠️ Comandos Útiles

### Backend
- `npm run dev` - Desarrollo con nodemon
- `npm start` - Producción
- `npm run init-db` - Inicializar base de datos

### Frontend
- `npm run dev` - Desarrollo
- `npm run build` - Build para producción
- `npm run preview` - Preview del build

## 📊 API Endpoints

- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/verify` - Verificar token
- `GET /api/profiles` - Obtener perfiles
- `POST /api/profiles` - Crear perfil
- `PUT /api/profiles/:id` - Actualizar perfil
- `DELETE /api/profiles/:id` - Eliminar perfil
- `PATCH /api/profiles/:id/status` - Cambiar estado de pago
