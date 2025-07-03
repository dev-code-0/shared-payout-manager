
import React, { useState, useEffect } from 'react';
import ProfileForm from './ProfileForm';
import PaymentTable from './PaymentTable';
import { toast } from 'sonner';
import { Profile, PaymentStats } from '../types';
import { profileService } from '../services/api';

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('todas');
  const [isLoading, setIsLoading] = useState(true);

  // Cargar perfiles desde la API
  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    try {
      setIsLoading(true);
      const profilesData = await profileService.getAll();
      setProfiles(profilesData);
    } catch (error) {
      console.error('Error al cargar perfiles:', error);
      toast.error('Error al cargar los perfiles');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProfile = async (profileData: Omit<Profile, 'id'>) => {
    try {
      const newProfile = await profileService.create(profileData);
      setProfiles([...profiles, newProfile]);
      toast.success('Perfil agregado exitosamente');
      setShowForm(false);
    } catch (error) {
      console.error('Error al agregar perfil:', error);
      toast.error('Error al agregar el perfil');
    }
  };

  const handleEditProfile = async (profileData: Omit<Profile, 'id'>) => {
    if (editingProfile) {
      try {
        const updatedProfile = await profileService.update(editingProfile.id, profileData);
        const updatedProfiles = profiles.map(p => 
          p.id === editingProfile.id ? updatedProfile : p
        );
        setProfiles(updatedProfiles);
        toast.success('Perfil actualizado exitosamente');
        setEditingProfile(null);
        setShowForm(false);
      } catch (error) {
        console.error('Error al actualizar perfil:', error);
        toast.error('Error al actualizar el perfil');
      }
    }
  };

  const handleDeleteProfile = async (id: string) => {
    try {
      await profileService.delete(id);
      setProfiles(profiles.filter(p => p.id !== id));
      toast.success('Perfil eliminado exitosamente');
    } catch (error) {
      console.error('Error al eliminar perfil:', error);
      toast.error('Error al eliminar el perfil');
    }
  };

  const handlePaymentStatusChange = async (id: string, status: 'pagado' | 'pendiente') => {
    try {
      const updatedProfile = await profileService.updatePaymentStatus(id, status);
      const updatedProfiles = profiles.map(p => 
        p.id === id ? updatedProfile : p
      );
      setProfiles(updatedProfiles);
      toast.success(`Estado actualizado a ${status}`);
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      toast.error('Error al actualizar el estado');
    }
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

  if (isLoading) {
    return (
      <div className="dashboard">
        <div className="loading-container">
          <h2>Cargando...</h2>
        </div>
      </div>
    );
  }

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
                <strong>{profile.nombre}</strong> ({profile.propietario}) debe pagar {profile.plataforma} 
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
