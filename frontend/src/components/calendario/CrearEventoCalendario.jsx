import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MensajesDeErrores from "../../pages/MensajesDeErrores"; // Importa el componente para mostrar errores generales.

export default function CrearEventoCalendario({ onSuccess }) {
    const { fecha } = useParams(); // Obtiene el parámetro 'fecha' de la URL, que representa la fecha en la que se va a crear el evento.
    const [nombre, setNombre] = useState(""); // Estado para el nombre del evento, inicializado como cadena vacía.
    const [cantidadPersonas, setCantidadPersonas] = useState(""); // Estado para la cantidad de asistentes, inicializado como una cadena vacía.
    const [espacio, setEspacio] = useState(""); // Estado para el lugar o espacio del evento, inicializado como una cadena vacía.
    const [horario, setHorario] = useState("MAÑANA"); // Estado para el horario del evento (MAÑANA, TARDE, NOCHE), inicializado en 'MAÑANA'.
    const [hora, setHora] = useState(""); // Estado para la hora específica del evento, inicializado como una cadena vacía.
    const [errores, setErrores] = useState({}); // Estado para almacenar los errores de validación del formulario, inicializado como un objeto vacío.
    const [erroresGenerales, setErroresGenerales] = useState([]); // Estado para manejar errores generales no controlados por el formulario.
    const navegar = useNavigate(); // Hook para obtener la función de navegación.

    // Función para limpiar los valores de los input, eliminando caracteres no deseados.
    const limpiarInput = (valor, tipo) => {
        if (tipo === "texto") {
            return valor.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ ]/g, ""); // Elimina caracteres que no son letras, números, acentos, ñ o espacios.
        }
        if (tipo === "numero") {
            return valor.replace(/[^0-9]/g, ""); // Elimina caracteres que no son números.
        }
        return valor; // Retorna el valor sin cambios si el tipo no es texto ni número.
    };

    // Función para validar el formulario antes de enviar los datos.
    const validarFormulario = () => {
        let valido = true; // Variable para controlar si el formulario es válido, inicialmente verdadero.
        const nuevosErrores = {}; // Objeto para almacenar los nuevos errores encontrados durante la validación.

        // Validación del campo 'nombre'.
        if (!nombre.trim()) {
            nuevosErrores.nombre = "El nombre es requerido.";
            valido = false;
        } else if (nombre.trim().length < 3 || nombre.trim().length > 100) {
            nuevosErrores.nombre = "El nombre debe tener entre 3 y 100 caracteres.";
            valido = false;
        }

        // Validación del campo 'fecha'.
        if (!fecha) {
            nuevosErrores.fecha = "La fecha es requerida.";
            valido = false;
        } else {
            const fechaEvento = new Date(fecha); // Crea un objeto Date a partir de la fecha seleccionada.
            const ahora = new Date(); // Obtiene la fecha y hora actual.

            // Extrae el año, mes y día de la fecha del evento y la fecha actual.
            const anoEvento = fechaEvento.getFullYear();
            const mesEvento = fechaEvento.getMonth();
            const diaEvento = fechaEvento.getDate();

            const anoAhora = ahora.getFullYear();
            const mesAhora = ahora.getMonth();
            const diaAhora = ahora.getDate();

            // Comprueba si la fecha del evento es anterior a la fecha actual.
            if (anoEvento < anoAhora || (anoEvento === anoAhora && mesEvento < mesAhora) || (anoEvento === anoAhora && mesEvento === mesAhora && diaEvento < diaAhora)) {
                nuevosErrores.fecha = "La fecha debe ser futura.";
                valido = false;
            } else if (anoEvento === anoAhora && mesEvento === mesAhora && diaEvento === diaAhora) {
                nuevosErrores.fecha = "No se puede crear un evento para hoy.";
                valido = false;
            }
        }

        // Validación del campo 'cantidadPersonas'.
        if (!cantidadPersonas) {
            nuevosErrores.cantidadPersonas = "La cantidad de asistentes es requerida.";
            valido = false;
        } else if (parseInt(cantidadPersonas) <= 0) {
            nuevosErrores.cantidadPersonas = "La cantidad de asistentes debe ser positiva.";
            valido = false;
        }

        // Validación del campo 'espacio'.
        if (!espacio.trim()) {
            nuevosErrores.espacio = "El espacio es requerido.";
            valido = false;
        } else if (espacio.trim().length > 200) {
            nuevosErrores.espacio = "El espacio no puede exceder los 200 caracteres.";
            valido = false;
        }

        // Validación del campo 'hora'.
        if (!hora) {
            nuevosErrores.hora = "La hora es requerida.";
            valido = false;
        }

        setErrores(nuevosErrores); // Actualiza el estado de errores con los nuevos errores encontrados.
        return valido; // Retorna true si no hay errores, false si hay alguno.
    };

    // Función asíncrona para manejar el envío del formulario.
    const manejarEnvio = async (evento) => {
        evento.preventDefault(); // Evita el comportamiento por defecto del formulario (recargar la página).

        if (!validarFormulario()) {
            return; // Si la validación falla, la función se detiene aquí.
        }

        // Crea un objeto con los datos del nuevo evento
        const nuevoEvento = {
            nombre: limpiarInput(nombre, "texto"),
            fecha,
            cantidadPersonas: parseInt(cantidadPersonas) || 0,
            espacio: limpiarInput(espacio, "texto"),
            horario,
            hora,
            clienteId: localStorage.getItem('userId')
        };

        try {
            // Realiza una petición POST a la API para crear el nuevo evento.
            const respuesta = await fetch("http://localhost:8100/api/eventos", {
                method: "POST",
                headers: { "Content-Type": "application/json" }, // Indica que el cuerpo de la petición es JSON.
                body: JSON.stringify(nuevoEvento), // Convierte el objeto del evento a una cadena JSON para enviarlo.
            });

            // Comprueba si la respuesta de la API fue exitosa (código de estado 2xx).
            if (respuesta.ok) {
                // Si se proporciona una función onSuccess, la llama.
                if (onSuccess) {
                    onSuccess();
                } else {
                    navegar("/calendario");
                }
            } else {
                const textoError = await respuesta.text(); // Obtiene el mensaje de error de la respuesta.
                setErroresGenerales((prev) => [...prev, textoError]); // Actualiza los errores generales.
            }
        } catch (errorDeConexion) {
            // Captura errores de conexión con la API.
            setErroresGenerales((prev) => [
                ...prev,
                `Error de conexión al crear el evento: ${errorDeConexion.message}`,
            ]);
        }
    };

    // Renderiza el formulario para crear un nuevo evento.
    return (
        <div className="p-6 bg-white rounded-lg shadow-md max-w-lg mx-auto">
            <h1 className="text-2xl font-bold mb-4 text-center">Crear Evento</h1>

            {/* Mostrar errores generales con MensajesDeErrores */}
            {erroresGenerales.length > 0 && <MensajesDeErrores messages={erroresGenerales} />}

            <form onSubmit={manejarEnvio} className="space-y-4">
                <div>
                    <label htmlFor="nombre" className="block text-sm font-medium">
                        Nombre
                    </label>
                    <input
                        type="text"
                        id="nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)} // Actualiza el estado 'nombre' cuando el valor del input cambia.
                        required
                        className="mt-1 w-full p-2 border rounded-md"
                    />
                    {errores.nombre && <p className="text-red-500 text-xs italic">{errores.nombre}</p>} {/* Muestra el error de nombre si existe. */}
                </div>

                <div>
                    <label htmlFor="fecha" className="block text-sm font-medium">
                        Fecha
                    </label>
                    <input
                        type="date"
                        id="fecha"
                        value={fecha} // Muestra la fecha seleccionada
                        readOnly // Para que el usuario no la modifique directamente en este formulario
                        className="mt-1 w-full p-2 border rounded-md bg-gray-100"
                    />
                    {errores.fecha && <p className="text-red-500 text-xs italic">{errores.fecha}</p>} {/* Muestra el error de fecha si existe. */}
                </div>

                <div>
                    <label htmlFor="cantidadPersonas" className="block text-sm font-medium">
                        Nº Asistentes
                    </label>
                    <input
                        type="number"
                        id="cantidadPersonas"
                        value={cantidadPersonas}
                        onChange={(e) => setCantidadPersonas(e.target.value)} // Actualiza el estado 'cantidadPersonas' cuando el valor del input cambia.
                        required
                        className="mt-1 w-full p-2 border rounded-md"
                    />
                    {errores.cantidadPersonas && <p className="text-red-500 text-xs italic">{errores.cantidadPersonas}</p>} {/* Muestra el error de cantidad de personas si existe. */}
                </div>

                <div>
                    <label htmlFor="espacio" className="block text-sm font-medium">
                        Espacio
                    </label>
                    <input
                        type="text"
                        id="espacio"
                        value={espacio}
                        onChange={(e) => setEspacio(e.target.value)} // Actualiza el estado 'espacio' cuando el valor del input cambia.
                        required
                        className="mt-1 w-full p-2 border rounded-md"
                    />
                    {errores.espacio && <p className="text-red-500 text-xs italic">{errores.espacio}</p>} {/* Muestra el error de espacio si existe. */}
                </div>

                <div>
                    <label htmlFor="horario" className="block text-sm font-medium">
                        Horario
                    </label>
                    <select
                        id="horario"
                        value={horario}
                        onChange={(e) => setHorario(e.target.value)} // Actualiza el estado 'horario' cuando el valor del input cambia.
                        required
                        className="mt-1 w-full p-2 border rounded-md"
                    >
                        <option value="MAÑANA">MAÑANA</option>
                        <option value="TARDE">TARDE</option>
                        <option value="NOCHE">NOCHE</option>
                    </select>
                    {errores.horario && <p className="text-red-500 text-xs italic">{errores.horario}</p>} {/* Muestra el error de horario si existe. */}
                </div>

                <div className="mb-4">
                    <label htmlFor="hora" className="block text-sm font-medium text-gray-700">
                        Hora
                    </label>
                    <input
                        type="time"
                        id="hora"
                        value={hora}
                        onChange={(e) => setHora(e.target.value)} // Actualiza el estado 'hora' cuando el valor del input cambia.
                        required
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errores.hora && <p className="text-red-500 text-xs italic">{errores.hora}</p>} {/* Muestra el error de hora si existe. */}
                </div>

                <div className="flex justify-between">
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Crear Evento
                    </button>
                    <button
                        type="button"
                        onClick={() => navegar("/calendario")} // Navega de vuelta a la página del calendario al hacer clic.
                        className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
}