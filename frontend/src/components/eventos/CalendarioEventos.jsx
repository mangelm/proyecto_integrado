import React, { useState, useEffect, useCallback } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Link, useNavigate } from "react-router-dom";

// Configurar el idioma a español
moment.locale("es");

const localizer = momentLocalizer(moment);

export default function CalendarioEventos() {
    const [eventos, setEventos] = useState([]);
    const [view, setView] = useState("month");
    const [currentDate, setCurrentDate] = useState(new Date());
    const [loading, setLoading] = useState(true); // Estado de carga
    const navigate = useNavigate();

    // Función para cargar los eventos sin paginación
    const fetchEventos = useCallback(async () => {
        setLoading(true); // Inicia el estado de carga
        try {
            // Llamamos al endpoint para obtener todos los eventos sin paginación
            const response = await fetch("http://localhost:8100/api/eventos/todos");
            const data = await response.json();

            console.log("Datos recibidos:", data); // Inspeccionar la estructura de los datos

            if (!data || !Array.isArray(data)) {
                console.error("La respuesta no tiene la estructura esperada.");
                return;
            }

            // Verificamos si la respuesta tiene la propiedad 'consumos' y mapeamos los eventos
            const eventosFormateados = data.map((evento) => {
                const start = new Date(evento.fecha); // Usamos 'fecha' como la fecha del evento
                const end = start; // Suponiendo que los eventos son de un solo día

                return {
                    id: evento.id,
                    title: evento.nombre, // El nombre del evento se muestra en el calendario
                    start,
                    end,
                    allDay: true, // Si el evento es de todo el día
                };
            });

            console.log("Eventos formateados:", eventosFormateados); // Verificar los eventos formateados

            setEventos(eventosFormateados);
        } catch (error) {
            console.error("Error al cargar eventos:", error);
        } finally {
            setLoading(false); // Finaliza el estado de carga
        }
    }, []);

    // Cargar eventos cuando se monta el componente
    useEffect(() => {
        fetchEventos();
    }, [fetchEventos]);

    // Manejar cambios de vista
    const handleViewChange = (view) => {
        setView(view);
    };

    // Manejar la navegación entre fechas
    const handleNavigate = (date) => {
        setCurrentDate(date);
    };

    // Manejar la selección de un slot (fecha en el calendario)
    const handleSelectSlot = ({ start }) => {
        const fechaSeleccionada = moment(start).format("YYYY-MM-DD");
        navigate(`/calendario/crear-evento/${fechaSeleccionada}`);
    };

    // Función para refrescar los eventos
    const handleRefresh = () => {
        fetchEventos();
    };

    if (loading) {
        return <div>Cargando...</div>; // Muestra un mensaje de carga mientras se obtienen los eventos
    }

    return (
        <>
            <div className="p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4 text-center">Calendario de Eventos</h2>

                <div className="flex justify-between mb-4">
                    {/* Botón de refrescar */}
                    <button
                        onClick={handleRefresh}
                        className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
                    >
                        Refrescar
                    </button>
                </div>

                {/* Muestra el calendario */}
                <Calendar
                    localizer={localizer}
                    events={eventos}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 500 }}
                    views={["month", "week", "day"]}
                    defaultView="month"
                    view={view}
                    onView={handleViewChange}
                    onNavigate={handleNavigate}
                    selectable
                    onSelectSlot={handleSelectSlot}
                    messages={{
                        month: "Mes",
                        week: "Semana",
                        day: "Día",
                        today: "Hoy",
                        previous: "Anterior",
                        next: "Siguiente",
                        showMore: (total) => `+ Ver ${total} más`,
                        weekday: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
                        monthNames: [
                            "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
                            "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
                        ],
                    }}
                    culture="es"
                    date={currentDate}
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
