import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Eventos from './pages/Eventos';
import Menus from './pages/Menus';
import Insumos from './pages/Insumos';
import OrdenesCompra from './pages/OrdenesCompra';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/eventos" element={<Eventos />} />
          <Route path="/menus" element={<Menus />} />
          <Route path="/insumos" element={<Insumos />} />
          <Route path="/ordenes-compra" element={<OrdenesCompra />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
