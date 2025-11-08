import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:8080/api';

function Menus() {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    primerPlato: '',
    segundoPlato: '',
    torta: '',
  });

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    try {
      const response = await axios.get(`${API_BASE}/menus`);
      setMenus(response.data || []);
    } catch (err) {
      console.error('Error al cargar menús:', err);
      setMenus([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/menus`, formData);
      setFormData({
        nombre: '',
        primerPlato: '',
        segundoPlato: '',
        torta: '',
      });
      setShowForm(false);
      fetchMenus();
    } catch (err) {
      console.error('Error al crear menú:', err);
      alert('Error al crear menú');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este menú?')) {
      try {
        await axios.delete(`${API_BASE}/menus/${id}`);
        fetchMenus();
      } catch (err) {
        console.error('Error al eliminar menú:', err);
        alert('Error al eliminar menú');
      }
    }
  };

  if (loading) return <div style={styles.loading}>Cargando menús...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Gestión de Menús</h1>
        <button 
          onClick={() => setShowForm(!showForm)} 
          style={styles.addButton}
        >
          {showForm ? 'Cancelar' : '+ Nuevo Menú'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={styles.form}>
          <h2 style={styles.formTitle}>Crear Nuevo Menú</h2>
          <div style={styles.formGrid}>
            <input
              type="text"
              placeholder="Nombre del Menú"
              value={formData.nombre}
              onChange={(e) => setFormData({...formData, nombre: e.target.value})}
              style={styles.input}
              required
            />
            <input
              type="text"
              placeholder="Primer Plato"
              value={formData.primerPlato}
              onChange={(e) => setFormData({...formData, primerPlato: e.target.value})}
              style={styles.input}
            />
            <input
              type="text"
              placeholder="Segundo Plato"
              value={formData.segundoPlato}
              onChange={(e) => setFormData({...formData, segundoPlato: e.target.value})}
              style={styles.input}
            />
            <input
              type="text"
              placeholder="Torta"
              value={formData.torta}
              onChange={(e) => setFormData({...formData, torta: e.target.value})}
              style={styles.input}
            />
          </div>
          <button type="submit" style={styles.submitButton}>Crear Menú</button>
        </form>
      )}

      <div style={styles.menusGrid}>
        {menus.length === 0 ? (
          <p style={styles.empty}>No hay menús registrados</p>
        ) : (
          menus.map((menu) => (
            <div key={menu.idMenu} style={styles.menuCard}>
              <h3 style={styles.menuTitle}>{menu.nombre}</h3>
              <div style={styles.menuDetails}>
                {menu.primerPlato && <p><strong>Primer Plato:</strong> {menu.primerPlato}</p>}
                {menu.segundoPlato && <p><strong>Segundo Plato:</strong> {menu.segundoPlato}</p>}
                {menu.torta && <p><strong>Torta:</strong> {menu.torta}</p>}
              </div>
              <button 
                onClick={() => handleDelete(menu.idMenu)} 
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
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
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
  menusGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem',
  },
  empty: {
    textAlign: 'center',
    color: '#7f8c8d',
    padding: '3rem',
  },
  menuCard: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  menuTitle: {
    fontSize: '1.25rem',
    color: '#2c3e50',
    marginBottom: '1rem',
  },
  menuDetails: {
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

export default Menus;
