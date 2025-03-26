import React from 'react';
import { Link } from "react-router-dom"; 

export default function Estadisticas() {

    return (
    <div className="p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Menú de las estadísticas</h1>
        <br></br>
        <br></br>
        <Link to="/estadisticas/ocupacion">
                <button className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition duration-300">
                    Estadísticas de Ocupación
                </button>
        </Link>
        <br></br>
        <br></br>
        <Link to="/">
                <button className="bg-yellow-500 text-white p-2 rounded-lg hover:bg-yellow-600 transition duration-300">
                    Volver
                </button>
        </Link>
    </div>
    );
}