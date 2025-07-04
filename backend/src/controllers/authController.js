
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getOne } from '../config/database.js';

// Login de usuario
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validar campos requeridos
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Usuario y contraseña son requeridos'
      });
    }

    // Buscar usuario en la base de datos
    const user = await getOne('SELECT * FROM users WHERE username = ?', [username]);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales incorrectas'
      });
    }

    // Verificar contraseña
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales incorrectas'
      });
    }

    // Generar JWT token
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Login exitoso',
      token,
      user: {
        id: user.id,
        username: user.username
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Verificar token
export const verifyToken = async (req, res) => {
  try {
    // El middleware ya verificó el token y agregó req.user
    res.json({
      success: true,
      user: req.user
    });
  } catch (error) {
    console.error('Error al verificar token:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};
