import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function EditarEventoCalendario() {
    const { id } = useParams(); // Obtiene el parámetro 'id' de la URL, que identifica el evento a editar.
    const [nombre, setNombre] = useState(""); // Estado para el nombre del evento, inicializado como una cadena vacía.
    const [fecha, setFecha] = useState(""); // Estado para la fecha del evento, inicializado como una cadena vacía.
    const [cantidadPersonas, setCantidadPersonas] = useState(""); // Estado para la cantidad de asistentes, inicializado como una cadena vacía.
    const [espacio, setEspacio] = useState(""); // Estado para el lugar o espacio del evento, inicializado como una cadena vacía.
    const [horario, setHorario] = useState(""); // Estado para el horario del evento (MAÑANA, TARDE, NOCHE), inicializado como una cadena vacía.
    const [hora, setHora] = useState(""); // Estado para la hora específica del evento, inicializado como una cadena vacía.
    const [estado, setEstado] = useState(""); // Estado para el estado del evento (PENDIENTE, CONFIRMADO, CANCELADO, FINALIZADO), inicializado como una cadena vacía.
    const [error, setError] = useState(null); // Estado para almacenar y mostrar errores al usuario, inicializado como null.
    const navegar = useNavigate(); // Hook para obtener la función de navegación.

    // useEffect se ejecuta después de cada renderizado del componente.
    useEffect(() => {
        // Realiza una petición fetch a la API para obtener los detalles del evento específico usando el 'id' de la URL.
        fetch(`http://localhost:8100/api/eventos/${id}`, {
            credentials: 'include', // Incluye las credenciales (como cookies) en la petición si es necesario para la autenticación.
        })
            .then((response) => response.json()) // Convierte la respuesta de la API a formato JSON.
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
            .catch((error) => console.error("Error al cargar el evento:", error)); // Captura y muestra cualquier error ocurrido durante la petición.
    }, [id]); // El efecto se ejecuta de nuevo si el valor de 'id' cambia.

    // Función para sanitizar los valores de los input, eliminando caracteres no deseados.
    const sanitizeInput = (value, type) => {
        if (type === "text") {
            return value.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ ]/g, ""); // Solo permite letras, números, acentos, ñ y espacios.
        }
        if (type === "number") {
            return value.replace(/[^0-9]/g, "");  // Solo permite números.
        }
        return value; // Retorna el valor sin cambios si el tipo no es texto ni número.
    };

    // Función asíncrona para manejar el envío del formulario de edición.
    const manejoEnvio = async (e) => {

        e.preventDefault(); // Evita el comportamiento por defecto del formulario (recargar la página).

        // Validar que todos los campos requeridos tengan un valor.
        if (!nombre || !fecha || !cantidadPersonas || !espacio || !horario || !estado || !hora) {
            setError("Todos los campos son obligatorios"); // Establece un mensaje de error si algún campo está vacío.
            return; // Detiene la ejecución si la validación falla.
        }

        // Crea un objeto con los datos del evento actualizados.
        const eventoActualizado = {
            nombre: sanitizeInput(nombre, "text"), // Limpia el nombre antes de enviarlo.
            fecha,
            cantidadPersonas: parseInt(cantidadPersonas) || 0,  // Convierte la cantidad de personas a número o usa 0 si no es válido.
            espacio: sanitizeInput(espacio, "text"), // Limpia el espacio antes de enviarlo.
            horario,
            hora,
            estado,
        };

        try {
            // Realiza una petición PUT a la API para actualizar el evento específico usando el 'id' de la URL.
            const response = await fetch(`http://localhost:8100/api/eventos/${id}`, {
                method: "PUT",  // Usa el método PUT para actualizar un recurso existente.
                headers: {
                    "Content-Type": "application/json", // Indica que el cuerpo de la petición es JSON.
                },
                body: JSON.stringify(eventoActualizado), // Convierte el objeto del evento actualizado a una cadena JSON para enviarlo.
                credentials: 'same-origin', // Envía las credenciales solo si la petición es al mismo origen.
            });

            // Comprueba si la respuesta de la API fue exitosa (código de estado 2xx).
            if (response.ok) {
                // Redirige al usuario a la página del calendario después de una actualización exitosa.
                navegar("/calendario");
            } else {
                // Si la respuesta no es exitosa, intenta obtener el cuerpo del error.
                const errorData = await response.text();
                // Si el código de estado es 422 (Unprocessable Entity), muestra el error específico del backend.
                if (response.status === 422) {
                    setError(errorData); // Muestra el mensaje de error recibido del backend (por ejemplo, horario ocupado).
                } else {
                    // Si es otro tipo de error, lanza un error con el mensaje recibido o uno genérico.
                    throw new Error(errorData || 'Error al actualizar el evento');
                }
            }
        } catch (error) {
            console.error("Error al editar el evento:", error);
            setError("Hubo un error al intentar actualizar el evento. Inténtalo más tarde.");  // Muestra un error genérico al usuario.
        }
    };

    // Renderiza el formulario para editar el evento.
    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-4">Editar Evento</h1>

            {/* Muestra el mensaje de error si la variable 'error' tiene un valor. */}
            {error && <div className="text-red-500 mb-4">{error}</div>}

            <form onSubmit={manejoEnvio}>
                <div className="mb-4">
                    <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre</label>
                    <input
                        type="text"
                        id="nombre"
                        value={nombre} // Valor actual del nombre del evento.
                        onChange={(e) => setNombre(e.target.value)} // Actualiza el estado 'nombre' al cambiar el input.
                        required
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="fecha" className="block text-sm font-medium text-gray-700">Fecha</label>
                    <input
                        type="date"
                        id="fecha"
                        value={fecha} // Valor actual de la fecha del evento.
                        onChange={(e) => setFecha(e.target.value)} // Actualiza el estado 'fecha' al cambiar el input.
                        required
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="cantidad_personas" className="block text-sm font-medium text-gray-700">Nº Asistentes</label>
                    <input
                        type="number"
                        id="cantidad_personas"
                        value={cantidadPersonas} // Valor actual de la cantidad de asistentes.
                        onChange={(e) => setCantidadPersonas(e.target.value)} // Actualiza el estado 'cantidadPersonas' al cambiar el input.
                        required
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="espacio" className="block text-sm font-medium text-gray-700">Espacio</label>
                    <input
                        type="text"
                        id="espacio"
                        value={espacio} // Valor actual del espacio del evento.
                        onChange={(e) => setEspacio(e.target.value)} // Actualiza el estado 'espacio' al cambiar el input.
                        required
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="horario" className="block text-sm font-medium text-gray-700">Horario</label>
                    <select
                        id="horario"
                        value={horario} // Valor actual del horario del evento.
                        onChange={(e) => setHorario(e.target.value)} // Actualiza el estado 'horario' al seleccionar una opción.
                        required
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="MAÑANA">MAÑANA</option>
                        <option value="TARDE">TARDE</option>
                        <option value="NOCHE">NOCHE</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label htmlFor="hora" className="block text-sm font-medium text-gray-700">Hora</label>
                    <input
                        type="time"
                        id="hora"
                        value={hora} // Valor actual de la hora del evento.
                        onChange={(e) => setHora(e.target.value)} // Actualiza el estado 'hora' al cambiar el input.
                        required
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="estado" className="block text-sm font-medium text-gray-700">Estado</label>
                    <select
                        id="estado"
                        value={estado} // Valor actual del estado del evento.
                        onChange={(e) => setEstado(e.target.value)} // Actualiza el estado 'estado' al seleccionar una opción.
                        required
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="PENDIENTE">PENDIENTE</option>
                        <option value="CONFIRMADO">CONFIRMADO</option>
                        <option value="CANCELADO">CANCELADO</option>
                        <option value="FINALIZADO">FINALIZADO</option>
                    </select>
                </div>

                <div className="flex justify-between items-center">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
                    >
                        Guardar Cambios
                    </button>
                    <button
                        type="button"
                        onClick={() => navegar("/calendario")} // Navega de vuelta a la página del calendario al hacer clic.
                        className="bg-gray-300 hover:bg-gray-400 text-black p-2 rounded"
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
}
