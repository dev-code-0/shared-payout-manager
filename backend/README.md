
# 🚀 PAYOUT MANAGER - BACKEND

API REST para la gestión de pagos compartidos de suscripciones digitales.

## 📋 TABLA DE CONTENIDOS

- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Instalación Local](#-instalación-local)
- [Configuración](#-configuración)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [API Endpoints](#-api-endpoints)
- [Deployment en Render](#-deployment-en-render)
- [Conexión con Frontend](#-conexión-con-frontend)

## 🛠️ TECNOLOGÍAS UTILIZADAS

### Dependencias Principales:
- **Express.js 4.18.2** - Framework web para Node.js
- **SQLite3 5.1.6** - Base de datos ligera y eficiente
- **JWT (jsonwebtoken 9.0.2)** - Autenticación con tokens
- **bcryptjs 2.4.3** - Encriptación de contraseñas
- **CORS 2.8.5** - Manejo de Cross-Origin Resource Sharing
- **Helmet 7.1.0** - Middlewares de seguridad
- **Express Rate Limit 7.1.5** - Limitación de peticiones
- **dotenv 16.3.1** - Variables de entorno

### Dependencias de Desarrollo:
- **Nodemon 3.0.2** - Auto-reload en desarrollo

## 🚀 INSTALACIÓN LOCAL

### 1. Navegar al directorio backend:
```bash
cd backend
```

### 2. Instalar dependencias:
```bash
npm install
```

### 3. Configurar variables de entorno:
```bash
# Copiar el archivo .env de ejemplo
cp .env.example .env

# Editar .env con tus configuraciones
```

### 4. Inicializar base de datos:
```bash
npm run init-db
```

### 5. Iniciar servidor de desarrollo:
```bash
npm run dev
```

### 6. Para producción:
```bash
npm start
```

## ⚙️ CONFIGURACIÓN

### Variables de Entorno (.env):

```env
# Puerto del servidor
PORT=3001

# Clave secreta JWT (CAMBIAR EN PRODUCCIÓN)
JWT_SECRET=tu_super_secreto_jwt_key_aqui

# Ruta de base de datos
DATABASE_PATH=./data/database.sqlite

# URL del frontend (para CORS)
FRONTEND_URL=http://localhost:5173

# Credenciales por defecto
DEFAULT_USERNAME=admin
DEFAULT_PASSWORD=admin123
```

### IMPORTANTE - Configuración para Render:
- Cambiar `FRONTEND_URL` a tu dominio de Vercel
- Usar una clave `JWT_SECRET` segura y única
- Render detecta automáticamente `NODE_ENV=production`

## 📁 ESTRUCTURA DEL PROYECTO

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # Configuración SQLite
│   ├── controllers/
│   │   ├── authController.js    # Lógica de autenticación
│   │   └── profileController.js # Lógica de perfiles
│   ├── database/
│   │   └── init.js             # Inicialización de tablas
│   ├── middleware/
│   │   └── auth.js             # Middleware de autenticación
│   ├── routes/
│   │   ├── auth.js             # Rutas de autenticación
│   │   └── profiles.js         # Rutas de perfiles
│   └── server.js               # Servidor principal
├── data/                       # Base de datos SQLite
├── .env                        # Variables de entorno
├── package.json
└── README.md
```

## 🌐 API ENDPOINTS

### Autenticación:

#### POST /api/auth/login
Iniciar sesión con usuario y contraseña.

**Request:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "token": "jwt_token_aqui",
    "user": {
      "id": 1,
      "username": "admin"
    }
  }
}
```

#### GET /api/auth/verify
Verificar validez del token JWT.

**Headers:**
```
Authorization: Bearer <token>
```

### Perfiles:

#### GET /api/profiles
Obtener todos los perfiles del usuario autenticado.

#### POST /api/profiles
Crear nuevo perfil.

**Request:**
```json
{
  "nombre": "Juan Pérez",
  "pin": "1234",
  "propietario": "Netflix Premium",
  "correo": "juan@email.com",
  "plataforma": "Netflix",
  "monto": 15000,
  "fecha_pago": 5,
  "estado_pago": "pendiente"
}
```

#### PUT /api/profiles/:id
Actualizar perfil completo.

#### DELETE /api/profiles/:id
Eliminar perfil.

#### PATCH /api/profiles/:id/payment-status
Cambiar solo el estado de pago.

**Request:**
```json
{
  "estado_pago": "pagado"
}
```

## 🌐 DEPLOYMENT EN RENDER

### Paso 1: Preparar el código
1. Asegúrate de que todo funciona localmente
2. Commit y push a GitHub

### Paso 2: Crear servicio en Render
1. Ve a [render.com](https://render.com)
2. Conecta tu repositorio de GitHub
3. Selecciona "Web Service"
4. Configurar:
   - **Build Command:** `cd backend && npm install`
   - **Start Command:** `cd backend && npm start`
   - **Environment:** Node

### Paso 3: Variables de entorno en Render
```env
JWT_SECRET=tu_clave_super_secreta_para_produccion
FRONTEND_URL=https://tu-frontend.vercel.app
DEFAULT_USERNAME=admin
DEFAULT_PASSWORD=admin123
```

### Paso 4: Deploy
1. Click "Create Web Service"
2. Render construirá y desplegará automáticamente
3. Obtendrás una URL como: `https://tu-backend.onrender.com`

## 🔗 CONEXIÓN CON FRONTEND

### En Desarrollo:
El frontend en `http://localhost:5173` se conecta al backend en `http://localhost:3001`

### En Producción:
1. **Frontend en Vercel:** `https://tu-app.vercel.app`
2. **Backend en Render:** `https://tu-backend.onrender.com`
3. **Actualizar variables:**
   - Backend: `FRONTEND_URL=https://tu-app.vercel.app`
   - Frontend: API URL debe apuntar a `https://tu-backend.onrender.com`

## 🔧 COMANDOS DISPONIBLES

```bash
# Desarrollo con auto-reload
npm run dev

# Producción
npm start

# Inicializar solo la base de datos
npm run init-db

# Instalar dependencias
npm install
```

## 🗄️ BASE DE DATOS

### Tablas:

#### users
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### profiles
```sql
CREATE TABLE profiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    pin TEXT,
    propietario TEXT NOT NULL,
    correo TEXT NOT NULL,
    plataforma TEXT NOT NULL,
    monto REAL NOT NULL,
    fecha_pago INTEGER NOT NULL,
    estado_pago TEXT CHECK(estado_pago IN ('pagado', 'pendiente')),
    user_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
);
```

## 🔒 SEGURIDAD

- Contraseñas encriptadas con bcrypt
- Autenticación JWT con expiración
- Rate limiting (100 requests/15min)
- CORS configurado
- Helmet para headers de seguridad
- Validación de datos de entrada

## 📞 SOPORTE

Si tienes problemas:
1. Revisa los logs del servidor
2. Verifica las variables de entorno
3. Asegúrate de que el frontend apunte a la URL correcta del backend
4. Verifica que CORS esté configurado correctamente
