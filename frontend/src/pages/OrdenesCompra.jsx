import { useState, useEffect } from 'react';
import { ordenesCompraAPI } from '../services/api';

function OrdenesCompra() {
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrdenes();
  }, []);

  const fetchOrdenes = async () => {
    try {
      const response = await ordenesCompraAPI.getAll();
      setOrdenes(response.data);
    } catch (err) {
      console.error('Error al cargar órdenes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeEstado = async (id, estado) => {
    try {
      await ordenesCompraAPI.updateEstado(id, estado);
      fetchOrdenes();
    } catch (err) {
      console.error('Error al actualizar estado:', err);
      alert('Error al actualizar estado');
    }
  };

  if (loading) return <div style={styles.loading}>Cargando órdenes de compra...</div>;

  const ordenesPendientes = ordenes.filter(o => o.estado === 'PENDIENTE');
  const ordenesOtras = ordenes.filter(o => o.estado !== 'PENDIENTE');

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Órdenes de Compra</h1>

      {ordenesPendientes.length > 0 && (
        <>
          <h2 style={styles.sectionTitle}>Pendientes ({ordenesPendientes.length})</h2>
          <div style={styles.ordenesGrid}>
            {ordenesPendientes.map((orden) => (
              <OrdenCard key={orden.idOc} orden={orden} onChangeEstado={handleChangeEstado} />
            ))}
          </div>
        </>
      )}

      <h2 style={styles.sectionTitle}>Todas las Órdenes</h2>
      {ordenes.length === 0 ? (
        <p style={styles.empty}>No hay órdenes de compra registradas</p>
      ) : (
        <div style={styles.ordenesGrid}>
          {ordenesOtras.map((orden) => (
            <OrdenCard key={orden.idOc} orden={orden} onChangeEstado={handleChangeEstado} />
          ))}
        </div>
      )}
    </div>
  );
}

function OrdenCard({ orden, onChangeEstado }) {
  const getEstadoStyle = (estado) => {
    const colors = {
      PENDIENTE: '#ffc107',
      PROCESANDO: '#3498db',
      COMPLETADA: '#27ae60',
      CANCELADA: '#e74c3c',
    };
    return { backgroundColor: colors[estado] || '#95a5a6', color: 'white' };
  };

  return (
    <div style={styles.ordenCard}>
      <div style={styles.ordenHeader}>
        <h3 style={styles.ordenId}>Orden #{orden.idOc}</h3>
        <span style={{...styles.badge, ...getEstadoStyle(orden.estado)}}>
          {orden.estado}
        </span>
      </div>
      <div style={styles.ordenDetails}>
        <p><strong>Fecha Emisión:</strong> {orden.fechaEmision}</p>
        {orden.fechaNecesidad && <p><strong>Fecha Necesidad:</strong> {orden.fechaNecesidad}</p>}
        {orden.total && <p><strong>Total:</strong> ${orden.total.toFixed(2)}</p>}
      </div>
      <div style={styles.actions}>
        <select 
          value={orden.estado} 
          onChange={(e) => onChangeEstado(orden.idOc, e.target.value)}
          style={styles.select}
        >
          <option value="PENDIENTE">Pendiente</option>
          <option value="PROCESANDO">Procesando</option>
          <option value="COMPLETADA">Completada</option>
          <option value="CANCELADA">Cancelada</option>
        </select>
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
    fontSize: '2rem',
    color: '#2c3e50',
    marginBottom: '2rem',
  },
  loading: {
    textAlign: 'center',
    padding: '3rem',
    fontSize: '1.2rem',
  },
  sectionTitle: {
    fontSize: '1.5rem',
    color: '#2c3e50',
    marginTop: '2rem',
    marginBottom: '1rem',
  },
  empty: {
    textAlign: 'center',
    color: '#7f8c8d',
    padding: '3rem',
  },
  ordenesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem',
  },
  ordenCard: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  ordenHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  ordenId: {
    fontSize: '1.25rem',
    color: '#2c3e50',
    margin: 0,
  },
  badge: {
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
    fontSize: '0.875rem',
    fontWeight: 'bold',
  },
  ordenDetails: {
    marginBottom: '1rem',
    color: '#555',
  },
  actions: {
    marginTop: '1rem',
  },
  select: {
    width: '100%',
    padding: '0.5rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
  },
};

export default OrdenesCompra;
