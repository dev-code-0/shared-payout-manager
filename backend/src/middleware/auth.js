
import jwt from 'jsonwebtoken';
import { getOne } from '../config/database.js';

// Middleware para verificar JWT
export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Token de acceso requerido' 
    });
  }

  try {
    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Buscar el usuario en la base de datos
    const user = await getOne('SELECT * FROM users WHERE id = ?', [decoded.userId]);
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Usuario no encontrado' 
      });
    }

    // Agregar información del usuario a la request
    req.user = {
      id: user.id,
      username: user.username
    };

    next();
  } catch (error) {
    console.error('Error al verificar token:', error);
    return res.status(403).json({ 
      success: false, 
      message: 'Token inválido' 
    });
  }
};
