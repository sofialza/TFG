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
    cargarDatos();
  }, [id]);

  const cargarDatos = async () => {
    try {
      const [eventoRes, menusRes] = await Promise.all([
        api.get(`/eventos/${id}`),
        api.get('/menus')
      ]);

      const evento = eventoRes.data;
      setFormData({
        nombreCliente: evento.nombreCliente || '',
        mailCliente: evento.mailCliente || '',
        tipoEvento: evento.tipoEvento || '',
        cantidadAsistentes: evento.cantidadAsistentes || '',
        fecha: evento.fecha || '',
        itinerario: evento.itinerario || '',
        menuPrincipal: evento.menu?.idMenu || '',
        menuEntrada: '',
        mesaDulce: '',
        extras: {
          torta: true,
          dj: true,
          decoracion: false,
          souvenirs: false,
          carioca: true
        }
      });

      setMenus(menusRes.data);
    } catch (error) {
      console.error('Error cargando datos:', error);
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

      await api.put(`/eventos/${id}`, eventoData);
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
