import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function EditarEvento() {
    const { id } = useParams();
    const [nombre, setNombre] = useState("");
    const [fecha, setFecha] = useState("");
    const [cantidadPersonas, setCantidadPersonas] = useState("");
    const [espacio, setEspacio] = useState("");
    const [horario, setHorario] = useState("");
    const [hora, setHora] = useState("");
    const [estado, setEstado] = useState("");
    const [errores, setErrores] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`http://localhost:8100/api/eventos/${id}`, {
            credentials: 'include',
        })
            .then((response) => response.json())
            .then((data) => {
                setNombre(data.nombre);
                setFecha(data.fecha);
                setCantidadPersonas(data.cantidadPersonas);
                setEspacio(data.espacio);
                setHorario(data.horario);
                setHora(data.hora);
                setEstado(data.estado);
            })
            .catch((error) => console.error("Error al cargar el evento:", error));
    }, [id]);

    const limpiarInput = (valor, tipo) => {
        if (tipo === "texto") {
            return valor.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ ]/g, "");
        }
        if (tipo === "numero") {
            return valor.replace(/[^0-9]/g, "");
        }
        return valor;
    };

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
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(eventoActualizado),
                credentials: 'same-origin',
            });

            if (response.ok) {
                navigate("/eventos");
            } else {
                const errorData = await response.text();
                setErrores({ general: errorData });
            }
        } catch (error) {
            console.error("Error al editar el evento:", error);
            setErrores({ general: "Hubo un error al intentar actualizar el evento. Inténtalo más tarde." });
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen py-6 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Editar Evento</h1>

                {errores.general && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <strong className="font-bold">Error!</strong>
                    <span className="block sm:inline">{errores.general}</span>
                </div>}

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
                        {errores.nombre && <p className="text-red-500 text-xs italic">{errores.nombre}</p>}
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
                        {errores.fecha && <p className="text-red-500 text-xs italic">{errores.fecha}</p>}
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
                        {errores.cantidadPersonas && <p className="text-red-500 text-xs italic">{errores.cantidadPersonas}</p>}
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
                        {errores.espacio && <p className="text-red-500 text-xs italic">{errores.espacio}</p>}
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
                        {errores.horario && <p className="text-red-500 text-xs italic">{errores.horario}</p>}
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
                        {errores.hora && <p className="text-red-500 text-xs italic">{errores.hora}</p>}
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
                        {errores.estado && <p className="text-red-500 text-xs italic">{errores.estado}</p>}
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