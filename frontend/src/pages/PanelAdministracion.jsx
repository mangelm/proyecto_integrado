import React from 'react';
// Hay que asegurarse de tener react-router-dom instalado
import { Link } from "react-router-dom"; 

export default function PanelAdministracion() {

    return (
        <div className='w-full md:max-w-[768px] xl:max-w-7xl p-4 md:p-6 xl:p-3 bg-white rounded-lg shadow-md mx-auto text-center'>
            <h1 className="text-xl md:text-2xl font-bold mb-4">Panel de Administración</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                <div className="p-3 md:p-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow transition-colors">
                    <Link to={`/eventos`} className="block">
                        <h2 className="text-base md:text-lg font-semibold">Gestión de Eventos</h2>
                    </Link>
                </div>
                <div className="p-3 md:p-4 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow transition-colors">
                    <Link to={`/productos`} className="block">
                        <h2 className="text-base md:text-lg font-semibold">Gestión de Productos</h2>
                    </Link>
                </div>
                <div className="p-3 md:p-4 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg shadow transition-colors">
                    <Link to={`/clientes`} className="block">
                        <h2 className="text-base md:text-lg font-semibold">Gestión de Clientes</h2>
                    </Link>
                </div>
                <div className="p-3 md:p-4 bg-red-500 hover:bg-red-600  text-white rounded-lg shadow transition-colors">
                    <Link to={`/estadisticas`} className="block">
                        <h2 className="text-base md:text-lg font-semibold">Consultas y Estadísticas</h2>
                    </Link>
                </div>
                <div className="p-3 md:p-4 bg-purple-500 hover:bg-purple-600  text-white rounded-lg shadow transition-colors">
                    <Link to={`/calendario`} className="block">
                        <h2 className="text-base md:text-lg font-semibold">Calendario de Eventos</h2>
                    </Link>
                </div>
                <div className="p-3 md:p-4 bg-purple-500 hover:bg-purple-600  text-white rounded-lg shadow transition-colors">
                    <Link to={`/ticket`} className="block">
                        <h2 className="text-base md:text-lg font-semibold">Generación de Tickets</h2>
                    </Link>
                </div>
            </div>
        </div>
    );
}