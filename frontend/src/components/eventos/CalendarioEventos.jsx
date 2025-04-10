import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Link, useNavigate } from "react-router-dom";

moment.locale("es");
const localizer = momentLocalizer(moment);

export default function CalendarioEventos() {
    const [eventos, setEventos] = useState([]);
    const [view, setView] = useState("month");
    const [currentDate, setCurrentDate] = useState(new Date());
    const [loading, setLoading] = useState(true);

    // Filtros
    const [filtroEstado, setFiltroEstado] = useState("");
    const [filtroEspacio, setFiltroEspacio] = useState("");
    const [filtroHorario, setFiltroHorario] = useState("");

    const navigate = useNavigate();

    //Solicitar la información al servidor
    const fetchEventos = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch("http://localhost:8100/api/eventos/todos");
            const data = await response.json();


            if (!data || !Array.isArray(data)) {
                console.error("La respuesta no tiene la estructura esperada.");
                return;
            }

            const eventosFormateados = data.map((evento) => {
                const start = new Date(evento.fecha);
                const end = start;
            
                return {
                    id: evento.id,
                    title: evento.nombre,
                    start,
                    end,
                    allDay: false, // No es un evento de todo el día
                    estado: evento.estado || "",
                    espacio: evento.espacio || "",
                    horario: evento.horario || "",
                    fecha: evento.fecha,
                };
            });
            
            
            
            setEventos(eventosFormateados);
        } catch (error) {
            console.error("Error al cargar eventos:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchEventos();
    }, [fetchEventos]);

    //Para controlar la vista (dia, semana, mes) y la fecha
    const handleViewChange = (view) => setView(view);
    const handleNavigate = (date) => setCurrentDate(date);

    //Controlar enlace y fecha a la hora de seleccionar un dia
    const handleSelectSlot = ({ start }) => {
        const fechaSeleccionada = moment(start).format("YYYY-MM-DD");
        navigate(`/calendario/crear-evento/${fechaSeleccionada}`);
    };

    const handleRefresh = () => {
        fetchEventos();
    };

    //Para gestionar los filtros del calendario
    const eventosFiltrados = useMemo(() => {
        return eventos.filter((evento) => {
            const coincideEstado = filtroEstado ? evento.estado === filtroEstado : true;
            const coincideEspacio = filtroEspacio
                ? evento.espacio.toLowerCase().includes(filtroEspacio.toLowerCase())
                : true;
            const coincideHorario = filtroHorario ? evento.horario === filtroHorario : true;
    
            return coincideEstado && coincideEspacio && coincideHorario;
        });
    }, [eventos, filtroEstado, filtroEspacio, filtroHorario]);
    

    //Personalizacion de estilo de los horarios
    const getEstiloEvento = (evento) => {
        let backgroundColor = "#6b7280"; // gris por defecto
    
        switch (evento.horario) {
            case "MAÑANA":
                backgroundColor = "#34d399"; // verde
                break;
            case "TARDE":
                backgroundColor = "#60a5fa"; // azul
                break;
            case "NOCHE":
                backgroundColor = "#f87171"; // rojo
                break;
            default:
                backgroundColor = "#d1d5db"; // gris claro si no hay horario
        }
    
        return {
            style: {
                backgroundColor,
                borderRadius: "8px",
                opacity: 0.9,
                color: "white",
                border: "none",
                padding: "4px",
            },
        };
    };
    
    //Para mostrar de forma personalizada lo que quiero que se muestre en el calendario
    const EventoPersonalizado = ({ event }) => (
        <div>
            <strong>{event.title}</strong>
            <div style={{ fontSize: "0.8em" }}>{event.espacio}</div>
        </div>
    );

    if (loading) {
        return <div>Cargando calendario ...</div>;
    }

    return (
        <>
            <div className="p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4 text-center">Calendario de Eventos</h2>

                {/* Filtros */}
                <div className="flex flex-wrap gap-4 mb-4">
                    <select
                        value={filtroEstado}
                        onChange={(e) => setFiltroEstado(e.target.value)}
                        className="p-2 border rounded"
                    >
                        <option value="">Todos los estados</option>
                        <option value="PENDIENTE">Pendiente</option>
                        <option value="CONFIRMADO">Confirmado</option>
                        <option value="CANCELADO">Cancelado</option>
                        <option value="CANCELADO">Finalizado</option>
                    </select>

                    <input
                        type="text"
                        placeholder="Filtrar por espacio"
                        value={filtroEspacio}
                        onChange={(e) => setFiltroEspacio(e.target.value)}
                        className="p-2 border rounded"
                    />

                    <select
                        value={filtroHorario}
                        onChange={(e) => setFiltroHorario(e.target.value)}
                        className="p-2 border rounded"
                    >
                        <option value="">Todos los horarios</option>
                        <option value="MAÑANA">Mañana</option>
                        <option value="TARDE">Tarde</option>
                        <option value="NOCHE">Noche</option>
                    </select>

                    <button
                        onClick={() => {
                            setFiltroEstado("");
                            setFiltroEspacio("");
                            setFiltroHorario("");
                        }}
                        className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                    >
                        Limpiar filtros
                    </button>

                    <button
                        onClick={handleRefresh}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Refrescar
                    </button>
                </div>

                <Calendar
                    localizer={localizer}
                    // Eventos con los filtros
                    events={eventosFiltrados}
                    //Fechas de inicio y fin que en nuestro caso solo hay una fecha de inicio asi que seria la misma
                    startAccessor="start"
                    endAccessor="end"
                    //Tamaño personalizado del campo
                    style={{ height: 1000 }}
                    //Que se vean los meses, semanas y dias
                    views={["month", "week", "day"]}
                    //Por defecto que se vea el mes
                    defaultView="month"
                    //Para controlar el cambio de vista
                    view={view}
                    onView={handleViewChange}
                    //Para controlar el movimiento de anterior y siguiente
                    onNavigate={handleNavigate}
                    //Para controlar el dia seleccionado para crear eventos
                    selectable
                    onSelectSlot={handleSelectSlot}
                    //Colores para los horarios
                    eventPropGetter={getEstiloEvento}
                    //Para mostrar en el calendario los datos que quiero
                    components={{
                        event: EventoPersonalizado,
                    }}
                    //Personalización en español de lo que se ve
                    messages={{
                        month: "Mes",
                        week: "Semana",
                        day: "Día",
                        today: "Hoy",
                        previous: "Anterior",
                        next: "Siguiente",
                        showMore: (total) => `+ Ver ${total} más`,
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
