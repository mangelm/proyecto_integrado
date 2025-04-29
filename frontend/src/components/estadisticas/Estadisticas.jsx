import { Link } from "react-router-dom";
import { useState } from "react";
import MensajesDeErrores from "../../pages/MensajesDeErrores";

export default function Estadisticas() {
    const [errores, setErrores] = useState([]); // Estado para manejar errores

    // Simulación de un error (puedes adaptarlo según tus necesidades)
    const manejarError = () => {
        setErrores((prevErrores) => [...prevErrores, "Ha ocurrido un error inesperado."]);
    };

    return (
        // Contenedor principal
        <div className="p-6 bg-white rounded-lg shadow-md">
            {/* Mostrar errores */}
            {errores.length > 0 && <MensajesDeErrores messages={errores} />}

            {/* Título principal de la página */}
            <h1 className="text-2xl font-bold mb-4">Menú de las estadísticas</h1>
            <br />
            <br />

            {/* Enlace a la página de estadísticas de ocupación */}
            <Link to="/estadisticas/ocupacion" onClick={manejarError}>
                <button className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition duration-300">
                    Estadísticas de Ocupación
                </button>
            </Link>
            <br />
            <br />

            {/* Enlace a la página de análisis de consumo de productos */}
            <Link to="/estadisticas/productos" onClick={manejarError}>
                <button className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition duration-300">
                    Análisis de Consumo
                </button>
            </Link>
            <br />
            <br />

            {/* Enlace a la página de generación de tickets */}
            <Link to="/estadisticas/tickets" onClick={manejarError}>
                <button className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition duration-300">
                    Generación de tickets
                </button>
            </Link>
            <br />
            <br />

            {/* Enlace a la página principal */}
            <Link to="/" onClick={manejarError}>
                <button className="bg-yellow-500 text-white p-2 rounded-lg hover:bg-yellow-600 transition duration-300">
                    Volver
                </button>
            </Link>
        </div>
    );
}