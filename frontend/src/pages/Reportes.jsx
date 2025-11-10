import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Reportes = () => {
  const navigate = useNavigate();
  const [tabActiva, setTabActiva] = useState('pendientes');
  const [comprasPendientes, setComprasPendientes] = useState([]);
  const [historico, setHistorico] = useState([]);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [pendientesRes, todasRes] = await Promise.all([
        api.get('/ordenes-compra/pendientes'),
        api.get('/ordenes-compra')
      ]);
      
      setComprasPendientes(pendientesRes.data || []);
      const completadas = todasRes.data.filter(o => o.estado === 'APROBADA') || [];
      setHistorico(completadas);
    } catch (error) {
      console.error('Error cargando reportes:', error);
    }
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return '';
    return new Date(fecha).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const exportarCSV = () => {
    if (historico.length === 0) {
      alert('No hay datos para exportar');
      return;
    }

    const headers = ['ID', 'Proveedor', 'Fecha de compra', 'Insumos', 'Cantidad', 'Costo total'];
    const rows = historico.map(orden => [
      orden.idOrdenCompra || '',
      orden.proveedor?.nombre || '[proveedor]',
      formatearFecha(orden.fechaSolicitud),
      '[Insumos]',
      '[xx]',
      '[xx.xx]'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `historico_compras_${new Date().toISOString().split('T')[0]}.csv`;
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
          Historico
        </button>
      </div>

      {/* Contenido Compras Pendientes */}
      {tabActiva === 'pendientes' && (
        <div>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px' }}>
            <thead>
              <tr style={{ background: '#5DADE2', color: '#fff' }}>
                <th style={{ padding: '12px', border: '1px solid #333' }}>ID</th>
                <th style={{ padding: '12px', border: '1px solid #333' }}>Insumo</th>
                <th style={{ padding: '12px', border: '1px solid #333' }}>Proveedor</th>
                <th style={{ padding: '12px', border: '1px solid #333' }}>Cantidad</th>
                <th style={{ padding: '12px', border: '1px solid #333' }}>Fecha Solicitad</th>
                <th style={{ padding: '12px', border: '1px solid #333' }}>Fecha Necesidad</th>
                <th style={{ padding: '12px', border: '1px solid #333' }}>Estado</th>
              </tr>
            </thead>
            <tbody>
              {comprasPendientes.map((orden) => (
                <tr key={orden.idOrdenCompra}>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                    {orden.idOrdenCompra}
                  </td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                    [Insumo]
                  </td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                    {orden.proveedor?.nombre || '[proveedor]'}
                  </td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                    [xxxx]
                  </td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                    {formatearFecha(orden.fechaSolicitud)}
                  </td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                    {formatearFecha(orden.fechaNecesidad)}
                  </td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                    {orden.estado || '[estado]'}
                  </td>
                </tr>
              ))}
              {comprasPendientes.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                    No hay compras pendientes
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Contenido Histórico */}
      {tabActiva === 'historico' && (
        <div>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px' }}>
            <thead>
              <tr style={{ background: '#5DADE2', color: '#fff' }}>
                <th style={{ padding: '12px', border: '1px solid #333' }}>ID</th>
                <th style={{ padding: '12px', border: '1px solid #333' }}>Proveedor</th>
                <th style={{ padding: '12px', border: '1px solid #333' }}>Fecha de compra</th>
                <th style={{ padding: '12px', border: '1px solid #333' }}>Insumos</th>
                <th style={{ padding: '12px', border: '1px solid #333' }}>Cantidad</th>
                <th style={{ padding: '12px', border: '1px solid #333' }}>Costo total</th>
              </tr>
            </thead>
            <tbody>
              {historico.map((orden) => (
                <tr key={orden.idOrdenCompra}>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                    {orden.idOrdenCompra}
                  </td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                    {orden.proveedor?.nombre || '[proveedor]'}
                  </td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                    {formatearFecha(orden.fechaSolicitud)}
                  </td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                    [Insumos]
                  </td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                    [xx]
                  </td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                    [xx.xx]
                  </td>
                </tr>
              ))}
              {historico.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
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
