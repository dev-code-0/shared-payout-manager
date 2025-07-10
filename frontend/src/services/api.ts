
/**
 * SERVICIO DE API
 * 
 * Este archivo contiene todas las funciones para comunicarse con el backend.
 * Maneja autenticación, perfiles y errores de manera centralizada.
 */

import { API_BASE_URL, API_ENDPOINTS, getAuthHeaders, REQUEST_TIMEOUT } from '../config/api';
import { Profile } from '../types';
import { handleApiError, ApiError, logError } from '../utils/errorHandler';

// Interfaz para respuestas de la API
interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

// Interfaz para datos de login
interface LoginData {
  username: string;
  password: string;
}

// Interfaz para respuesta de login
interface LoginResponse {
  token: string;
  user: {
    id: number;
    username: string;
  };
}

// Función helper para hacer requests HTTP
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  
  if (options.body) {
    console.log('conectado');
  }
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...options.headers,
      },
      // Timeout para evitar requests colgados
      signal: AbortSignal.timeout(REQUEST_TIMEOUT),
    });

    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      throw new Error('Invalid JSON response from server');
    }
    
    
    if (!response.ok) {
      throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
    }
    
    return data;
  } catch (error) {
    const appError = handleApiError(error);
    logError(appError, 'API Request');
    throw new ApiError(appError.message, appError.code, appError.details);
  }
};

// =====================
// FUNCIONES DE AUTENTICACIÓN
// =====================

/**
 * Iniciar sesión
 */
export const login = async (credentials: LoginData): Promise<LoginResponse> => {
  const response = await apiRequest<LoginResponse>(API_ENDPOINTS.LOGIN, {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
  
  return response.data!;
};

/**
 * Verificar si el token es válido
 */
export const verifyToken = async (): Promise<boolean> => {
  try {
    await apiRequest(API_ENDPOINTS.VERIFY_TOKEN);
    return true;
  } catch {
    return false;
  }
};

// =====================
// FUNCIONES DE PERFILES
// =====================

/**
 * Obtener todos los perfiles del usuario
 */
export const getProfiles = async (): Promise<Profile[]> => {
  const response = await apiRequest<Profile[]>(API_ENDPOINTS.PROFILES);
  return response.data || [];
};

/**
 * Crear nuevo perfil
 */
export const createProfile = async (profileData: Omit<Profile, 'id'>): Promise<Profile> => {
  const response = await apiRequest<Profile>(API_ENDPOINTS.PROFILES, {
    method: 'POST',
    body: JSON.stringify(profileData),
  });
  
  return response.data!;
};

/**
 * Actualizar perfil existente
 */
export const updateProfile = async (id: string, profileData: Omit<Profile, 'id'>): Promise<Profile> => {
  console.log('Actualizando perfil:', id);
  const response = await apiRequest<Profile>(API_ENDPOINTS.PROFILE_BY_ID(id), {
    method: 'PUT',
    body: JSON.stringify(profileData),
  });
  
  console.log('Perfil actualizado en base de datos:', response.data);
  return response.data!;
};

/**
 * Eliminar perfil
 */
export const deleteProfile = async (id: string): Promise<void> => {
  console.log('Eliminando perfil:', id);
  await apiRequest(API_ENDPOINTS.PROFILE_BY_ID(id), {
    method: 'DELETE',
  });
  console.log('Perfil eliminado de base de datos');
};

/**
 * Cambiar estado de pago de un perfil
 */
export const updatePaymentStatus = async (
  id: string, 
  status: 'pagado' | 'pendiente'
): Promise<void> => {
  await apiRequest(API_ENDPOINTS.UPDATE_PAYMENT_STATUS(id), {
    method: 'PATCH',
    body: JSON.stringify({ estado_pago: status }),
  });
};

// =====================
// FUNCIÓN DE LOGOUT
// =====================

/**
 * Cerrar sesión (limpiar token local)
 */
export const logout = (): void => {
  localStorage.removeItem('authToken');
};
