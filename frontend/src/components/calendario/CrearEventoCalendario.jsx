import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function CrearEventoCalendario({ onSuccess }) {
    const { fecha } = useParams(); // Obtiene la fecha de la URL
    const [nombre, setNombre] = useState("");
    const [cantidadPersonas, setCantidadPersonas] = useState("");
    const [espacio, setEspacio] = useState("");
    const [horario, setHorario] = useState("MAÑANA");
    const [hora, setHora] = useState("");
    const [errores, setErrores] = useState({});
    const navegar = useNavigate();

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
                const textoError = await respuesta.text();
                setErrores({ general: textoError });
            }
        } catch (errorDeConexion) {
            setErrores({ general: `Error de conexión al crear el evento: ${errorDeConexion.message}` });
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md max-w-lg mx-auto">
            <h1 className="text-2xl font-bold mb-4 text-center">Crear Evento</h1>
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
                        className="mt-1 w-full p-2 border rounded-md"
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
                        value={fecha} // Muestra la fecha seleccionada
                        readOnly // Para que el usuario no la modifique
                        className="mt-1 w-full p-2 border rounded-md bg-gray-100"
                    />
                    {errores.fecha && <p className="text-red-500 text-xs italic">{errores.fecha}</p>}
                </div>

                <div>
                    <label htmlFor="cantidadPersonas" className="block text-sm font-medium">
                        Nº Asistentes
                    </label>
                    <input
                        type="number"
                        id="cantidadPersonas"
                        value={cantidadPersonas}
                        onChange={(e) => setCantidadPersonas(e.target.value)}
                        required
                        className="mt-1 w-full p-2 border rounded-md"
                    />
                    {errores.cantidadPersonas && <p className="text-red-500 text-xs italic">{errores.cantidadPersonas}</p>}
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
                        className="mt-1 w-full p-2 border rounded-md"
                    />
                    {errores.espacio && <p className="text-red-500 text-xs italic">{errores.espacio}</p>}
                </div>

                <div>
                    <label
                        htmlFor="horario"
                        className="block text-sm font-medium"
                    >
                        Horario
                    </label>
                    <select
                        id="horario"
                        value={horario}
                        onChange={(e) => setHorario(e.target.value)}
                        required
                        className="mt-1 w-full p-2 border rounded-md"
                    >
                        <option value="MAÑANA">MAÑANA</option>
                        <option value="TARDE">TARDE</option>
                        <option value="NOCHE">NOCHE</option>
                    </select>
                    {errores.horario && <p className="text-red-500 text-xs italic">{errores.horario}</p>}
                </div>

                <div className="mb-4">
                    <label htmlFor="hora" className="block text-sm font-medium text-gray-700">Hora</label>
                    <input
                        type="time"
                        id="hora"
                        value={hora}
                        onChange={(e) => setHora(e.target.value)}
                        required
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errores.hora && <p className="text-red-500 text-xs italic">{errores.hora}</p>}
                </div>

                {errores.general && <div className="text-red-500 mt-4">{errores.general}</div>}

                <div className="flex justify-between">
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Crear Evento
                    </button>
                    <button
                        type="button"
                        onClick={() => navegar("/calendario")}
                        className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
}