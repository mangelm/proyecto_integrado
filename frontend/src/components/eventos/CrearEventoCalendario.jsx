import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function CrearEventoCalendario() {
    const { fecha } = useParams(); // Obtiene la fecha de la URL
    const [nombre, setNombre] = useState("");
    const [cantidadPersonas, setCantidadPersonas] = useState("");
    const [espacio, setEspacio] = useState("");
    const [horario, setHorario] = useState("MAÑANA");
    const [estado, setEstado] = useState("PENDIENTE");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const nuevoEvento = {
            nombre,
            fecha, // Usa la fecha recibida desde la URL
            cantidadPersonas: parseInt(cantidadPersonas) || 0,
            espacio,
            horario,
            estado,
        };

        try {
            const response = await fetch("http://localhost:8100/api/eventos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(nuevoEvento),
            });

            if (response.ok) {
                navigate("/calendario"); // Redirige al calendario después de crear el evento
            } else {
                alert("Error al crear el evento");
            }
        } catch (error) {
            alert("Error al crear el evento: " + error.message);
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md max-w-lg mx-auto">
            <h1 className="text-2xl font-bold mb-4 text-center">Crear Evento</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                </div>

                <div>
                    <label 
                        htmlFor="estado" 
                        className="block text-sm font-medium"
                        >
                            Estado
                        </label>
                    <select 
                        id="estado" 
                        value={estado} 
                        onChange={(e) => setEstado(e.target.value)}
                        required 
                        className="mt-1 w-full p-2 border rounded-md"
                    >
                        <option value="PENDIENTE">PENDIENTE</option>
                        <option value="CONFIRMADO">CONFIRMADO</option>
                        <option value="CANCELADO">CANCELADO</option>
                        <option value="FINALIZADO">FINALIZADO</option>
                    </select>
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
                        onClick={() => navigate("/calendario")}
                        className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
}
