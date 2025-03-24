import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CrearEvento() {
    const [nombre, setNombre] = useState("");
    const [fecha, setFecha] = useState("");
    const [cantidadPersonas, setCantidadPersonas] = useState("");
    const [espacio, setEspacio] = useState("");
    const [horario, setHorario] = useState("");
    const [estado, setEstado] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!horario) {
            alert("Por favor, selecciona un horario.");
            return;
        }

        const nuevoEvento = {
            nombre,
            fecha,
            cantidadPersonas,
            espacio,
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
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-4">Crear Evento</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre</label>
                    <input type="text" id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                </div>

                <div className="mb-4">
                    <label htmlFor="fecha" className="block text-sm font-medium text-gray-700">Fecha</label>
                    <input type="date" id="fecha" value={fecha} onChange={(e) => setFecha(e.target.value)} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                </div>

                <div className="mb-4">
                    <label htmlFor="cantidad_personas" className="block text-sm font-medium text-gray-700">Nº Asistentes</label>
                    <input type="number" id="cantidad_personas" value={cantidadPersonas} onChange={(e) => setCantidadPersonas(e.target.value)} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                </div>

                <div className="mb-4">
                    <label htmlFor="espacio" className="block text-sm font-medium text-gray-700">Espacio</label>
                    <input type="text" id="espacio" value={espacio} onChange={(e) => setEspacio(e.target.value)} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                </div>
                

                <div className="mb-4">
                    <label htmlFor="horario" className="block text-sm font-medium text-gray-700">Horario</label>
                    <select 
                        id="horario" 
                        value={horario} 
                        onChange={(e) => setHorario(e.target.value)} 
                        required 
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    >
                        <option value="">Selecciona un horario</option>
                        <option value="MAÑANA">MAÑANA</option>
                        <option value="TARDE">TARDE</option>
                        <option value="NOCHE">NOCHE</option>
                    </select>
                </div>

                <div className="mb-4">
                <label htmlFor="estado" className="block text-sm font-medium text-gray-700">Estado</label>
                <select 
                    id="estado" 
                    value={estado} 
                    onChange={(e) => setEstado(e.target.value)} 
                    required 
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                >
                    <option value="">Selecciona un estado</option>
                    <option value="PENDIENTE">PENDIENTE</option>
                    <option value="CONFIRMADO">CONFIRMADO</option>
                    <option value="CANCELADO">CANCELADO</option>
                    <option value="FINALIZADO">FINALIZADO</option>
                </select>
            </div>


                <div className="flex justify-between items-center">
                    <button type="submit" className="bg-blue-500 text-white p-2 rounded">Crear Evento</button>
                    <button type="button" onClick={() => navigate("/eventos")} className="bg-gray-300 text-black p-2 rounded">Cancelar</button>
                </div>
            </form>
        </div>
    );
}
