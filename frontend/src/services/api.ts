
import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';
import { Profile } from '../types';

// Configurar axios con interceptores
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token a todas las requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (username: string, password: string) => {
    const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, { username, password });
    return response.data;
  },
  
  verifyToken: async () => {
    const response = await api.get(API_ENDPOINTS.AUTH.VERIFY);
    return response.data;
  }
};

export const profileService = {
  getAll: async (): Promise<Profile[]> => {
    const response = await api.get(API_ENDPOINTS.PROFILES.GET_ALL);
    return response.data;
  },
  
  create: async (profile: Omit<Profile, 'id'>): Promise<Profile> => {
    const response = await api.post(API_ENDPOINTS.PROFILES.CREATE, profile);
    return response.data;
  },
  
  update: async (id: string, profile: Omit<Profile, 'id'>): Promise<Profile> => {
    const response = await api.put(`${API_ENDPOINTS.PROFILES.UPDATE}/${id}`, profile);
    return response.data;
  },
  
  delete: async (id: string): Promise<void> => {
    await api.delete(`${API_ENDPOINTS.PROFILES.DELETE}/${id}`);
  },
  
  updatePaymentStatus: async (id: string, status: 'pagado' | 'pendiente'): Promise<Profile> => {
    const response = await api.patch(`${API_ENDPOINTS.PROFILES.UPDATE}/${id}/status`, { estado_pago: status });
    return response.data;
  }
};
