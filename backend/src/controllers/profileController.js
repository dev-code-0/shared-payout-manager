
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

import db from '../config/database.js';

// OBTENER TODOS LOS PERFILES
export const getProfiles = (req, res) => {
    const userId = req.user.id;

    db.all(
        'SELECT * FROM profiles WHERE user_id = ? ORDER BY created_at DESC',
        [userId],
        (err, profiles) => {
            if (err) {
                console.error('❌ Error obteniendo perfiles:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Error obteniendo perfiles'
                });
            }

            console.log(`📋 ${profiles.length} perfiles obtenidos para usuario ${req.user.username}`);

            res.json({
                success: true,
                message: 'Perfiles obtenidos correctamente',
                data: profiles
            });
        }
    );
};

// CREAR NUEVO PERFIL
export const createProfile = (req, res) => {
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

    db.run(
        `INSERT INTO profiles (nombre, pin, propietario, correo, plataforma, monto, fecha_pago, estado_pago, user_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [nombre, pin || '', propietario, correo, plataforma, monto, fecha_pago, estado_pago || 'pendiente', userId],
        function(err) {
            if (err) {
                console.error('❌ Error creando perfil:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Error creando perfil'
                });
            }

            console.log(`✅ Perfil creado: ${nombre} - ${plataforma} (ID: ${this.lastID})`);

            res.status(201).json({
                success: true,
                message: 'Perfil creado exitosamente',
                data: {
                    id: this.lastID,
                    nombre,
                    pin: pin || '',
                    propietario,
                    correo,
                    plataforma,
                    monto,
                    fecha_pago,
                    estado_pago: estado_pago || 'pendiente'
                }
            });
        }
    );
};

// ACTUALIZAR PERFIL
export const updateProfile = (req, res) => {
    const userId = req.user.id;
    const profileId = req.params.id;
    const { nombre, pin, propietario, correo, plataforma, monto, fecha_pago, estado_pago } = req.body;

    // Validar que el perfil pertenece al usuario
    db.get(
        'SELECT * FROM profiles WHERE id = ? AND user_id = ?',
        [profileId, userId],
        (err, profile) => {
            if (err) {
                console.error('❌ Error verificando perfil:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Error interno del servidor'
                });
            }

            if (!profile) {
                return res.status(404).json({
                    success: false,
                    message: 'Perfil no encontrado'
                });
            }

            // Actualizar perfil
            db.run(
                `UPDATE profiles SET 
                 nombre = ?, pin = ?, propietario = ?, correo = ?, plataforma = ?, 
                 monto = ?, fecha_pago = ?, estado_pago = ?, updated_at = CURRENT_TIMESTAMP
                 WHERE id = ? AND user_id = ?`,
                [nombre, pin || '', propietario, correo, plataforma, monto, fecha_pago, estado_pago, profileId, userId],
                function(err) {
                    if (err) {
                        console.error('❌ Error actualizando perfil:', err);
                        return res.status(500).json({
                            success: false,
                            message: 'Error actualizando perfil'
                        });
                    }

                    console.log(`✅ Perfil actualizado: ${nombre} - ${plataforma} (ID: ${profileId})`);

                    res.json({
                        success: true,
                        message: 'Perfil actualizado exitosamente',
                        data: {
                            id: profileId,
                            nombre,
                            pin: pin || '',
                            propietario,
                            correo,
                            plataforma,
                            monto,
                            fecha_pago,
                            estado_pago
                        }
                    });
                }
            );
        }
    );
};

// ELIMINAR PERFIL
export const deleteProfile = (req, res) => {
    const userId = req.user.id;
    const profileId = req.params.id;

    // Verificar que el perfil pertenece al usuario
    db.get(
        'SELECT * FROM profiles WHERE id = ? AND user_id = ?',
        [profileId, userId],
        (err, profile) => {
            if (err) {
                console.error('❌ Error verificando perfil:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Error interno del servidor'
                });
            }

            if (!profile) {
                return res.status(404).json({
                    success: false,
                    message: 'Perfil no encontrado'
                });
            }

            // Eliminar perfil
            db.run(
                'DELETE FROM profiles WHERE id = ? AND user_id = ?',
                [profileId, userId],
                function(err) {
                    if (err) {
                        console.error('❌ Error eliminando perfil:', err);
                        return res.status(500).json({
                            success: false,
                            message: 'Error eliminando perfil'
                        });
                    }

                    console.log(`🗑️ Perfil eliminado: ${profile.nombre} - ${profile.plataforma} (ID: ${profileId})`);

                    res.json({
                        success: true,
                        message: 'Perfil eliminado exitosamente'
                    });
                }
            );
        }
    );
};

// CAMBIAR ESTADO DE PAGO
export const updatePaymentStatus = (req, res) => {
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
    db.get(
        'SELECT * FROM profiles WHERE id = ? AND user_id = ?',
        [profileId, userId],
        (err, profile) => {
            if (err) {
                console.error('❌ Error verificando perfil:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Error interno del servidor'
                });
            }

            if (!profile) {
                return res.status(404).json({
                    success: false,
                    message: 'Perfil no encontrado'
                });
            }

            // Actualizar estado
            db.run(
                'UPDATE profiles SET estado_pago = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?',
                [estado_pago, profileId, userId],
                function(err) {
                    if (err) {
                        console.error('❌ Error actualizando estado:', err);
                        return res.status(500).json({
                            success: false,
                            message: 'Error actualizando estado de pago'
                        });
                    }

                    console.log(`💳 Estado actualizado: ${profile.nombre} -> ${estado_pago}`);

                    res.json({
                        success: true,
                        message: `Estado actualizado a ${estado_pago}`,
                        data: {
                            id: profileId,
                            estado_pago
                        }
                    });
                }
            );
        }
    );
};
