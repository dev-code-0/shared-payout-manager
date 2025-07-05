
/**
 * RUTAS DE AUTENTICACIÓN
 * 
 * Endpoints:
 * POST /api/auth/login - Iniciar sesión
 * GET /api/auth/verify - Verificar token
 */

import express from 'express';
import { login, verifyToken } from '../controllers/authController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// POST /api/auth/login - Iniciar sesión
router.post('/login', login);

// GET /api/auth/verify - Verificar token (requiere autenticación)
router.get('/verify', authMiddleware, verifyToken);

export default router;
