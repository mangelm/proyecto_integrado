import './app.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PanelAdministracion from "./pages/PanelAdministracion";
import GestionEventos from "./components/eventos/Eventos";
import EditarEvento from "./components/eventos/EditarEvento";
import CrearEvento from "./components/eventos/CrearEvento";
import GestionProductos from './components/productos/Productos';
import CrearProducto from './components/productos/CrearProducto';
import EditarProducto from './components/productos/EditarProducto';
import GestionClientes from './components/clientes/Clientes';
import CrearCliente from './components/clientes/CrearCliente';
import EditarCliente from './components/clientes/EditarCliente';
import DetallesEvento from './components/eventos/DetallesEvento';
import Estadisticas from './components/estadisticas/Estadisticas';
import EstadisticasOcupacion from './components/estadisticas/EstadisticasOcupacion';
import AnalisisConsumo from './components/estadisticas/AnalisisConsumo';
import AsignarProducto from './components/productos/AsignarProducto';
import CalendarioEventos from './components/calendario/CalendarioEventos';
import CrearEventoCalendario from './components/calendario/CrearEventoCalendario';
import EditarEventoCalendario from './components/calendario/EditarEventoCalendario';

function App() {
  return (
    <Router>
      <div className="max-w-screen-2xl mx-auto p-8">
        <Routes>
          <Route path="/" element={<PanelAdministracion />} />
          <Route path="/eventos" element={<GestionEventos />} />
          <Route path="/eventos/:id" element={<DetallesEvento />} />
          <Route path="/eventos/editar-evento/:id" element={<EditarEvento />} /> {/* Ruta para editar */}
          <Route path="/eventos/crear-evento/" element={<CrearEvento />} /> {/* Ruta para crear */}
          <Route path="/eventos/:id/productos" element={<AsignarProducto />} /> {/* Ruta para crear */}
          <Route path="/productos" element={<GestionProductos />} />
          <Route path="/productos/editar-producto/:id" element={<EditarProducto />} /> {/* Ruta para editar */}
          <Route path="/productos/crear-producto/" element={<CrearProducto />} /> {/* Ruta para crear */}
          <Route path="/clientes" element={<GestionClientes />} />
          <Route path="/clientes/editar-cliente/:id" element={<EditarCliente />} /> {/* Ruta para editar */}
          <Route path="/clientes/crear-cliente/" element={<CrearCliente/>} /> {/* Ruta para crear */}
          <Route path="/estadisticas" element={<Estadisticas />} />
          <Route path="/estadisticas/ocupacion" element={<EstadisticasOcupacion />} /> {/* Ruta primeros gráficos */}
          <Route path="/estadisticas/productos" element={<AnalisisConsumo />} /> {/* Ruta segundos gráficos */}
          <Route path="/calendario" element={<CalendarioEventos />} /> {/* Ruta segundos gráficos */}
          <Route path="/calendario/crear-evento/:fecha" element={<CrearEventoCalendario />} />
          <Route path="/calendario/editar-evento/:id" element={<EditarEventoCalendario />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
