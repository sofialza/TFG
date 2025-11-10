import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Reservas = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const puedeEditarReservas = () => {
    return user && (user.role === 'ADMINISTRADOR' || user.role === 'ORGANIZADOR_EVENTOS');
  };
  const [eventos, setEventos] = useState([]);
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  
  const [filtros, setFiltros] = useState({
    cliente: '',
    fecha: ''
  });

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

  const eventosFiltrados = eventos.filter(evento => {
    const coincideCliente = !filtros.cliente || 
      evento.nombreCliente?.toLowerCase().includes(filtros.cliente.toLowerCase());
    const coincideFecha = !filtros.fecha || evento.fecha === filtros.fecha;
    return coincideCliente && coincideFecha;
  });

  const handleModificar = () => {
    if (eventoSeleccionado) {
      navigate(`/eventos/editar/${eventoSeleccionado}`);
    } else {
      alert('Seleccione un evento para modificar');
    }
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return '';
    const [anio, mes, dia] = fecha.split('-');
    return `${dia}/${mes}/${anio}`;
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

      {/* Filtros de Búsqueda */}
      <div style={{ 
        display: 'flex', 
        gap: '15px', 
        marginBottom: '20px',
        maxWidth: '600px'
      }}>
        <input
          type="text"
          placeholder="Buscar por cliente"
          value={filtros.cliente}
          onChange={(e) => setFiltros({ ...filtros, cliente: e.target.value })}
          style={{
            flex: 1,
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '14px'
          }}
        />
        <input
          type="date"
          value={filtros.fecha}
          onChange={(e) => setFiltros({ ...filtros, fecha: e.target.value })}
          style={{
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '14px'
          }}
          placeholder="Fecha"
        />
        {(filtros.cliente || filtros.fecha) && (
          <button
            onClick={() => setFiltros({ cliente: '', fecha: '' })}
            style={{
              padding: '10px 20px',
              background: '#f5f5f5',
              border: '1px solid #ccc',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Limpiar
          </button>
        )}
      </div>

      {/* Tabla de Reservas */}
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
              {eventosFiltrados.map((evento) => (
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
                    {evento.menu ? evento.menu.nombre : 'Sin menú'}
                  </td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                    {evento.tipoEvento || '[Tipo evento]'}
                  </td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                    {getExtrasTexto(evento)}
                  </td>
                </tr>
              ))}
              {eventosFiltrados.length === 0 && (
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
              Volver
            </button>
            <button
              onClick={handleModificar}
              disabled={!puedeEditarReservas()}
              title={!puedeEditarReservas() ? 'Acción no disponible para su perfil de usuario' : ''}
              style={{
                background: puedeEditarReservas() ? '#5DADE2' : '#ccc',
                color: '#fff',
                border: 'none',
                padding: '12px 40px',
                borderRadius: '5px',
                fontSize: '16px',
                cursor: puedeEditarReservas() ? 'pointer' : 'not-allowed'
              }}
            >
              Modificar
            </button>
          </div>
        </div>
    </div>
  );
};

export default Reservas;
