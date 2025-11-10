import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Reservas = () => {
  const navigate = useNavigate();
  const [tabActiva, setTabActiva] = useState('lista');
  const [eventos, setEventos] = useState([]);
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  
  const [busqueda, setBusqueda] = useState({
    cliente: '',
    fecha: ''
  });
  const [resultadosBusqueda, setResultadosBusqueda] = useState([]);

  useEffect(() => {
    cargarEventos();
  }, []);

  const cargarEventos = async () => {
    try {
      const response = await api.get('/eventos');
      const eventosFuturos = response.data.filter(e => new Date(e.fecha) >= new Date());
      setEventos(eventosFuturos);
    } catch (error) {
      console.error('Error cargando eventos:', error);
    }
  };

  const handleBuscar = async () => {
    try {
      const response = await api.get('/eventos');
      let resultados = response.data;

      if (busqueda.cliente) {
        resultados = resultados.filter(e => 
          e.nombreCliente?.toLowerCase().includes(busqueda.cliente.toLowerCase())
        );
      }

      if (busqueda.fecha) {
        resultados = resultados.filter(e => e.fecha === busqueda.fecha);
      }

      setResultadosBusqueda(resultados);
    } catch (error) {
      console.error('Error buscando eventos:', error);
    }
  };

  const handleModificar = () => {
    if (eventoSeleccionado) {
      navigate(`/eventos/editar/${eventoSeleccionado}`);
    } else {
      alert('Seleccione un evento para modificar');
    }
  };

  const handleDetalles = () => {
    if (resultadosBusqueda.length > 0 && resultadosBusqueda[0]) {
      navigate(`/eventos/editar/${resultadosBusqueda[0].idEvento}`);
    } else {
      alert('No hay resultados para mostrar detalles');
    }
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getExtrasTexto = (evento) => {
    return '[extra1], [extra 2]...';
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
        <h1 style={{ fontSize: '24px', margin: 0 }}>Reservas</h1>
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
          onClick={() => setTabActiva('lista')}
          style={{
            flex: 1,
            padding: '15px',
            background: tabActiva === 'lista' ? '#f8f8f8' : '#fff',
            border: 'none',
            borderBottom: tabActiva === 'lista' ? '3px solid #5DADE2' : 'none',
            fontSize: '16px',
            cursor: 'pointer',
            fontWeight: tabActiva === 'lista' ? 'bold' : 'normal'
          }}
        >
          Lista reservas
        </button>
        <button
          onClick={() => setTabActiva('buscar')}
          style={{
            flex: 1,
            padding: '15px',
            background: tabActiva === 'buscar' ? '#f8f8f8' : '#fff',
            border: 'none',
            borderBottom: tabActiva === 'buscar' ? '3px solid #5DADE2' : 'none',
            fontSize: '16px',
            cursor: 'pointer',
            fontWeight: tabActiva === 'buscar' ? 'bold' : 'normal'
          }}
        >
          Buscar evento
        </button>
      </div>

      {/* Contenido de Lista */}
      {tabActiva === 'lista' && (
        <div>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px' }}>
            <thead>
              <tr style={{ background: '#5DADE2', color: '#fff' }}>
                <th style={{ padding: '12px', border: '1px solid #333', width: '50px' }}></th>
                <th style={{ padding: '12px', border: '1px solid #333' }}>Cliente</th>
                <th style={{ padding: '12px', border: '1px solid #333' }}>Fecha evento</th>
                <th style={{ padding: '12px', border: '1px solid #333' }}>Asistentes</th>
                <th style={{ padding: '12px', border: '1px solid #333' }}>Menus seleccionados</th>
                <th style={{ padding: '12px', border: '1px solid #333' }}>Tipo evento</th>
                <th style={{ padding: '12px', border: '1px solid #333' }}>Extras</th>
              </tr>
            </thead>
            <tbody>
              {eventos.map((evento) => (
                <tr key={evento.idEvento}>
                  <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      checked={eventoSeleccionado === evento.idEvento}
                      onChange={() => setEventoSeleccionado(
                        eventoSeleccionado === evento.idEvento ? null : evento.idEvento
                      )}
                      style={{ width: '20px', height: '20px' }}
                    />
                  </td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                    {evento.nombreCliente || '[Nombre cliente]'}
                  </td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                    {formatearFecha(evento.fecha)}
                  </td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                    {evento.cantidadAsistentes}
                  </td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                    {evento.menu ? `[Menu entrada], [Menu principal], [Menu dulce]` : 'Sin menú'}
                  </td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                    {evento.tipoEvento || '[Tipo evento]'}
                  </td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                    {getExtrasTexto(evento)}
                  </td>
                </tr>
              ))}
              {eventos.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                    No hay reservas registradas
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
              Cancelar
            </button>
            <button
              onClick={handleModificar}
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
              Modificar
            </button>
          </div>
        </div>
      )}

      {/* Contenido de Búsqueda */}
      {tabActiva === 'buscar' && (
        <div>
          <div style={{ maxWidth: '400px', marginBottom: '30px' }}>
            <input
              type="text"
              placeholder="Cliente"
              value={busqueda.cliente}
              onChange={(e) => setBusqueda({ ...busqueda, cliente: e.target.value })}
              style={{
                width: '100%',
                padding: '10px',
                marginBottom: '15px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />

            <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <label style={{ fontSize: '14px', minWidth: '100px' }}>Fecha Evento</label>
              <input
                type="date"
                value={busqueda.fecha}
                onChange={(e) => setBusqueda({ ...busqueda, fecha: e.target.value })}
                style={{
                  flex: 1,
                  padding: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
            </div>

            <button
              onClick={handleBuscar}
              style={{
                background: '#5DADE2',
                color: '#fff',
                border: 'none',
                padding: '12px 40px',
                borderRadius: '5px',
                fontSize: '16px',
                cursor: 'pointer',
                display: 'block',
                margin: '0 auto'
              }}
            >
              Buscar
            </button>
          </div>

          {resultadosBusqueda.length > 0 && (
            <>
              <table style={{ width: '100%', maxWidth: '600px', borderCollapse: 'collapse', marginBottom: '30px' }}>
                <thead>
                  <tr style={{ background: '#5DADE2', color: '#fff' }}>
                    <th style={{ padding: '12px', border: '1px solid #333' }}>Cliente</th>
                    <th style={{ padding: '12px', border: '1px solid #333' }}>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {resultadosBusqueda.map((evento) => (
                    <tr key={evento.idEvento}>
                      <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                        {evento.nombreCliente}
                      </td>
                      <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                        {formatearFecha(evento.fecha)}
                      </td>
                    </tr>
                  ))}
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
                  Cancelar
                </button>
                <button
                  onClick={handleDetalles}
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
                  Detalles
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Reservas;
