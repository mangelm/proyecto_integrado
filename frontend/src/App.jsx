import './app.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import PanelAdministracion from "./pages/PanelAdministracion";
import Eventos from "./pages/Eventos";
import EditarEvento from "./pages/EditarEvento";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="max-w-screen-2xl mx-auto p-8">
        <Routes>
          <Route path="/" element={<PanelAdministracion />} />
          <Route path="/eventos" element={<Eventos />} />
          <Route path="/eventos/editar/:id" element={<EditarEvento />} /> {/* Ruta para editar */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
