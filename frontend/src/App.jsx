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
import RutaProtegida from './components/auth/RutaProtegida';
import AccesoDenegado from './components/auth/AccesoDenegado';


function App() {
  return (
    <Router>
      <div className="max-w-screen-2xl mx-auto p-8">
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          
          {/* Rutas protegidas para todos los usuarios */}
          <Route path="/panel-administracion" element={
            <RutaProtegida>
              <PanelAdministracion />
            </RutaProtegida>
            
          } />

          <Route path="/calendario" element={
            <RutaProtegida>
              <CalendarioEventos />
            </RutaProtegida>
          } />
          
          <Route path="/calendario/:id" element={
            <RutaProtegida>
              <DetallesEventoCalendario />
            </RutaProtegida>
          } />

          {/* Rutas protegidas para administrador */}
          <Route path="/eventos" element={
            <RutaProtegida rolesRequeridos={['ADMIN']}>
              <GestionEventos />
            </RutaProtegida>
          } />


          <Route path="/eventos/nuevo" element={
            <RutaProtegida rolesRequeridos={['ADMIN']}>
              <CrearEvento />
            </RutaProtegida>
          } />


          <Route path="/eventos/:id" element={
            <RutaProtegida rolesRequeridos={['ADMIN']}>
              <DetallesEvento />
            </RutaProtegida>
          } />

          <Route path="/eventos/:id/editar" element={
            <RutaProtegida rolesRequeridos={['ADMIN']}>
              <EditarEvento />
            </RutaProtegida>
          } />

          <Route path="/clientes" element={
            <RutaProtegida rolesRequeridos={['ADMIN']}>
              <GestionClientes />
            </RutaProtegida>
          } />

          <Route path="/clientes/nuevo" element={
            <RutaProtegida rolesRequeridos={['ADMIN']}>
              <CrearCliente />
            </RutaProtegida>
          } />

          <Route path="/clientes/:id/editar" element={
            <RutaProtegida rolesRequeridos={['ADMIN']}>
              <EditarCliente />
            </RutaProtegida>
          } />

          {/* Rutas protegidas para administrador y staff */}

          <Route path="/eventos/:id/productos" element={
            <RutaProtegida rolesRequeridos={['ADMIN','STAFF']}>
              <AsignarProducto />
            </RutaProtegida>
          } />
          
          <Route path="/productos" element={
            <RutaProtegida rolesRequeridos={['ADMIN','STAFF']}>
              <GestionProductos />
            </RutaProtegida>
          } />
          <Route path="/productos/nuevo" element={
            <RutaProtegida rolesRequeridos={['ADMIN','STAFF']}>
              <CrearProducto />
            </RutaProtegida>
          } />
          <Route path="/productos/:id/editar" element={
            <RutaProtegida rolesRequeridos={['ADMIN','STAFF']}>
              <EditarProducto />
            </RutaProtegida>
          } />
          
          <Route path="/estadisticas" element={
            <RutaProtegida rolesRequeridos={['ADMIN','STAFF']}>
              <Estadisticas />
            </RutaProtegida>
          } />
          <Route path="/estadisticas/ocupacion" element={
            <RutaProtegida rolesRequeridos={['ADMIN','STAFF']}>
              <EstadisticasOcupacion />
            </RutaProtegida>
          } />
          <Route path="/estadisticas/consumo" element={
            <RutaProtegida rolesRequeridos={['ADMIN','STAFF']}>
              <AnalisisConsumo />
            </RutaProtegida>
          } />
          
          <Route path="/calendario/nuevo/:fecha" element={
            <RutaProtegida rolesRequeridos={['ADMIN','STAFF']}>
              <CrearEventoCalendario />
            </RutaProtegida>
          } />

          <Route path="/calendario/:id/editar" element={
            <RutaProtegida rolesRequeridos={['ADMIN','STAFF']}>
              <EditarEventoCalendario />
            </RutaProtegida>
          } />

          <Route path="/seleccionar-evento-ticket" element={
            <RutaProtegida rolesRequeridos={['ADMIN','STAFF']}>
              <SeleccionarEvento />
            </RutaProtegida>
          } />
          <Route path="/gestion-de-tickets" element={
            <RutaProtegida rolesRequeridos={['ADMIN','STAFF']}>
              <TicketProducto />
            </RutaProtegida>
          } />

          {/* Otras rutas */}
          <Route path="/acceso-denegado" element={<AccesoDenegado />} />

          {/* Ruta por defecto - redirige a login si no hay ruta válida */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>

      </div>
    </Router>
  );
}

export default App;
