
/**
 * SERVIDOR PRINCIPAL - Administrador de pagos BACKEND
 * 
 * Este es el archivo principal del servidor Express.
 * Configura middlewares, rutas y inicia el servidor.
 * 
 * IMPORTANTE PARA RENDER:
 * - Render usa la variable de entorno PORT automáticamente
 * - El servidor se inicia en 0.0.0.0 para ser accesible públicamente
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Importar rutas
import authRoutes from './routes/auth.js';
import profileRoutes from './routes/profiles.js';

// Importar inicialización de base de datos
import initDatabase from './database/init.js';

// Configurar variables de entorno
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Crear instancia de Express
const app = express();

// Puerto del servidor (Render usa process.env.PORT automáticamente)
const PORT = process.env.PORT || 3001;

// CONFIGURACIÓN DE MIDDLEWARES

// 1. Helmet para seguridad básica
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// 2. CORS - Permitir requests desde el frontend
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// 3. Rate limiting - Prevenir abuso de API
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // máximo 100 requests por IP cada 15 min
    message: {
        success: false,
        message: 'Demasiadas peticiones, intenta de nuevo en 15 minutos'
    }
});
app.use('/api/', limiter);

// 4. Parsear JSON y URL encoded
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 5. Logging de requests (solo en desarrollo)
if (process.env.NODE_ENV !== 'production') {
    app.use((req, res, next) => {
        console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
        next();
    });
}

// RUTAS DE LA API

// Ruta de health check
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Administrador de pagos API funcionando correctamente',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});

// Rutas de autenticación
app.use('/api/auth', authRoutes);

// Rutas de perfiles
app.use('/api/profiles', profileRoutes);

// Ruta para manejar 404
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint no encontrado'
    });
});

// Manejador global de errores
app.use((err, req, res, next) => {
    console.error('❌ Error no manejado:', err);
    
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        ...(process.env.NODE_ENV !== 'production' && { error: err.message })
    });
});

// INICIALIZAR SERVIDOR
const startServer = async () => {
    try {
        // Inicializar base de datos
        await initDatabase();
        
        // Iniciar servidor
        app.listen(PORT, '0.0.0.0', () => {
            console.log('🚀 =====================================');
            console.log('🚀 Administrador de pagos BACKEND INICIADO');
            console.log('🚀 =====================================');
            console.log(`🌐 Servidor corriendo en puerto: ${PORT}`);
            console.log(`🌍 URL local: http://localhost:${PORT}`);
            console.log(`🔒 CORS habilitado para: ${corsOptions.origin}`);
            console.log(`📱 Frontend esperado en: ${process.env.FRONTEND_URL}`);
            console.log('🚀 =====================================');
            
            if (process.env.NODE_ENV !== 'production') {
                console.log('🔧 Endpoints disponibles:');
                console.log('   GET  / - Health check');
                console.log('   POST /api/auth/login - Login');
                console.log('   GET  /api/auth/verify - Verificar token');
                console.log('   GET  /api/profiles - Obtener perfiles');
                console.log('   POST /api/profiles - Crear perfil');
                console.log('   PUT  /api/profiles/:id - Actualizar perfil');
                console.log('   DELETE /api/profiles/:id - Eliminar perfil');
                console.log('   PATCH /api/profiles/:id/payment-status - Cambiar estado');
                console.log('🚀 =====================================');
            }
        });
    } catch (error) {
        console.error('❌ Error iniciando servidor:', error);
        process.exit(1);
    }
};

// Manejar cierre graceful del servidor
process.on('SIGTERM', () => {
    console.log('🛑 Cerrando servidor...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('🛑 Cerrando servidor...');
    process.exit(0);
});

// Iniciar servidor
startServer();
