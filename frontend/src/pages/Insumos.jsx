import { useState, useEffect } from 'react';
import { insumosAPI } from '../services/api';

function Insumos() {
  const [insumos, setInsumos] = useState([]);
  const [alertas, setAlertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    unidadMedida: '',
    cantidadActual: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [insumosRes, alertasRes] = await Promise.all([
        insumosAPI.getAll(),
        insumosAPI.getAlertasStockBajo(),
      ]);
      setInsumos(insumosRes.data);
      setAlertas(alertasRes.data);
    } catch (err) {
      console.error('Error al cargar datos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await insumosAPI.create({
        ...formData,
        cantidadActual: parseFloat(formData.cantidadActual),
      });
      setFormData({ nombre: '', unidadMedida: '', cantidadActual: '' });
      setShowForm(false);
      fetchData();
    } catch (err) {
      console.error('Error al crear insumo:', err);
      alert('Error al crear insumo');
    }
  };

  const handleUpdateStock = async (id) => {
    const cantidad = prompt('Ingrese la nueva cantidad en stock:');
    if (cantidad !== null) {
      try {
        await insumosAPI.updateStock(id, parseFloat(cantidad));
        fetchData();
      } catch (err) {
        console.error('Error al actualizar stock:', err);
        alert('Error al actualizar stock');
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este insumo?')) {
      try {
        await insumosAPI.delete(id);
        fetchData();
      } catch (err) {
        console.error('Error al eliminar insumo:', err);
        alert('Error al eliminar insumo');
      }
    }
  };

  if (loading) return <div style={styles.loading}>Cargando insumos...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Gestión de Insumos</h1>
        <button 
          onClick={() => setShowForm(!showForm)} 
          style={styles.addButton}
        >
          {showForm ? 'Cancelar' : '+ Nuevo Insumo'}
        </button>
      </div>

      {alertas.length > 0 && (
        <div style={styles.alertsSection}>
          <h2 style={styles.alertTitle}>⚠️ Alertas de Stock Bajo ({alertas.length})</h2>
          <div style={styles.alertsGrid}>
            {alertas.map((alerta) => (
              <div key={alerta.idInsumo} style={styles.alertCard}>
                <strong>{alerta.nombre}</strong>
                <p>Stock actual: {alerta.stockActual} {alerta.unidadMedida}</p>
                <p>Consumo proyectado: {alerta.consumoProyectado} {alerta.unidadMedida}</p>
                <p style={styles.deficit}>Déficit: {alerta.deficit} {alerta.unidadMedida}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} style={styles.form}>
          <h2 style={styles.formTitle}>Crear Nuevo Insumo</h2>
          <div style={styles.formGrid}>
            <input
              type="text"
              placeholder="Nombre del Insumo"
              value={formData.nombre}
              onChange={(e) => setFormData({...formData, nombre: e.target.value})}
              style={styles.input}
              required
            />
            <input
              type="text"
              placeholder="Unidad de Medida (kg, L, unidad, etc.)"
              value={formData.unidadMedida}
              onChange={(e) => setFormData({...formData, unidadMedida: e.target.value})}
              style={styles.input}
              required
            />
            <input
              type="number"
              step="0.01"
              placeholder="Cantidad Actual"
              value={formData.cantidadActual}
              onChange={(e) => setFormData({...formData, cantidadActual: e.target.value})}
              style={styles.input}
              required
            />
          </div>
          <button type="submit" style={styles.submitButton}>Crear Insumo</button>
        </form>
      )}

      <h2 style={styles.sectionTitle}>Lista de Insumos</h2>
      <div style={styles.table}>
        <div style={styles.tableHeader}>
          <div>Nombre</div>
          <div>Cantidad</div>
          <div>Unidad</div>
          <div>Última Actualización</div>
          <div>Acciones</div>
        </div>
        {insumos.length === 0 ? (
          <p style={styles.empty}>No hay insumos registrados</p>
        ) : (
          insumos.map((insumo) => (
            <div key={insumo.idInsumo} style={styles.tableRow}>
              <div>{insumo.nombre}</div>
              <div style={{fontWeight: 'bold'}}>{insumo.cantidadActual}</div>
              <div>{insumo.unidadMedida}</div>
              <div>{insumo.fechaActualizacion ? new Date(insumo.fechaActualizacion).toLocaleDateString() : '-'}</div>
              <div style={styles.actions}>
                <button onClick={() => handleUpdateStock(insumo.idInsumo)} style={styles.actionButton}>
                  Actualizar Stock
                </button>
                <button onClick={() => handleDelete(insumo.idInsumo)} style={styles.deleteButton}>
                  Eliminar
                </button>
              </div>
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
  alertsSection: {
    backgroundColor: '#fff3cd',
    padding: '1.5rem',
    borderRadius: '8px',
    marginBottom: '2rem',
    border: '2px solid #ffc107',
  },
  alertTitle: {
    color: '#856404',
    marginBottom: '1rem',
  },
  alertsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '1rem',
  },
  alertCard: {
    backgroundColor: 'white',
    padding: '1rem',
    borderRadius: '4px',
    borderLeft: '4px solid #ffc107',
  },
  deficit: {
    color: '#e74c3c',
    fontWeight: 'bold',
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
  sectionTitle: {
    fontSize: '1.5rem',
    marginBottom: '1rem',
    color: '#2c3e50',
  },
  table: {
    backgroundColor: 'white',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  tableHeader: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr 1.5fr 2fr',
    gap: '1rem',
    padding: '1rem',
    backgroundColor: '#ecf0f1',
    fontWeight: 'bold',
  },
  tableRow: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr 1.5fr 2fr',
    gap: '1rem',
    padding: '1rem',
    borderBottom: '1px solid #ecf0f1',
    alignItems: 'center',
  },
  empty: {
    textAlign: 'center',
    color: '#7f8c8d',
    padding: '2rem',
  },
  actions: {
    display: 'flex',
    gap: '0.5rem',
  },
  actionButton: {
    backgroundColor: '#3498db',
    color: 'white',
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.875rem',
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    color: 'white',
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.875rem',
  },
};

export default Insumos;
