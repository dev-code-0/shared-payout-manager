
import { useState, useEffect } from 'react';
import LoginForm from '../components/LoginForm';
import Dashboard from '../components/Dashboard';
import { verifyToken } from '../services/api';

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const isValid = await verifyToken();
        setIsAuthenticated(isValid);
      } catch {
        localStorage.removeItem('authToken');
        setIsAuthenticated(false);
      }
    }
    setIsLoading(false);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Cargando...</div>
      </div>
    );
  }

  return isAuthenticated ? (
    <Dashboard onLogout={handleLogout} />
  ) : (
    <LoginForm onLogin={handleLogin} />
  );
};

export default Index;
