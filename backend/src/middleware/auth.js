
/**
 * MIDDLEWARE DE AUTENTICACIÓN
 * 
 * Este middleware verifica que el usuario esté autenticado
 * mediante JWT token en cada request que lo requiera.
 * 
 * HEADERS REQUERIDOS:
 * Authorization: Bearer <token>
 */

import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    try {
        // Obtener token del header Authorization
        const authHeader = req.headers.authorization;
        
        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: 'Token de autorización requerido'
            });
        }

        // Verificar formato "Bearer <token>"
        const token = authHeader.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Formato de token inválido'
            });
        }

        // Verificar y decodificar token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Agregar información del usuario al request
        req.user = decoded;
        
        next();
    } catch (error) {
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expirado'
            });
        }
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Token inválido'
            });
        }
        
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

export default authMiddleware;
