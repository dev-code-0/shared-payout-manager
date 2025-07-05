import React, { useState, useEffect } from 'react';
import ProfileForm from './ProfileForm';
import PaymentTable from './PaymentTable';
import { toast } from 'sonner';
import { Profile, PaymentStats } from '../types';
import { 
  getProfiles, 
  createProfile, 
  updateProfile, 
  deleteProfile, 
  updatePaymentStatus,
  logout 
} from '../services/api';

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('todas');
  const [isLoading, setIsLoading] = useState(true);

  // Cargar perfiles al montar el componente
  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    try {
      console.log('📋 Cargando perfiles desde backend...');
      setIsLoading(true);
      
      const fetchedProfiles = await getProfiles();
      console.log('✅ Perfiles obtenidos:', fetchedProfiles);
      setProfiles(fetchedProfiles);
      
      toast.success(`${fetchedProfiles.length} perfiles cargados`);
    } catch (error) {
      console.error('❌ Error cargando perfiles:', error);
      
      if (error instanceof Error) {
        toast.error(`Error cargando perfiles: ${error.message}`);
        
        // Si es error de autenticación, cerrar sesión
        if (error.message.includes('Token') || error.message.includes('401') || error.message.includes('403')) {
          toast.error('Sesión expirada, cerrando sesión...');
          handleLogout();
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProfile = async (profileData: Omit<Profile, 'id'>) => {
    try {
      console.log('➕ Creando perfil:', profileData.nombre);
      
      const newProfile = await createProfile(profileData);
      console.log('✅ Perfil creado:', newProfile);
      
      setProfiles([...profiles, newProfile]);
      toast.success('Perfil agregado exitosamente');
      setShowForm(false);
    } catch (error) {
      console.error('❌ Error creando perfil:', error);
      
      if (error instanceof Error) {
        toast.error(`Error creando perfil: ${error.message}`);
      }
    }
  };

  const handleEditProfile = async (profileData: Omit<Profile, 'id'>) => {
    if (!editingProfile) return;
    
    try {
      console.log('✏️ Actualizando perfil:', editingProfile.id);
      
      const updatedProfile = await updateProfile(editingProfile.id, profileData);
      console.log('✅ Perfil actualizado:', updatedProfile);
      
      const updatedProfiles = profiles.map(p => 
        p.id === editingProfile.id ? updatedProfile : p
      );
      setProfiles(updatedProfiles);
      
      toast.success('Perfil actualizado exitosamente');
      setEditingProfile(null);
      setShowForm(false);
    } catch (error) {
      console.error('❌ Error actualizando perfil:', error);
      
      if (error instanceof Error) {
        toast.error(`Error actualizando perfil: ${error.message}`);
      }
    }
  };

  const handleDeleteProfile = async (id: string) => {
    try {
      console.log('🗑️ Eliminando perfil:', id);
      
      await deleteProfile(id);
      console.log('✅ Perfil eliminado');
      
      setProfiles(profiles.filter(p => p.id !== id));
      toast.success('Perfil eliminado exitosamente');
    } catch (error) {
      console.error('❌ Error eliminando perfil:', error);
      
      if (error instanceof Error) {
        toast.error(`Error eliminando perfil: ${error.message}`);
      }
    }
  };

  const handlePaymentStatusChange = async (id: string, status: 'pagado' | 'pendiente') => {
    try {
      console.log('💳 Cambiando estado de pago:', id, '->', status);
      
      await updatePaymentStatus(id, status);
      console.log('✅ Estado actualizado');
      
      const updatedProfiles = profiles.map(p => 
        p.id === id ? { ...p, estado_pago: status } : p
      );
      setProfiles(updatedProfiles);
      
      toast.success(`Estado actualizado a ${status}`);
    } catch (error) {
      console.error('❌ Error actualizando estado:', error);
      
      if (error instanceof Error) {
        toast.error(`Error actualizando estado: ${error.message}`);
      }
    }
  };

  const handleLogout = () => {
    logout(); // Limpiar token del localStorage
    onLogout(); // Notificar al componente padre
    toast.success('Sesión cerrada correctamente');
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
          <h2>🔄 Cargando datos...</h2>
          <p>Conectando con el servidor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>💳 Payout Manager</h1>
          <div className="header-actions">
            <small>🌐 Conectado: {profiles.length} perfiles</small>
            <button onClick={handleLogout} className="logout-button">
              Cerrar Sesión
            </button>
          </div>
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
          
          <button 
            onClick={loadProfiles} 
            className="refresh-button"
            title="Actualizar datos"
          >
            🔄 Actualizar
          </button>
        </div>

        {/* Mensaje si no hay perfiles */}
        {profiles.length === 0 && !isLoading && (
          <div className="empty-state">
            <h3>📋 No hay perfiles registrados</h3>
            <p>Agrega tu primer perfil para comenzar a gestionar los pagos</p>
            <button 
              onClick={() => setShowForm(true)} 
              className="add-button"
            >
              ➕ Agregar Primer Perfil
            </button>
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
