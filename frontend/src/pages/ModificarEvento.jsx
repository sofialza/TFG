import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

const ModificarEvento = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [formData, setFormData] = useState({
    nombreCliente: '',
    mailCliente: '',
    tipoEvento: '',
    cantidadAsistentes: '',
    fecha: '',
    itinerario: '',
    menuId: '',
    extraIds: []
  });

  const [menus, setMenus] = useState([]);
  const [extras, setExtras] = useState([]);

  useEffect(() => {
    cargarDatos();
  }, [id]);

  const cargarDatos = async () => {
    try {
      const [eventoRes, menusRes, extrasRes] = await Promise.all([
        api.get(`/eventos/${id}`),
        api.get('/menus'),
        api.get('/extras')
      ]);

      const evento = eventoRes.data;
      const eventExtraIds = evento.extras?.map(e => e.idExtra) || [];

      setFormData({
        nombreCliente: evento.nombreCliente || '',
        mailCliente: evento.mailCliente || '',
        tipoEvento: evento.tipoEvento || '',
        cantidadAsistentes: evento.cantidadAsistentes || '',
        fecha: evento.fecha || '',
        itinerario: evento.itinerario || '',
        menuId: evento.menu?.idMenu || '',
        extraIds: eventExtraIds
      });

      setMenus(menusRes.data);
      setExtras(extrasRes.data);
    } catch (error) {
      console.error('Error cargando datos:', error);
    }
  };

  const handleInputChange = ({ target: { name, value } }) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleExtra = (id) => {
    setFormData(prev => ({
      ...prev,
      extraIds: prev.extraIds.includes(id)
        ? prev.extraIds.filter(extraId => extraId !== id)
        : [...prev.extraIds, id]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const payload = {
        ...formData,
        cantidadAsistentes: Number(formData.cantidadAsistentes) || 0,
        menuId: formData.menuId ? Number(formData.menuId) : null,
        extraIds: formData.extraIds.map(Number)
      };

      await api.put(`/eventos/${id}`, payload);
      alert('Evento modificado exitosamente');
      navigate('/reservas');
    } catch (error) {
      console.error('Error modificando evento:', error);
      alert('Error al modificar el evento');
    }
  };

  const handleEliminar = async () => {
    if (window.confirm('¿Está seguro que desea eliminar este evento?')) {
      try {
        await api.delete(`/eventos/${id}`);
        alert('Evento eliminado exitosamente');
        navigate('/reservas');
      } catch (error) {
        console.error('Error eliminando evento:', error);
        alert('Error al eliminar el evento');
      }
    }
  };

  const handleCancelar = () => {
    navigate('/reservas');
  };

  const menuSeleccionado = menus.find(m => m.idMenu === Number(formData.menuId));

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <h1 style={{ fontSize: '24px', margin: 0 }}>Modificar Evento</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid #333' }}></div>
          <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid #333' }}></div>
          <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid #5DADE2', background: '#5DADE2' }}></div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
          <div>
            <h2 style={{ fontSize: '18px', marginBottom: '20px' }}>Detalles del Evento</h2>
            
            <input
              type="text"
              name="nombreCliente"
              value={formData.nombreCliente}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '10px',
                marginBottom: '15px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />

            <input
              type="email"
              name="mailCliente"
              value={formData.mailCliente}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '10px',
                marginBottom: '15px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />

            <div style={{ position: 'relative', marginBottom: '15px' }}>
              <input
                type="text"
                name="tipoEvento"
                value={formData.tipoEvento}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  paddingRight: '40px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
              <div style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: '#5DADE2',
                width: '25px',
                height: '25px',
                borderRadius: '3px'
              }}></div>
            </div>

            <input
              type="number"
              name="cantidadAsistentes"
              value={formData.cantidadAsistentes}
              onChange={handleInputChange}
              required
              min="1"
              style={{
                width: '100%',
                padding: '10px',
                marginBottom: '15px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />

            <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <label style={{ fontSize: '14px', minWidth: '100px' }}>Fecha Evento</label>
              <input
                type="date"
                name="fecha"
                value={formData.fecha}
                onChange={handleInputChange}
                required
                style={{
                  flex: 1,
                  padding: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
            </div>

            <textarea
              name="itinerario"
              placeholder="Itinerario:"
              value={formData.itinerario}
              onChange={handleInputChange}
              rows="4"
              style={{
                width: '100%',
                padding: '10px',
                marginBottom: '15px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '14px',
                resize: 'vertical'
              }}
            />
          </div>

          <div>
            <h2 style={{ fontSize: '18px', marginBottom: '20px' }}>Menú</h2>
            
            <div style={{ marginBottom: '15px' }}>
              <div style={{ position: 'relative', marginBottom: '10px' }}>
                <select
                  name="menuId"
                  value={formData.menuId}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    paddingRight: '40px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    fontSize: '14px',
                    appearance: 'none',
                    background: '#fff'
                  }}
                >
                  <option value="">Seleccionar menú</option>
                  {menus.map(menu => (
                    <option key={menu.idMenu} value={menu.idMenu}>
                      {menu.nombre}
                    </option>
                  ))}
                </select>
                <div style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: '#5DADE2',
                  width: '25px',
                  height: '25px',
                  borderRadius: '3px',
                  pointerEvents: 'none'
                }}></div>
              </div>

              {menuSeleccionado && (
                <div style={{
                  background: '#f8f8f8',
                  padding: '10px',
                  borderRadius: '4px',
                  fontSize: '13px',
                  color: '#555'
                }}>
                  <div><strong>Entrada:</strong> {menuSeleccionado.primerPlato}</div>
                  <div><strong>Principal:</strong> {menuSeleccionado.segundoPlato}</div>
                  <div><strong>Postre:</strong> {menuSeleccionado.torta}</div>
                </div>
              )}
            </div>

            <h2 style={{ fontSize: '18px', marginBottom: '15px', marginTop: '30px', fontWeight: 'bold' }}>Extras</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              {extras.map(extra => (
                <label key={extra.idExtra} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                  <input
                    type="checkbox"
                    checked={formData.extraIds.includes(extra.idExtra)}
                    onChange={() => toggleExtra(extra.idExtra)}
                    style={{ width: '18px', height: '18px' }}
                  />
                  {extra.nombre}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '20px',
          marginTop: '40px'
        }}>
          <button
            type="button"
            onClick={handleCancelar}
            style={{
              background: '#fff',
              color: '#333',
              border: '2px solid #ccc',
              padding: '12px 40px',
              borderRadius: '5px',
              fontSize: '16px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleEliminar}
            style={{
              background: '#fff',
              color: '#e74c3c',
              border: '2px solid #e74c3c',
              padding: '12px 40px',
              borderRadius: '5px',
              fontSize: '16px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Eliminar
          </button>

          <button
            type="submit"
            style={{
              background: '#5DADE2',
              color: '#fff',
              border: 'none',
              padding: '12px 40px',
              borderRadius: '5px',
              fontSize: '16px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Guardar cambios
          </button>
        </div>
      </form>
    </div>
  );
};

export default ModificarEvento;
