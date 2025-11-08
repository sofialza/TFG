import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import DashboardAdministrador from './pages/DashboardAdministrador';
import DashboardEncargadaCocina from './pages/DashboardEncargadaCocina';
import DashboardOrganizador from './pages/DashboardOrganizador';
import Eventos from './pages/Eventos';
import Menus from './pages/Menus';
import Insumos from './pages/Insumos';
import OrdenesCompra from './pages/OrdenesCompra';
import './App.css';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div style={{ textAlign: 'center', padding: '3rem' }}>Cargando...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

function DashboardRouter() {
  const { user } = useAuth();
  
  if (!user) return null;
  
  switch (user.role) {
    case 'administrador':
      return <DashboardAdministrador />;
    case 'encargada_cocina':
      return <DashboardEncargadaCocina />;
    case 'organizador_eventos':
      return <DashboardOrganizador />;
    default:
      return <DashboardAdministrador />;
  }
}

function AppContent() {
  const { user } = useAuth();
  
  return (
    <div className="App">
      {user && <Navbar />}
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardRouter />
            </ProtectedRoute>
          }
        />
        <Route
          path="/eventos"
          element={
            <ProtectedRoute>
              <Eventos />
            </ProtectedRoute>
          }
        />
        <Route
          path="/menus"
          element={
            <ProtectedRoute>
              <Menus />
            </ProtectedRoute>
          }
        />
        <Route
          path="/insumos"
          element={
            <ProtectedRoute>
              <Insumos />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ordenes-compra"
          element={
            <ProtectedRoute>
              <OrdenesCompra />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
