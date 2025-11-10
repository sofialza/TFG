import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const CrearEvento = () => {
  const navigate = useNavigate();
  
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
    cargarMenus();
    cargarExtras();
  }, []);

  const cargarMenus = async () => {
    try {
      const response = await api.get('/menus');
      setMenus(response.data);
    } catch (error) {
      console.error('Error cargando menús:', error);
    }
  };

  const cargarExtras = async () => {
    try {
      const response = await api.get('/extras');
      setExtras(response.data);
    } catch (error) {
      console.error('Error cargando extras:', error);
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

      await api.post('/eventos', payload);
      alert('Evento creado exitosamente');
      navigate('/');
    } catch (error) {
      console.error('Error creando evento:', error);
      alert('Error al crear el evento');
    }
  };

  const handleCancelar = () => {
    navigate('/');
  };

  const menuSeleccionado = menus.find(m => m.idMenu === Number(formData.menuId));

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <h1 style={{ fontSize: '24px', margin: 0 }}>Crear Evento</h1>
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

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
          {/* Columna izquierda - Detalles del Evento */}
          <div>
            <h2 style={{ fontSize: '18px', marginBottom: '20px' }}>Detalles del Evento</h2>
            
            <input
              type="text"
              name="nombreCliente"
              placeholder="Cliente"
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
              placeholder="Mail Cliente"
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
                placeholder="Tipo de Evento"
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
              placeholder="Asistentes"
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

          {/* Columna derecha - Menú y Extras */}
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

        {/* Botones */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '20px', 
          marginTop: '40px',
          paddingBottom: '20px'
        }}>
          <button
            type="button"
            onClick={handleCancelar}
            style={{
              padding: '12px 40px',
              background: '#ccc',
              color: '#333',
              border: 'none',
              borderRadius: '5px',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            Cancelar
          </button>
          <button
            type="submit"
            style={{
              padding: '12px 40px',
              background: '#5DADE2',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            Confirmar
          </button>
        </div>
      </form>
    </div>
  );
};

export default CrearEvento;
