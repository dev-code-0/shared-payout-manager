import React, { useState } from 'react';
import { toast } from 'sonner';
import { login as loginService } from '../services/api';

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
      // Llamada real al backend para autenticación
      const response = await loginService(credentials);
      const token = response.token;
      localStorage.setItem('authToken', token);
      onLogin(token);
      toast.success('Inicio de sesión exitoso');
    } catch (error) {
      toast.error('Credenciales incorrectas o error al iniciar sesión');
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
            />
          </div>
          
          <button type="submit" disabled={isLoading} className="login-button">
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>
        
       
      </div>
    </div>
  );
};

export default LoginForm;
