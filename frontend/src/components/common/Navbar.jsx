import React from 'react';
import { Link } from "react-router-dom";;

export default function Navbar() {
    return (
        <nav className="bg-gray-800 text-white p-4 flex justify-between">
            <div className="text-lg font-bold">Gestión de Eventos</div>
            <div className="flex space-x-4">
                <Link to="/panel-administracion" className="hover:text-gray-300">Administración</Link>
                <Link to="/eventos" className="hover:text-gray-300">Eventos</Link>
                <Link to="/productos" className="hover:text-gray-300">Productos</Link>
                <Link to="/clientes" className="hover:text-gray-300">Clientes</Link>
                <Link to="/estadisticas" className="hover:text-gray-300">Estadísticas</Link>
            </div>
        </nav>
    );
};

