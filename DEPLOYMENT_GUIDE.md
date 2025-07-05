
# 🚀 GUÍA COMPLETA DE DEPLOYMENT

## Administrador de pagos - Frontend + Backend

Esta guía te explica paso a paso cómo desplegar tu aplicación completa:
- **Frontend** en **Vercel** 
- **Backend** en **Render**

---

## 📋 REQUISITOS PREVIOS

✅ Tener una cuenta en GitHub  
✅ Tener una cuenta en Vercel  
✅ Tener una cuenta en Render  
✅ Código funcionando en local  

---

## 🖥️ DEPLOYMENT DEL BACKEND (Render)

### Paso 1: Preparar el código

1. **Asegúrate de que el backend funcione localmente:**
```bash
cd backend
npm install
npm run dev
```

2. **Commit y push a GitHub:**
```bash
git add .
git commit -m "Backend ready for deployment"
git push origin main
```

### Paso 2: Crear servicio en Render

1. Ve a [render.com](https://render.com)
2. Haz clic en "New +"
3. Selecciona "Web Service"
4. Conecta tu repositorio de GitHub
5. Selecciona tu repositorio

### Paso 3: Configurar el servicio

**Configuración básica:**
- **Name:** `payout-manager-backend`
- **Environment:** `Node`
- **Region:** `Oregon (US West)` o el más cercano
- **Branch:** `main`

**Build & Deploy:**
- **Root Directory:** `backend`
- **Build Command:** `npm install`
- **Start Command:** `npm start`

### Paso 4: Variables de entorno

En la sección "Environment Variables", agregar:

```env
JWT_SECRET=tu_clave_super_secreta_y_unica_aqui_123456789
FRONTEND_URL=https://tu-app.vercel.app
DEFAULT_USERNAME=admin
DEFAULT_PASSWORD=admin123
NODE_ENV=production
```

⚠️ **IMPORTANTE:** 
- Cambia `JWT_SECRET` por una clave única y segura
- `FRONTEND_URL` se actualizará después del deploy del frontend

### Paso 5: Deploy

1. Haz clic en "Create Web Service"
2. Render comenzará el build automáticamente
3. Espera a que aparezca "Live" (puede tomar 5-10 minutos)
4. **Anota tu URL del backend:** `https://tu-backend.onrender.com`

---

## 🌐 DEPLOYMENT DEL FRONTEND (Vercel)

### Paso 1: Actualizar configuración de API

1. **Editar `frontend/src/config/api.ts`:**
```typescript
export const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://tu-backend.onrender.com' // 🚨 CAMBIAR por tu URL de Render
  : 'http://localhost:3001';
```

2. **Commit los cambios:**
```bash
git add .
git commit -m "Update API URL for production"
git push origin main
```

### Paso 2: Crear proyecto en Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Haz clic en "New Project"
3. Conecta tu repositorio de GitHub
4. Selecciona tu repositorio

### Paso 3: Configurar el proyecto

**Project Settings:**
- **Framework Preset:** `Vite`
- **Root Directory:** `frontend`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

### Paso 4: Deploy

1. Haz clic en "Deploy"
2. Vercel construirá y desplegará automáticamente
3. Obtendrás una URL como: `https://tu-app.vercel.app`

### Paso 5: Actualizar CORS en el backend

1. **Ve a tu dashboard de Render**
2. **Actualiza la variable `FRONTEND_URL`:**
```env
FRONTEND_URL=https://tu-app.vercel.app
```
3. **Redeploy el backend** (se hace automáticamente)

---

## 🔗 CONFIGURACIÓN FINAL DE CONEXIONES

### URLs finales:
- **Frontend:** `https://tu-app.vercel.app`
- **Backend:** `https://tu-backend.onrender.com`

### Verificar conexión:

1. **Abrir tu app en Vercel**
2. **Intentar login con:** `admin` / `admin123`
3. **Verificar en DevTools (F12):**
   - Network tab debe mostrar requests a tu backend
   - Console no debe tener errores de CORS

---

## 🛠️ COMANDOS UTILIZADOS

### Backend:
```bash
# Instalación inicial
cd backend
npm install

# Desarrollo
npm run dev

# Producción (Render usa esto)
npm start

# Inicializar DB manualmente
npm run init-db
```

### Frontend:
```bash
# Instalación inicial
cd frontend
npm install

# Desarrollo
npm run dev

# Build para producción (Vercel usa esto)
npm run build

# Preview del build
npm run preview
```

---

## 📦 DEPENDENCIAS UTILIZADAS

### Backend (Node.js + Express):
- **express** - Framework web
- **sqlite3** - Base de datos
- **jsonwebtoken** - Autenticación JWT
- **bcryptjs** - Encriptación de contraseñas
- **cors** - Cross-Origin Resource Sharing
- **helmet** - Seguridad HTTP
- **express-rate-limit** - Limitación de requests
- **dotenv** - Variables de entorno
- **nodemon** - Auto-reload en desarrollo

### Frontend (React + TypeScript):
- **React 18** - Framework frontend
- **TypeScript** - Tipado estático
- **Vite** - Build tool
- **Tailwind CSS** - Estilos
- **React Router** - Navegación
- **Sonner** - Notificaciones toast
- **Date-fns** - Manipulación de fechas

---

## 🔧 CONFIGURACIONES MANUALES REQUERIDAS

### 1. En Render (Backend):
- [x] Configurar variables de entorno
- [x] Cambiar `JWT_SECRET` por valor seguro
- [x] Actualizar `FRONTEND_URL` después del deploy de Vercel

### 2. En Vercel (Frontend):
- [x] Configurar root directory como `frontend`
- [x] Actualizar URL del backend en `api.ts`

### 3. En el código:
- [x] Actualizar `API_BASE_URL` en `frontend/src/config/api.ts`
- [x] Verificar que CORS esté configurado correctamente

---

## 🚨 TROUBLESHOOTING

### Error de CORS:
```
Access to fetch at 'https://backend...' from origin 'https://frontend...' has been blocked
```
**Solución:** Verificar que `FRONTEND_URL` en Render coincida exactamente con la URL de Vercel.

### Error 500 en backend:
**Solución:** Revisar logs en Render dashboard para ver errores específicos.

### Error de conexión:
**Solución:** Verificar que las URLs en `api.ts` sean correctas y que el backend esté "Live" en Render.

### Base de datos no inicializada:
**Solución:** El backend inicializa automáticamente la DB al arrancar. Si hay problemas, revisar logs.

---

## 📞 CREDENCIALES POR DEFECTO

- **Usuario:** `admin`
- **Contraseña:** `admin123`

⚠️ **Para mayor seguridad en producción, cambiar estas credenciales desde la aplicación o modificar las variables de entorno.**

---

## ✅ CHECKLIST DE DEPLOYMENT

### Backend (Render):
- [ ] Código committeado y pusheado a GitHub
- [ ] Servicio creado en Render
- [ ] Variables de entorno configuradas
- [ ] Build exitoso y servicio "Live"
- [ ] URL del backend anotada

### Frontend (Vercel):
- [ ] API URL actualizada en el código
- [ ] Proyecto creado en Vercel
- [ ] Root directory configurado
- [ ] Deploy exitoso
- [ ] URL del frontend anotada

### Conexión:
- [ ] CORS actualizado con URL del frontend
- [ ] Login funciona correctamente
- [ ] Datos se persisten entre sesiones
- [ ] No hay errores en DevTools

---

¡Tu aplicación ya está desplegada y funcionando! 🎉

Los datos se guardan en la base de datos SQLite en Render, por lo que persisten entre sesiones y dispositivos.
