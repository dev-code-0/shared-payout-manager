# 🎬 Administrador de Pagos Compartidos

Una aplicación web moderna para gestionar pagos compartidos de servicios de streaming y suscripciones.

## ✨ Características

- 🔐 **Autenticación segura** con JWT
- 📊 **Dashboard intuitivo** con estadísticas en tiempo real
- 💳 **Gestión de perfiles** de pagos compartidos
- 🔔 **Alertas automáticas** para pagos próximos
- 📱 **Diseño responsive** para móviles y desktop
- 🎨 **UI moderna** con Tailwind CSS y shadcn/ui
- 🗄️ **Base de datos PostgreSQL** robusta
- ⚡ **API REST** con Express.js
- 🔄 **React Query** para sincronización de datos

## 🏗️ Arquitectura

```
shared-payout-manager/
├── backend/                 # API REST con Express.js
│   ├── src/
│   │   ├── config/         # Configuración de BD y validación
│   │   ├── controllers/    # Lógica de negocio
│   │   ├── middleware/     # Autenticación y validación
│   │   ├── routes/         # Definición de endpoints
│   │   └── database/       # Inicialización de BD
│   └── package.json
└── frontend/               # Aplicación React con TypeScript
    ├── src/
    │   ├── components/     # Componentes reutilizables
    │   ├── services/       # Llamadas a la API
    │   ├── utils/          # Utilidades y validación
    │   └── types/          # Definiciones TypeScript
    └── package.json
```

## 🚀 Instalación

### Prerrequisitos

- Node.js 18+ 
- PostgreSQL 12+
- npm o yarn

### 1. Clonar el repositorio

```bash
git clone <tu-repositorio>
cd shared-payout-manager
```

### 2. Configurar Backend

```bash
cd backend
npm install

# Copiar archivo de variables de entorno
cp env.example .env

# Editar .env con tus configuraciones
nano .env
```

**Variables de entorno requeridas:**
```env
# Base de Datos PostgreSQL
DATABASE_URL=postgresql://username:password@localhost:5432/payout_manager

# JWT Secret (¡CAMBIAR EN PRODUCCIÓN!)
JWT_SECRET=tu_jwt_secret_super_seguro_aqui

# Usuario por defecto
DEFAULT_USERNAME=
DEFAULT_PASSWORD=
```

### 3. Configurar Frontend

```bash
cd ../frontend
npm install

# Crear archivo .env para variables del frontend
echo "VITE_API_URL=http://localhost:3001" > .env
```

### 4. Iniciar la aplicación

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

La aplicación estará disponible en:
- Frontend: http://localhost:5173
- Backend: http://localhost:3001

## 📋 Uso

1. **Iniciar sesión** con las credenciales por defecto:
   - Usuario:
   - Contraseña:

2. **Agregar perfiles** de pagos compartidos con:
   - Nombre de la persona
   - Propietario del perfil
   - Correo electrónico
   - Plataforma (Netflix, Spotify, etc.)
   - Monto mensual
   - Día de pago

3. **Gestionar pagos** marcando como pagado/pendiente

4. **Ver estadísticas** en tiempo real

## 🔧 Desarrollo

### Scripts disponibles

**Backend:**
```bash
npm run dev          # Desarrollo con nodemon
npm start           # Producción
npm run init-db     # Inicializar base de datos
```

**Frontend:**
```bash
npm run dev         # Desarrollo
npm run build       # Construir para producción
npm run lint        # Linting
```

### Estructura de la Base de Datos

```sql
-- Tabla de usuarios
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de perfiles
CREATE TABLE profiles (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    pin VARCHAR(50),
    propietario VARCHAR(255) NOT NULL,
    correo VARCHAR(255) NOT NULL,
    plataforma VARCHAR(255) NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    fecha_pago INTEGER NOT NULL,
    estado_pago VARCHAR(20) DEFAULT 'pendiente',
    user_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🛡️ Seguridad

- ✅ JWT tokens para autenticación
- ✅ Contraseñas hasheadas con bcrypt
- ✅ Validación de datos en frontend y backend
- ✅ Rate limiting para prevenir abuso
- ✅ Headers de seguridad con Helmet
- ✅ CORS configurado correctamente

## 🚀 Despliegue

### Backend (Render)

1. Conectar repositorio a Render
2. Configurar variables de entorno
3. Render detectará automáticamente el `package.json`

### Frontend (Vercel)

1. Conectar repositorio a Vercel
2. Configurar variable `VITE_API_URL` con la URL del backend
3. Vercel detectará automáticamente el framework

## 🤝 Contribuir

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🆘 Soporte

Si encuentras algún problema:

1. Revisa los logs del backend y frontend
2. Verifica que PostgreSQL esté funcionando
3. Confirma que las variables de entorno estén configuradas
4. Abre un issue en el repositorio

---

Desarrollado con ❤️ para simplificar la gestión de pagos compartidos 