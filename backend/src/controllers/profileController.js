
import { runQuery, getAll, getOne } from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

// Obtener todos los perfiles del usuario
export const getAllProfiles = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const profiles = await getAll(
      'SELECT * FROM profiles WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );

    res.json(profiles);
  } catch (error) {
    console.error('Error al obtener perfiles:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener los perfiles'
    });
  }
};

// Crear nuevo perfil
export const createProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      nombre,
      pin,
      propietario,
      correo,
      plataforma,
      monto,
      fecha_pago,
      estado_pago
    } = req.body;

    // Generar ID único
    const profileId = uuidv4();

    // Insertar en la base de datos
    await runQuery(`
      INSERT INTO profiles (
        id, nombre, pin, propietario, correo, plataforma, 
        monto, fecha_pago, estado_pago, user_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      profileId, nombre, pin, propietario, correo, plataforma,
      monto, fecha_pago, estado_pago || 'pendiente', userId
    ]);

    // Obtener el perfil creado
    const newProfile = await getOne('SELECT * FROM profiles WHERE id = ?', [profileId]);

    res.status(201).json(newProfile);
  } catch (error) {
    console.error('Error al crear perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear el perfil'
    });
  }
};

// Actualizar perfil
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const profileId = req.params.id;
    const {
      nombre,
      pin,
      propietario,
      correo,
      plataforma,
      monto,
      fecha_pago,
      estado_pago
    } = req.body;

    // Verificar que el perfil pertenece al usuario
    const existingProfile = await getOne(
      'SELECT * FROM profiles WHERE id = ? AND user_id = ?',
      [profileId, userId]
    );

    if (!existingProfile) {
      return res.status(404).json({
        success: false,
        message: 'Perfil no encontrado'
      });
    }

    // Actualizar el perfil
    await runQuery(`
      UPDATE profiles SET 
        nombre = ?, pin = ?, propietario = ?, correo = ?, 
        plataforma = ?, monto = ?, fecha_pago = ?, estado_pago = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND user_id = ?
    `, [
      nombre, pin, propietario, correo, plataforma,
      monto, fecha_pago, estado_pago, profileId, userId
    ]);

    // Obtener el perfil actualizado
    const updatedProfile = await getOne('SELECT * FROM profiles WHERE id = ?', [profileId]);

    res.json(updatedProfile);
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el perfil'
    });
  }
};

// Eliminar perfil
export const deleteProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const profileId = req.params.id;

    // Verificar que el perfil pertenece al usuario
    const existingProfile = await getOne(
      'SELECT * FROM profiles WHERE id = ? AND user_id = ?',
      [profileId, userId]
    );

    if (!existingProfile) {
      return res.status(404).json({
        success: false,
        message: 'Perfil no encontrado'
      });
    }

    // Eliminar el perfil
    await runQuery('DELETE FROM profiles WHERE id = ? AND user_id = ?', [profileId, userId]);

    res.json({
      success: true,
      message: 'Perfil eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar el perfil'
    });
  }
};

// Actualizar estado de pago
export const updatePaymentStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const profileId = req.params.id;
    const { estado_pago } = req.body;

    // Validar estado
    if (!['pagado', 'pendiente'].includes(estado_pago)) {
      return res.status(400).json({
        success: false,
        message: 'Estado de pago inválido'
      });
    }

    // Verificar que el perfil pertenece al usuario
    const existingProfile = await getOne(
      'SELECT * FROM profiles WHERE id = ? AND user_id = ?',
      [profileId, userId]
    );

    if (!existingProfile) {
      return res.status(404).json({
        success: false,
        message: 'Perfil no encontrado'
      });
    }

    // Actualizar estado
    await runQuery(`
      UPDATE profiles SET 
        estado_pago = ?, 
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND user_id = ?
    `, [estado_pago, profileId, userId]);

    // Obtener el perfil actualizado
    const updatedProfile = await getOne('SELECT * FROM profiles WHERE id = ?', [profileId]);

    res.json(updatedProfile);
  } catch (error) {
    console.error('Error al actualizar estado:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el estado'
    });
  }
};
