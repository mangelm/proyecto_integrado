import './app.css';
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
import DetallesEventoCalendario from './components/calendario/DetallesEventoCalendario';
import SeleccionarEvento from './components/tickets/SeleccionarEvento';
import TicketProducto from './components/tickets/TicketProducto';


function App() {
  return (
    <Router>
      <div className="max-w-screen-2xl mx-auto p-8">
        <Routes>
          {/* Rutas principales */}
          <Route path="/" element={<PanelAdministracion />} />
          
          {/* Rutas de eventos */}
          <Route path="/eventos" element={<GestionEventos />} />
          <Route path="/eventos/nuevo" element={<CrearEvento />} />
          <Route path="/eventos/:id" element={<DetallesEvento />} />
          <Route path="/eventos/:id/editar" element={<EditarEvento />} />
          <Route path="/eventos/:id/productos" element={<AsignarProducto />} />
          
          {/* Rutas de productos */}
          <Route path="/productos" element={<GestionProductos />} />
          <Route path="/productos/nuevo" element={<CrearProducto />} />
          <Route path="/productos/:id/editar" element={<EditarProducto />} />
          
          {/* Rutas de clientes */}
          <Route path="/clientes" element={<GestionClientes />} />
          <Route path="/clientes/nuevo" element={<CrearCliente />} />
          <Route path="/clientes/:id/editar" element={<EditarCliente />} />
          
          {/* Rutas de estadísticas */}
          <Route path="/estadisticas" element={<Estadisticas />} />
          <Route path="/estadisticas/ocupacion" element={<EstadisticasOcupacion />} />
          <Route path="/estadisticas/consumo" element={<AnalisisConsumo />} />
          
          {/* Rutas de calendario */}
          <Route path="/calendario" element={<CalendarioEventos />} />
          <Route path="/calendario/nuevo/:fecha" element={<CrearEventoCalendario />} />
          <Route path="/calendario/:id/editar" element={<EditarEventoCalendario />} />
          <Route path="/calendario/:id" element={<DetallesEventoCalendario />} />

          {/* Rutas de tickets */}
          <Route path="/seleccionar-evento-ticket" element={<SeleccionarEvento />} />
          <Route path="/gestion-de-tickets" element={<TicketProducto />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
