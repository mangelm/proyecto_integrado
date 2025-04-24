import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Link } from "react-router-dom";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function EstadisticasOcupacion() {
    const [eventos, setEventos] = useState([]); // Estado para almacenar la lista de eventos obtenida de la API.
    const [eventoSeleccionado, setEventoSeleccionado] = useState(""); // Estado para almacenar el ID del evento seleccionado por el usuario.
    const [estadisticas, setEstadisticas] = useState([]); // Estado para almacenar las estadísticas de ocupación del evento seleccionado.
    const [horariosUnicos, setHorariosUnicos] = useState([]); // Estado para almacenar los horarios únicos disponibles en las estadísticas del evento.
    const [horarioSeleccionadoGraficoPrincipal, setHorarioSeleccionadoGraficoPrincipal] = useState(""); // Estado para el horario seleccionado en el gráfico principal.
    const [cargando, setCargando] = useState(false); // Estado para indicar si los datos están en proceso de carga.
    const [error, setError] = useState(null); // Estado para almacenar cualquier error ocurrido durante la carga de datos.
    const [graficoHorariosMasSolicitados, setGraficoHorariosMasSolicitados] = useState(null); // Estado para almacenar los datos del gráfico de horarios más solicitados.
    const [mostrarGraficoHorarios, setMostrarGraficoHorarios] = useState(false); // Estado para controlar la visibilidad del gráfico de horarios más solicitados.
    const [graficoDiasMasSolicitados, setGraficoDiasMasSolicitados] = useState(null); // Estado para almacenar los datos del gráfico de días más solicitados.
    const [mostrarGraficoDias, setMostrarGraficoDias] = useState(false); // Estado para controlar la visibilidad del gráfico de días más solicitados.
    const [mostrarGraficoPrincipal, setMostrarGraficoPrincipal] = useState(true); // Estado para controlar la visibilidad del gráfico principal de ocupación.

    // Este efecto se ejecuta una vez al montar el componente para obtener la lista de eventos.
    useEffect(() => {
        const obtenerEventos = async () => {
            setCargando(true); // Indica que la carga de eventos ha comenzado.
            setError(null); // Limpia cualquier error previo.
            try {
                // Realiza una petición GET a la API para obtener todos los eventos.
                const response = await fetch("http://localhost:8100/api/eventos/todos"); 
                // Si la respuesta de la API no es exitosa.
                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${await response.text()}`); // Lanza un error con el código de estado y el mensaje de la respuesta.
                }
                
                const data = await response.json(); // Convierte la respuesta de la API a formato JSON.
                
                // Verifica si la respuesta es un array.
                if (Array.isArray(data)) {
                    setEventos(data); // Actualiza el estado 'eventos' con los datos obtenidos.

                    // Si hay eventos en la lista.
                    if (data.length > 0) {
                        // Selecciona el ID del primer evento por defecto.
                        setEventoSeleccionado(data[0].id);
                    }
                // Si la respuesta no es un array.
                } else {
                    setEventos([]); // Establece 'eventos' como un array vacío.
                    setError("Error: La respuesta del servidor no es un array de eventos."); // Establece un mensaje de error.
                }

            // Captura cualquier error ocurrido durante la petición.
            } catch (error) {
                setError(error.message); // Establece el mensaje de error.
            
                // Se ejecuta al final del try...catch, independientemente de si hubo un error.
            } finally {
                setCargando(false); // Indica que la carga de eventos ha finalizado
            }
        };

        obtenerEventos(); // Llama a la función para obtener los eventos al montar el componente.
    }, []); // El array de dependencias vacío asegura que este efecto se ejecute solo una vez.

    // Este efecto se ejecuta cada vez que cambia el 'eventoSeleccionado' para obtener las estadísticas del evento.
    useEffect(() => {
        const obtenerEstadisticasEvento = async () => {

            // Si no hay un evento seleccionado, no hace nada.
            if (!eventoSeleccionado) return;

            setCargando(true); // Indica que la carga de estadísticas ha comenzado.
            setError(null); // Limpia cualquier error previo
            setEstadisticas([]); // Limpia las estadísticas previas.
            setGraficoHorariosMasSolicitados(null); // Limpia los datos del gráfico de horarios.
            setGraficoDiasMasSolicitados(null); // Limpia los datos del gráfico de días.

            try {
                // Realiza una petición GET para obtener las estadísticas de ocupación del evento.
                const response = await fetch(`http://localhost:8100/api/estadisticas/ocupacion/evento/${eventoSeleccionado}`);
                // Si la respuesta no es exitosa.
                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${await response.text()}`);
                }

                const data = await response.json(); // Convierte la respuesta a JSON.
                setEstadisticas(data); // Actualiza el estado 'estadisticas' con los datos obtenidos.

                const horarios = [...new Set(data.map(item => item.horario))]; // Obtiene un array de horarios únicos del conjunto de datos.
                setHorariosUnicos(horarios); // Actualiza el estado 'horariosUnicos'.
                setHorarioSeleccionadoGraficoPrincipal(horarios[0] || ""); // Selecciona el primer horario como predeterminado para el gráfico principal.

                calcularHorariosMasSolicitadosEvento(data); // Llama a la función para calcular los horarios más solicitados.
                calcularDiasMasSolicitadosEvento(data); // Llama a la función para calcular los días más solicitados.

            } 
            // Captura errores durante la petición.
            catch (error) {
                setError(error.message); // Establece el mensaje de error.
            } finally {
                setCargando(false); // Indica que la carga de estadísticas ha finalizado.
            }
        };

        obtenerEstadisticasEvento(); // Llama a la función para obtener las estadísticas al cambiar el evento seleccionado.
    }, [eventoSeleccionado]); // El efecto se vuelve a ejecutar cada vez que cambia 'eventoSeleccionado'.

    const manejoCambioEvento = (e) => {
        setEventoSeleccionado(e.target.value); // Actualiza el estado con el ID del evento seleccionado.
    };

    const manejoCambioHorarioGraficoPrincipal = (e) => setHorarioSeleccionadoGraficoPrincipal(e.target.value); // Actualiza el estado del horario seleccionado para el gráfico principal.

    const manejoBotonClickPrincipal = () => {
        setMostrarGraficoPrincipal(prev => !prev); // Invierte la visibilidad del gráfico principal al hacer clic en el botón.
    };

    // Calcula la frecuencia de cada horario en los datos.
    const calcularHorariosMasSolicitadosEvento = (data) => {
        
        const horariosSolicitados = data.reduce((acc, item) => {
            const horario = item.horario;
            acc[horario] = (acc[horario] || 0) + 1; // Incrementa el contador del horario o lo inicializa en 1.
            return acc; // Devuelve el acumulador actualizado.
        }, {});

        // Ordena los horarios por su frecuencia de forma descendente y toma los 5 más frecuentes.
        const horariosOrdenados = Object.entries(horariosSolicitados).sort((a, b) => b[1] - a[1]);
        const topHorarios = horariosOrdenados.slice(0, 5);

        // Extrae las etiquetas (horarios) y los datos (frecuencias) para el gráfico.
        const labels = topHorarios.map(horario => horario[0]);
        const dataHorarios = topHorarios.map(horario => horario[1]);

        // Establece el estado con la configuración del gráfico de horarios más solicitados.
        setGraficoHorariosMasSolicitados({
            labels: labels,
            datasets: [
                {
                    label: 'Horarios más frecuentes en este evento', // Etiqueta del conjunto de datos.
                    data: dataHorarios, // Datos de frecuencia de los horarios.
                    backgroundColor: 'rgba(153, 102, 255, 0.2)', // Color de fondo de las barras.
                    borderColor: 'rgba(153, 102, 255, 1)', // Color del borde de las barras.
                    borderWidth: 1 // Ancho del borde de las barras.
                }
            ]
        });
    };

    // Calcula la frecuencia de cada fecha en los datos.
    const calcularDiasMasSolicitadosEvento = (data) => {
        
        const espaciosPorFecha = data.reduce((acc, item) => {
            const fecha = new Date(item.fecha).toLocaleDateString('es-ES'); // Formatea la fecha a un string local.
            acc[fecha] = (acc[fecha] || 0) + 1; // Incrementa el contador de la fecha o lo inicializa en 1.
            return acc; // Devuelve el acumulador.
        }, {}); // Inicializa el acumulador como un objeto vacío.

        // Ordena las fechas por su frecuencia de forma descendente y toma las 5 más frecuentes.
        const diasOrdenados = Object.entries(espaciosPorFecha).sort((a, b) => b[1] - a[1]);
        const topDias = diasOrdenados.slice(0, 5);

        // Extrae las etiquetas (días) y los datos (frecuencias) para el gráfico.
        const labels = topDias.map(dia => dia[0]);
        const dataDias = topDias.map(dia => dia[1]);

        // Establece el estado con la configuración del gráfico de días más solicitados.
        setGraficoDiasMasSolicitados({
            labels: labels,
            datasets: [
                {
                    label: 'Momentos con más actividad en este evento', // Etiqueta del conjunto de datos.
                    data: dataDias, // Datos de frecuencia de los días.
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',  // Color de fondo de las barras.
                    borderColor: 'rgba(75, 192, 192, 1)', // Color del borde de las barras.
                    borderWidth: 1 // Ancho del borde de las barras.
                }
            ]
        });
    };

    // Renderiza el gráfico principal de ocupación por espacio para el horario seleccionado.
    const renderChart = () => {
        // Si no hay datos o no se ha seleccionado un horario, no renderiza nada.
        if (!estadisticas.length || !horarioSeleccionadoGraficoPrincipal) return null;

        // Filtra las estadísticas para el horario seleccionado.
        const datosFiltrados = estadisticas.filter(item => item.horario === horarioSeleccionadoGraficoPrincipal);
        // Obtiene un array de espacios únicos del conjunto de datos filtrado.
        const espaciosUnicos = [...new Set(datosFiltrados.map(item => item.espacio))];

        // Crea los conjuntos de datos para el gráfico, uno por cada espacio único.
        const datasets = espaciosUnicos.map(espacio => {
            // Encuentra el total de eventos para el espacio actual en el horario seleccionado.
            const totalEventos = datosFiltrados.find(item => item.espacio === espacio)?.totalEventos || 0;
            return {
                label: espacio, // La etiqueta del conjunto de datos es el nombre del espacio.
                data: [totalEventos], // Los datos son un array con el total de eventos para ese espacio.
                backgroundColor: colorAleatorio(), // Asigna un color aleatorio a la barra del espacio.
                borderColor: 'rgba(0, 0, 0, 0.1)', // Color del borde de la barra.
                borderWidth: 1 // Ancho del borde de la barra.
            };
        });

        // Renderiza el componente Bar de react-chartjs-2 con los datos y opciones configuradas.
        return (
            <Bar
                data={{ labels: [horarioSeleccionadoGraficoPrincipal], datasets }} // Los labels son el horario seleccionado y los datasets son los datos de cada espacio.
                options={{ responsive: true, maintainAspectRatio: false }} // Hace el gráfico responsive y permite ajustar la proporción.
            />
        );
    };

    // Renderiza el gráfico de los horarios más solicitados.
    const renderGraficoHorariosMasSolicitados = () => {
        // Si no hay datos para el gráfico, no renderiza nada.
        if (!graficoHorariosMasSolicitados) return null;
        return (
            <div className="w-full h-96 mt-6">
                <Bar data={graficoHorariosMasSolicitados} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
        );
    };

    // Renderiza el gráfico de los días más solicitados.
    const renderGraficoDiasMasSolicitados = () => {
        // Si no hay datos para el gráfico, no renderiza nada.
        if (!graficoDiasMasSolicitados) return null; // Invierte la visibilidad del gráfico de horarios al hacer clic en el botón.
        return (
            <div className="w-full h-96 mt-6">
                <Bar data={graficoDiasMasSolicitados} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
        );
    };

    const manejoBotonClickHorarios = () => {
        setMostrarGraficoHorarios(prev => !prev);
    };

    return (
        // Contenedor principal 
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">

                {/* Título de la sección de selección de evento. */}
                <h2 className="text-xl font-semibold text-center mb-4">Seleccionar Evento</h2>
                
                {/* Contenedor para la selección del evento*/}
                <div className="space-y-4">
                    
                    <select
                        value={eventoSeleccionado} // Asigna el valor del estado 'eventoSeleccionado' al selector.
                        onChange={manejoCambioEvento} // Llama a la función 'manejoCambioEvento' cuando cambia la selección.
                        className="w-full p-2 border rounded" // Aplica estilos al selector.
                    >
                        {/* Muestra un mensaje de carga mientras se obtienen los eventos. */}
                        {cargando && <option disabled>Cargando eventos...</option>}
                        {/* Muestra un mensaje de error si ocurre algún problema al cargar los eventos. */}
                        {error && <option disabled>Error al cargar eventos</option>}

                        {/* Muestra un mensaje si no hay eventos disponibles y no hay error. */}
                        {!cargando && !error && eventos.length === 0 && <option disabled>No hay eventos disponibles</option>}

                        {/* Mapea la lista de eventos para crear opciones en el selector. */}
                        {!cargando && !error && eventos.map(evento => (
                            // Cada opción tiene como clave el ID del evento y muestra el nombre del evento.
                            <option key={evento.id} value={evento.id}>{evento.nombre}</option>
                        ))}
                    </select>
                </div>
            </div>
            
             {/* Muestra un mensaje de carga mientras se obtienen los datos del evento seleccionado. */}
            {cargando && <p className="mt-4 text-gray-600">Cargando datos del evento...</p>}
            {/* Muestra un mensaje de error si ocurre algún problema al cargar los datos del evento. */}
            {error && <p className="mt-4 text-red-600">{error}</p>}
            
            {/* Si hay estadísticas disponibles y no se está cargando, muestra la sección de análisis. */}
            {estadisticas.length > 0 && !cargando && (
                // Contenedor para los gráficos de análisis
                <div className="bg-white shadow-md rounded-lg p-6 mt-6 w-full max-w-2xl">

                    {/* Botón para mostrar/ocultar el gráfico principal de tasa de ocupación. */}
                    <button
                        onClick={manejoBotonClickPrincipal}
                        className="mt-6 w-full p-2 bg-red-500 text-white rounded"
                    >
                        {mostrarGraficoPrincipal ? "Ocultar Tasa de Ocupación por Espacio y Horario" : "Mostrar Tasa de Ocupación por Espacio y Horario"}
                    </button>   

                    {/* Si 'mostrarGraficoPrincipal' es true, renderiza el gráfico principal. */}
                    {mostrarGraficoPrincipal && (
                        <div className="w-full h-96">
                            {/* Título del gráfico principal. */}
                            <h2 className="text-xl font-semibold text-center mb-4">Tasa de Ocupación por Espacio y Horario</h2>

                            {/* Selector para cambiar el horario mostrado en el gráfico principal. */}
                            <select
                                value={horarioSeleccionadoGraficoPrincipal}
                                onChange={manejoCambioHorarioGraficoPrincipal}
                                className="w-full p-2 border rounded"
                            >
                                {/* Mapea los horarios únicos para crear opciones en el selector. */}
                                {horariosUnicos.map(horario => (
                                    <option key={horario} value={horario}>{horario}</option>
                                ))}
                            </select>

                            {/* Renderiza el gráfico principal utilizando la función 'renderChart'. */}
                            {renderChart()}
                        </div>
                    )}
                    
                    {/* Botón para mostrar/ocultar el gráfico de horarios más frecuentes. */}
                    <button
                        onClick={manejoBotonClickHorarios}
                        className="mt-24 w-full p-2 bg-green-500 text-white rounded"
                    >
                        {mostrarGraficoHorarios ? "Ocultar Horarios Más Frecuentes" : "Ver Horarios Más Frecuentes"}
                    </button>
                    {/* Si 'mostrarGraficoHorarios' es true, renderiza el gráfico de horarios más frecuentes. */}
                    {mostrarGraficoHorarios && renderGraficoHorariosMasSolicitados()}

                    {/* Botón para mostrar/ocultar el gráfico de momentos con más actividad (días más solicitados). */}
                    <button
                        onClick={() => {
                            setMostrarGraficoDias(!mostrarGraficoDias);
                        }}
                        className="mt-6 w-full p-2 bg-blue-500 text-white rounded"
                    >
                        {mostrarGraficoDias ? "Ocultar Momentos con Más Actividad" : "Ver Momentos con Más Actividad"}
                    </button>
                    {/* Si 'mostrarGraficoDias' es true, renderiza el gráfico de momentos con más actividad. */}
                    {mostrarGraficoDias && renderGraficoDiasMasSolicitados()}
                </div>
            )}

            {/* Enlace para volver a la página principal de estadísticas. */}
            <Link to="/estadisticas" className="p-4 bg-green-500 text-white rounded mt-4">Volver</Link>
        </div>
    );
}

// Función para generar un color hexadecimal aleatorio.
const colorAleatorio = () => "#" + Math.floor(Math.random() * 16777215).toString(16);