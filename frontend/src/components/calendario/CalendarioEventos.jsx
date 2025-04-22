import { useState, useEffect, useCallback, useMemo } from "react";
import moment from "moment";
import "moment/locale/es";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Link, useNavigate } from "react-router-dom";

moment.locale("es");
const localizer = momentLocalizer(moment);

export default function CalendarioEventos() {
    const [eventos, setEventos] = useState([]);
    const [view, setView] = useState("month");
    const [currentDate, setCurrentDate] = useState(new Date());
    const [cargando, setCargando] = useState(true);

    // Filtros
    const [filtroEstado, setFiltroEstado] = useState("");
    const [filtroEspacio, setFiltroEspacio] = useState("");
    const [filtroHorario, setFiltroHorario] = useState("");

    const navegar = useNavigate();

    // Solicitar la información al servidor
    const fetchEventos = useCallback(async () => {
        setCargando(true);
        try {
            const response = await fetch("http://localhost:8100/api/eventos/todos");
            const data = await response.json();

            if (!data || !Array.isArray(data)) {
                console.error("La respuesta no tiene la estructura esperada.");
                return;
            }

            const eventosFormateados = data.map((evento) => {
                // Formateamos la fecha y la hora
                const fecha = new Date(evento.fecha); // La fecha
                const hora = evento.hora ? evento.hora.split(":") : [0, 0]; // Obtenemos la hora y los minutos
                fecha.setHours(hora[0]);  // Establecemos las horas
                fecha.setMinutes(hora[1]);  // Establecemos los minutos
                fecha.setSeconds(0);      // Aseguramos segundos a 0
                fecha.setMilliseconds(0); // Aseguramos milisegundos a 0

                // Calcula una hora de fin 60 minutos después del inicio
                const end = new Date(fecha.getTime() + 120 * 60000); 
                return {
                    id: evento.id,
                    title: evento.nombre,
                    start: fecha,
                    end: end, 
                    allDay: false, // No es un evento de todo el día
                    estado: evento.estado || "",
                    espacio: evento.espacio || "",
                    horario: evento.horario || "",
                    fecha: evento.fecha, // Mantienes la fecha original si la necesitas para otra cosa
                };
            });

            setEventos(eventosFormateados);
        } catch (error) {
            console.error("Error al cargar eventos:", error);
        } finally {
            setCargando(false);
        }
    }, []);

    useEffect(() => {
        fetchEventos();
    }, [fetchEventos]);

    // Para controlar la vista (día, semana, mes) y la fecha
    const handleViewChange = (view) => setView(view);
    const handleNavigate = (date) => setCurrentDate(date);

    // Controlar enlace y fecha al seleccionar un día
    const handleSelectSlot = ({ start }) => {
        const fechaSeleccionada = moment(start).format("YYYY-MM-DD");
        navegar(`/calendario/crear-evento/${fechaSeleccionada}`);
    };

    const handleRefresh = () => {
        fetchEventos();
    };

    // Para gestionar los filtros del calendario
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

    // Personalización de estilo de los horarios
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
                borderRadius: "4px",
                opacity: 0.9,
                color: "white",
                border: "none",
            },
        };
    };

    // Para la vista de día - Mostrando Título y Espacio
    const EventoPersonalizadoDia = ({ event }) => {
        return (
            <div style={{
                height: 'auto',
                width: '100%',
                overflow: 'visible', 
                padding: '2px 4px',
                fontSize: '0.8em', 
                color: 'white',
                display: 'flex',
                flexDirection: 'column', 
                justifyContent: 'flex-start', 
                boxSizing: 'border-box',
            }}>
                {/* Línea 1: Título */}
                <div style={{
                    fontWeight: 'bold',  
                    whiteSpace: 'normal',
                    overflow: 'visible',
                    textOverflow: 'unset',
                }}>
                    {event.title}
                </div>

                {/* Línea 2: Espacio (si existe) */}
                {event.espacio && (
                    <div style={{
                        fontSize: '0.9em', 
                        whiteSpace: 'normal',
                        overflow: 'visible',
                        textOverflow: 'unset',
                    }}>
                        {event.espacio}
                    </div>
                )}
            </div>
        );
    };

    // Para la vista del mes
    const EventoPersonalizadoMes = ({ event }) => (
        <div>
            <strong>{event.title}</strong>
            <div style={{ fontSize: "0.8em" }}>{event.espacio}</div>
        </div>
    );

    // Para la vista de semana
    const EventoPersonalizadoSemana = ({ event }) => {
        return (
            <div style={{
                padding: '8px',
                fontSize: '1em',
                backgroundColor:
                    event.horario === "MAÑANA" ? "#34d399" :
                    event.horario === "TARDE" ? "#60a5fa" :
                    event.horario === "NOCHE" ? "#f87171" :
                    "#d1d5db",
                borderRadius: '8px',
                color: 'white',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                minHeight: '60px',  // Esto puede ser ajustado según lo que necesites
                width: '100%',
                overflow: 'visible', // Asegura que todo el contenido sea visible
            }}>
                <strong>{event.title}</strong>
                <div style={{ fontSize: "0.85em" }}>{event.espacio}</div>
            </div>
        );
    };

    if (cargando) {
        return <div>Cargando calendario ...</div>;
    }

    const handleSelectEvent = (event) => {
        // Redirigir a la página de detalles del evento
        navegar(`/calendario/detalle-evento/${event.id}`);
    };

    // Textos del calendario
    const messages = {
        month: 'Mes',
        week: 'Semana',
        day: 'Día',
        today: 'Hoy',
        previous: 'Anterior',
        next: 'Siguiente',
        showMore: total => `+ Ver más (${total})`,
        date: 'Fecha',
        time: 'Hora',
        event: 'Evento',
        noEventsInRange: 'No hay eventos en este rango.',
        weekdays: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
        weekdaysShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
        months: [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ],
        monthsShort: [
            'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 
            'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
        ],
    };

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
                        <option value="FINALIZADO">Finalizado</option>
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
                        onClick={handleRefresh}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Refrescar
                    </button>
                </div>

                <Calendar
                    localizer={localizer}
                    culture="es"
                    events={eventosFiltrados}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 1000 }}
                    views={["month", "week", "day"]}
                    defaultView="month"
                    view={view}
                    onView={handleViewChange}
                    onNavigate={handleNavigate}
                    selectable
                    onSelectSlot={handleSelectSlot}
                    onSelectEvent={handleSelectEvent}
                    eventPropGetter={getEstiloEvento}
                    components={{
                        event: EventoPersonalizadoMes,
                        week: {
                            event: EventoPersonalizadoSemana
                        },
                        day: {
                            event: EventoPersonalizadoDia
                        }
                    }}
                    messages={messages}
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
