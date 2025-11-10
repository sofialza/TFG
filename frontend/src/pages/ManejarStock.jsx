import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const ManejarStock = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const puedeActualizarStock = () => {
    return user && (user.role === 'ADMINISTRADOR' || user.role === 'ENCARGADA_COCINA');
  };
  const [tabActiva, setTabActiva] = useState('actual');
  const [insumos, setInsumos] = useState([]);
  const [menus, setMenus] = useState([]);
  
  const [eventoSeleccionado, setEventoSeleccionado] = useState('');
  const [proyeccion, setProyeccion] = useState([]);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [insumosRes, menusRes] = await Promise.all([
        api.get('/insumos'),
        api.get('/menus')
      ]);
      
      setInsumos(insumosRes.data);
      setMenus(menusRes.data);
    } catch (error) {
      console.error('Error cargando datos:', error);
    }
  };

  const handleActualizarStock = async () => {
    try {
      alert('Stock actualizado exitosamente');
      cargarDatos();
    } catch (error) {
      console.error('Error actualizando stock:', error);
      alert('Error al actualizar stock');
    }
  };

  const handleSimularPedido = async () => {
    if (!eventoSeleccionado) {
      alert('Seleccione un evento primero');
      return;
    }

    try {
      const response = await api.get(`/eventos/${eventoSeleccionado}/proyeccion-consumo`);
      setProyeccion(response.data);
    } catch (error) {
      console.error('Error simulando pedido:', error);
      alert('Error al simular pedido');
    }
  };

  const handleExportarCSV = () => {
    if (proyeccion.length === 0) {
      alert('No hay datos para exportar');
      return;
    }

    const headers = [
      'Nombre Menu',
      'Nombre Insumo',
      'Cant x Persona',
      'Cantidad actual',
      'Cantidad total para el evento',
      'Proveedor',
      'Cantidad pedido'
    ];

    const rows = proyeccion.map(item => [
      item.nombreMenu || '',
      item.nombreInsumo || '',
      item.cantidadPorPersona || 0,
      item.stockActual || 0,
      item.consumoProyectado || 0,
      item.nombreProveedor || '',
      item.deficit > 0 ? item.deficit : 0
    ]);

    let csvContent = headers.join(',') + '\n';
    rows.forEach(row => {
      csvContent += row.map(cell => `"${cell}"`).join(',') + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `proyeccion_consumo_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <h1 style={{ fontSize: '24px', margin: 0 }}>Manejar Stock</h1>
          <button
            onClick={() => navigate('/')}
            style={{
              background: '#5DADE2',
              color: '#fff',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              fontSize: '14px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            ← Volver al Dashboard
          </button>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            border: '2px solid #333'
          }}></div>
          <div style={{
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            border: '2px solid #333'
          }}></div>
          <div style={{
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            border: '2px solid #5DADE2',
            background: '#5DADE2'
          }}></div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '2px solid #333', marginBottom: '30px' }}>
        <button
          onClick={() => setTabActiva('actual')}
          style={{
            flex: 1,
            padding: '15px',
            background: tabActiva === 'actual' ? '#f8f8f8' : '#fff',
            border: 'none',
            borderBottom: tabActiva === 'actual' ? '3px solid #5DADE2' : 'none',
            fontSize: '16px',
            cursor: 'pointer',
            fontWeight: tabActiva === 'actual' ? 'bold' : 'normal'
          }}
        >
          Stock Actual
        </button>
        <button
          onClick={() => setTabActiva('simular')}
          style={{
            flex: 1,
            padding: '15px',
            background: tabActiva === 'simular' ? '#f8f8f8' : '#fff',
            border: 'none',
            borderBottom: tabActiva === 'simular' ? '3px solid #5DADE2' : 'none',
            fontSize: '16px',
            cursor: 'pointer',
            fontWeight: tabActiva === 'simular' ? 'bold' : 'normal'
          }}
        >
          Simular pedido
        </button>
      </div>

      {/* Contenido Stock Actual */}
      {tabActiva === 'actual' && (
        <div>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px' }}>
            <thead>
              <tr style={{ background: '#5DADE2', color: '#fff' }}>
                <th style={{ padding: '12px', border: '1px solid #333', textAlign: 'left' }}>Nombre Insumo</th>
                <th style={{ padding: '12px', border: '1px solid #333', textAlign: 'center' }}>Stock Actual</th>
                <th style={{ padding: '12px', border: '1px solid #333', textAlign: 'center' }}>Unidad</th>
                <th style={{ padding: '12px', border: '1px solid #333', textAlign: 'center' }}>Última Actualización</th>
              </tr>
            </thead>
            <tbody>
              {insumos.length > 0 ? (
                insumos.map((insumo) => (
                  <tr key={insumo.idInsumo}>
                    <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                      {insumo.nombre}
                    </td>
                    <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>
                      {insumo.cantidadActual}
                    </td>
                    <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>
                      {insumo.unidadMedida}
                    </td>
                    <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>
                      {new Date(insumo.fechaActualizacion).toLocaleDateString('es-AR')}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                    No hay insumos registrados
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
            <button
              onClick={() => navigate('/')}
              style={{
                background: '#fff',
                color: '#333',
                border: '2px solid #ccc',
                padding: '12px 40px',
                borderRadius: '5px',
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              Volver
            </button>
            <button
              onClick={handleActualizarStock}
              disabled={!puedeActualizarStock()}
              title={!puedeActualizarStock() ? 'Acción no disponible para su perfil de usuario' : ''}
              style={{
                background: puedeActualizarStock() ? '#5DADE2' : '#ccc',
                color: '#fff',
                border: 'none',
                padding: '12px 40px',
                borderRadius: '5px',
                fontSize: '16px',
                cursor: puedeActualizarStock() ? 'pointer' : 'not-allowed'
              }}
            >
              Actualizar
            </button>
          </div>
        </div>
      )}

      {/* Contenido Simular Pedido */}
      {tabActiva === 'simular' && (
        <div>
          <div style={{ 
            maxWidth: '500px', 
            marginBottom: '30px',
            display: 'flex',
            gap: '15px',
            alignItems: 'flex-end'
          }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '14px', display: 'block', marginBottom: '5px' }}>
                Seleccionar Evento
              </label>
              <input
                type="date"
                value={eventoSeleccionado}
                onChange={(e) => setEventoSeleccionado(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
            </div>
            
            <button
              onClick={handleSimularPedido}
              style={{
                background: '#5DADE2',
                color: '#fff',
                border: 'none',
                padding: '10px 30px',
                borderRadius: '5px',
                fontSize: '16px',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              Simular pedido
            </button>
          </div>

          {proyeccion.length > 0 && (
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px' }}>
              <thead>
                <tr style={{ background: '#5DADE2', color: '#fff' }}>
                  <th style={{ padding: '12px', border: '1px solid #333' }}>Nombre Menu</th>
                  <th style={{ padding: '12px', border: '1px solid #333' }}>Nombre Insumo</th>
                  <th style={{ padding: '12px', border: '1px solid #333' }}>Cant x Persona</th>
                  <th style={{ padding: '12px', border: '1px solid #333' }}>Cantidad actual</th>
                  <th style={{ padding: '12px', border: '1px solid #333' }}>Cantidad total para el evento</th>
                  <th style={{ padding: '12px', border: '1px solid #333' }}>Proveedor</th>
                  <th style={{ padding: '12px', border: '1px solid #333' }}>Cantidad pedido</th>
                </tr>
              </thead>
              <tbody>
                {proyeccion.map((item, index) => (
                  <tr key={index}>
                    <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                      {item.nombreMenu || '[nombre menu]'}
                    </td>
                    <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                      {item.nombreInsumo}
                    </td>
                    <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                      {item.cantidadPorPersona}
                    </td>
                    <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                      {item.stockActual}
                    </td>
                    <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                      {item.consumoProyectado}
                    </td>
                    <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                      [nombre proveedor]
                    </td>
                    <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                      {item.deficit > 0 ? item.deficit : 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
            <button
              onClick={() => navigate('/')}
              style={{
                background: '#fff',
                color: '#333',
                border: '2px solid #ccc',
                padding: '12px 40px',
                borderRadius: '5px',
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              Salir
            </button>
            
            {proyeccion.length > 0 && (
              <button
                onClick={handleExportarCSV}
                style={{
                  background: '#28a745',
                  color: '#fff',
                  border: 'none',
                  padding: '12px 40px',
                  borderRadius: '5px',
                  fontSize: '16px',
                  cursor: 'pointer'
                }}
              >
                Exportar CSV
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ManejarStock;
