
import React, { useState, useEffect } from 'react';
import { format, isToday, isTomorrow, addDays, isBefore, startOfDay } from 'date-fns';
import { es } from 'date-fns/locale';
import ProfileForm from './ProfileForm';
import PaymentTable from './PaymentTable';
import { toast } from 'sonner';
import { Profile, PaymentStats } from '../types';

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('todas');

  // Cargar datos iniciales
  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = () => {
    // Datos de ejemplo (en producción vendría del backend)
    const mockProfiles: Profile[] = [
      {
        id: '1',
        nombre: 'Juan Pérez',
        pin: '1234',
        propietario: 'Admin 1',
        correo: 'juan@email.com',
        plataforma: 'Netflix',
        monto: 15000,
        fecha_pago: 5,
        estado_pago: 'pagado'
      },
      {
        id: '2',
        nombre: 'María García',
        pin: '5678',
        propietario: 'Admin 2',
        correo: 'maria@email.com',
        plataforma: 'Spotify',
        monto: 8000,
        fecha_pago: 10,
        estado_pago: 'pendiente'
      },
      {
        id: '3',
        nombre: 'Carlos López',
        pin: '',
        propietario: 'Admin 1',
        correo: 'carlos@email.com',
        plataforma: 'Netflix',
        monto: 15000,
        fecha_pago: 3,
        estado_pago: 'pendiente'
      }
    ];
    setProfiles(mockProfiles);
  };

  const handleAddProfile = (profileData: Omit<Profile, 'id'>) => {
    const newProfile: Profile = {
      ...profileData,
      id: Date.now().toString()
    };
    setProfiles([...profiles, newProfile]);
    toast.success('Perfil agregado exitosamente');
    setShowForm(false);
  };

  const handleEditProfile = (profileData: Omit<Profile, 'id'>) => {
    if (editingProfile) {
      const updatedProfiles = profiles.map(p => 
        p.id === editingProfile.id ? { ...profileData, id: editingProfile.id } : p
      );
      setProfiles(updatedProfiles);
      toast.success('Perfil actualizado exitosamente');
      setEditingProfile(null);
      setShowForm(false);
    }
  };

  const handleDeleteProfile = (id: string) => {
    setProfiles(profiles.filter(p => p.id !== id));
    toast.success('Perfil eliminado exitosamente');
  };

  const handlePaymentStatusChange = (id: string, status: 'pagado' | 'pendiente') => {
    const updatedProfiles = profiles.map(p => 
      p.id === id ? { ...p, estado_pago: status } : p
    );
    setProfiles(updatedProfiles);
    toast.success(`Estado actualizado a ${status}`);
  };

  const getPaymentStats = (): PaymentStats => {
    const filteredProfiles = selectedPlatform === 'todas' 
      ? profiles 
      : profiles.filter(p => p.plataforma === selectedPlatform);

    const totalAmount = filteredProfiles.reduce((sum, p) => sum + p.monto, 0);
    const paidAmount = filteredProfiles
      .filter(p => p.estado_pago === 'pagado')
      .reduce((sum, p) => sum + p.monto, 0);
    const pendingCount = filteredProfiles.filter(p => p.estado_pago === 'pendiente').length;

    return {
      totalAmount,
      paidAmount,
      pendingAmount: totalAmount - paidAmount,
      pendingCount,
      totalCount: filteredProfiles.length
    };
  };

  const getUpcomingPayments = () => {
    const today = new Date();
    const currentDay = today.getDate();
    
    return profiles.filter(profile => {
      if (profile.estado_pago === 'pagado') return false;
      
      const paymentDay = profile.fecha_pago;
      const daysUntilPayment = paymentDay - currentDay;
      
      return daysUntilPayment <= 1 && daysUntilPayment >= 0;
    });
  };

  const stats = getPaymentStats();
  const upcomingPayments = getUpcomingPayments();
  const platforms = ['todas', ...Array.from(new Set(profiles.map(p => p.plataforma)))];

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>💳 Payout Manager</h1>
          <button onClick={onLogout} className="logout-button">
            Cerrar Sesión
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        {/* Alertas de pagos próximos */}
        {upcomingPayments.length > 0 && (
          <div className="alerts-section">
            <h3>⚠️ Pagos Próximos</h3>
            {upcomingPayments.map(profile => (
              <div key={profile.id} className="alert-card">
                <strong>{profile.nombre}</strong> debe pagar {profile.plataforma} 
                el día {profile.fecha_pago} (${profile.monto.toLocaleString()})
              </div>
            ))}
          </div>
        )}

        {/* Estadísticas */}
        <div className="stats-section">
          <div className="stats-grid">
            <div className="stat-card total">
              <h3>Total a Recaudar</h3>
              <p>${stats.totalAmount.toLocaleString()}</p>
            </div>
            <div className="stat-card paid">
              <h3>Ya Pagado</h3>
              <p>${stats.paidAmount.toLocaleString()}</p>
            </div>
            <div className="stat-card pending">
              <h3>Pendiente</h3>
              <p>${stats.pendingAmount.toLocaleString()}</p>
            </div>
            <div className="stat-card count">
              <h3>Perfiles Pendientes</h3>
              <p>{stats.pendingCount} de {stats.totalCount}</p>
            </div>
          </div>
        </div>

        {/* Controles */}
        <div className="controls-section">
          <div className="controls-left">
            <button 
              onClick={() => setShowForm(true)} 
              className="add-button"
            >
              ➕ Agregar Perfil
            </button>
            
            <select 
              value={selectedPlatform} 
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="platform-filter"
            >
              {platforms.map(platform => (
                <option key={platform} value={platform}>
                  {platform === 'todas' ? 'Todas las plataformas' : platform}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tabla de perfiles */}
        <PaymentTable
          profiles={profiles.filter(p => 
            selectedPlatform === 'todas' || p.plataforma === selectedPlatform
          )}
          onEdit={(profile) => {
            setEditingProfile(profile);
            setShowForm(true);
          }}
          onDelete={handleDeleteProfile}
          onPaymentStatusChange={handlePaymentStatusChange}
        />
      </main>

      {/* Modal de formulario */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <ProfileForm
              profile={editingProfile}
              onSubmit={editingProfile ? handleEditProfile : handleAddProfile}
              onCancel={() => {
                setShowForm(false);
                setEditingProfile(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
