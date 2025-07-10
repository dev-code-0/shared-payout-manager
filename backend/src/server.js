
/**
 * SERVIDOR PRINCIPAL
 * 
 * Este es el punto de entrada del backend.
 * Configura Express, middlewares, rutas y conecta con PostgreSQL.
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Importar rutas
import authRoutes from './routes/auth.js';
import profileRoutes from './routes/profiles.js';

// Importar inicialización de base de datos
import initDatabase from './database/init.js';

// Cargar variables de entorno
dotenv.config();

// Validar variables de entorno críticas
import validateEnvironment from './config/validateEnv.js';
validateEnvironment();

const app = express();
const PORT = process.env.PORT || 3001;

// =====================
// CONFIGURACIÓN DE SEGURIDAD
// =====================

// Helmet para headers de seguridad
app.use(helmet({
    crossOriginEmbedderPolicy: false
}));

// Rate limiting - 1000 requests por 15 minutos
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    message: {
        success: false,
        message: 'Demasiadas peticiones desde esta IP, intenta más tarde.'
    }
});
app.use(limiter);

// =====================
// CONFIGURACIÓN DE CORS
// =====================

const corsOptions = {
    origin: [
        'http://localhost:5173',
        'http://localhost:3000',
        'https://shared-payout-manager.vercel.app',
        'https://*.vercel.app'
    ],
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));

// =====================
// MIDDLEWARES
// =====================

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
app.use((req, res, next) => {
    next();
});

// =====================
// RUTAS DE SALUD
// =====================

app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Servidor funcionando correctamente',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'API funcionando correctamente',
        database: 'PostgreSQL conectado',
        timestamp: new Date().toISOString()
    });
});

// =====================
// RUTAS DE LA API
// =====================

app.use('/api/auth', authRoutes);
app.use('/api/profiles', profileRoutes);

// =====================
// MANEJO DE ERRORES
// =====================

// Middleware para rutas no encontradas
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`
    });
});

// Middleware global de manejo de errores
app.use((error, req, res, next) => {
    
    res.status(error.status || 500).json({
        success: false,
        message: process.env.NODE_ENV === 'production' 
            ? 'Error interno del servidor' 
            : error.message
    });
});

// =====================
// INICIALIZACIÓN DEL SERVIDOR
// =====================

const startServer = async () => {
    try {
        // Inicializar base de datos PostgreSQL
        await initDatabase();

        // Iniciar servidor
        app.listen(PORT, () => {

            
            if (process.env.NODE_ENV === 'production') {
                console.log('Frontend URL: https://shared-payout-manager.vercel.app');
            }
        });
    } catch (error) {
        process.exit(1);
    }
};

// Iniciar servidor
startServer();

// Manejo graceful de cierre del servidor
process.on('SIGTERM', () => {
    process.exit(0);
});

process.on('SIGINT', () => {
    process.exit(0);
});
