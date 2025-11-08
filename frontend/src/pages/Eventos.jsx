import { useState, useEffect } from 'react';
import { eventosAPI } from '../services/api';

function Eventos() {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nombreCliente: '',
    mailCliente: '',
    tipoEvento: '',
    fecha: '',
    cantidadAsistentes: '',
    itinerario: '',
  });

  useEffect(() => {
    fetchEventos();
  }, []);

  const fetchEventos = async () => {
    try {
      const response = await eventosAPI.getAll();
      setEventos(response.data);
      setError(null);
    } catch (err) {
      setError('Error al cargar eventos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await eventosAPI.create({
        ...formData,
        cantidadAsistentes: parseInt(formData.cantidadAsistentes),
      });
      setFormData({
        nombreCliente: '',
        mailCliente: '',
        tipoEvento: '',
        fecha: '',
        cantidadAsistentes: '',
        itinerario: '',
      });
      setShowForm(false);
      fetchEventos();
    } catch (err) {
      console.error('Error al crear evento:', err);
      alert('Error al crear evento');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este evento?')) {
      try {
        await eventosAPI.delete(id);
        fetchEventos();
      } catch (err) {
        console.error('Error al eliminar evento:', err);
        alert('Error al eliminar evento');
      }
    }
  };

  if (loading) return <div style={styles.loading}>Cargando eventos...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Gestión de Eventos</h1>
        <button 
          onClick={() => setShowForm(!showForm)} 
          style={styles.addButton}
        >
          {showForm ? 'Cancelar' : '+ Nuevo Evento'}
        </button>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} style={styles.form}>
          <h2 style={styles.formTitle}>Crear Nuevo Evento</h2>
          <div style={styles.formGrid}>
            <input
              type="text"
              placeholder="Nombre del Cliente"
              value={formData.nombreCliente}
              onChange={(e) => setFormData({...formData, nombreCliente: e.target.value})}
              style={styles.input}
              required
            />
            <input
              type="email"
              placeholder="Email del Cliente"
              value={formData.mailCliente}
              onChange={(e) => setFormData({...formData, mailCliente: e.target.value})}
              style={styles.input}
              required
            />
            <input
              type="text"
              placeholder="Tipo de Evento"
              value={formData.tipoEvento}
              onChange={(e) => setFormData({...formData, tipoEvento: e.target.value})}
              style={styles.input}
              required
            />
            <input
              type="date"
              value={formData.fecha}
              onChange={(e) => setFormData({...formData, fecha: e.target.value})}
              style={styles.input}
              required
            />
            <input
              type="number"
              placeholder="Cantidad de Asistentes"
              value={formData.cantidadAsistentes}
              onChange={(e) => setFormData({...formData, cantidadAsistentes: e.target.value})}
              style={styles.input}
              required
            />
            <textarea
              placeholder="Itinerario (opcional)"
              value={formData.itinerario}
              onChange={(e) => setFormData({...formData, itinerario: e.target.value})}
              style={{...styles.input, gridColumn: '1 / -1'}}
              rows="3"
            />
          </div>
          <button type="submit" style={styles.submitButton}>Crear Evento</button>
        </form>
      )}

      <div style={styles.eventosGrid}>
        {eventos.length === 0 ? (
          <p style={styles.empty}>No hay eventos registrados</p>
        ) : (
          eventos.map((evento) => (
            <div key={evento.idEvento} style={styles.eventoCard}>
              <h3 style={styles.eventoTitle}>{evento.tipoEvento}</h3>
              <div style={styles.eventoDetails}>
                <p><strong>Cliente:</strong> {evento.nombreCliente}</p>
                <p><strong>Email:</strong> {evento.mailCliente}</p>
                <p><strong>Fecha:</strong> {evento.fecha}</p>
                <p><strong>Asistentes:</strong> {evento.cantidadAsistentes}</p>
                {evento.itinerario && <p><strong>Itinerario:</strong> {evento.itinerario}</p>}
              </div>
              <button 
                onClick={() => handleDelete(evento.idEvento)} 
                style={styles.deleteButton}
              >
                Eliminar
              </button>
            </div>
          ))
        )}
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
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
  },
  title: {
    fontSize: '2rem',
    color: '#2c3e50',
  },
  loading: {
    textAlign: 'center',
    padding: '3rem',
    fontSize: '1.2rem',
  },
  error: {
    backgroundColor: '#fee',
    color: '#c00',
    padding: '1rem',
    borderRadius: '4px',
    marginBottom: '1rem',
  },
  addButton: {
    backgroundColor: '#3498db',
    color: 'white',
    padding: '0.75rem 1.5rem',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  form: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    marginBottom: '2rem',
  },
  formTitle: {
    fontSize: '1.5rem',
    marginBottom: '1.5rem',
    color: '#2c3e50',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1rem',
    marginBottom: '1rem',
  },
  input: {
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
  },
  submitButton: {
    backgroundColor: '#27ae60',
    color: 'white',
    padding: '0.75rem 2rem',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  eventosGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem',
  },
  empty: {
    textAlign: 'center',
    color: '#7f8c8d',
    padding: '3rem',
  },
  eventoCard: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  eventoTitle: {
    fontSize: '1.25rem',
    color: '#2c3e50',
    marginBottom: '1rem',
  },
  eventoDetails: {
    marginBottom: '1rem',
    color: '#555',
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    color: 'white',
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default Eventos;
