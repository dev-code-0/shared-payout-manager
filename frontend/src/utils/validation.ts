/**
 * VALIDACIÓN DE FORMULARIOS
 * 
 * Utilidades para validar datos de entrada en el frontend
 */

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateProfile = (data: {
  nombre: string;
  propietario: string;
  correo: string;
  plataforma: string;
  monto: number;
  fecha_pago: number;
}): ValidationResult => {
  const errors: string[] = [];

  // Validar nombre
  if (!data.nombre.trim()) {
    errors.push('El nombre es requerido');
  } else if (data.nombre.length < 2) {
    errors.push('El nombre debe tener al menos 2 caracteres');
  }

  // Validar propietario
  if (!data.propietario.trim()) {
    errors.push('El propietario es requerido');
  }

  // Validar correo
  if (!data.correo.trim()) {
    errors.push('El correo es requerido');
  } else if (!validateEmail(data.correo)) {
    errors.push('El correo no tiene un formato válido');
  }

  // Validar plataforma
  if (!data.plataforma.trim()) {
    errors.push('La plataforma es requerida');
  }

  // Validar monto
  if (!data.monto || data.monto <= 0) {
    errors.push('El monto debe ser mayor a 0');
  }

  // Validar fecha de pago
  if (!data.fecha_pago || data.fecha_pago < 1 || data.fecha_pago > 31) {
    errors.push('La fecha de pago debe estar entre 1 y 31');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateLogin = (data: {
  username: string;
  password: string;
}): ValidationResult => {
  const errors: string[] = [];

  if (!data.username.trim()) {
    errors.push('El usuario es requerido');
  }

  if (!data.password.trim()) {
    errors.push('La contraseña es requerida');
  } else if (data.password.length < 3) {
    errors.push('La contraseña debe tener al menos 3 caracteres');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}; 