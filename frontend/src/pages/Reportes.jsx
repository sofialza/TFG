import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Reportes = () => {
  const navigate = useNavigate();
  const [tabActiva, setTabActiva] = useState('pendientes');
  const [comprasPendientes, setComprasPendientes] = useState([]);
  const [historico, setHistorico] = useState([]);
  const [edicionPendientes, setEdicionPendientes] = useState({});

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [pendientesRes, historicoRes] = await Promise.all([
        api.get('/ordenes-compra/pendientes'),
        api.get('/ordenes-compra/historico')
      ]);
      
      setComprasPendientes(pendientesRes.data || []);
      setHistorico(historicoRes.data || []);
      
      const ediciones = {};
      pendientesRes.data.forEach(orden => {
        if (orden.detalles) {
          orden.detalles.forEach(detalle => {
            ediciones[detalle.idOcDet] = detalle.cantidadRecibida || detalle.cantidadPedida;
          });
        }
      });
      setEdicionPendientes(ediciones);
    } catch (error) {
      console.error('Error cargando reportes:', error);
    }
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return '';
    const [anio, mes, dia] = fecha.split('-');
    return `${dia}/${mes}/${anio}`;
  };

  const handleCambiarCantidad = (idDetalle, cantidad) => {
    setEdicionPendientes(prev => ({
      ...prev,
      [idDetalle]: cantidad
    }));
  };

  const handleConfirmarRecepcion = async (idOrden, idDetalle) => {
    const orden = comprasPendientes.find(o => o.idOc === idOrden);
    if (!orden) return;

    try {
      const hoy = new Date();
      const fechaRecepcion = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;
      
      const confirmacion = {
        fechaRecepcion: fechaRecepcion,
        detalles: [{
          idDetalle: idDetalle,
          cantidadRecibida: parseFloat(edicionPendientes[idDetalle] || 0)
        }]
      };

      await api.put(`/ordenes-compra/${idOrden}/confirmar-recepcion`, confirmacion);
      alert('Recepción confirmada exitosamente');
      cargarDatos();
    } catch (error) {
      console.error('Error confirmando recepción:', error);
      alert('Error al confirmar la recepción');
    }
  };

  const exportarCSVPendientes = () => {
    if (comprasPendientes.length === 0) {
      alert('No hay datos para exportar');
      return;
    }

    const headers = [
      'Fecha Pedido',
      'Proveedor',
      'Insumo',
      'Unidad',
      'Cant. Pedida',
      'Cant. Recibida',
      'Estado'
    ];

    const rows = [];
    comprasPendientes.forEach(orden => {
      if (orden.detalles && orden.detalles.length > 0) {
        orden.detalles.forEach(detalle => {
          rows.push([
            formatearFecha(orden.fechaEmision),
            orden.proveedor?.nombre || '',
            detalle.insumo?.nombre || '',
            detalle.insumo?.unidadMedida || '',
            detalle.cantidadPedida || 0,
            edicionPendientes[detalle.idOcDet] || detalle.cantidadPedida || 0,
            orden.estado || 'Pendiente'
          ]);
        });
      }
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    const hoy = new Date();
    const fechaArchivo = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;
    link.download = `compras_pendientes_${fechaArchivo}.csv`;
    link.click();
  };

  const exportarCSVHistorico = () => {
    if (historico.length === 0) {
      alert('No hay datos para exportar');
      return;
    }

    const headers = [
      'Fecha Recepción',
      'Proveedor',
      'Insumo',
      'Unidad',
      'Cant. Pedida',
      'Cant. Recibida'
    ];

    const rows = [];
    historico.forEach(orden => {
      if (orden.detalles && orden.detalles.length > 0) {
        orden.detalles.forEach(detalle => {
          rows.push([
            formatearFecha(orden.fechaRecepcion),
            orden.proveedor?.nombre || '',
            detalle.insumo?.nombre || '',
            detalle.insumo?.unidadMedida || '',
            detalle.cantidadPedida || 0,
            detalle.cantidadRecibida || 0
          ]);
        });
      }
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    const hoy = new Date();
    const fechaArchivo = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;
    link.download = `historico_compras_${fechaArchivo}.csv`;
    link.click();
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
        <h1 style={{ fontSize: '24px', margin: 0 }}>Reportes</h1>
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
          onClick={() => setTabActiva('pendientes')}
          style={{
            flex: 1,
            padding: '15px',
            background: tabActiva === 'pendientes' ? '#f8f8f8' : '#fff',
            border: 'none',
            borderBottom: tabActiva === 'pendientes' ? '3px solid #5DADE2' : 'none',
            fontSize: '16px',
            cursor: 'pointer',
            fontWeight: tabActiva === 'pendientes' ? 'bold' : 'normal'
          }}
        >
          Compras Pendientes
        </button>
        <button
          onClick={() => setTabActiva('historico')}
          style={{
            flex: 1,
            padding: '15px',
            background: tabActiva === 'historico' ? '#f8f8f8' : '#fff',
            border: 'none',
            borderBottom: tabActiva === 'historico' ? '3px solid #5DADE2' : 'none',
            fontSize: '16px',
            cursor: 'pointer',
            fontWeight: tabActiva === 'historico' ? 'bold' : 'normal'
          }}
        >
          Histórico de Compras
        </button>
      </div>

      {/* Contenido Compras Pendientes */}
      {tabActiva === 'pendientes' && (
        <div>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px' }}>
            <thead>
              <tr style={{ background: '#5DADE2', color: '#fff' }}>
                <th style={{ padding: '12px', border: '1px solid #333' }}>Fecha Pedido</th>
                <th style={{ padding: '12px', border: '1px solid #333' }}>Proveedor</th>
                <th style={{ padding: '12px', border: '1px solid #333' }}>Insumo</th>
                <th style={{ padding: '12px', border: '1px solid #333' }}>Unidad</th>
                <th style={{ padding: '12px', border: '1px solid #333' }}>Cant. Pedida</th>
                <th style={{ padding: '12px', border: '1px solid #333' }}>Cant. Recibida</th>
                <th style={{ padding: '12px', border: '1px solid #333' }}>Estado</th>
                <th style={{ padding: '12px', border: '1px solid #333' }}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {comprasPendientes.length > 0 ? (
                comprasPendientes.map((orden) => (
                  orden.detalles && orden.detalles.map((detalle) => (
                    <tr key={`${orden.idOc}-${detalle.idOcDet}`}>
                      <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>
                        {formatearFecha(orden.fechaEmision)}
                      </td>
                      <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                        {orden.proveedor?.nombre}
                      </td>
                      <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                        {detalle.insumo?.nombre}
                      </td>
                      <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>
                        {detalle.insumo?.unidadMedida}
                      </td>
                      <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>
                        {detalle.cantidadPedida}
                      </td>
                      <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                        <input
                          type="number"
                          step="0.01"
                          value={edicionPendientes[detalle.idOcDet] || detalle.cantidadPedida}
                          onChange={(e) => handleCambiarCantidad(detalle.idOcDet, e.target.value)}
                          style={{
                            width: '100px',
                            padding: '8px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            fontSize: '14px'
                          }}
                        />
                      </td>
                      <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>
                        {orden.estado || 'Pendiente'}
                      </td>
                      <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>
                        <button
                          onClick={() => handleConfirmarRecepcion(orden.idOc, detalle.idOcDet)}
                          style={{
                            background: '#27AE60',
                            color: '#fff',
                            border: 'none',
                            padding: '8px 20px',
                            borderRadius: '4px',
                            fontSize: '14px',
                            cursor: 'pointer'
                          }}
                        >
                          Confirmar
                        </button>
                      </td>
                    </tr>
                  ))
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ padding: '40px', textAlign: 'center', color: '#666', fontSize: '16px' }}>
                    No hay compras pendientes
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
            <button
              onClick={exportarCSVPendientes}
              style={{
                background: '#5DADE2',
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
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Contenido Histórico */}
      {tabActiva === 'historico' && (
        <div>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px' }}>
            <thead>
              <tr style={{ background: '#5DADE2', color: '#fff' }}>
                <th style={{ padding: '12px', border: '1px solid #333' }}>Fecha Recepción</th>
                <th style={{ padding: '12px', border: '1px solid #333' }}>Proveedor</th>
                <th style={{ padding: '12px', border: '1px solid #333' }}>Insumo</th>
                <th style={{ padding: '12px', border: '1px solid #333' }}>Unidad</th>
                <th style={{ padding: '12px', border: '1px solid #333' }}>Cant. Pedida</th>
                <th style={{ padding: '12px', border: '1px solid #333' }}>Cant. Recibida</th>
              </tr>
            </thead>
            <tbody>
              {historico.length > 0 ? (
                historico.map((orden) => (
                  orden.detalles && orden.detalles.map((detalle) => (
                    <tr key={`${orden.idOc}-${detalle.idOcDet}`}>
                      <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>
                        {formatearFecha(orden.fechaRecepcion)}
                      </td>
                      <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                        {orden.proveedor?.nombre}
                      </td>
                      <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                        {detalle.insumo?.nombre}
                      </td>
                      <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>
                        {detalle.insumo?.unidadMedida}
                      </td>
                      <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>
                        {detalle.cantidadPedida}
                      </td>
                      <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>
                        {detalle.cantidadRecibida}
                      </td>
                    </tr>
                  ))
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: '#666', fontSize: '16px' }}>
                    No hay histórico de compras
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
            <button
              onClick={exportarCSVHistorico}
              style={{
                background: '#5DADE2',
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
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reportes;
