import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MensajesDeErrores from "../../pages/MensajesDeErrores"; // Importa el componente para mostrar errores generales.

export default function DetallesEventoCalendario() {
    const { id } = useParams(); // Obtiene el parámetro 'id' de la URL, que identifica el evento a mostrar.
    const [nombre, setNombre] = useState(""); // Estado para el nombre del evento, inicializado como una cadena vacía.
    const [fecha, setFecha] = useState(""); // Estado para la fecha del evento, inicializado como una cadena vacía.
    const [cantidadPersonas, setCantidadPersonas] = useState(""); // Estado para la cantidad de asistentes, inicializado como una cadena vacía.
    const [espacio, setEspacio] = useState(""); // Estado para el lugar o espacio del evento, inicializado como una cadena vacía.
    const [horario, setHorario] = useState(""); // Estado para el horario del evento (MAÑANA, TARDE, NOCHE), inicializado como una cadena vacía.
    const [hora, setHora] = useState(""); // Estado para la hora específica del evento, inicializado como una cadena vacía.
    const [estado, setEstado] = useState(""); // Estado para el estado del evento, inicializado como una cadena vacía.
    const [erroresGenerales, setErroresGenerales] = useState([]); // Estado para manejar errores generales.

    // useEffect se ejecuta después de cada renderizado del componente.
    useEffect(() => {
        // Realiza una petición fetch a la API para obtener los detalles del evento específico usando el 'id' de la URL.
        fetch(`http://localhost:8100/api/eventos/${id}`, {
            credentials: "include", // Incluye las credenciales (como cookies) en la petición si es necesario.
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }
                return response.json(); // Convierte la respuesta de la API a formato JSON.
            })
            .then((data) => {
                // Actualiza los estados del componente con los datos recibidos del evento.
                setNombre(data.nombre);
                setFecha(data.fecha);
                setCantidadPersonas(data.cantidadPersonas);
                setEspacio(data.espacio);
                setHorario(data.horario);
                setHora(data.hora);
                setEstado(data.estado);
            })
            .catch((error) => {
                console.error("Error al cargar el evento:", error); // Captura y muestra cualquier error ocurrido durante la petición.
                setErroresGenerales((prev) => [
                    ...prev,
                    "No se pudo cargar la información del evento. Inténtalo de nuevo más tarde.",
                ]);
            });
    }, [id]); // El efecto se ejecuta de nuevo si el valor de 'id' cambia.

    // Renderiza los detalles del evento.
    return (
        <div className="max-w-lg mx-auto p-4 sm:p-6 md:p-8 bg-white rounded-lg shadow-md text-center">
            <h1 className="text-2xl font-semibold text-gray-800 mb-4 md:text-3xl">Detalles del Evento</h1>

            {/* Mostrar errores generales con MensajesDeErrores */}
            {erroresGenerales.length > 0 && <MensajesDeErrores messages={erroresGenerales} />}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">Nombre</label>
                    <p className="p-3 bg-gray-50 border border-gray-300 rounded-md text-gray-800">{nombre}</p>
                </div>

                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-2">Fecha</label>
                    <p className="p-3 bg-gray-50 border border-gray-300 rounded-md text-gray-800">{fecha}</p>
                </div>

                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-2">Nº Asistentes</label>
                    <p className="p-3 bg-gray-50 border border-gray-300 rounded-md text-gray-800">{cantidadPersonas}</p>
                </div>

                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-2">Espacio</label>
                    <p className="p-3 bg-gray-50 border border-gray-300 rounded-md text-gray-800">{espacio}</p>
                </div>

                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-2">Horario</label>
                    <p className="p-3 bg-gray-50 border border-gray-300 rounded-md text-gray-800">{horario}</p>
                </div>

                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-2">Hora Inicio</label>
                    <p className="p-3 bg-gray-50 border border-gray-300 rounded-md text-gray-800">{hora}</p>
                </div>

                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-2">Estado</label>
                    <p className="p-3 bg-gray-50 border border-gray-300 rounded-md text-gray-800">{estado}</p>
                </div>
            </div>

            <div className="mt-6 flex justify-center">
                <button
                    type="button"
                    onClick={() => window.history.back()} // Utiliza la API del navegador para volver a la página anterior en el historial.
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
                >
                    Volver
                </button>
            </div>
        </div>
    );
}