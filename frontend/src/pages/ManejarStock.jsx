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
  const [menus, setMenus] = useState([]);
  const [menuSeleccionado, setMenuSeleccionado] = useState('');
  const [insumosMenu, setInsumosMenu] = useState([]);
  const [insumosEditados, setInsumosEditados] = useState({});
  
  const [eventos, setEventos] = useState([]);
  const [eventoSeleccionado, setEventoSeleccionado] = useState('');
  const [proyeccion, setProyeccion] = useState([]);

  useEffect(() => {
    cargarDatos();
  }, []);

  useEffect(() => {
    if (menuSeleccionado) {
      cargarInsumosMenu();
    }
  }, [menuSeleccionado]);

  const cargarDatos = async () => {
    try {
      const [menusRes, eventosRes] = await Promise.all([
        api.get('/menus'),
        api.get('/eventos')
      ]);
      
      setMenus(menusRes.data);
      setEventos(eventosRes.data);
      
      if (menusRes.data.length > 0) {
        setMenuSeleccionado(menusRes.data[0].idMenu);
      }
    } catch (error) {
      console.error('Error cargando datos:', error);
    }
  };

  const cargarInsumosMenu = async () => {
    try {
      const menuResponse = await api.get(`/menus/${menuSeleccionado}`);
      const menu = menuResponse.data;
      
      if (menu.menuInsumos && menu.menuInsumos.length > 0) {
        const insumosData = menu.menuInsumos.map((mi) => ({
          ...mi.insumo,
          cantidadPorPersona: mi.cantidadPorPersona,
          nombreMenu: menu.nombre
        }));
        
        setInsumosMenu(insumosData);
        
        // Inicializar valores editables
        const editados = {};
        insumosData.forEach(insumo => {
          editados[insumo.idInsumo] = {
            cantidadActual: insumo.cantidadActual,
            fechaActualizacion: new Date(insumo.fechaActualizacion).toISOString().split('T')[0]
          };
        });
        setInsumosEditados(editados);
      } else {
        setInsumosMenu([]);
        setInsumosEditados({});
      }
    } catch (error) {
      console.error('Error cargando insumos del menú:', error);
      setInsumosMenu([]);
    }
  };

  const handleCambioInsumo = (idInsumo, campo, valor) => {
    setInsumosEditados(prev => ({
      ...prev,
      [idInsumo]: {
        ...prev[idInsumo],
        [campo]: valor
      }
    }));
  };

  const handleActualizarStock = async () => {
    if (!puedeActualizarStock()) {
      alert('No tiene permisos para actualizar el stock');
      return;
    }

    try {
      const actualizaciones = Object.entries(insumosEditados).map(async ([idInsumo, datos]) => {
        await api.put(`/insumos/${idInsumo}`, {
          cantidadActual: parseFloat(datos.cantidadActual),
          fechaActualizacion: datos.fechaActualizacion
        });
      });

      await Promise.all(actualizaciones);
      alert('Stock actualizado exitosamente');
      cargarInsumosMenu();
    } catch (error) {
      console.error('Error actualizando stock:', error);
      alert('Error al actualizar stock');
    }
  };

  const handleCancelar = () => {
    cargarInsumosMenu();
  };

  const handleCancelarSimulacion = () => {
    setProyeccion([]);
    setEventoSeleccionado('');
  };

  const handleSimularPedido = async () => {
    if (!eventoSeleccionado) {
      alert('Seleccione un evento primero');
      return;
    }

    try {
      const response = await api.get(`/eventos/${eventoSeleccionado}/proyeccion-consumo`);
      const proyeccionData = response.data;
      
      // Obtener el evento para tener el nombre del menú
      const eventoRes = await api.get(`/eventos/${eventoSeleccionado}`);
      const evento = eventoRes.data;
      const menuRes = await api.get(`/menus/${evento.idMenu}`);
      const nombreMenu = menuRes.data.nombre;
      
      // Enriquecer con proveedores para cada insumo
      const proyeccionEnriquecida = await Promise.all(
        proyeccionData.map(async (item) => {
          try {
            const insumoRes = await api.get(`/insumos/${item.idInsumo}`);
            const insumo = insumoRes.data;
            const proveedor = insumo.provInsumos && insumo.provInsumos.length > 0
              ? insumo.provInsumos[0].proveedor?.nombre || 'N/A'
              : 'N/A';
            
            return {
              ...item,
              nombreMenu: nombreMenu,
              nombreProveedor: proveedor
            };
          } catch (error) {
            return {
              ...item,
              nombreMenu: nombreMenu,
              nombreProveedor: 'N/A'
            };
          }
        })
      );
      
      setProyeccion(proyeccionEnriquecida);
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
      item.nombreProveedor || 'N/A',
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

  const handleGenerarOrden = async () => {
    if (!eventoSeleccionado) {
      alert('Debe seleccionar un evento primero');
      return;
    }

    if (proyeccion.length === 0) {
      alert('Debe simular el pedido primero');
      return;
    }

    const itemsConDeficit = proyeccion.filter(item => item.deficit > 0);
    
    if (itemsConDeficit.length === 0) {
      alert('No hay insumos con déficit para generar una orden de compra');
      return;
    }

    try {
      const items = await Promise.all(itemsConDeficit.map(async (item) => {
        const insumoRes = await api.get(`/insumos/${item.idInsumo}`);
        const insumo = insumoRes.data;
        
        let idProveedor = null;
        if (insumo.provInsumos && insumo.provInsumos.length > 0) {
          idProveedor = insumo.provInsumos[0].proveedor?.idProveedor || null;
        }

        if (!idProveedor) {
          throw new Error(`El insumo "${item.nombreInsumo}" no tiene proveedor asignado`);
        }

        return {
          idInsumo: item.idInsumo,
          cantidad: item.deficit,
          idProveedor: idProveedor
        };
      }));

      const request = {
        idEvento: parseInt(eventoSeleccionado),
        items: items
      };

      await api.post('/ordenes-compra/generar-desde-proyeccion', request);
      alert('Orden de compra generada exitosamente');
      setProyeccion([]);
      setEventoSeleccionado('');
    } catch (error) {
      console.error('Error generando orden de compra:', error);
      alert(error.message || 'Error al generar orden de compra');
    }
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return '';
    const date = new Date(fecha);
    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const anio = date.getFullYear();
    return `${dia}/${mes}/${anio}`;
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignments: 'center',
        marginBottom: '30px'
      }}>
        <h1 style={{ fontSize: '24px', margin: 0 }}>Manejar Stock</h1>
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
          {/* Selector de Menú */}
          <div style={{ marginBottom: '30px', maxWidth: '400px' }}>
            <label style={{ 
              fontSize: '16px', 
              fontWeight: 'bold', 
              display: 'block', 
              marginBottom: '10px' 
            }}>
              Menú
            </label>
            <select
              value={menuSeleccionado}
              onChange={(e) => setMenuSeleccionado(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '14px',
                background: '#fff'
              }}
            >
              <option value="">Selecciona Menú</option>
              {menus.map(menu => (
                <option key={menu.idMenu} value={menu.idMenu}>
                  {menu.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Tabla de Insumos */}
          {insumosMenu.length > 0 ? (
            <>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px' }}>
                <thead>
                  <tr style={{ background: '#5DADE2', color: '#fff' }}>
                    <th style={{ padding: '12px', border: '1px solid #333' }}>Nombre del Menu</th>
                    <th style={{ padding: '12px', border: '1px solid #333' }}>Nombre Insumo</th>
                    <th style={{ padding: '12px', border: '1px solid #333' }}>Cant x Persona</th>
                    <th style={{ padding: '12px', border: '1px solid #333' }}>Stock Actual</th>
                    <th style={{ padding: '12px', border: '1px solid #333' }}>Fecha Actualización</th>
                    <th style={{ padding: '12px', border: '1px solid #333' }}>Nombre Proveedor</th>
                  </tr>
                </thead>
                <tbody>
                  {insumosMenu.map((insumo) => {
                    const proveedor = insumo.provInsumos && insumo.provInsumos.length > 0 
                      ? insumo.provInsumos[0].proveedor?.nombre || 'N/A'
                      : 'N/A';
                    
                    return (
                      <tr key={insumo.idInsumo}>
                        <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                          {insumo.nombreMenu}
                        </td>
                        <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                          {insumo.nombre}
                        </td>
                        <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>
                          {insumo.cantidadPorPersona} {insumo.unidadMedida}
                        </td>
                        <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                          <input
                            type="number"
                            step="0.01"
                            value={insumosEditados[insumo.idInsumo]?.cantidadActual || 0}
                            onChange={(e) => handleCambioInsumo(insumo.idInsumo, 'cantidadActual', e.target.value)}
                            disabled={!puedeActualizarStock()}
                            style={{
                              width: '100%',
                              padding: '8px',
                              border: '1px solid #ccc',
                              borderRadius: '4px',
                              fontSize: '14px'
                            }}
                          />
                        </td>
                        <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                          <input
                            type="date"
                            value={insumosEditados[insumo.idInsumo]?.fechaActualizacion || ''}
                            onChange={(e) => handleCambioInsumo(insumo.idInsumo, 'fechaActualizacion', e.target.value)}
                            disabled={!puedeActualizarStock()}
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
                          {proveedor}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '20px' }}>
                <button
                  onClick={handleCancelar}
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
            </>
          ) : (
            <div style={{ 
              padding: '40px', 
              textAlign: 'center', 
              color: '#666',
              fontSize: '16px'
            }}>
              {menuSeleccionado ? 'Este menú no tiene insumos asignados' : 'Seleccione un menú para ver sus insumos'}
            </div>
          )}
        </div>
      )}

      {/* Contenido Simular Pedido */}
      {tabActiva === 'simular' && (
        <div>
          <div style={{ 
            marginBottom: '30px',
            display: 'flex',
            gap: '15px',
            alignItems: 'flex-end',
            maxWidth: '600px'
          }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '14px', display: 'block', marginBottom: '5px' }}>
                Seleccionar Evento
              </label>
              <select
                value={eventoSeleccionado}
                onChange={(e) => setEventoSeleccionado(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '14px',
                  background: '#fff'
                }}
              >
                <option value="">dd/mm/aaaa</option>
                {eventos.map(evento => (
                  <option key={evento.idEvento} value={evento.idEvento}>
                    {formatearFecha(evento.fecha)} - {evento.nombreCliente}
                  </option>
                ))}
              </select>
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
            <>
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
                        {item.nombreMenu}
                      </td>
                      <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                        {item.nombreInsumo}
                      </td>
                      <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>
                        {item.cantidadPorPersona}
                      </td>
                      <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>
                        {item.stockActual}
                      </td>
                      <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>
                        {item.consumoProyectado}
                      </td>
                      <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>
                        {item.nombreProveedor || 'N/A'}
                      </td>
                      <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>
                        {item.deficit > 0 ? item.deficit : 0}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                <button
                  onClick={handleGenerarOrden}
                  style={{
                    background: '#27AE60',
                    color: '#fff',
                    border: 'none',
                    padding: '12px 40px',
                    borderRadius: '5px',
                    fontSize: '16px',
                    cursor: 'pointer'
                  }}
                >
                  Generar Orden de Compra
                </button>
                
                <button
                  onClick={handleExportarCSV}
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
                  onClick={handleCancelarSimulacion}
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
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ManejarStock;
