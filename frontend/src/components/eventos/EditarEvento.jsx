import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function EditarEvento() {
    const { id } = useParams();
    const [nombre, setNombre] = useState("");
    const [fecha, setFecha] = useState("");
    const [cantidadPersonas, setCantidadPersonas] = useState("");
    const [espacio, setEspacio] = useState("");
    const [horario, setHorario] = useState("");
    const [estado, setEstado] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`http://localhost:8100/api/eventos/${id}`, {
            credentials: 'include'
        })
            .then((response) => response.json())
            .then((data) => {
                setNombre(data.nombre);
                setFecha(data.fecha);
                setCantidadPersonas(data.cantidadPersonas);
                setEspacio(data.espacio);
                setHorario(data.horario);
                setEstado(data.estado);
            })
            .catch((error) => console.error("Error al cargar el evento:", error));
    }, [id]);

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
    
        const eventoActualizado = {
            nombre: sanitizeInput(nombre,"text"),
            fecha,
            cantidadPersonas: sanitizeInput(cantidadPersonas,"number"),
            espacio: sanitizeInput(espacio,"text"),
            horario,
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
                // Redirigir a la lista de eventos después de la actualización exitosa
                navigate("/eventos");
            } else {
                // Si no es una respuesta OK, intenta obtener el cuerpo de la respuesta.
                const errorData = await response.text(); // Cambiado a .text() para manejar respuestas vacías
                throw new Error(errorData || 'Error al actualizar el evento');
            }
        } catch (error) {
            console.error("Error al editar el evento:", error);
        }
    };
    
    

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-4">Editar Evento</h1>
            <form onSubmit={handleSubmit}>            
                <div className="mb-4">
                    <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre</label>
                    <input
                        type="text"
                        id="nombre"
                        value={nombre}
                        onChange={(e) => setNombre(sanitizeInput(e.target.value,"text"))}
                        required
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="fecha" className="block text-sm font-medium text-gray-700">Fecha</label>
                    <input
                        type="date"
                        id="fecha"
                        value={fecha}
                        onChange={(e) => setFecha(e.target.value)}
                        required
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="cantidad_personas" className="block text-sm font-medium text-gray-700">Nº Asistentes</label>
                    <input
                        type="number"
                        id="cantidad_personas"
                        value={cantidadPersonas}
                        onChange={(e) => setCantidadPersonas(sanitizeInput(e.target.value,"number"))}
                        required
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="espacio" className="block text-sm font-medium text-gray-700">Espacio</label>
                    <input
                        type="text"
                        id="espacio"
                        value={espacio}
                        onChange={(e) => setEspacio(sanitizeInput(e.target.value,"text"))}
                        required
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                
                <div className="mb-4">
                    <label htmlFor="horario" className="block text-sm font-medium text-gray-700">Horario</label>
                    <select
                        id="horario"
                        value={horario}
                        onChange={(e) => setHorario(e.target.value)}
                        required
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
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
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="PENDIENTE">PENDIENTE</option>
                        <option value="CONFIRMADO">CONFIRMADO</option>
                        <option value="CANCELADO">CANCELADO</option>
                        <option value="FINALIZADO">FINALIZADO</option>
                    </select>
                </div>

                <div className="flex justify-between items-center">
                    <button
                        type="submit"
                        className="bg-blue-500 text-white p-2 rounded"
                    >
                        Guardar Cambios
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate("/eventos")}
                        className="bg-gray-300 text-black p-2 rounded"
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
}
