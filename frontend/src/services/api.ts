
import axios from 'axios';
import { Profile, LoginCredentials, LoginResponse } from '../types';

// URL del backend (desde variables de entorno o fallback)
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.MODE === 'production' 
    ? 'https://shared-payout-manager.onrender.com' 
    : 'http://localhost:3000');

console.log('🌐 API Base URL configurada:', API_BASE_URL);

// Configurar axios con interceptores
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token de autenticación
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔑 Token agregado a la petición');
    }
    return config;
  },
  (error) => {
    console.error('❌ Error en interceptor de petición:', error);
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas
api.interceptors.response.use(
  (response) => {
    console.log('✅ Respuesta exitosa de API:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ Error en respuesta de API:', error.response?.status, error.config?.url);
    
    if (error.response?.status === 401) {
      console.log('🔐 Token expirado, limpiando localStorage');
      localStorage.removeItem('authToken');
    }
    
    return Promise.reject(error);
  }
);

// Funciones de autenticación
export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  try {
    console.log('🔐 Enviando credenciales de login...');
    
    const response = await api.post('/auth/login', credentials);
    
    console.log('✅ Login exitoso:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ Error en login:', error);
    
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else if (error.code === 'ECONNREFUSED') {
      throw new Error('No se puede conectar con el servidor. Verifica que el backend esté funcionando.');
    } else {
      throw new Error('Error al iniciar sesión. Inténtalo de nuevo.');
    }
  }
};

export const verifyToken = async (): Promise<boolean> => {
  try {
    console.log('🔍 Verificando token...');
    
    const response = await api.get('/auth/verify');
    
    console.log('✅ Token válido:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Token inválido:', error);
    return false;
  }
};

export const logout = (): void => {
  console.log('👋 Cerrando sesión...');
  localStorage.removeItem('authToken');
};

// Funciones de perfiles
export const getProfiles = async (): Promise<Profile[]> => {
  try {
    console.log('📋 Obteniendo perfiles desde backend...');
    
    const response = await api.get('/profiles');
    
    console.log('✅ Perfiles obtenidos:', response.data.length, 'perfiles');
    return response.data;
  } catch (error: any) {
    console.error('❌ Error obteniendo perfiles:', error);
    
    if (error.response?.status === 401 || error.response?.status === 403) {
      throw new Error('Token de autenticación inválido o expirado');
    } else if (error.code === 'ECONNREFUSED') {
      throw new Error('No se puede conectar con el servidor');
    } else {
      throw new Error(error.response?.data?.message || 'Error al obtener perfiles');
    }
  }
};

export const createProfile = async (profileData: Omit<Profile, 'id'>): Promise<Profile> => {
  try {
    console.log('➕ Creando perfil:', profileData.nombre);
    
    const response = await api.post('/profiles', profileData);
    
    console.log('✅ Perfil creado:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ Error creando perfil:', error);
    
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error('Error al crear el perfil');
    }
  }
};

export const updateProfile = async (id: string, profileData: Omit<Profile, 'id'>): Promise<Profile> => {
  try {
    console.log('✏️ Actualizando perfil:', id);
    
    const response = await api.put(`/profiles/${id}`, profileData);
    
    console.log('✅ Perfil actualizado:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ Error actualizando perfil:', error);
    
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error('Error al actualizar el perfil');
    }
  }
};

export const deleteProfile = async (id: string): Promise<void> => {
  try {
    console.log('🗑️ Eliminando perfil:', id);
    
    await api.delete(`/profiles/${id}`);
    
    console.log('✅ Perfil eliminado exitosamente');
  } catch (error: any) {
    console.error('❌ Error eliminando perfil:', error);
    
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error('Error al eliminar el perfil');
    }
  }
};

export const updatePaymentStatus = async (id: string, status: 'pagado' | 'pendiente'): Promise<Profile> => {
  try {
    console.log('💳 Actualizando estado de pago:', id, '->', status);
    
    const response = await api.patch(`/profiles/${id}/payment-status`, { estado_pago: status });
    
    console.log('✅ Estado de pago actualizado:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ Error actualizando estado:', error);
    
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error('Error al actualizar el estado de pago');
    }
  }
};
