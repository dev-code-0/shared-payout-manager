
/**
 * RUTAS DE PERFILES
 * 
 * Endpoints:
 * GET /api/profiles - Obtener todos los perfiles
 * POST /api/profiles - Crear nuevo perfil
 * PUT /api/profiles/:id - Actualizar perfil
 * DELETE /api/profiles/:id - Eliminar perfil
 * PATCH /api/profiles/:id/payment-status - Cambiar estado de pago
 */

import express from 'express';
import {
    getProfiles,
    createProfile,
    updateProfile,
    deleteProfile,
    updatePaymentStatus
} from '../controllers/profileController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// Todas las rutas de perfiles requieren autenticación
router.use(authMiddleware);

// GET /api/profiles - Obtener todos los perfiles del usuario autenticado
router.get('/', getProfiles);

// POST /api/profiles - Crear nuevo perfil
router.post('/', createProfile);

// PUT /api/profiles/:id - Actualizar perfil completo
router.put('/:id', updateProfile);

// DELETE /api/profiles/:id - Eliminar perfil
router.delete('/:id', deleteProfile);

// PATCH /api/profiles/:id/payment-status - Solo cambiar estado de pago
router.patch('/:id/payment-status', updatePaymentStatus);

export default router;
