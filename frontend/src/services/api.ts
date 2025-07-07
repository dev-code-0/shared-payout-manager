
/**
 * SERVICIO DE API
 * 
 * Este archivo contiene todas las funciones para comunicarse con el backend.
 * Maneja autenticación, perfiles y errores de manera centralizada.
 */

import { API_BASE_URL, API_ENDPOINTS, getAuthHeaders, REQUEST_TIMEOUT } from '../config/api';
import { Profile } from '../types';

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
  
  console.log(`🌐 API Request: ${options.method || 'GET'} ${url}`);
  console.log('📋 Headers:', getAuthHeaders());
  
  if (options.body) {
    console.log('📦 Body:', options.body);
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

    console.log(`📡 Response Status: ${response.status} ${response.statusText}`);
    
    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      console.error('❌ Error parsing JSON response:', parseError);
      throw new Error('Invalid JSON response from server');
    }
    
    console.log('📋 Response Data:', data);
    
    if (!response.ok) {
      console.error('❌ API Error:', data);
      throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
    }
    
    console.log('✅ API Success:', data.message);
    return data;
  } catch (error) {
    console.error('❌ API Request failed:', error);
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout - verifica tu conexión a internet');
      }
      
      if (error.message.includes('Failed to fetch') || error.message.includes('fetch')) {
        throw new Error('No se pudo conectar con el servidor. Verifica que el backend esté funcionando.');
      }
      
      throw error;
    }
    
    throw new Error('Error de conexión con el servidor');
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
  console.log('🔍 Obteniendo perfiles desde PostgreSQL...');
  const response = await apiRequest<Profile[]>(API_ENDPOINTS.PROFILES);
  console.log('✅ Perfiles obtenidos desde base de datos:', response.data?.length || 0);
  return response.data || [];
};

/**
 * Crear nuevo perfil
 */
export const createProfile = async (profileData: Omit<Profile, 'id'>): Promise<Profile> => {
  console.log('➕ Creando perfil en PostgreSQL:', profileData.nombre);
  const response = await apiRequest<Profile>(API_ENDPOINTS.PROFILES, {
    method: 'POST',
    body: JSON.stringify(profileData),
  });
  
  console.log('✅ Perfil creado en base de datos:', response.data);
  return response.data!;
};

/**
 * Actualizar perfil existente
 */
export const updateProfile = async (id: string, profileData: Omit<Profile, 'id'>): Promise<Profile> => {
  console.log('✏️ Actualizando perfil en PostgreSQL:', id);
  const response = await apiRequest<Profile>(API_ENDPOINTS.PROFILE_BY_ID(id), {
    method: 'PUT',
    body: JSON.stringify(profileData),
  });
  
  console.log('✅ Perfil actualizado en base de datos:', response.data);
  return response.data!;
};

/**
 * Eliminar perfil
 */
export const deleteProfile = async (id: string): Promise<void> => {
  console.log('🗑️ Eliminando perfil de PostgreSQL:', id);
  await apiRequest(API_ENDPOINTS.PROFILE_BY_ID(id), {
    method: 'DELETE',
  });
  console.log('✅ Perfil eliminado de base de datos');
};

/**
 * Cambiar estado de pago de un perfil
 */
export const updatePaymentStatus = async (
  id: string, 
  status: 'pagado' | 'pendiente'
): Promise<void> => {
  console.log('💳 Actualizando estado de pago en PostgreSQL:', id, '->', status);
  await apiRequest(API_ENDPOINTS.UPDATE_PAYMENT_STATUS(id), {
    method: 'PATCH',
    body: JSON.stringify({ estado_pago: status }),
  });
  console.log('✅ Estado de pago actualizado en base de datos');
};

// =====================
// FUNCIÓN DE LOGOUT
// =====================

/**
 * Cerrar sesión (limpiar token local)
 */
export const logout = (): void => {
  localStorage.removeItem('authToken');
  console.log('🚪 Sesión cerrada - token eliminado');
};
