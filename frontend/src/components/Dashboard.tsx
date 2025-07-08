import React, { useState, useEffect } from 'react';
import { format, isToday, isTomorrow, addDays, isBefore, startOfDay } from 'date-fns';
import { es } from 'date-fns/locale';
import ProfileForm from './ProfileForm';
import PaymentTable from './PaymentTable';
import { toast } from 'sonner';
import { Profile, PaymentStats } from '../types';
import { 
  getProfiles, 
  createProfile, 
  updateProfile, 
  deleteProfile, 
  updatePaymentStatus 
} from '../services/api';

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('todas');
  const [loading, setLoading] = useState(true);

  // Cargar datos reales desde la API
  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    try {
      setLoading(true);
      console.log('🔄 Cargando perfiles desde la base de datos...');
      const profilesData = await getProfiles();
      // Asegurarse de que monto sea número
      const sanitizedProfiles = profilesData.map(p => ({ ...p, monto: Number(p.monto) }));
      setProfiles(sanitizedProfiles);
      console.log('✅ Perfiles cargados:', sanitizedProfiles.length);
    } catch (error) {
      console.error('❌ Error cargando perfiles:', error);
      toast.error('Error al cargar los perfiles. Verifica que el backend esté funcionando.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProfile = async (profileData: Omit<Profile, 'id'>) => {
    try {
      console.log('➕ Creando nuevo perfil...');
      const newProfile = await createProfile(profileData);
      setProfiles([...profiles, newProfile]);
      toast.success('Perfil agregado exitosamente');
      setShowForm(false);
    } catch (error) {
      console.error('❌ Error creando perfil:', error);
      toast.error('Error al crear el perfil');
    }
  };

  const handleEditProfile = async (profileData: Omit<Profile, 'id'>) => {
    if (editingProfile) {
      try {
        console.log('✏️ Actualizando perfil:', editingProfile.id);
        const updatedProfile = await updateProfile(editingProfile.id, profileData);
        const updatedProfiles = profiles.map(p => 
          p.id === editingProfile.id ? updatedProfile : p
        );
        setProfiles(updatedProfiles);
        toast.success('Perfil actualizado exitosamente');
        setEditingProfile(null);
        setShowForm(false);
      } catch (error) {
        console.error('❌ Error actualizando perfil:', error);
        toast.error('Error al actualizar el perfil');
      }
    }
  };

  const handleDeleteProfile = async (id: string) => {
    try {
      console.log('🗑️ Eliminando perfil:', id);
      await deleteProfile(id);
      setProfiles(profiles.filter(p => p.id !== id));
      toast.success('Perfil eliminado exitosamente');
    } catch (error) {
      console.error('❌ Error eliminando perfil:', error);
      toast.error('Error al eliminar el perfil');
    }
  };

  const handlePaymentStatusChange = async (id: string, status: 'pagado' | 'pendiente') => {
    try {
      console.log('💳 Cambiando estado de pago:', id, '->', status);
      await updatePaymentStatus(id, status);
      const updatedProfiles = profiles.map(p => 
        p.id === id ? { ...p, estado_pago: status } : p
      );
      setProfiles(updatedProfiles);
      toast.success(`Estado actualizado a ${status}`);
    } catch (error) {
      console.error('❌ Error actualizando estado:', error);
      toast.error('Error al actualizar el estado de pago');
    }
  };

  const getPaymentStats = (): PaymentStats => {
    const filteredProfiles = selectedPlatform === 'todas' 
      ? profiles 
      : profiles.filter(p => p.plataforma === selectedPlatform);

    const totalAmount = filteredProfiles.reduce((sum, p) => sum + Number(p.monto), 0);
    const paidAmount = filteredProfiles
      .filter(p => p.estado_pago === 'pagado')
      .reduce((sum, p) => sum + Number(p.monto), 0);
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

  if (loading) {
    return (
      <div className="dashboard">
        <header className="dashboard-header">
          <div className="header-content">
            <h1>Administrador de pagos</h1>
            <button onClick={onLogout} className="logout-button">
              Cerrar Sesión
            </button>
          </div>
        </header>
        <main className="dashboard-main">
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
            <div>
              <h3>🔄 Cargando datos...</h3>
              <p>Conectando con la base de datos PostgreSQL</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const stats = getPaymentStats();
  const upcomingPayments = getUpcomingPayments();
  const platforms = ['todas', ...Array.from(new Set(profiles.map(p => p.plataforma)))];

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Administrador de pagos</h1>
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
                el día {profile.fecha_pago} (S/{profile.monto.toLocaleString()})
              </div>
            ))}
          </div>
        )}

        {/* Estadísticas */}
        <div className="stats-section">
          <div className="stats-grid">
            <div className="stat-card total">
              <h3>Total a Recaudar</h3>
              <p>S/{stats.totalAmount.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
            <div className="stat-card paid">
              <h3>Ya Pagado</h3>
              <p>S/{stats.paidAmount.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
            <div className="stat-card pending">
              <h3>Pendiente</h3>
              <p>S/{stats.pendingAmount.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
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

        {/* Estado cuando no hay perfiles */}
        {profiles.length === 0 && !loading && (
          <div className="empty-state">
            <h3>📋 No hay perfiles registrados</h3>
            <p>Los datos se cargan desde PostgreSQL. Agrega tu primer perfil para comenzar.</p>
          </div>
        )}

        {/* Tabla de perfiles */}
        {profiles.length > 0 && (
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
        )}
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
