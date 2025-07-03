
// Configuración de la API
// INSTRUCCIÓN: Cambia esta URL por la URL de tu backend en producción (Render)
export const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://tu-app-backend.onrender.com' // Cambia esta URL cuando tengas el backend desplegado
  : 'http://localhost:3001'; // URL local del backend

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    VERIFY: '/api/auth/verify'
  },
  PROFILES: {
    GET_ALL: '/api/profiles',
    CREATE: '/api/profiles',
    UPDATE: '/api/profiles',
    DELETE: '/api/profiles'
  }
};
