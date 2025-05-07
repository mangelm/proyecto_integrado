import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MensajesDeErrores from "../../pages/MensajesDeErrores"; // Importa el componente para mostrar errores generales.

export default function EditarEventoCalendario() {
    const { id } = useParams(); // Obtiene el parámetro 'id' de la URL
    const navigate = useNavigate(); // Hook para navegar entre rutas

    // Estados para los campos del formulario
    const [nombre, setNombre] = useState("");
    const [fecha, setFecha] = useState("");
    const [cantidadPersonas, setCantidadPersonas] = useState("");
    const [espacio, setEspacio] = useState("");
    const [horario, setHorario] = useState("");
    const [hora, setHora] = useState("");
    const [estado, setEstado] = useState("");
    const [erroresFormulario, setErroresFormulario] = useState({});
    const [erroresGenerales, setErroresGenerales] = useState([]);

    // Cargar los datos del evento al montar el componente
    useEffect(() => {
        fetch(`http://localhost:8100/api/eventos/${id}`, {
            credentials: "include",
        })
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
            })
            .catch((error) => {
                console.error("Error al cargar el evento:", error.message);
                setErroresGenerales((prevErrores) => [
                    ...prevErrores,
                    "Error al cargar los datos del evento. Intenta nuevamente.",
                ]);
            });
    }, [id]);

    // Validar el formulario antes de enviarlo
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
        }

        if (!cantidadPersonas || parseInt(cantidadPersonas) <= 0) {
            nuevosErrores.cantidadPersonas = "La cantidad de asistentes debe ser positiva.";
            valido = false;
        }

        if (!espacio.trim()) {
            nuevosErrores.espacio = "El espacio es requerido.";
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
        if (!validarFormulario()) {
            return;
        }

        const eventoActualizado = {
            nombre,
            fecha,
            cantidadPersonas: parseInt(cantidadPersonas),
            espacio,
            horario,
            hora,
            estado,
        };

        try {
            const response = await fetch(`http://localhost:8100/api/eventos/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(eventoActualizado),
                credentials: "include",
            });

            if (response.ok) {
                navigate("/calendario");
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

                    <div className="flex justify-end space-x-4">
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Guardar Cambios
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate("/calendario")}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}