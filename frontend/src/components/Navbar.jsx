import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleLabel = (role) => {
    const roles = {
      'administrador': 'Administrador',
      'encargada_cocina': 'Encargada de Cocina',
      'organizador_eventos': 'Organizador de Eventos',
    };
    return roles[role] || role;
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <Link to="/" style={styles.brand}>
          Sistema de Gestión de Eventos
        </Link>
        <div style={styles.links}>
          <Link to="/" style={styles.link}>Dashboard</Link>
          <Link to="/eventos" style={styles.link}>Eventos</Link>
          <Link to="/menus" style={styles.link}>Menús</Link>
          <Link to="/insumos" style={styles.link}>Insumos</Link>
          <Link to="/ordenes-compra" style={styles.link}>Órdenes de Compra</Link>
        </div>
        <div style={styles.userSection}>
          <span style={styles.userName}>
            {user?.username} ({getRoleLabel(user?.role)})
          </span>
          <button onClick={handleLogout} style={styles.logoutButton}>
            Salir
          </button>
        </div>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    backgroundColor: '#2c3e50',
    padding: '1rem 0',
    marginBottom: '2rem',
  },
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 2rem',
  },
  brand: {
    color: 'white',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    textDecoration: 'none',
  },
  links: {
    display: 'flex',
    gap: '2rem',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '1rem',
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  userName: {
    color: 'white',
    fontSize: '0.9rem',
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
};

export default Navbar;
