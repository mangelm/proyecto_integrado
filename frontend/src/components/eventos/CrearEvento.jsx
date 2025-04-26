import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Este componente permite crear un nuevo evento. Utiliza hooks de React para manejar el estado y la navegación.
export default function CrearEvento({ onSuccess }) {
    
    const [nombre, setNombre] = useState(""); // Estado para almacenar el nombre del evento
    const [fecha, setFecha] = useState(""); // Estado para almacenar la fecha del evento
    const [cantidadPersonas, setCantidadPersonas] = useState(""); // Estado para almacenar la cantidad de personas que asistirán al evento
    const [espacio, setEspacio] = useState(""); // Estado para almacenar el espacio donde se llevará a cabo el evento
    const [horario, setHorario] = useState("MAÑANA"); // Estado para almacenar el horario del evento (MAÑANA, TARDE, NOCHE)
    const [hora, setHora] = useState(""); // Estado para almacenar la hora del evento
    const [errores, setErrores] = useState({}); // Estado para almacenar los errores de validación del formulario
    const navegar = useNavigate(); // Hook de React Router para navegar entre rutas

    
    /* Función para limpiar el input, eliminando caracteres no deseados según el tipo (texto o número)
    Esta función se utiliza para limpiar los valores de los inputs antes de enviarlos al servidor.
    Se utiliza una expresión regular para eliminar caracteres no deseados.
    Si el tipo es "texto", se eliminan caracteres que no sean letras, números o espacios.
    Si el tipo es "numero", se eliminan caracteres que no sean dígitos.
    Si no se especifica un tipo, se devuelve el valor original. */
    const limpiarInput = (valor, tipo) => { 
        if (tipo === "texto") {
            return valor.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ ]/g, "");
        }
        if (tipo === "numero") {
            return valor.replace(/[^0-9]/g, "");
        }
        return valor;
    };

    /* 
        Función para validar el formulario antes de enviarlo.
        Se verifica que todos los campos requeridos estén completos y que los valores sean válidos.
        Si hay errores, se actualiza el estado de errores y se devuelve false.
        Si no hay errores, se devuelve true.
        Se valida el nombre, la fecha (debe ser futura y no puede ser hoy), la cantidad de personas 
        (debe ser positiva), el espacio (no puede exceder 200 caracteres) y la hora (no puede estar vacía).
        Si algún campo no es válido, se agrega un mensaje de error correspondiente al estado de errores.
        Si todos los campos son válidos, se devuelve true.
        Si el nombre no es válido, se agrega un mensaje de error correspondiente al estado de errores
        Si la fecha no es válida, se agrega un mensaje de error correspondiente al estado de errores.
        Si la cantidad de personas no es válida, se agrega un mensaje de error correspondiente al estado de errores.
        Si el espacio no es válido, se agrega un mensaje de error correspondiente al estado de errores.
        Si la hora no es válida, se agrega un mensaje de error correspondiente al estado de errores.
        Si todos los campos son válidos, se devuelve true.
    */
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

            const anoEvento = fechaEvento.getFullYear();
            const mesEvento = fechaEvento.getMonth();
            const diaEvento = fechaEvento.getDate();

            const anoAhora = ahora.getFullYear();
            const mesAhora = ahora.getMonth();
            const diaAhora = ahora.getDate();

            if (anoEvento < anoAhora || (anoEvento === anoAhora && mesEvento < mesAhora) || (anoEvento === anoAhora && mesEvento === mesAhora && diaEvento < diaAhora)) {
                nuevosErrores.fecha = "La fecha debe ser futura.";
                valido = false;
            } else if (anoEvento === anoAhora && mesEvento === mesAhora && diaEvento === diaAhora) {
                nuevosErrores.fecha = "No se puede crear un evento para hoy.";
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

        setErrores(nuevosErrores);
        return valido;
    };
    
    
    /* 
        Función para manejar el envío del formulario.
        Se previene el comportamiento por defecto del formulario y se valida el formulario.
        Si hay errores, no se envía el formulario.
        Si no hay errores, se crea un nuevo evento con los datos del formulario y se envía una solicitud POST al servidor.
        Si la respuesta es exitosa, se navega a la página de eventos o se llama a la función onSuccess si está definida.
        Si hay un error en la conexión o en la respuesta, se actualiza el estado de errores con el mensaje correspondiente.
        Se utiliza la función limpiarInput para limpiar los valores de los inputs antes de enviarlos al servidor.
        Se utiliza la función validarFormulario para validar los datos del formulario antes de enviarlos al servidor.
        Se utiliza la función setErrores para actualizar el estado de errores con los mensajes de error correspondientes.
        Se utiliza la función setNombre, setFecha, setCantidadPersonas, setEspacio, setHorario y setHora para actualizar 
        el estado de los inputs con los valores correspondientes.
    */
    const manejarEnvio = async (evento) => {
        evento.preventDefault();
        if (!validarFormulario()) {
            return; // No se envía si hay errores
        }

        const nuevoEvento = {
            nombre: limpiarInput(nombre, "texto"),
            fecha,
            cantidadPersonas: parseInt(cantidadPersonas) || 0,
            espacio: limpiarInput(espacio, "texto"),
            horario,
            hora,
        };

        try {
            // Se envía una solicitud POST al servidor para crear un nuevo evento
            const respuesta = await fetch("http://localhost:8100/api/eventos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(nuevoEvento),
            });

            if (respuesta.ok) {
                // Si la respuesta es exitosa, se navega a la página de eventos o se llama a la función onSuccess si está definida
                if (onSuccess) {
                    onSuccess();
                } else {
                    navegar("/eventos");
                }
            } else {
                // Si hay un error en la respuesta, se actualiza el estado de errores con el mensaje correspondiente
                const textoError = await respuesta.text();
                setErrores({ general: textoError });
            }
        } catch (errorDeConexion) {
            // Si hay un error en la conexión, se actualiza el estado de errores con el mensaje correspondiente
            setErrores({ general: `Error de conexión al crear el evento: ${errorDeConexion.message}` });
        }
    };

    return (
        <div className="p-4 sm:p-6 md:p-8 bg-white rounded-lg shadow-md max-w-md mx-auto">
            <h1 className="text-xl font-bold mb-4 text-center sm:text-2xl">Crear Evento</h1>
            <form onSubmit={manejarEnvio} className="space-y-4">
                <div>
                    <label htmlFor="nombre" className="block text-sm font-medium">
                        Nombre
                    </label>
                    <input
                        type="text"
                        id="nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)} // Se utiliza la función limpiarInput para limpiar el valor del input 
                        required
                        className="mt-1 w-full p-2 border rounded-md text-gray-900 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    {errores.nombre && <p className="text-red-500 text-xs italic">{errores.nombre}</p>}
                    
                </div>

                <div>
                    <label htmlFor="fecha" className="block text-sm font-medium">
                        Fecha
                    </label>
                    <input
                        type="date"
                        id="fecha"
                        value={fecha}
                        onChange={(e) => setFecha(e.target.value)} //
                        /* 
                            Función para validar el formulario antes de enviarlo.
                            Se verifica que todos los campos requeridos estén completos y que los valores sean válidos.
                            Si hay errores, se actualiza el estado de errores y se devuelve false.
                            Si no hay errores, se devuelve true.
                            Se valida el nombre, la fecha (debe ser futura y no puede ser hoy), la cantidad de personas 
                            (debe ser positiva), el espacio (no puede exceder 200 caracteres) y la hora (no puede estar vacía).
                            Si algún campo no es válido, se agrega un mensaje de error correspondiente al estado de errores.
                            Si todos los campos son válidos, se devuelve true.
                            Si el nombre no es válido, se agrega un mensaje de error correspondiente al estado de errores
                            Si la fecha no es válida, se agrega un mensaje de error correspondiente al estado de errores.
                            Si la cantidad de personas no es válida, se agrega un mensaje de error correspondiente al estado de errores.
                            Si el espacio no es válido, se agrega un mensaje de error correspondiente al estado de errores.
                            Si la hora no es válida, se agrega un mensaje de error correspondiente al estado de errores.
                            Si todos los campos son válidos, se devuelve true.
                        */
                        required
                        className="mt-1 w-full p-2 border rounded-md text-gray-900 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    {errores.fecha && <p className="text-red-500 text-xs italic">{errores.fecha}</p>}
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
                        {errores.cantidadPersonas && <p className="text-red-500 text-xs italic">{errores.cantidadPersonass}</p>}
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
                        {errores.espacio && <p className="text-red-500 text-xs italic">{errores.espacio}</p>}
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
                    {errores.horario && <p className="text-red-500 text-xs italic">{errores.horario}</p>}
                
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
                    {errores.hora && <p className="text-red-500 text-xs italic">{errores.hora}</p>}
                </div>

                {/* Se muestra un mensaje de error general si hay algún error en la conexión o en la respuesta
                al crear el evento */}
                {errores.general && <div className="text-red-500 mt-4">{errores.general}</div>}

                <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full sm:w-auto"
                    >
                        Crear Evento
                    </button>
                    <button
                        type="button"
                        // Se utiliza la función navegar para redirigir al usuario a la página de eventos
                        // al hacer clic en el botón "Cancelar"
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