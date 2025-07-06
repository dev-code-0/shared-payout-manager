
/**
 * CONTROLADOR DE AUTENTICACIÓN
 * 
 * Maneja login y validación de usuarios.
 * Por ahora solo soporta el usuario admin,
 * pero se puede extender fácilmente.
 */

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../config/database.js';

// LOGIN - Autenticar usuario
export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validar datos requeridos
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Usuario y contraseña son requeridos'
            });
        }

        // Buscar usuario en base de datos
        const result = await query('SELECT * FROM users WHERE username = $1', [username]);
        const user = result.rows[0];

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales incorrectas'
            });
        }

        // Verificar contraseña
        const isValidPassword = bcrypt.compareSync(password, user.password);
        
        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales incorrectas'
            });
        }

        // Generar JWT token
        const token = jwt.sign(
            { 
                id: user.id, 
                username: user.username 
            },
            process.env.JWT_SECRET,
            { 
                expiresIn: '24h' // Token válido por 24 horas
            }
        );

        console.log(`✅ Usuario ${username} autenticado correctamente`);

        res.json({
            success: true,
            message: 'Login exitoso',
            data: {
                token,
                user: {
                    id: user.id,
                    username: user.username
                }
            }
        });
    } catch (error) {
        console.error('❌ Error en login:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// VERIFICAR TOKEN - Validar si el token es válido
export const verifyToken = (req, res) => {
    // Si llegamos aquí, el middleware de auth ya validó el token
    res.json({
        success: true,
        message: 'Token válido',
        data: {
            user: req.user
        }
    });
};
