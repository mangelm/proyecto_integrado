import './app.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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
import Registro from './components/auth/Registro';
import Login from './components/auth/Login';

// Componente para proteger rutas
const RutaProtegida = ({ children }) => {
    const token = localStorage.getItem('token');
    if (!token) {
        return <Navigate to="/" replace />;
    }
    return children;
};

function App() {
  return (
    <Router>
      <div className="max-w-screen-2xl mx-auto p-8">
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          
          {/* Rutas protegidas */}
          <Route path="/admin" element={
            <RutaProtegida>
              <PanelAdministracion />
            </RutaProtegida>
          } />
          
          <Route path="/eventos" element={
            <RutaProtegida>
              <GestionEventos />
            </RutaProtegida>
          } />
          <Route path="/eventos/nuevo" element={
            <RutaProtegida>
              <CrearEvento />
            </RutaProtegida>
          } />
          <Route path="/eventos/:id" element={
            <RutaProtegida>
              <DetallesEvento />
            </RutaProtegida>
          } />
          <Route path="/eventos/:id/editar" element={
            <RutaProtegida>
              <EditarEvento />
            </RutaProtegida>
          } />
          <Route path="/eventos/:id/productos" element={
            <RutaProtegida>
              <AsignarProducto />
            </RutaProtegida>
          } />
          
          <Route path="/productos" element={
            <RutaProtegida>
              <GestionProductos />
            </RutaProtegida>
          } />
          <Route path="/productos/nuevo" element={
            <RutaProtegida>
              <CrearProducto />
            </RutaProtegida>
          } />
          <Route path="/productos/:id/editar" element={
            <RutaProtegida>
              <EditarProducto />
            </RutaProtegida>
          } />
          
          <Route path="/clientes" element={
            <RutaProtegida>
              <GestionClientes />
            </RutaProtegida>
          } />
          <Route path="/clientes/nuevo" element={
            <RutaProtegida>
              <CrearCliente />
            </RutaProtegida>
          } />
          <Route path="/clientes/:id/editar" element={
            <RutaProtegida>
              <EditarCliente />
            </RutaProtegida>
          } />
          
          <Route path="/estadisticas" element={
            <RutaProtegida>
              <Estadisticas />
            </RutaProtegida>
          } />
          <Route path="/estadisticas/ocupacion" element={
            <RutaProtegida>
              <EstadisticasOcupacion />
            </RutaProtegida>
          } />
          <Route path="/estadisticas/consumo" element={
            <RutaProtegida>
              <AnalisisConsumo />
            </RutaProtegida>
          } />
          
          <Route path="/calendario" element={
            <RutaProtegida>
              <CalendarioEventos />
            </RutaProtegida>
          } />
          <Route path="/calendario/nuevo/:fecha" element={
            <RutaProtegida>
              <CrearEventoCalendario />
            </RutaProtegida>
          } />
          <Route path="/calendario/:id/editar" element={
            <RutaProtegida>
              <EditarEventoCalendario />
            </RutaProtegida>
          } />
          <Route path="/calendario/:id" element={
            <RutaProtegida>
              <DetallesEventoCalendario />
            </RutaProtegida>
          } />

          <Route path="/seleccionar-evento-ticket" element={
            <RutaProtegida>
              <SeleccionarEvento />
            </RutaProtegida>
          } />
          <Route path="/gestion-de-tickets" element={
            <RutaProtegida>
              <TicketProducto />
            </RutaProtegida>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
