import React from 'react';
import { Profile } from '../types';

interface PaymentTableProps {
  profiles: Profile[];
  onEdit: (profile: Profile) => void;
  onDelete: (id: string) => void;
  onPaymentStatusChange: (id: string, status: 'pagado' | 'pendiente') => void;
}

const PaymentTable: React.FC<PaymentTableProps> = ({
  profiles,
  onEdit,
  onDelete,
  onPaymentStatusChange
}) => {
  const getPlatformIcon = (platform: string) => {
    const icons: { [key: string]: string } = {
      'Netflix': '🎬',
      'Spotify': '🎵',
      'Amazon Prime': '📦',
      'Disney+': '🏰',
      'HBO Max': '🎭',
      'YouTube Premium': '📺',
      'Otros': '💻'
    };
    return icons[platform] || '💻';
  };

  const getPaymentAlert = (profile: Profile) => {
    if (profile.estado_pago === 'pagado') return null;
    
    const today = new Date().getDate();
    const paymentDay = profile.fecha_pago;
    const daysUntilPayment = paymentDay - today;
    
    if (daysUntilPayment === 0) {
      return <span className="payment-alert urgent">¡Hoy!</span>;
    } else if (daysUntilPayment === 1) {
      return <span className="payment-alert warning">Mañana</span>;
    } else if (daysUntilPayment < 0) {
      return <span className="payment-alert overdue">Vencido</span>;
    }
    
    return null;
  };

  if (profiles.length === 0) {
    return (
      <div className="empty-state">
        <h3>No hay perfiles registrados</h3>
        <p>Agrega tu primer perfil para comenzar a gestionar los pagos</p>
      </div>
    );
  }

  return (
    <div className="payment-table-container">
      <div className="table-wrapper">
        <table className="payment-table">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Perfil</th>
              <th>Plataforma</th>
              <th>Monto</th>
              <th>Día de Pago</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {profiles.map(profile => (
              <tr key={profile.id} className={`profile-row ${profile.estado_pago}`}>
                <td className="user-info">
                  <div className="user-details">
                    <strong>{profile.nombre}</strong>
                    {profile.pin && <small>PIN: {profile.pin}</small>}
                    <small>{profile.correo}</small>
                  </div>
                </td>
                
                <td className="profile-info">
                  <div className="profile-name">
                    <strong>{profile.propietario}</strong>
                  </div>
                </td>
                
                <td className="platform-info">
                  <span className="platform-badge">
                    {getPlatformIcon(profile.plataforma)} {profile.plataforma}
                  </span>
                </td>
                
                <td className="amount-info">
                  <strong>${profile.monto.toLocaleString()}</strong>
                </td>
                
                <td className="payment-date">
                  <div className="date-info">
                    <span>Día {profile.fecha_pago}</span>
                    {getPaymentAlert(profile)}
                  </div>
                </td>
                
                <td className="status-info">
                  <div className="status-controls">
                    <select
                      value={profile.estado_pago}
                      onChange={(e) => onPaymentStatusChange(
                        profile.id, 
                        e.target.value as 'pagado' | 'pendiente'
                      )}
                      className={`status-select ${profile.estado_pago}`}
                    >
                      <option value="pendiente">Pendiente</option>
                      <option value="pagado">Pagado</option>
                    </select>
                  </div>
                </td>
                
                <td className="actions">
                  <div className="action-buttons">
                    <button
                      onClick={() => onEdit(profile)}
                      className="edit-button"
                      title="Editar perfil"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('¿Estás seguro de eliminar este perfil?')) {
                          onDelete(profile.id);
                        }
                      }}
                      className="delete-button"
                      title="Eliminar perfil"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentTable;
