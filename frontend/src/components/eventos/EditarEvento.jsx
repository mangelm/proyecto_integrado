import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function EditarEvento() {
    const { id } = useParams(); // Extrae el ID del evento de la URL
    const [nombre, setNombre] = useState(""); // Estado para almacenar el nombre del evento
    const [fecha, setFecha] = useState(""); // Estado para almacenar la fecha del evento
    const [cantidadPersonas, setCantidadPersonas] = useState(""); // Estado para almacenar la cantidad de personas
    const [espacio, setEspacio] = useState(""); // Estado para almacenar el espacio del evento
    const [horario, setHorario] = useState(""); // Estado para almacenar el horario del evento
    const [hora, setHora] = useState(""); // Estado para almacenar la hora del evento
    const [estado, setEstado] = useState(""); // Estado para almacenar el estado del evento
    const [erroresFormulario, setErroresFormulario] = useState({}); // Estado para almacenar los errores de validación
    const [erroresGenerales, setErroresGenerales] = useState({});
    const navigate = useNavigate(); // Hook para navegar a otras rutas

    // useEffect es un hook de React que se utiliza para manejar efectos secundarios en componentes funcionales.
    // En este caso, se utiliza para realizar una solicitud a la API cuando el componente se monta.
    useEffect(() => {
        fetch(`http://localhost:8100/api/eventos/${id}`, {
            // Realiza una solicitud GET a la API para obtener los detalles del evento
            method: "GET",
            credentials: 'include',
            // Incluye las credenciales de la sesión (cookies) en la solicitud
        })  
            // Convierte la respuesta a JSON
            // y actualiza el estado del componente con los datos del evento
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error al cargar los datos del evento.");
                }
                return response.json();
            })
            .then((data) => {
                setNombre(data.nombre);
                setFecha(data.fecha);
                setCantidadPersonas(data.cantidadPersonas);
                setEspacio(data.espacio);
                setHorario(data.horario);
                setHora(data.hora);
                setEstado(data.estado);
            }).catch((error) => {
                console.error("Error al cargar el evento:", error.message);
                setErroresGenerales((prevErrores) => [
                    ...prevErrores,
                    "Error al cargar los datos del evento. Intenta nuevamente.",
                ]);
            });
    }, [id]);

    // Función para limpiar el input de texto o número
    // dependiendo del tipo de dato que se espera
    // Se utiliza una expresión regular para eliminar caracteres no deseados
    // y devolver el valor limpio
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
        Función para validar el formulario antes de enviarlo
        Se verifica que los campos requeridos no estén vacíos y que cumplan con las restricciones de longitud
        Se valida que la fecha sea futura y que la cantidad de personas sea positiva
        Se actualiza el estado de errores con los mensajes correspondientes 
        y se devuelve un valor booleano indicando si el formulario es válido o no
        Se utiliza una expresión regular para validar el formato de la fecha
        y se compara con la fecha actual para asegurarse de que sea futura
        Se utiliza el método getFullYear(), getMonth() y getDate() para obtener el año, mes y día de la fecha
        y se compara con la fecha actual para asegurarse de que sea futura 
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

        setErroresFormulario(nuevosErrores);
        return valido;
    };
    
    /*
        Función para manejar el envío del formulario
        Se previene el comportamiento por defecto del formulario
        Se valida el formulario y si es válido, se crea un objeto con los datos del evento
        Se realiza una solicitud PUT a la API para actualizar el evento
        Si la respuesta es exitosa, se navega a la lista de eventos
        Si hay un error, se actualiza el estado de errores con el mensaje de error
        Se utiliza el método fetch para realizar la solicitud a la API
        y se envían los datos del evento en formato JSON
        Se utiliza el método JSON.stringify para convertir el objeto a una cadena JSON
        y se envía en el cuerpo de la solicitud
        Se utiliza el método navigate para redirigir al usuario a la lista de eventos
        y se utiliza el método response.ok para verificar si la respuesta fue exitosa
        y se maneja cualquier error que ocurra durante la solicitud
        y se muestra en la consola
        Se utiliza el método response.text() para obtener el mensaje de error
        y se actualiza el estado de errores con el mensaje de error
        y se muestra en la consola
        Se utiliza el método setErrores para actualizar el estado de errores
        y se muestra el mensaje de error en la interfaz de usuario
    */
    const manejarEnvio = async (e) => {
        e.preventDefault();
        if (!validarFormulario()) {
            return;
        }

        const eventoActualizado = {
            nombre: limpiarInput(nombre, "text"),
            fecha,
            cantidadPersonas: parseInt(cantidadPersonas) || 0,
            espacio: limpiarInput(espacio, "text"),
            horario,
            hora,
            estado,
        };

        try {
            const response = await fetch(`http://localhost:8100/api/eventos/${id}`, {
                method: "PUT",
                headers: {
                    // "Content-Type" es un encabezado que indica el tipo de contenido que se 
                    // está enviando en la solicitud
                    "Content-Type": "application/json",
                },
                
                body: JSON.stringify(eventoActualizado),
                credentials: 'same-origin',
            });

            if (response.ok) {
                navigate("/eventos");
            } else {
                const errorData = await response.text();
                setErroresGenerales((prevErrores) => [
                    ...prevErrores,
                    errorData || "Error al actualizar el evento. Intenta nuevamente.",
                ]);
            }
        } catch (error) {
            console.error("Error al editar el evento:", error.message);
            setErroresGenerales((prevErrores) => [
                ...prevErrores,
                "Hubo un error al intentar actualizar el evento. Inténtalo más tarde.",
            ]);
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen py-6 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Editar Evento</h1>

                {/* Mostrar errores generales */}
                {erroresGenerales.length > 0 && <MensajesDeErrores messages={erroresGenerales} />}

                <form onSubmit={manejarEnvio} className="space-y-4">
                    <div>
                        <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre</label>
                        <input
                            type="text"
                            id="nombre"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            required
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                        {erroresFormulario.nombre && <p className="text-red-500 text-xs italic">{erroresFormulario.nombre}</p>}
                    </div>

                    <div>
                        <label htmlFor="fecha" className="block text-sm font-medium text-gray-700">Fecha</label>
                        <input
                            type="date"
                            id="fecha"
                            value={fecha}
                            onChange={(e) => setFecha(e.target.value)}
                            required
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                        {erroresFormulario.fecha && <p className="text-red-500 text-xs italic">{erroresFormulario.fecha}</p>}
                    </div>

                    <div>
                        <label htmlFor="cantidad_personas" className="block text-sm font-medium text-gray-700">Nº Asistentes</label>
                        <input
                            type="number"
                            id="cantidad_personas"
                            value={cantidadPersonas}
                            onChange={(e) => setCantidadPersonas(e.target.value)}
                            required
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                        {erroresFormulario.cantidadPersonas && <p className="text-red-500 text-xs italic">{erroresFormulario.cantidadPersonas}</p>}
                    </div>

                    <div>
                        <label htmlFor="espacio" className="block text-sm font-medium text-gray-700">Espacio</label>
                        <input
                            type="text"
                            id="espacio"
                            value={espacio}
                            onChange={(e) => setEspacio(e.target.value)}
                            required
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                        {erroresFormulario.espacio && <p className="text-red-500 text-xs italic">{erroresFormulario.espacio}</p>}
                    </div>

                    <div>
                        <label htmlFor="horario" className="block text-sm font-medium text-gray-700">Horario</label>
                        <select
                            id="horario"
                            value={horario}
                            onChange={(e) => setHorario(e.target.value)}
                            required
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                            <option value="MAÑANA">MAÑANA</option>
                            <option value="TARDE">TARDE</option>
                            <option value="NOCHE">NOCHE</option>
                        </select>
                        {erroresFormulario.horario && <p className="text-red-500 text-xs italic">{erroresFormulario.horario}</p>}
                    </div>

                    <div>
                        <label htmlFor="hora" className="block text-sm font-medium text-gray-700">Hora</label>
                        <input
                            type="time"
                            id="hora"
                            value={hora}
                            onChange={(e) => setHora(e.target.value)}
                            required
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                        {erroresFormulario.hora && <p className="text-red-500 text-xs italic">{erroresFormulario.hora}</p>}
                    </div>

                    <div>
                        <label htmlFor="estado" className="block text-sm font-medium text-gray-700">Estado</label>
                        <select
                            id="estado"
                            value={estado}
                            onChange={(e) => setEstado(e.target.value)}
                            required
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                            <option value="PENDIENTE">PENDIENTE</option>
                            <option value="CONFIRMADO">CONFIRMADO</option>
                            <option value="CANCELADO">CANCELADO</option>
                            <option value="FINALIZADO">FINALIZADO</option>
                        </select>
                        {erroresFormulario.estado && <p className="text-red-500 text-xs italic">{erroresFormulario.estado}</p>}
                    </div>

                    <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0 justify-end">
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline block w-full sm:w-auto"
                        >
                            Guardar Cambios
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate("/eventos")}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline block w-full sm:w-auto"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}