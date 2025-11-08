import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventosAPI, insumosAPI } from '../services/api';

function DashboardAdministrador() {
  const [stats, setStats] = useState({
    totalEventos: 0,
    totalInsumos: 0,
    alertasStock: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [eventosRes, insumosRes, alertasRes] = await Promise.all([
          eventosAPI.getAll(),
          insumosAPI.getAll(),
          insumosAPI.getAlertasStockBajo(),
        ]);

        setStats({
          totalEventos: eventosRes.data.length,
          totalInsumos: insumosRes.data.length,
          alertasStock: alertasRes.data.length,
        });
      } catch (error) {
        console.error('Error al cargar estadísticas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div style={styles.loading}>Cargando...</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Dashboard - Administrador</h1>
      <p style={styles.subtitle}>Gestión estratégica y toma de decisiones</p>
      
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <h3 style={styles.statTitle}>Total Eventos</h3>
          <p style={styles.statValue}>{stats.totalEventos}</p>
          <Link to="/eventos" style={styles.statLink}>Ver eventos →</Link>
        </div>

        <div style={styles.statCard}>
          <h3 style={styles.statTitle}>Total Insumos</h3>
          <p style={styles.statValue}>{stats.totalInsumos}</p>
          <Link to="/insumos" style={styles.statLink}>Ver insumos →</Link>
        </div>

        <div style={{...styles.statCard, ...(stats.alertasStock > 0 && styles.alertCard)}}>
          <h3 style={styles.statTitle}>Alertas de Stock</h3>
          <p style={styles.statValue}>{stats.alertasStock}</p>
          <Link to="/insumos" style={styles.statLink}>Ver alertas →</Link>
        </div>
      </div>

      <div style={styles.sections}>
        <h2 style={styles.sectionTitle}>Acciones del Administrador</h2>
        <div style={styles.actionGrid}>
          <Link to="/eventos" style={styles.actionCard}>
            <h3>📅 Gestión de Eventos</h3>
            <p>Planificación estratégica de eventos</p>
          </Link>
          <Link to="/menus" style={styles.actionCard}>
            <h3>🍽️ Gestión de Menús</h3>
            <p>Configuración de opciones gastronómicas</p>
          </Link>
          <Link to="/insumos" style={styles.actionCard}>
            <h3>📦 Control de Insumos</h3>
            <p>Supervisión de inventario completo</p>
          </Link>
          <Link to="/ordenes-compra" style={styles.actionCard}>
            <h3>🛒 Órdenes de Compra</h3>
            <p>Aprobación y gestión de proveedores</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem',
  },
  loading: {
    textAlign: 'center',
    padding: '3rem',
    fontSize: '1.2rem',
  },
  title: {
    fontSize: '2rem',
    color: '#2c3e50',
    marginBottom: '0.5rem',
  },
  subtitle: {
    fontSize: '1.1rem',
    color: '#7f8c8d',
    marginBottom: '2rem',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    marginBottom: '3rem',
  },
  statCard: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  alertCard: {
    backgroundColor: '#fff5f5',
    borderLeft: '4px solid #e74c3c',
  },
  statTitle: {
    fontSize: '0.9rem',
    color: '#7f8c8d',
    marginBottom: '0.5rem',
  },
  statValue: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: '0.5rem',
  },
  statLink: {
    color: '#3498db',
    textDecoration: 'none',
    fontSize: '0.9rem',
  },
  sections: {
    marginTop: '2rem',
  },
  sectionTitle: {
    fontSize: '1.5rem',
    color: '#2c3e50',
    marginBottom: '1.5rem',
  },
  actionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '1.5rem',
  },
  actionCard: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    textDecoration: 'none',
    color: 'inherit',
    transition: 'transform 0.2s',
  },
};

export default DashboardAdministrador;
