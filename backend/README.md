
# Payout Manager Backend

Backend API para el sistema de gestión de pagos compartidos.

## Tecnologías

- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **SQLite** - Base de datos
- **JWT** - Autenticación
- **bcryptjs** - Encriptación de contraseñas

## Instalación y Configuración

### 1. Instalar dependencias
```bash
cd backend
npm install
```

### 2. Configurar variables de entorno
El archivo `.env` ya está configurado con valores por defecto. 

**IMPORTANTE**: En producción (Render), necesitas cambiar:
- `JWT_SECRET` por una clave más segura
- `FRONTEND_URL` por la URL de tu app en Vercel

### 3. Inicializar base de datos
```bash
npm run init-db
```

### 4. Ejecutar en desarrollo
```bash
npm run dev
```

### 5. Ejecutar en producción
```bash
npm start
```

## Estructura de la API

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/verify` - Verificar token

### Perfiles
- `GET /api/profiles` - Obtener todos los perfiles
- `POST /api/profiles` - Crear nuevo perfil
- `PUT /api/profiles/:id` - Actualizar perfil
- `DELETE /api/profiles/:id` - Eliminar perfil
- `PATCH /api/profiles/:id/status` - Actualizar estado de pago

## Credenciales por defecto

- **Usuario**: admin
- **Contraseña**: admin123

## Deploy en Render

1. Conecta tu repositorio de GitHub
2. Configura las variables de entorno en Render
3. El comando de build será: `npm install`
4. El comando de start será: `npm start`

## Base de datos

SQLite se crea automáticamente. En producción en Render, la base de datos se mantendrá mientras el servicio esté activo.
