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
    menuEntrada: '',
    menuPrincipal: '',
    mesaDulce: '',
    extras: {
      torta: false,
      dj: false,
      decoracion: false,
      souvenirs: false,
      carioca: false
    }
  });

  const [menus, setMenus] = useState([]);

  useEffect(() => {
    cargarMenus();
  }, []);

  const cargarMenus = async () => {
    try {
      const response = await api.get('/menus');
      setMenus(response.data);
    } catch (error) {
      console.error('Error cargando menús:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleExtraChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      extras: {
        ...prev.extras,
        [name]: checked
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const eventoData = {
        nombreCliente: formData.nombreCliente,
        mailCliente: formData.mailCliente,
        tipoEvento: formData.tipoEvento,
        cantidadAsistentes: parseInt(formData.cantidadAsistentes),
        fecha: formData.fecha,
        itinerario: formData.itinerario,
        menu: {
          idMenu: formData.menuPrincipal ? parseInt(formData.menuPrincipal) : null
        }
      };

      await api.post('/eventos', eventoData);
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
            <h2 style={{ fontSize: '18px', marginBottom: '20px' }}>Menu</h2>
            
            <div style={{ position: 'relative', marginBottom: '15px' }}>
              <select
                name="menuEntrada"
                value={formData.menuEntrada}
                onChange={handleInputChange}
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
                <option value="">Entrada</option>
                {menus.map(menu => (
                  <option key={menu.idMenu} value={menu.idMenu}>
                    {menu.primerPlato}
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

            <div style={{ position: 'relative', marginBottom: '15px' }}>
              <select
                name="menuPrincipal"
                value={formData.menuPrincipal}
                onChange={handleInputChange}
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
                <option value="">Menu Principal</option>
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

            <div style={{ position: 'relative', marginBottom: '30px' }}>
              <select
                name="mesaDulce"
                value={formData.mesaDulce}
                onChange={handleInputChange}
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
                <option value="">Mesa Dulce</option>
                {menus.map(menu => (
                  <option key={menu.idMenu} value={menu.idMenu}>
                    {menu.torta}
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

            <h2 style={{ fontSize: '18px', marginBottom: '15px', fontWeight: 'bold' }}>Extras</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                <input
                  type="checkbox"
                  name="torta"
                  checked={formData.extras.torta}
                  onChange={handleExtraChange}
                  style={{ width: '18px', height: '18px' }}
                />
                Torta
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                <input
                  type="checkbox"
                  name="souvenirs"
                  checked={formData.extras.souvenirs}
                  onChange={handleExtraChange}
                  style={{ width: '18px', height: '18px' }}
                />
                Souvenirs
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                <input
                  type="checkbox"
                  name="dj"
                  checked={formData.extras.dj}
                  onChange={handleExtraChange}
                  style={{ width: '18px', height: '18px' }}
                />
                DJ
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                <input
                  type="checkbox"
                  name="carioca"
                  checked={formData.extras.carioca}
                  onChange={handleExtraChange}
                  style={{ width: '18px', height: '18px' }}
                />
                Carioca
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                <input
                  type="checkbox"
                  name="decoracion"
                  checked={formData.extras.decoracion}
                  onChange={handleExtraChange}
                  style={{ width: '18px', height: '18px' }}
                />
                Decoracion
              </label>
            </div>
          </div>
        </div>

        {/* Botones */}
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
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
};

export default CrearEvento;
