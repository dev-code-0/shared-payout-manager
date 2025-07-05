
/**
 * CONFIGURACIÓN DE API
 * 
 * Este archivo contiene la configuración para conectar el frontend con el backend.
 * 
 * IMPORTANTE - CONFIGURACIÓN POR AMBIENTE:
 * 
 * DESARROLLO:
 * - Frontend: http://localhost:5173
 * - Backend: http://localhost:3001
 * 
 * PRODUCCIÓN:
 * - Frontend: https://tu-app.vercel.app (Vercel)
 * - Backend: https://tu-backend.onrender.com (Render)
 * 
 * INSTRUCCIONES:
 * 1. Para desarrollo local: usar localhost:3001
 * 2. Para producción: cambiar a tu URL de Render
 */

// URL base del backend API
export const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://tu-backend.onrender.com' // 🚨 CAMBIAR POR TU URL DE RENDER
  : 'http://localhost:3001';

// Endpoints de la API
export const API_ENDPOINTS = {
  // Autenticación
  LOGIN: '/api/auth/login',
  VERIFY_TOKEN: '/api/auth/verify',
  
  // Perfiles
  PROFILES: '/api/profiles',
  PROFILE_BY_ID: (id: string) => `/api/profiles/${id}`,
  UPDATE_PAYMENT_STATUS: (id: string) => `/api/profiles/${id}/payment-status`,
};

// Configuración de headers por defecto
export const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Configuración de timeout para requests
export const REQUEST_TIMEOUT = 10000; // 10 segundos

console.log('🔧 API configurada para:', API_BASE_URL);
