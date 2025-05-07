import { useNavigate } from "react-router-dom";

export default function AccesoDenegado() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-3xl font-bold text-red-600 mb-4">Acceso Denegado</h1>
            <p className="text-gray-700 mb-6">No tienes permisos para acceder a esta página.</p>
            <button
                onClick={() => navigate(-1)} // Navega a la página anterior
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
                Volver
            </button>
        </div>
    );
}