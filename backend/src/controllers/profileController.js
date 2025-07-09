
/**
 * CONTROLADOR DE PERFILES
 * 
 * Maneja todas las operaciones CRUD para los perfiles de pagos:
 * - Crear perfil
 * - Obtener perfiles
 * - Actualizar perfil
 * - Eliminar perfil
 * - Cambiar estado de pago
 */

import { query } from '../config/database.js';

// OBTENER TODOS LOS PERFILES
export const getProfiles = async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await query(
            'SELECT * FROM profiles WHERE user_id = $1 ORDER BY created_at DESC',
            [userId]
        );

        (`📋 ${result.rows.length} perfiles obtenidos para usuario ${req.user.username}`);

        res.json({
            success: true,
            message: 'Perfiles obtenidos correctamente',
            data: result.rows
        });
    } catch (error) {
        console.error('❌ Error obteniendo perfiles:', error);
        res.status(500).json({
            success: false,
            message: 'Error obteniendo perfiles'
        });
    }
};

// CREAR NUEVO PERFIL
export const createProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { nombre, pin, propietario, correo, plataforma, monto, fecha_pago, estado_pago } = req.body;

        // Validar datos requeridos
        if (!nombre || !propietario || !correo || !plataforma || !monto || !fecha_pago) {
            return res.status(400).json({
                success: false,
                message: 'Los campos nombre, propietario, correo, plataforma, monto y fecha_pago son requeridos'
            });
        }

        // Validar rango de fecha de pago
        if (fecha_pago < 1 || fecha_pago > 31) {
            return res.status(400).json({
                success: false,
                message: 'La fecha de pago debe estar entre 1 y 31'
            });
        }

        // Validar estado de pago
        const estadoValido = ['pagado', 'pendiente'].includes(estado_pago || 'pendiente');
        if (!estadoValido) {
            return res.status(400).json({
                success: false,
                message: 'El estado de pago debe ser "pagado" o "pendiente"'
            });
        }

        const result = await query(
            `INSERT INTO profiles (nombre, pin, propietario, correo, plataforma, monto, fecha_pago, estado_pago, user_id)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
            [nombre, pin || '', propietario, correo, plataforma, monto, fecha_pago, estado_pago || 'pendiente', userId]
        );

        const newProfile = result.rows[0];


        res.status(201).json({
            success: true,
            message: 'Perfil creado exitosamente',
            data: newProfile
        });
    } catch (error) {
        console.error('❌ Error creando perfil:', error);
        res.status(500).json({
            success: false,
            message: 'Error creando perfil'
        });
    }
};

// ACTUALIZAR PERFIL
export const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const profileId = req.params.id;
        const { nombre, pin, propietario, correo, plataforma, monto, fecha_pago, estado_pago } = req.body;

        // Verificar que el perfil pertenece al usuario
        const profileCheck = await query(
            'SELECT * FROM profiles WHERE id = $1 AND user_id = $2',
            [profileId, userId]
        );

        if (profileCheck.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Perfil no encontrado'
            });
        }

        // Actualizar perfil
        const result = await query(
            `UPDATE profiles SET 
             nombre = $1, pin = $2, propietario = $3, correo = $4, plataforma = $5, 
             monto = $6, fecha_pago = $7, estado_pago = $8, updated_at = CURRENT_TIMESTAMP
             WHERE id = $9 AND user_id = $10 RETURNING *`,
            [nombre, pin || '', propietario, correo, plataforma, monto, fecha_pago, estado_pago, profileId, userId]
        );

        const updatedProfile = result.rows[0];


        res.json({
            success: true,
            message: 'Perfil actualizado exitosamente',
            data: updatedProfile
        });
    } catch (error) {
        console.error('❌ Error actualizando perfil:', error);
        res.status(500).json({
            success: false,
            message: 'Error actualizando perfil'
        });
    }
};

// ELIMINAR PERFIL
export const deleteProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const profileId = req.params.id;

        // Verificar que el perfil pertenece al usuario
        const profileCheck = await query(
            'SELECT * FROM profiles WHERE id = $1 AND user_id = $2',
            [profileId, userId]
        );

        if (profileCheck.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Perfil no encontrado'
            });
        }

        const profile = profileCheck.rows[0];

        // Eliminar perfil
        await query(
            'DELETE FROM profiles WHERE id = $1 AND user_id = $2',
            [profileId, userId]
        );


        res.json({
            success: true,
            message: 'Perfil eliminado exitosamente'
        });
    } catch (error) {
        console.error('❌ Error eliminando perfil:', error);
        res.status(500).json({
            success: false,
            message: 'Error eliminando perfil'
        });
    }
};

// CAMBIAR ESTADO DE PAGO
export const updatePaymentStatus = async (req, res) => {
    try {
        const userId = req.user.id;
        const profileId = req.params.id;
        const { estado_pago } = req.body;

        // Validar estado
        if (!['pagado', 'pendiente'].includes(estado_pago)) {
            return res.status(400).json({
                success: false,
                message: 'El estado debe ser "pagado" o "pendiente"'
            });
        }

        // Verificar que el perfil pertenece al usuario
        const profileCheck = await query(
            'SELECT * FROM profiles WHERE id = $1 AND user_id = $2',
            [profileId, userId]
        );

        if (profileCheck.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Perfil no encontrado'
            });
        }

        const profile = profileCheck.rows[0];

        // Actualizar estado
        await query(
            'UPDATE profiles SET estado_pago = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND user_id = $3',
            [estado_pago, profileId, userId]
        );


        res.json({
            success: true,
            message: `Estado actualizado a ${estado_pago}`,
            data: {
                id: profileId,
                estado_pago
            }
        });
    } catch (error) {
        console.error('❌ Error actualizando estado:', error);
        res.status(500).json({
            success: false,
            message: 'Error actualizando estado de pago'
        });
    }
};
