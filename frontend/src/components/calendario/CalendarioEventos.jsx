import { useState, useEffect, useCallback, useMemo } from "react";
import moment from "moment";
import "moment/locale/es";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Link, useNavigate } from "react-router-dom";


moment.locale("es"); // Establece el idioma español para todas las instancias de moment.
const localizer = momentLocalizer(moment); // Crea un localizador que permite al componente Calendar entender y usar objetos de moment para las fechas.

export default function CalendarioEventos() {
    // Estados para gestionar la información y la interfaz del calendario
    const [eventos, setEventos] = useState([]); // Estado para almacenar la lista de eventos obtenidos del servidor.
    const [vista, setVista] = useState("month"); // Estado para controlar la vista actual del calendario (mes, semana, día). Por defecto es "month".
    const [fechaActual, setFechaActual] = useState(new Date()); // Estado para controlar la fecha actual mostrada en el calendario. Inicialmente la fecha actual del sistema.
    const [cargando, setCargando] = useState(true); // Estado para indicar si los datos del calendario se están cargando.


    // Estados para los filtros
    const [filtroEstado, setFiltroEstado] = useState(""); // Estado para almacenar el filtro por estado del evento.
    const [filtroEspacio, setFiltroEspacio] = useState(""); // Estado para almacenar el filtro por espacio del evento (permite búsqueda parcial).
    const [filtroHorario, setFiltroHorario] = useState(""); // Estado para almacenar el filtro por horario del evento (MAÑANA, TARDE, NOCHE).

    // Hook para obtener la función de navegación proporcionada por React Router.
    const navegar = useNavigate();

    // Función asíncrona para solicitar la información de los eventos al servidor
    const fetchEventos = useCallback(async () => {
        setCargando(true); // Indica que la carga de eventos ha comenzado.
        try {
            const response = await fetch("http://localhost:8100/api/eventos/todos"); // Realiza una petición GET al endpoint para obtener todos los eventos.
            const data = await response.json(); // Convierte la respuesta del servidor a formato JSON.

            // Comprueba si la respuesta es válida y tiene la estructura esperada (un array).
            if (!data || !Array.isArray(data)) {
                console.error("La respuesta no tiene la estructura esperada.");
                return; // Sale de la función si la estructura de la respuesta es incorrecta.
            }

            // Mapea los datos recibidos del servidor al formato esperado por react-big-calendar.
            const eventosFormateados = data.map((evento) => {
                // Formateamos la fecha y la hora para que react-big-calendar pueda interpretarlas.
                const fechaInicial = new Date(evento.fecha); // Crea un objeto Date a partir de la cadena de fecha del evento.
                const hora = evento.hora ? evento.hora.split(":") : [0, 0]; // Si la hora existe, la divide en horas y minutos. Si no, usa [0, 0].
                fechaInicial.setHours(parseInt(hora[0], 10));  // Establece las horas en el objeto Date.
                fechaInicial.setMinutes(parseInt(hora[1], 10));  // Establece los minutos en el objeto Date.
                fechaInicial.setSeconds(0);      // Aseguramos segundos a 0
                fechaInicial.setMilliseconds(0); // Aseguramos milisegundos a 0

                // Calcula una hora de fin para el evento (en este caso, 120 minutos después del inicio).
                const fechaFinal = new Date(fechaInicial.getTime() + 120 * 60000); 
                return {
                    id: evento.id, // Identificador único del evento.
                    title: evento.nombre, // Título del evento que se mostrará en el calendario.
                    start: fechaInicial, // Fecha y hora de inicio del evento en formato Date.
                    end: fechaFinal, // Fecha y hora de fin del evento en formato Date.
                    allDay: false, // Indica que no es un evento de todo el día.
                    estado: evento.estado || "", // Estado del evento (PENDIENTE, CONFIRMADO, etc.). Si no existe, se establece como una cadena vacía.
                    espacio: evento.espacio || "", // Espacio donde se realiza el evento. Si no existe, se establece como una cadena vacía.
                    horario: evento.horario || "", // Horario del evento (MAÑANA, TARDE, NOCHE). Si no existe, se establece como una cadena vacía.
                    fecha: evento.fecha, // Mantiene la fecha original sin formato de hora, útil si se necesita para otros fines.
                };
            });

            setEventos(eventosFormateados); // Actualiza el estado con los eventos formateados.
        } catch (error) {
            console.error("Error al cargar eventos:", error); // Muestra un error en la consola si falla la petición.
        } finally {
            setCargando(false); // Indica que la carga de eventos ha finalizado, independientemente del resultado.
        }
    }, []);  // El array de dependencias vacío significa que esta función useCallback solo se creará una vez al montar el componente.

    // Hook de efecto para llamar a la función fetchEventos al montar el componente o cuando cambian sus dependencias.
    useEffect(() => {
        fetchEventos();
    }, [fetchEventos]); // Se vuelve a ejecutar si la función fetchEventos cambia (aunque en este caso, nunca cambiará gracias a useCallback con dependencias vacías).

    // Funciones para controlar la vista y la navegación del calendario
    const manejoCambioVistas = (vista) => setVista(vista);
    const manejoNavegacion = (fechaActual) => setFechaActual(fechaActual);

    // Función para controlar la acción al seleccionar un día en la vista del mes o semana
    const manejoSeleccionarDia = ({ start }) => {
        const fechaSeleccionada = moment(start).format("YYYY-MM-DD");
        navegar(`/calendario/nuevo/${fechaSeleccionada}`);
    };

    // Función para recargar los eventos del servidor
    const manejoRefrescar = () => {
        fetchEventos(); // Llama a la función para obtener de nuevo los eventos.
    };

    // Hook useMemo para filtrar los eventos basados en los estados de los filtros.
    const eventosFiltrados = useMemo(() => {
        return eventos.filter((evento) => {
            // Comprueba si el estado del evento coincide con el filtro de estado (si hay un filtro aplicado).
            const coincideEstado = filtroEstado ? evento.estado === filtroEstado : true;
            // Comprueba si el espacio del evento (en minúsculas) incluye el texto del filtro de espacio (en minúsculas) (si hay un filtro aplicado).
            const coincideEspacio = filtroEspacio
                ? evento.espacio.toLowerCase().includes(filtroEspacio.toLowerCase())
                : true;
            // Comprueba si el horario del evento coincide con el filtro de horario (si hay un filtro aplicado).
            const coincideHorario = filtroHorario ? evento.horario === filtroHorario : true;

            // Devuelve true si el evento cumple con todos los filtros aplicados.
            return coincideEstado && coincideEspacio && coincideHorario;
        });
    }, [eventos, filtroEstado, filtroEspacio, filtroHorario]); // Se recalcula cuando cambia alguno de estos valores.

    // Función para personalizar el estilo de los eventos en el calendario según su horario.
    const getEstiloEvento = (evento) => {
        let backgroundColor = "#6b7280"; // Color gris por defecto.

        // Asigna un color de fondo diferente según el horario del evento.
        switch (evento.horario) {
            case "MAÑANA":
                backgroundColor = "#34d399"; // Verde para eventos de la mañana.
                break;
            case "TARDE":
                backgroundColor = "#60a5fa"; // Azul para eventos de la tarde.
                break;
            case "NOCHE":
                backgroundColor = "#f87171"; // Rojo para eventos de la noche.
                break;
            default:
                backgroundColor = "#d1d5db"; // Gris claro si no se especifica el horario.
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

    // Componente para personalizar la visualización de un evento en la vista de día.
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
                {/* Línea 1: Título del evento en negrita */}
                <div style={{
                    fontWeight: 'bold',  
                    whiteSpace: 'normal',
                    overflow: 'visible',
                    textOverflow: 'unset',
                }}>
                    {event.title}
                </div>

                {/* Línea 2: Espacio del evento (si existe) con un tamaño de fuente ligeramente menor */}
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

    // Componente para personalizar la visualización de un evento en la vista de mes.
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
                minHeight: '60px',  // Asegura una altura mínima para que el contenido no se vea cortado.
                width: '100%',
                overflow: 'visible', // Asegura que el contenido que exceda el tamaño se muestre.
            }}>
                <strong>{event.title}</strong> {/* Muestra el título del evento en negrita. */}
                <div style={{ fontSize: "0.85em" }}>{event.espacio}</div> {/* Muestra el espacio del evento con un tamaño de fuente ligeramente menor. */}
            </div>
        );
    };

    // Muestra un mensaje de carga mientras se obtienen los eventos.
    if (cargando) {
        return <div>Cargando calendario ...</div>;
    }

    // Función para manejar la selección de un evento en el calendario.
    const manejoSeleccionarEvento = (event) => {
        // Redirige a la página de detalles del evento, utilizando el ID del evento seleccionado.
        navegar(`/calendario/${event.id}`);
    };

    // Objeto con los textos personalizados para el calendario en español.
    const messages = {
        month: 'Mes',
        week: 'Semana',
        day: 'Día',
        today: 'Hoy',
        previous: 'Anterior',
        next: 'Siguiente',
        showMore: total => `+ Ver más (${total})`, // Función para el texto de "ver más" cuando hay muchos eventos en un día.
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

                {/* Sección de filtros */}
                <div className="flex flex-wrap gap-4 mb-4">
                    {/* Filtro por estado del evento */}
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

                    {/* Filtro por espacio del evento (permite búsqueda parcial) */}
                    <input
                        type="text"
                        placeholder="Filtrar por espacio"
                        value={filtroEspacio}
                        onChange={(e) => setFiltroEspacio(e.target.value)}
                        className="p-2 border rounded"
                    />

                    {/* Filtro por horario del evento */}
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

                    {/* Botón para recargar los eventos */}
                    <button
                        onClick={manejoRefrescar}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Refrescar
                    </button>
                </div>

                {/* Componente principal del calendario */}
                <Calendar
                    localizer={localizer} // Proporciona la configuración de localización para las fechas.
                    culture="es" // Establece la cultura del calendario a español para formatos y textos.
                    events={eventosFiltrados} // Array de eventos a mostrar en el calendario (ya filtrados).
                    startAccessor="start" // Nombre del campo en el objeto de evento que contiene la fecha y hora de inicio.
                    endAccessor="end" // Nombre del campo en el objeto de evento que contiene la fecha y hora de fin.
                    style={{ height: 1000 }} // Define la altura del calendario.
                    views={["month", "week", "day"]} // Define las vistas disponibles para el calendario (mes, semana, día).
                    defaultView="month" // Establece la vista por defecto al cargar el calendario.
                    view={vista} // Controla la vista actual del calendario mediante el estado 'vista'.
                    onView={manejoCambioVistas} // Función que se llama cuando el usuario cambia la vista del calendario.
                    onNavigate={manejoNavegacion} // Función que se llama cuando el usuario navega a una nueva fecha.
                    selectable // Permite seleccionar rangos de días
                    onSelectSlot={manejoSeleccionarDia} // Función que se llama al seleccionar un espacio vacío en el calendario (para crear un nuevo evento).
                    onSelectEvent={manejoSeleccionarEvento} // Función que se llama al hacer clic en un evento existente.
                    eventPropGetter={getEstiloEvento} // Función que devuelve un objeto de estilos para personalizar la apariencia de los eventos.
                    // Objeto que permite reemplazar los componentes por defecto del calendario con implementaciones personalizadas.
                    components={{
                        event: EventoPersonalizadoMes, // Componente personalizado para renderizar los eventos en la vista de mes.
                        week: {
                            event: EventoPersonalizadoSemana // Componente personalizado para renderizar los eventos en la vista de semana.
                        },
                        day: {
                            event: EventoPersonalizadoDia // Componente personalizado para renderizar los eventos en la vista de dia
                        }
                    }} 
                    messages={messages} // Objeto con los textos personalizados para la interfaz del calendario.
                    date={fechaActual} // Fecha actual que se muestra en el calendario, controlada por el estado 'fechaActual'.
                />
            </div>
            
            {/* Botón para volver a la página principal */}
            <div className="mt-6 flex justify-center">
                <Link to={`/panel-administracion`}> {/* Componente Link de React Router para crear un enlace navegable. */}
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
