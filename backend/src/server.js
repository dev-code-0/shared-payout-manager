
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Importar rutas
import authRoutes from './routes/auth.js';
import profileRoutes from './routes/profiles.js';

// Importar inicialización de base de datos
import { initDatabase } from './database/init.js';

// Configurar variables de entorno
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8080',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/profiles', profileRoutes);

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'API funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Ruta para casos no encontrados
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error('Error no manejado:', err);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor'
  });
});

// Inicializar base de datos y arrancar servidor
const startServer = async () => {
  try {
    // Inicializar base de datos
    await initDatabase();
    
    // Arrancar servidor
    app.listen(PORT, () => {
      console.log('🚀 Servidor iniciado exitosamente');
      console.log(`📍 URL: http://localhost:${PORT}`);
      console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
      console.log('📋 Rutas disponibles:');
      console.log('   GET  /api/health           - Estado del servidor');
      console.log('   POST /api/auth/login       - Iniciar sesión');
      console.log('   GET  /api/auth/verify      - Verificar token');
      console.log('   GET  /api/profiles         - Obtener perfiles');
      console.log('   POST /api/profiles         - Crear perfil');
      console.log('   PUT  /api/profiles/:id     - Actualizar perfil');
      console.log('   DELETE /api/profiles/:id   - Eliminar perfil');
      console.log('   PATCH /api/profiles/:id/status - Actualizar estado');
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();
