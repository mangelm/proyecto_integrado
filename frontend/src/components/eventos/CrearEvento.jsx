import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MensajesDeErrores from "../../pages/MensajesDeErrores";

// Este componente permite crear un nuevo evento.
export default function CrearEvento({ onSuccess }) {
    const [nombre, setNombre] = useState(""); // Estado para almacenar el nombre del evento
    const [fecha, setFecha] = useState(""); // Estado para almacenar la fecha del evento
    const [cantidadPersonas, setCantidadPersonas] = useState(""); // Estado para almacenar la cantidad de personas
    const [espacio, setEspacio] = useState(""); // Estado para almacenar el espacio del evento
    const [horario, setHorario] = useState("MAÑANA"); // Estado para almacenar el horario del evento
    const [hora, setHora] = useState(""); // Estado para almacenar la hora del evento
    const [erroresFormulario, setErroresFormulario] = useState({}); // Estado para errores específicos del formulario
    const [erroresGenerales, setErroresGenerales] = useState([]); // Estado para errores generales
    const navegar = useNavigate(); // Hook de React Router para navegar entre rutas

    // Función para limpiar el input
    const limpiarInput = (valor, tipo) => {
        if (tipo === "texto") {
            return valor.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ ]/g, "");
        }
        if (tipo === "numero") {
            return valor.replace(/[^0-9]/g, "");
        }
        return valor;
    };

    // Validar el formulario
    const validarFormulario = () => {
        let valido = true;
        const nuevosErrores = {};

        if (!nombre.trim()) {
            nuevosErrores.nombre = "El nombre es requerido.";
            valido = false;
        } else if (nombre.trim().length < 3 || nombre.trim().length > 100) {
            nuevosErrores.nombre = "El nombre debe tener entre 3 y 100 caracteres.";
            valido = false;
        }

        if (!fecha) {
            nuevosErrores.fecha = "La fecha es requerida.";
            valido = false;
        } else {
            const fechaEvento = new Date(fecha);
            const ahora = new Date();
            if (fechaEvento <= ahora) {
                nuevosErrores.fecha = "La fecha debe ser futura.";
                valido = false;
            }
        }

        if (!cantidadPersonas) {
            nuevosErrores.cantidadPersonas = "La cantidad de asistentes es requerida.";
            valido = false;
        } else if (parseInt(cantidadPersonas) <= 0) {
            nuevosErrores.cantidadPersonas = "La cantidad de asistentes debe ser positiva.";
            valido = false;
        }

        if (!espacio.trim()) {
            nuevosErrores.espacio = "El espacio es requerido.";
            valido = false;
        } else if (espacio.trim().length > 200) {
            nuevosErrores.espacio = "El espacio no puede exceder los 200 caracteres.";
            valido = false;
        }

        if (!hora) {
            nuevosErrores.hora = "La hora es requerida.";
            valido = false;
        }

        setErroresFormulario(nuevosErrores);
        return valido;
    };

    // Manejar el envío del formulario
    const manejarEnvio = async (e) => {
        e.preventDefault();
        setErroresGenerales([]);

        // Validar el formulario antes de enviar
        if (!validarFormulario()) {
            return;
        }

        const nuevoEvento = {
            nombre: limpiarInput(nombre, "texto"),
            fecha: fecha,
            cantidadPersonas: parseInt(limpiarInput(cantidadPersonas, "numero")),
            espacio: limpiarInput(espacio, "texto"),
            horario: horario,
            hora: hora,
            clienteId: localStorage.getItem('userId')
        };

        try {
            const respuesta = await fetch("http://localhost:8100/api/eventos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(nuevoEvento),
            });

            if (respuesta.ok) {
                if (onSuccess) {
                    onSuccess();
                } else {
                    navegar("/eventos");
                }
            } else {
                const errorData = await respuesta.json();
                if (errorData && typeof errorData === 'object') {
                    if (Array.isArray(errorData.errors)) {
                        setErroresGenerales(errorData.errors.map(err => err.defaultMessage));
                    } else {
                        setErroresGenerales([errorData.message || "Error al crear el evento"]);
                    }
                } else {
                    setErroresGenerales(["Error al crear el evento. Intenta nuevamente."]);
                }
            }
        } catch (error) {
            console.error("Error al crear el evento:", error);
            if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
                setErroresGenerales(["Error de conexión. Verifica tu conexión a internet."]);
            } else {
                setErroresGenerales(["Error inesperado al crear el evento. Intenta nuevamente."]);
            }
        }
    };

    return (
        <div className="p-4 sm:p-6 md:p-8 bg-white rounded-lg shadow-md max-w-md mx-auto">
            <h1 className="text-xl font-bold mb-4 text-center sm:text-2xl">Crear Evento</h1>

            {/* Mostrar errores generales */}
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
                        onChange={(e) => setNombre(e.target.value)}
                        required
                        className="mt-1 w-full p-2 border rounded-md text-gray-900 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    {erroresFormulario.nombre && <p className="text-red-500 text-xs italic">{erroresFormulario.nombre}</p>}
                </div>

                <div>
                    <label htmlFor="fecha" className="block text-sm font-medium">
                        Fecha
                    </label>
                    <input
                        type="date"
                        id="fecha"
                        value={fecha}
                        onChange={(e) => setFecha(e.target.value)}
                        required
                        className="mt-1 w-full p-2 border rounded-md text-gray-900 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    {erroresFormulario.fecha && <p className="text-red-500 text-xs italic">{erroresFormulario.fecha}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="cantidad_personas" className="block text-sm font-medium">
                            Nº Asistentes
                        </label>
                        <input
                            type="number"
                            id="cantidad_personas"
                            value={cantidadPersonas}
                            onChange={(e) => setCantidadPersonas(e.target.value)}
                            required
                            className="mt-1 w-full p-2 border rounded-md text-gray-900 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                        {erroresFormulario.cantidadPersonas && (
                            <p className="text-red-500 text-xs italic">{erroresFormulario.cantidadPersonas}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="espacio" className="block text-sm font-medium">
                            Espacio
                        </label>
                        <input
                            type="text"
                            id="espacio"
                            value={espacio}
                            onChange={(e) => setEspacio(e.target.value)}
                            required
                            className="mt-1 w-full p-2 border rounded-md text-gray-900 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                        {erroresFormulario.espacio && <p className="text-red-500 text-xs italic">{erroresFormulario.espacio}</p>}
                    </div>
                </div>

                <div>
                    <label htmlFor="horario" className="block text-sm font-medium">
                        Horario
                    </label>
                    <select
                        id="horario"
                        value={horario}
                        onChange={(e) => setHorario(e.target.value)}
                        required
                        className="mt-1 w-full p-2 border rounded-md text-gray-900 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                        <option value="MAÑANA">MAÑANA</option>
                        <option value="TARDE">TARDE</option>
                        <option value="NOCHE">NOCHE</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="hora" className="block text-sm font-medium">
                        Hora
                    </label>
                    <input
                        type="time"
                        id="hora"
                        value={hora}
                        onChange={(e) => setHora(e.target.value)}
                        required
                        className="mt-1 w-full p-2 border rounded-md text-gray-900 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    {erroresFormulario.hora && <p className="text-red-500 text-xs italic">{erroresFormulario.hora}</p>}
                </div>

                <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full sm:w-auto"
                    >
                        Crear Evento
                    </button>
                    <button
                        type="button"
                        onClick={() => navegar("/eventos")}
                        className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 w-full sm:w-auto"
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
}