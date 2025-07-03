
import express from 'express';
import {
  getAllProfiles,
  createProfile,
  updateProfile,
  deleteProfile,
  updatePaymentStatus
} from '../controllers/profileController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Aplicar middleware de autenticación a todas las rutas
router.use(authenticateToken);

// GET /api/profiles - Obtener todos los perfiles
router.get('/', getAllProfiles);

// POST /api/profiles - Crear nuevo perfil
router.post('/', createProfile);

// PUT /api/profiles/:id - Actualizar perfil
router.put('/:id', updateProfile);

// DELETE /api/profiles/:id - Eliminar perfil
router.delete('/:id', deleteProfile);

// PATCH /api/profiles/:id/status - Actualizar estado de pago
router.patch('/:id/status', updatePaymentStatus);

export default router;
