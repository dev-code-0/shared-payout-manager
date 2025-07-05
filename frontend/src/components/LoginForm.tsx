
import React, { useState } from 'react';
import { toast } from 'sonner';
import { login } from '../services/api';

interface LoginFormProps {
  onLogin: (token: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('🔐 Intentando login...');
      
      // Llamar al backend para autenticación
      const response = await login(credentials);
      
      // Guardar token en localStorage
      localStorage.setItem('authToken', response.token);
      
      // Notificar al componente padre
      onLogin(response.token);
      
      toast.success('Inicio de sesión exitoso');
    } catch (error) {
      console.error('❌ Error en login:', error);
      
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Error al iniciar sesión');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Administrador de pagos</h1>
          <p>Gestión de Pagos Compartidos</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Usuario</label>
            <input
              id="username"
              type="text"
              value={credentials.username}
              onChange={(e) => setCredentials({...credentials, username: e.target.value})}
              placeholder="Ingresa tu usuario"
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              placeholder="Ingresa tu contraseña"
              required
              disabled={isLoading}
            />
          </div>
          
          <button type="submit" disabled={isLoading} className="login-button">
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>
        
        <div className="login-info">
          
          <small>🌐 Conectando con backend...</small>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
