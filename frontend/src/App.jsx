import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import DashboardPrincipal from './pages/DashboardPrincipal';
import CrearEvento from './pages/CrearEvento';
import ModificarEvento from './pages/ModificarEvento';
import Reservas from './pages/Reservas';
import ManejarStock from './pages/ManejarStock';
import Reportes from './pages/Reportes';
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

function AppContent() {
  const { user } = useAuth();
  
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardPrincipal />
            </ProtectedRoute>
          }
        />
        <Route
          path="/eventos/nuevo"
          element={
            <ProtectedRoute>
              <CrearEvento />
            </ProtectedRoute>
          }
        />
        <Route
          path="/eventos/editar/:id"
          element={
            <ProtectedRoute>
              <ModificarEvento />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reservas"
          element={
            <ProtectedRoute>
              <Reservas />
            </ProtectedRoute>
          }
        />
        <Route
          path="/stock"
          element={
            <ProtectedRoute>
              <ManejarStock />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reportes"
          element={
            <ProtectedRoute>
              <Reportes />
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
