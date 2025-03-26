import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CrearEvento() {
    const [nombre, setNombre] = useState("");
    const [fecha, setFecha] = useState("");
    const [cantidadPersonas, setCantidadPersonas] = useState("");
    const [espacio, setEspacio] = useState("");
    const [horario, setHorario] = useState("MAÑANA");
    const [estado, setEstado] = useState("PENDIENTE");
    const navigate = useNavigate();

    const sanitizeInput = (value, type) => {
        if (type === "text") {
            return value.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ ]/g, ""); // Solo letras, números y espacios
        }
        if (type === "number") {
            return value.replace(/[^0-9]/g, ""); // Solo números
        }
        return value;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!horario) {
            alert("Por favor, selecciona un horario.");
            return;
        }

        const nuevoEvento = {
            nombre: sanitizeInput(nombre,"text"),
            fecha,
            cantidadPersonas: parseInt(cantidadPersonas) || 0,
            espacio: sanitizeInput(espacio,"text"),
            horario,
            estado,
        };

        try {
            const response = await fetch("http://localhost:8100/api/eventos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(nuevoEvento),
                credentials: 'same-origin',
            });

            console.log("Respuesta:", response);
            if (response.ok) {
                navigate("/eventos");
            } else {
                const errorData = await response.text();
                console.log("Error en la respuesta:", errorData);
                throw new Error(errorData || 'Error al crear el evento');
            }
        } catch (error) {
            console.error("Error al crear el evento:", error);
            alert("Error al crear el evento. Verifica la consola para más detalles.");
        }
    };
    

    return (
        <div className="p-6 bg-white rounded-lg shadow-md max-w-lg mx-auto">
            <h1 className="text-2xl font-bold mb-4 text-center">Crear Evento</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label 
                        htmlFor="nombre" 
                        className="block text-sm font-medium"
                    >
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
                    <label 
                        htmlFor="fecha" 
                        className="block text-sm font-medium">
                            Fecha
                    </label>
                    <input 
                        type="date" 
                        id="fecha" 
                        value={fecha} 
                        onChange={(e) => setFecha(e.target.value)}
                        required 
                        className="mt-1 w-full p-2 border rounded-md" 
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label 
                            htmlFor="cantidad_personas" 
                            className="block text-sm font-medium"
                        >
                            Nº Asistentes
                        </label>
                        <input 
                            type="number" 
                            id="cantidad_personas" 
                            value={cantidadPersonas}
                            onChange={(e) => setCantidadPersonas(e.target.value)}
                            required 
                            className="mt-1 w-full p-2 border rounded-md" 
                        />
                    </div>

                    <div>
                        <label 
                            htmlFor="espacio" 
                            className="block text-sm font-medium"
                        >
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
                        onClick={() => navigate("/eventos")} 
                        className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
}
