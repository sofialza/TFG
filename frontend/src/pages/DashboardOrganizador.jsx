import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventosAPI } from '../services/api';
import axios from 'axios';

const API_BASE = 'http://localhost:8080/api';

function DashboardOrganizador() {
  const [eventos, setEventos] = useState([]);
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventosRes, menusRes] = await Promise.all([
          eventosAPI.getAll(),
          axios.get(`${API_BASE}/menus`),
        ]);

        setEventos(eventosRes.data);
        setMenus(menusRes.data);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const eventosProximos = eventos
    .filter(e => new Date(e.fecha) >= new Date())
    .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
    .slice(0, 5);

  if (loading) {
    return <div style={styles.loading}>Cargando...</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Dashboard - Organizador de Eventos</h1>
      <p style={styles.subtitle}>Planificación y contacto con clientes</p>

      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <h3 style={styles.statTitle}>Eventos Totales</h3>
          <p style={styles.statValue}>{eventos.length}</p>
          <Link to="/eventos" style={styles.statLink}>Ver todos →</Link>
        </div>

        <div style={styles.statCard}>
          <h3 style={styles.statTitle}>Eventos Próximos</h3>
          <p style={styles.statValue}>{eventosProximos.length}</p>
        </div>

        <div style={styles.statCard}>
          <h3 style={styles.statTitle}>Menús Disponibles</h3>
          <p style={styles.statValue}>{menus.length}</p>
          <Link to="/menus" style={styles.statLink}>Ver menús →</Link>
        </div>
      </div>

      <div style={styles.eventosSection}>
        <h2 style={styles.sectionTitle}>📅 Próximos Eventos</h2>
        {eventosProximos.length === 0 ? (
          <div style={styles.noEvents}>
            No hay eventos próximos programados
          </div>
        ) : (
          <div style={styles.eventsList}>
            {eventosProximos.map((evento) => (
              <div key={evento.idEvento} style={styles.eventoCard}>
                <h3>{evento.nombreCliente}</h3>
                <p style={styles.eventoDate}>
                  📅 {new Date(evento.fecha).toLocaleDateString('es-AR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <p style={styles.eventoInfo}>
                  👥 {evento.cantidadAsistentes} asistentes
                </p>
                <p style={styles.eventoInfo}>
                  📍 {evento.lugar}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={styles.sections}>
        <h2 style={styles.sectionTitle}>Acciones Rápidas</h2>
        <div style={styles.actionGrid}>
          <Link to="/eventos" style={styles.actionCard}>
            <h3>🎉 Crear Nuevo Evento</h3>
            <p>Planificar evento para cliente</p>
          </Link>
          <Link to="/menus" style={styles.actionCard}>
            <h3>🍽️ Consultar Menús</h3>
            <p>Ver opciones disponibles</p>
          </Link>
          <Link to="/insumos" style={styles.actionCard}>
            <h3>📦 Verificar Disponibilidad</h3>
            <p>Consultar stock de insumos</p>
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
  eventosSection: {
    marginBottom: '3rem',
  },
  sectionTitle: {
    fontSize: '1.5rem',
    color: '#2c3e50',
    marginBottom: '1.5rem',
  },
  noEvents: {
    backgroundColor: '#ecf0f1',
    padding: '2rem',
    borderRadius: '8px',
    textAlign: 'center',
    color: '#7f8c8d',
  },
  eventsList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1rem',
  },
  eventoCard: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    borderLeft: '4px solid #3498db',
  },
  eventoDate: {
    color: '#3498db',
    fontWeight: '600',
    margin: '0.5rem 0',
    textTransform: 'capitalize',
  },
  eventoInfo: {
    color: '#555',
    margin: '0.25rem 0',
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
  },
};

export default DashboardOrganizador;
