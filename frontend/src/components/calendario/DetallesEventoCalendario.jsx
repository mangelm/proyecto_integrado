import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function DetallesEventoCalendario() {
    const { id } = useParams();
    const [nombre, setNombre] = useState("");
    const [fecha, setFecha] = useState("");
    const [cantidadPersonas, setCantidadPersonas] = useState("");
    const [espacio, setEspacio] = useState("");
    const [horario, setHorario] = useState("");
    const [hora, setHora] = useState("");
    const [estado, setEstado] = useState("");

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
                setHora(data.hora);
                setEstado(data.estado);
            })
            .catch((error) => console.error("Error al cargar el evento:", error));
    }, [id]);

    return (
        <div className="max-w-lg mx-auto p-4 sm:p-6 md:p-8 bg-white rounded-lg shadow-md text-center">
            <h1 className="text-2xl font-semibold text-gray-800 mb-4 md:text-3xl">Detalles del Evento</h1>
            
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">Nombre</label>
                    <p className="p-3 bg-gray-50 border border-gray-300 rounded-md text-gray-800">{nombre}</p>
                </div>

                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-2">Fecha</label>
                    <p className="p-3 bg-gray-50 border border-gray-300 rounded-md text-gray-800">{fecha}</p>
                </div>

                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-2">Nº Asistentes</label>
                    <p className="p-3 bg-gray-50 border border-gray-300 rounded-md text-gray-800">{cantidadPersonas}</p>
                </div>

                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-2">Espacio</label>
                    <p className="p-3 bg-gray-50 border border-gray-300 rounded-md text-gray-800">{espacio}</p>
                </div>

                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-2">Horario</label>
                    <p className="p-3 bg-gray-50 border border-gray-300 rounded-md text-gray-800">{horario}</p>
                </div>

                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-2">Hora Inicio</label>
                    <p className="p-3 bg-gray-50 border border-gray-300 rounded-md text-gray-800">{hora}</p>
                </div>

                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-2">Estado</label>
                    <p className="p-3 bg-gray-50 border border-gray-300 rounded-md text-gray-800">{estado}</p>
                </div>
            </div>

            <div className="mt-6 flex justify-center">
                <button
                    type="button"
                    onClick={() => window.history.back()} // Vuelve a la página anterior
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
                >
                    Volver
                </button>
            </div>
        </div>
    );
}
