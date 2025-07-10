/**
 * MANEJO CENTRALIZADO DE ERRORES
 * 
 * Utilidad para manejar errores de manera consistente en toda la aplicación
 */

export interface AppError {
  message: string;
  code?: string;
  details?: any;
}

export class ApiError extends Error {
  public code: string;
  public details?: any;

  constructor(message: string, code: string = 'UNKNOWN_ERROR', details?: any) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.details = details;
  }
}

export const handleApiError = (error: any): AppError => {
  // Si ya es un ApiError, devolverlo
  if (error instanceof ApiError) {
    return {
      message: error.message,
      code: error.code,
      details: error.details
    };
  }

  // Si es un error de red
  if (error.message?.includes('Failed to fetch') || error.message?.includes('fetch')) {
    return {
      message: 'No se pudo conectar con el servidor. Verifica tu conexión a internet.',
      code: 'NETWORK_ERROR'
    };
  }

  // Si es un error de timeout
  if (error.name === 'AbortError' || error.message?.includes('timeout')) {
    return {
      message: 'La solicitud tardó demasiado. Verifica tu conexión a internet.',
      code: 'TIMEOUT_ERROR'
    };
  }

  // Si es un error de autenticación
  if (error.message?.includes('401') || error.message?.includes('unauthorized')) {
    return {
      message: 'Sesión expirada. Por favor, inicia sesión nuevamente.',
      code: 'AUTH_ERROR'
    };
  }

  // Error genérico
  return {
    message: error.message || 'Ocurrió un error inesperado',
    code: 'UNKNOWN_ERROR',
    details: error
  };
};

export const logError = (error: AppError, context?: string) => {
  if (process.env.NODE_ENV === 'development') {
    console.error(`[${context || 'App'}] Error:`, error);
  }
  // En producción, aquí podrías enviar el error a un servicio de logging
}; 