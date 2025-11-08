import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventosAPI, insumosAPI } from '../services/api';

function Dashboard() {
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
      <h1 style={styles.title}>Dashboard</h1>
      
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
          <h3 style={styles.statTitle}>Alertas de Stock Bajo</h3>
          <p style={styles.statValue}>{stats.alertasStock}</p>
          <Link to="/insumos" style={styles.statLink}>Ver alertas →</Link>
        </div>
      </div>

      <div style={styles.quickActions}>
        <h2 style={styles.sectionTitle}>Acciones Rápidas</h2>
        <div style={styles.actionButtons}>
          <Link to="/eventos" style={styles.button}>Gestionar Eventos</Link>
          <Link to="/insumos" style={styles.button}>Gestionar Insumos</Link>
          <Link to="/menus" style={styles.button}>Gestionar Menús</Link>
          <Link to="/ordenes-compra" style={styles.button}>Órdenes de Compra</Link>
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
  title: {
    fontSize: '2.5rem',
    marginBottom: '2rem',
    color: '#2c3e50',
  },
  loading: {
    textAlign: 'center',
    padding: '3rem',
    fontSize: '1.2rem',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '2rem',
    marginBottom: '3rem',
  },
  statCard: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s',
  },
  alertCard: {
    backgroundColor: '#fff3cd',
    border: '2px solid #ffc107',
  },
  statTitle: {
    fontSize: '1rem',
    color: '#7f8c8d',
    marginBottom: '0.5rem',
  },
  statValue: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: '1rem',
  },
  statLink: {
    color: '#3498db',
    textDecoration: 'none',
    fontSize: '0.9rem',
  },
  quickActions: {
    marginTop: '3rem',
  },
  sectionTitle: {
    fontSize: '1.5rem',
    marginBottom: '1rem',
    color: '#2c3e50',
  },
  actionButtons: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  button: {
    backgroundColor: '#3498db',
    color: 'white',
    padding: '0.75rem 1.5rem',
    borderRadius: '4px',
    textDecoration: 'none',
    fontSize: '1rem',
    transition: 'background-color 0.2s',
  },
};

export default Dashboard;
