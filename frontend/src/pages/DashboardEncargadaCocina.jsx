import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { insumosAPI } from '../services/api';

function DashboardEncargadaCocina() {
  const [alertas, setAlertas] = useState([]);
  const [insumos, setInsumos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [alertasRes, insumosRes] = await Promise.all([
          insumosAPI.getAlertasStockBajo(),
          insumosAPI.getAll(),
        ]);

        setAlertas(alertasRes.data);
        setInsumos(insumosRes.data);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div style={styles.loading}>Cargando...</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Dashboard - Encargada de Cocina</h1>
      <p style={styles.subtitle}>Control de insumos y preparación de pedidos</p>

      <div style={styles.alertSection}>
        <h2 style={styles.sectionTitle}>
          🚨 Alertas de Stock Bajo ({alertas.length})
        </h2>
        {alertas.length === 0 ? (
          <div style={styles.noAlerts}>
            ✅ No hay alertas de stock. Todo en orden.
          </div>
        ) : (
          <div style={styles.alertGrid}>
            {alertas.map((alerta) => (
              <div key={alerta.idInsumo} style={styles.alertCard}>
                <h3>{alerta.nombreInsumo}</h3>
                <p style={styles.alertText}>
                  Stock actual: <strong>{alerta.cantidadActual}</strong> {alerta.unidadMedida}
                </p>
                <p style={styles.alertText}>
                  Consumo proyectado: <strong>{alerta.consumoProyectado}</strong> {alerta.unidadMedida}
                </p>
                <p style={styles.deficit}>
                  Déficit: {alerta.deficit} {alerta.unidadMedida}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={styles.sections}>
        <h2 style={styles.sectionTitle}>Acciones Rápidas</h2>
        <div style={styles.actionGrid}>
          <Link to="/insumos" style={styles.actionCard}>
            <h3>📦 Control de Insumos</h3>
            <p>Revisar y actualizar inventario</p>
            <div style={styles.badge}>{insumos.length} insumos</div>
          </Link>
          <Link to="/menus" style={styles.actionCard}>
            <h3>🍽️ Menús Disponibles</h3>
            <p>Consultar menús para eventos</p>
          </Link>
          <Link to="/ordenes-compra" style={styles.actionCard}>
            <h3>🛒 Solicitar Compras</h3>
            <p>Crear órdenes para reabastecer</p>
          </Link>
          <Link to="/eventos" style={styles.actionCard}>
            <h3>📅 Eventos Próximos</h3>
            <p>Ver pedidos a preparar</p>
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
  alertSection: {
    marginBottom: '3rem',
  },
  sectionTitle: {
    fontSize: '1.5rem',
    color: '#2c3e50',
    marginBottom: '1.5rem',
  },
  noAlerts: {
    backgroundColor: '#d5f4e6',
    padding: '2rem',
    borderRadius: '8px',
    textAlign: 'center',
    fontSize: '1.1rem',
    color: '#27ae60',
  },
  alertGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1rem',
  },
  alertCard: {
    backgroundColor: '#fff5f5',
    padding: '1.5rem',
    borderRadius: '8px',
    borderLeft: '4px solid #e74c3c',
  },
  alertText: {
    margin: '0.5rem 0',
    color: '#555',
  },
  deficit: {
    marginTop: '1rem',
    color: '#e74c3c',
    fontWeight: 'bold',
  },
  sections: {
    marginTop: '2rem',
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
    position: 'relative',
  },
  badge: {
    marginTop: '0.5rem',
    display: 'inline-block',
    backgroundColor: '#3498db',
    color: 'white',
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
    fontSize: '0.85rem',
  },
};

export default DashboardEncargadaCocina;
