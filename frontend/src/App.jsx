import './app.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Navbar from "./components/common/Navbar";
import PanelAdministracion from "./pages/PanelAdministracion";
import Eventos from "./pages/Eventos";
function App() {

  return (
      <Router>
        <Navbar />
        <div className='container mx-auto p-4'>
            <Routes>
              {/* <Route path="/" element={<Dashboard />} /> */}
              <Route path="/panel-administracion" element={<PanelAdministracion />} />
              <Route path="/eventos" element={<Eventos />} />
              {/* <Route path="/productos" element={<Productos />} /> */}
              {/* <Route path="/clientes" element={<Clientes />} /> */}
              {/* <Route path="/estadisticas" element={<Estadisticas />} /> */}
            </Routes>
        </div>
      </Router>
  )
}

export default App
