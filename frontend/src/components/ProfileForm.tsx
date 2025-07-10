import React, { useState, useEffect } from 'react';
import { Profile } from '../types';
import { validateProfile, ValidationResult } from '../utils/validation';
import { toast } from 'sonner';

interface ProfileFormProps {
  profile?: Profile | null;
  onSubmit: (profileData: Omit<Profile, 'id'>) => void;
  onCancel: () => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ profile, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    pin: '',
    propietario: '',
    correo: '',
    plataforma: 'Netflix',
    monto: '',
    fecha_pago: 1,
    estado_pago: 'pendiente' as 'pagado' | 'pendiente'
  });
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (profile) {
      setFormData({
        nombre: profile.nombre,
        pin: profile.pin,
        propietario: profile.propietario,
        correo: profile.correo,
        plataforma: profile.plataforma,
        monto: profile.monto.toString(),
        fecha_pago: profile.fecha_pago,
        estado_pago: profile.estado_pago
      });
    }
  }, [profile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar formulario
    const validation = validateProfile({
      ...formData,
      monto: Number(formData.monto)
    });
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      validation.errors.forEach(error => toast.error(error));
      return;
    }
    
    setErrors([]);
    onSubmit({
      ...formData,
      monto: Number(formData.monto)
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'monto' || name === 'fecha_pago'
        ? value === '' ? '' : Number(value)
        : value
    }));
  };

  return (
    <div className="profile-form">
      <h2>{profile ? 'Editar Perfil' : 'Nuevo Perfil'}</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="nombre">Nombre de la Persona *</label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="propietario">Nombre del Perfil *</label>
            <input
              id="propietario"
              name="propietario"
              type="text"
              value={formData.propietario}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="pin">PIN (opcional)</label>
            <input
              id="pin"
              name="pin"
              type="text"
              value={formData.pin}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="correo">Correo *</label>
            <input
              id="correo"
              name="correo"
              type="email"
              value={formData.correo}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="plataforma">Plataforma *</label>
            <select
              id="plataforma"
              name="plataforma"
              value={formData.plataforma}
              onChange={handleChange}
              required
            >
              <option value="Netflix">Netflix</option>
              <option value="Spotify">Spotify</option>
              <option value="Amazon Prime">Amazon Prime</option>
              <option value="Disney+">Disney+</option>
              <option value="HBO Max">HBO Max</option>
              <option value="YouTube Premium">YouTube Premium</option>
              <option value="Otros">Otros</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="monto">Monto Mensual *</label>
            <input
              id="monto"
              name="monto"
              type="number"
              value={formData.monto}
              onChange={handleChange}
              required
              min="0"
              step="1"
            />
          </div>

          <div className="form-group">
            <label htmlFor="fecha_pago">Día de Pago *</label>
            <select
              id="fecha_pago"
              name="fecha_pago"
              value={formData.fecha_pago}
              onChange={handleChange}
              required
            >
              {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                <option key={day} value={day}>
                  Día {day}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="estado_pago">Estado del Pago</label>
            <select
              id="estado_pago"
              name="estado_pago"
              value={formData.estado_pago}
              onChange={handleChange}
            >
              <option value="pendiente">Pendiente</option>
              <option value="pagado">Pagado</option>
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" onClick={onCancel} className="cancel-button">
            Cancelar
          </button>
          <button type="submit" className="submit-button">
            {profile ? 'Actualizar' : 'Agregar'} Perfil
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;
