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

  const handleConfirmarRecepcion = async (idOrden) => {
    const orden = comprasPendientes.find(o => o.idOc === idOrden);
    if (!orden) return;

    try {
      const detalles = orden.detalles.map(detalle => ({
        idDetalle: detalle.idOcDet,
        cantidadRecibida: parseFloat(edicionPendientes[detalle.idOcDet] || detalle.cantidadPedida)
      }));

      const hoy = new Date();
      const fechaRecepcion = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;
      
      const confirmacion = {
        fechaRecepcion: fechaRecepcion,
        detalles: detalles
      };

      await api.put(`/ordenes-compra/${idOrden}/confirmar-recepcion`, confirmacion);
      alert('Recepción confirmada exitosamente');
      cargarDatos();
    } catch (error) {
      console.error('Error confirmando recepción:', error);
      alert('Error al confirmar la recepción');
    }
  };

  const exportarCSV = () => {
    if (historico.length === 0) {
      alert('No hay datos para exportar');
      return;
    }

    const headers = [
      'ID Orden',
      'Insumo',
      'Cantidad Pedida',
      'Cantidad Recibida',
      'Proveedor',
      'Fecha Pedido',
      'Fecha Recepción'
    ];

    const rows = [];
    historico.forEach(orden => {
      if (orden.detalles && orden.detalles.length > 0) {
        orden.detalles.forEach(detalle => {
          rows.push([
            orden.idOc || '',
            detalle.insumo?.nombre || '',
            detalle.cantidadPedida || 0,
            detalle.cantidadRecibida || 0,
            orden.proveedor?.nombre || '',
            formatearFecha(orden.fechaEmision),
            formatearFecha(orden.fechaRecepcion)
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <h1 style={{ fontSize: '24px', margin: 0 }}>Reportes</h1>
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
          {comprasPendientes.length > 0 ? (
            comprasPendientes.map((orden) => (
              <div key={orden.idOc} style={{ marginBottom: '40px' }}>
                <h3 style={{ marginBottom: '10px' }}>
                  Orden #{orden.idOc} - {orden.proveedor?.nombre} - {formatearFecha(orden.fechaEmision)}
                </h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                  <thead>
                    <tr style={{ background: '#5DADE2', color: '#fff' }}>
                      <th style={{ padding: '12px', border: '1px solid #333' }}>Insumo</th>
                      <th style={{ padding: '12px', border: '1px solid #333' }}>Cant. Solicitada</th>
                      <th style={{ padding: '12px', border: '1px solid #333' }}>Cant. Recibida</th>
                      <th style={{ padding: '12px', border: '1px solid #333' }}>Fecha Necesidad</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orden.detalles && orden.detalles.map((detalle) => (
                      <tr key={detalle.idOcDet}>
                        <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                          {detalle.insumo?.nombre}
                        </td>
                        <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>
                          {detalle.cantidadPedida} {detalle.insumo?.unidadMedida}
                        </td>
                        <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                          <input
                            type="number"
                            step="0.01"
                            value={edicionPendientes[detalle.idOcDet] || detalle.cantidadPedida}
                            onChange={(e) => handleCambiarCantidad(detalle.idOcDet, e.target.value)}
                            style={{
                              width: '100%',
                              padding: '8px',
                              border: '1px solid #ccc',
                              borderRadius: '4px',
                              fontSize: '14px'
                            }}
                          />
                        </td>
                        <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>
                          {formatearFecha(orden.fechaNecesidad)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={{ textAlign: 'right' }}>
                  <button
                    onClick={() => handleConfirmarRecepcion(orden.idOc)}
                    style={{
                      background: '#27AE60',
                      color: '#fff',
                      border: 'none',
                      padding: '10px 30px',
                      borderRadius: '5px',
                      fontSize: '16px',
                      cursor: 'pointer'
                    }}
                  >
                    Confirmar Recepción
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div style={{ padding: '40px', textAlign: 'center', color: '#666', fontSize: '16px' }}>
              No hay compras pendientes
            </div>
          )}
        </div>
      )}

      {/* Contenido Histórico */}
      {tabActiva === 'historico' && (
        <div>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px' }}>
            <thead>
              <tr style={{ background: '#5DADE2', color: '#fff' }}>
                <th style={{ padding: '12px', border: '1px solid #333' }}>ID Orden</th>
                <th style={{ padding: '12px', border: '1px solid #333' }}>Insumo</th>
                <th style={{ padding: '12px', border: '1px solid #333' }}>Cant. Pedida</th>
                <th style={{ padding: '12px', border: '1px solid #333' }}>Cant. Recibida</th>
                <th style={{ padding: '12px', border: '1px solid #333' }}>Proveedor</th>
                <th style={{ padding: '12px', border: '1px solid #333' }}>Fecha Pedido</th>
                <th style={{ padding: '12px', border: '1px solid #333' }}>Fecha Recepción</th>
              </tr>
            </thead>
            <tbody>
              {historico.length > 0 ? (
                historico.map((orden) => (
                  orden.detalles && orden.detalles.map((detalle) => (
                    <tr key={`${orden.idOc}-${detalle.idOcDet}`}>
                      <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>
                        {orden.idOc}
                      </td>
                      <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                        {detalle.insumo?.nombre}
                      </td>
                      <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>
                        {detalle.cantidadPedida} {detalle.insumo?.unidadMedida}
                      </td>
                      <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>
                        {detalle.cantidadRecibida} {detalle.insumo?.unidadMedida}
                      </td>
                      <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                        {orden.proveedor?.nombre}
                      </td>
                      <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>
                        {formatearFecha(orden.fechaEmision)}
                      </td>
                      <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>
                        {formatearFecha(orden.fechaRecepcion)}
                      </td>
                    </tr>
                  ))
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                    No hay histórico de compras
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div style={{ textAlign: 'center' }}>
            <button
              onClick={exportarCSV}
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
          </div>
        </div>
      )}
    </div>
  );
};

export default Reportes;
