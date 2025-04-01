import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Link } from "react-router-dom";

// Configurar el idioma a español
moment.locale("es"); // Establecer el idioma de moment a español

const localizer = momentLocalizer(moment);

export default function CalendarioEventos() {
    const [eventos, setEventos] = useState([]);

    // Cargar eventos desde la API
    useEffect(() => {
        const fetchEventos = async () => {
            try {
                const response = await fetch("http://localhost:8100/api/eventos");
                const data = await response.json();

                // Acceder a la propiedad 'content' que contiene los eventos
                const eventosFormateados = data.content.map(evento => ({
                    id: evento.id,
                    title: evento.nombre,
                    start: new Date(evento.fecha),
                    end: new Date(evento.fecha),  // Si solo tienes una fecha de evento, puedes usarla también para 'end'
                    allDay: false, // Para que no se muestre como evento de todo el día
                }));

                setEventos(eventosFormateados);
            } catch (error) {
                console.error("Error al cargar eventos:", error);
            }
        };

        fetchEventos();
    }, []);

    return (
        <>
            <div className="p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4 text-center">Calendario de Eventos</h2>
                <Calendar
                    localizer={localizer}
                    events={eventos}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 500 }}
                    views={["month", "week", "day"]} // Aseguramos que las vistas de mes, semana y día estén habilitadas
                    defaultView="month" // Definir la vista predeterminada como "month"
                    messages={{
                        month: "Mes",
                        week: "Semana",
                        day: "Día",
                        today: "Hoy",
                        previous: "Anterior",
                        next: "Siguiente",
                        showMore: (total) => `+ Ver ${total} más`,
                    }} // Mensajes personalizados en español
                />
            </div>

            <div className="mt-6 flex justify-center">
                <Link to={`/`}>
                    <button
                        type="button"
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Volver
                    </button>
                </Link>
            </div>
        </>
    );
}
