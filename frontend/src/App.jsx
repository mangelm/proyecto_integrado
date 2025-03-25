import './app.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PanelAdministracion from "./pages/PanelAdministracion";
import GestionEventos from "./pages/Eventos";
import EditarEvento from "./pages/EditarEvento";
import CrearEvento from "./pages/CrearEvento";
import GestionProductos from './pages/Productos';
import CrearProducto from './pages/CrearProducto';
import EditarProducto from './pages/EditarProducto';

function App() {
  return (
    <Router>
      <div className="max-w-screen-2xl mx-auto p-8">
        <Routes>
          <Route path="/" element={<PanelAdministracion />} />
          <Route path="/eventos" element={<GestionEventos />} />
          <Route path="/eventos/editar/:id" element={<EditarEvento />} /> {/* Ruta para editar */}
          <Route path="/eventos/crear/" element={<CrearEvento />} /> {/* Ruta para crear */}
          <Route path="/productos" element={<GestionProductos />} />
          <Route path="/productos/editar/:id" element={<EditarProducto />} /> {/* Ruta para editar */}
          <Route path="/productos/crear/" element={<CrearProducto />} /> {/* Ruta para crear */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
