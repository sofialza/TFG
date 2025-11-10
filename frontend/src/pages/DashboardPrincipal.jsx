import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const DashboardPrincipal = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [proximosEventos, setProximosEventos] = useState([]);
  const [alertasStock, setAlertasStock] = useState([]);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [eventosRes, alertasRes] = await Promise.all([
        api.get('/eventos'),
        api.get('/insumos/alertas-stock-bajo')
      ]);

      const eventos = eventosRes.data;
      const ahora = new Date();
      const proximos = eventos
        .filter(e => new Date(e.fecha) > ahora)
        .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
        .slice(0, 3);

      setProximosEventos(proximos);
      setAlertasStock(alertasRes.data);
    } catch (error) {
      console.error('Error cargando datos:', error);
    }
  };

  const tienePermiso = (accion) => {
    if (!user) return false;
    
    const permisos = {
      'ADMINISTRADOR': ['eventos', 'stock', 'reservas', 'reportes'],
      'ENCARGADA_COCINA': ['stock', 'reportes'],
      'ORGANIZADOR_EVENTOS': ['eventos', 'reservas', 'reportes']
    };

    return permisos[user.role]?.includes(accion) || false;
  };

  const handleNavegar = (ruta, permiso) => {
    if (tienePermiso(permiso)) {
      navigate(ruta);
    }
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '40px'
      }}>
        <h1 style={{ 
          fontSize: '28px', 
          fontWeight: 'bold', 
          color: '#333',
          margin: 0
        }}>
          SAVEUR EVENTOS
        </h1>
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

      {/* Contenido principal */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '40px',
        alignItems: 'start'
      }}>
        {/* Columna izquierda - Alertas */}
        <div style={{
          border: '2px solid #333',
          padding: '20px',
          minHeight: '300px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '20px'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: '#fff',
              border: '2px solid #e74c3c',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ color: '#e74c3c', fontSize: '24px', fontWeight: 'bold' }}>!</span>
            </div>
            <h2 style={{ 
              fontSize: '18px', 
              margin: 0,
              textDecoration: 'underline'
            }}>
              Alerta Stock!!
            </h2>
          </div>

          {/* Tabla de próximos eventos */}
          {proximosEventos.length > 0 ? (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#5DADE2', color: '#fff' }}>
                  <th style={{ padding: '10px', border: '1px solid #333' }}>Cliente</th>
                  <th style={{ padding: '10px', border: '1px solid #333' }}>Fecha próximo evento</th>
                </tr>
              </thead>
              <tbody>
                {proximosEventos.map((evento) => (
                  <tr key={evento.idEvento}>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                      {evento.nombreCliente || 'Sin nombre'}
                    </td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                      {formatearFecha(evento.fecha)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ color: '#666', textAlign: 'center', marginTop: '20px' }}>
              No hay eventos próximos
            </p>
          )}

          {/* Botón Actualizar Stock */}
          <div style={{ textAlign: 'center', marginTop: '30px' }}>
            <button
              onClick={() => handleNavegar('/stock', 'stock')}
              disabled={!tienePermiso('stock')}
              title={!tienePermiso('stock') ? 'Acción no disponible para su perfil de usuario' : ''}
              style={{
                background: tienePermiso('stock') ? '#5DADE2' : '#ccc',
                color: '#fff',
                border: 'none',
                padding: '12px 40px',
                borderRadius: '5px',
                fontSize: '16px',
                cursor: tienePermiso('stock') ? 'pointer' : 'not-allowed',
                fontWeight: 'bold'
              }}
            >
              Actualizar Stock
            </button>
          </div>
        </div>

        {/* Columna derecha - Botones principales */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <button
            onClick={() => handleNavegar('/eventos/nuevo', 'eventos')}
            disabled={!tienePermiso('eventos')}
            title={!tienePermiso('eventos') ? 'Acción no disponible para su perfil de usuario' : ''}
            style={{
              background: tienePermiso('eventos') ? '#5DADE2' : '#ccc',
              color: '#fff',
              border: 'none',
              padding: '20px',
              borderRadius: '8px',
              fontSize: '20px',
              cursor: tienePermiso('eventos') ? 'pointer' : 'not-allowed',
              fontWeight: 'bold',
              width: '100%'
            }}
          >
            Nuevo Evento
          </button>

          <button
            onClick={() => handleNavegar('/stock', 'stock')}
            disabled={!tienePermiso('stock')}
            title={!tienePermiso('stock') ? 'Acción no disponible para su perfil de usuario' : ''}
            style={{
              background: tienePermiso('stock') ? '#5DADE2' : '#ccc',
              color: '#fff',
              border: 'none',
              padding: '20px',
              borderRadius: '8px',
              fontSize: '20px',
              cursor: tienePermiso('stock') ? 'pointer' : 'not-allowed',
              fontWeight: 'bold',
              width: '100%'
            }}
          >
            Manejar Stock
          </button>

          <button
            onClick={() => handleNavegar('/reservas', 'reservas')}
            disabled={!tienePermiso('reservas')}
            title={!tienePermiso('reservas') ? 'Acción no disponible para su perfil de usuario' : ''}
            style={{
              background: tienePermiso('reservas') ? '#5DADE2' : '#ccc',
              color: '#fff',
              border: 'none',
              padding: '20px',
              borderRadius: '8px',
              fontSize: '20px',
              cursor: tienePermiso('reservas') ? 'pointer' : 'not-allowed',
              fontWeight: 'bold',
              width: '100%'
            }}
          >
            Reservas
          </button>

          <button
            onClick={() => handleNavegar('/reportes', 'reportes')}
            disabled={!tienePermiso('reportes')}
            title={!tienePermiso('reportes') ? 'Acción no disponible para su perfil de usuario' : ''}
            style={{
              background: tienePermiso('reportes') ? '#5DADE2' : '#ccc',
              color: '#fff',
              border: 'none',
              padding: '20px',
              borderRadius: '8px',
              fontSize: '20px',
              cursor: tienePermiso('reportes') ? 'pointer' : 'not-allowed',
              fontWeight: 'bold',
              width: '100%'
            }}
          >
            Reportes
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPrincipal;
