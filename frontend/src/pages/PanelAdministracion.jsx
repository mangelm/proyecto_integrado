import React from 'react';


export default function Navbar() {

    return (
    <div className="p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Panel de Administración</h1>
        <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-blue-500 text-white rounded-lg shadow">
            <h2 className="text-lg font-semibold">Gestión de Eventos</h2>
        </div>
        <div className="p-4 bg-green-500 text-white rounded-lg shadow">
            <h2 className="text-lg font-semibold">Gestión de Productos</h2>
        </div>
        <div className="p-4 bg-yellow-500 text-white rounded-lg shadow">
            <h2 className="text-lg font-semibold">Gestión de Clientes</h2>
        </div>
        </div>
    </div>
    );
}