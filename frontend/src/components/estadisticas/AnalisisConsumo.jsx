import React, { useState, useEffect } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
import { Link } from "react-router-dom";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function AnalisisConsumoPorEvento() {
    
    const [eventos, setEventos] = useState([]); // Estado para almacenar la lista de eventos obtenida de la API.
    const [eventoSeleccionado, setEventoSeleccionado] = useState(""); // Estado para almacenar el ID del evento seleccionado por el usuario.
    const [datos, setDatos] = useState(null); // Estado para almacenar los datos de consumo total por producto para el evento seleccionado.
    const [datosPorHorario, setDatosPorHorario] = useState(null); // Estado para almacenar los datos de consumo por producto y horario para el evento seleccionado.
    const [datosPorPersonas, setDatosPorPersonas] = useState(null); // Estado para almacenar los datos de la cantidad de personas que consumieron cada producto en el evento seleccionado.
    const [datosPromedioPorPersona, setDatosPromedioPorPersona] = useState(null); // Estado para almacenar los datos del promedio de consumo por persona para cada producto en el evento seleccionado.
    const [cargandoEventos, setCargandoEventos] = useState(true); // Estado para indicar si se están cargando los eventos desde la API.
    const [errorEventos, setErrorEventos] = useState(null); // Estado para almacenar cualquier error que ocurra al cargar los eventos.

    //Controlar visibilidad de los gráficos
    const [mostrarGraficoTotal, setMostrarGraficoTotal] = useState(false); // Estado para controlar si se muestra el gráfico de consumo total.
    const [mostrarGraficoHorario, setMostrarGraficoHorario] = useState(false); // Estado para controlar si se muestra el gráfico de consumo por horario.
    const [mostrarGraficoPorPersonas, setMostrarGraficoPorPersonas] = useState(false); // Estado para controlar si se muestra el gráfico de consumo por cantidad de personas.
    const [mostrarGraficoPromedio, setMostrarGraficoPromedio] = useState(false); // Estado para controlar si se muestra el gráfico de promedio de consumo por persona.

    // Este efecto se ejecuta una vez al montar el componente para obtener la lista de eventos.
    useEffect(() => {
        const obtenerEventos = async () => {
            setCargandoEventos(true);  // Indica que la carga de eventos ha comenzado.
            setErrorEventos(null); // Limpia cualquier error previo.
            try {
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
                        setEventoSeleccionado(data[0].id); // Selecciona el ID del primer evento por defecto.
                    }
                // Si la respuesta no es un array.
                } else {
                    setEventos([]); // Establece 'eventos' como un array vacío.
                    setErrorEventos("Error: La respuesta del servidor no es un array de eventos."); // Establece un mensaje de error.
                }
            // Captura cualquier error ocurrido durante la petición.
            } catch (error) {
                setErrorEventos(error.message); // Establece el mensaje de error.
            // Se ejecuta al final del try...catch, independientemente de si hubo un error.
            } finally {
                setCargandoEventos(false); // Indica que la carga de eventos ha finalizado.
            }
        };
        // Llama a la función para obtener los eventos al montar el componente.
        obtenerEventos();
    }, []); // El array de dependencias vacío asegura que este efecto se ejecute solo una vez.

     // Este efecto se ejecuta cada vez que cambia el 'eventoSeleccionado' para obtener los datos de consumo del evento.
    useEffect(() => {
        const fetchConsumo = async () => {
            // Si no hay un evento seleccionado, no hace nada.
            if (!eventoSeleccionado) return;
            try {
                // Realiza una petición GET para obtener el consumo total por producto del evento.
                const response = await fetch(`http://localhost:8100/api/estadisticas/productos/evento/${eventoSeleccionado}`);
                const data = await response.json(); // Convierte la respuesta a JSON.
                setDatos(data); // Actualiza el estado 'datos' con la información obtenida.
            // Captura errores durante la petición.
            } catch (error) {
                console.error("Error al obtener datos de consumo", error); // Muestra el error en la consola.
            }
        };

        const fetchConsumoPorHorario = async () => {
            // Si no hay un evento seleccionado, no hace nada.
            if (!eventoSeleccionado) return;
            try {
                // Realiza una petición GET para obtener el consumo por producto y horario del evento.
                const response = await fetch(`http://localhost:8100/api/estadisticas/productos-horario/evento/${eventoSeleccionado}`);
                const data = await response.json(); // Convierte la respuesta a JSON.
                setDatosPorHorario(data); // Actualiza el estado 'datosPorHorario'.
            } catch (error) {
                console.error("Error al obtener datos por horario", error);
            }
        };

        const fetchConsumoPorPersonas = async () => {
            // Si no hay evento seleccionado, no hace nada.
            if (!eventoSeleccionado) return;
            try {
                // Obtiene la cantidad de personas que consumieron cada producto.
                const response = await fetch(`http://localhost:8100/api/estadisticas/productos-personas/evento/${eventoSeleccionado}`);
                const data = await response.json();  // Convierte a JSON.
                setDatosPorPersonas(data); // Actualiza el estado.
            } catch (error) {
                console.error("Error al obtener datos por cantidad de personas", error);
            }
        };

        const fetchPromedioPorPersona = async () => {
            if (!eventoSeleccionado) return;
            try {
                // Obtiene el promedio de consumo por persona de cada producto.
                const response = await fetch(`http://localhost:8100/api/estadisticas/productos-promedio-personas/evento/${eventoSeleccionado}`);
                // Si la respuesta no es exitosa.
                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status}`);
                }
                const text = await response.text(); // Obtiene el texto de la respuesta.
                const data = text ? JSON.parse(text) : []; // Intenta parsear el texto como JSON, si no hay texto, usa un array vacío.
                setDatosPromedioPorPersona(data); // Actualiza el estado.
            } catch (error) {
                console.error("Error al obtener datos de promedio por persona:", error);
            }
        };

        fetchConsumo(); // Llama a la función para obtener el consumo total.
        fetchConsumoPorHorario(); // Llama a la función para obtener el consumo por horario.
        fetchConsumoPorPersonas(); // Llama a la función para obtener el consumo por cantidad de personas.
        fetchPromedioPorPersona(); // Llama a la función para obtener el promedio de consumo por persona.

    }, [eventoSeleccionado]); // El efecto se vuelve a ejecutar cada vez que cambia el 'eventoSeleccionado'.

    const manejoEventoSeleccionado = (e) => {
        // Actualiza el estado 'eventoSeleccionado' con el valor del evento seleccionado en el dropdown.
        setEventoSeleccionado(e.target.value);
    };

    // Creación de datos para Cantidad Consumida Total
    const chartData = datos ? {
        // Utiliza los nombres de los productos como etiquetas del eje X.
        labels: datos.map(p => p.nombre),
        datasets: [{
            label: "Cantidad Consumida Total", // Etiqueta para la barra en el gráfico.
            data: datos.map(p => p.totalConsumido), // Utiliza la cantidad total consumida de cada producto como los valores de las barras.
            backgroundColor: "rgba(54, 162, 235, 0.6)", // Color de fondo de las barras.
        }]
    } : null; // Si no hay datos, 'chartData' es null.

    // Función para agrupar los datos por producto y horario
    const agruparPorProductoYHorario = (datos) => {
        // Si no hay datos, devuelve un objeto vacío.
        if (!datos) return {};
        // Utiliza reduce para iterar sobre los datos y agruparlos.
        return datos.reduce((acc, item) => {
            // Si el producto no existe en el acumulador.
            if (!acc[item.nombre]) {
                // Inicializa el producto con consumos en los tres horarios a cero.
                acc[item.nombre] = { MAÑANA: 0, TARDE: 0, NOCHE: 0 };
            }
            acc[item.nombre][item.horario] += item.totalConsumido; // Suma la cantidad consumida al horario correspondiente del producto.
            return acc; // Devuelve el acumulador actualizado.
        }, {});
    };

    // Datos para el gráfico por horario
    const chartDataHorario = datosPorHorario ? {
        // Obtiene los nombres de los productos (claves del objeto agrupado) como etiquetas.
        labels: Object.keys(agruparPorProductoYHorario(datosPorHorario)),
        datasets: [
            {
                label: "MAÑANA", // Etiqueta para las barras correspondientes al horario de la mañana.
                data: Object.values(agruparPorProductoYHorario(datosPorHorario)).map(item => item.MAÑANA), // Obtiene los valores de consumo en la mañana para cada producto.
                backgroundColor: "rgba(255, 159, 64, 0.6)", // Color de fondo para las barras de la mañana.
            },
            {
                label: "TARDE", // Etiqueta para las barras de la tarde.
                data: Object.values(agruparPorProductoYHorario(datosPorHorario)).map(item => item.TARDE), // Obtiene los valores de consumo en la tarde.
                backgroundColor: "rgba(54, 162, 235, 0.6)", // Color de fondo para las barras de la tarde.
            },
            {
                label: "NOCHE", // Etiqueta para las barras de la noche.
                data: Object.values(agruparPorProductoYHorario(datosPorHorario)).map(item => item.NOCHE), // Obtiene los valores de consumo en la noche.
                backgroundColor: "rgba(75, 192, 192, 0.6)", // Color de fondo para las barras de la noche.
            },
        ]
    } : null; // Si no hay datos por horario, 'chartDataHorario' es null.

    // Datos para el gráfico de cantidad de personas
    const chartDataPorPersonas = datosPorPersonas ? {
        // Utiliza los nombres de los productos como etiquetas.
        labels: datosPorPersonas.map(p => p.nombre),
        datasets: [{
            label: "Cantidad de Personas que Consumen el Producto", // Etiqueta para las barras.
            data: datosPorPersonas.map(p => p.cantidadPersonas), // Utiliza la cantidad de personas que consumieron cada producto como valores.
            backgroundColor: "rgba(75, 192, 192, 0.6)", // Color de fondo de las barras.
        }]
    } : null; // Si no hay datos por personas, 'chartDataPorPersonas' es null.

    // Datos para el gráfico del promedio de consumo por persona
    const chartDataPromedioPorPersona = datosPromedioPorPersona ? {
        // Utiliza los nombres de los productos como etiquetas.
        labels: datosPromedioPorPersona.map(p => p.producto), 
        datasets: [{
            label: "Promedio de Consumo por Persona", // Etiqueta para las barras.
            data: datosPromedioPorPersona.map(p => p.consumoPromedio), // Utiliza el promedio de consumo por persona de cada producto como valores.
            backgroundColor: "rgba(255, 99, 132, 0.6)", // Color de fondo de las barras.
        }]
    } : null; // Si no hay datos de promedio por persona, 'chartDataPromedioPorPersona' es null.

    return (
        // Contenedor principal que centra los elementos vertical y horizontalmente en la pantalla.
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            {/* Contenedor para la selección del evento*/}
            <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
                {/* Título de la sección de selección de evento. */}
                <h2 className="text-xl font-semibold text-center mb-4">Seleccionar Evento para Análisis de Consumo</h2>
                <div className="space-y-4">
                    {/* Muestra un mensaje de carga mientras se obtienen los eventos. */}
                    {cargandoEventos && <p>Cargando eventos...</p>}
                    {/* Muestra un mensaje de error si ocurre algún problema al cargar los eventos. */}
                    {errorEventos && <p className="text-red-500">{errorEventos}</p>}
                    {/* Si no se está cargando y hay eventos disponibles, muestra el selector. */}
                    {!cargandoEventos && eventos.length > 0 && (
                        <select
                            value={eventoSeleccionado} // Asigna el valor del estado 'eventoSeleccionado' al selector.
                            onChange={manejoEventoSeleccionado} // Llama a la función 'manejoEventoSeleccionado' cuando cambia la selección.
                            className="w-full p-2 border rounded" // Aplica estilos al selector.
                        >   
                             {/* Opción por defecto para indicar al usuario que seleccione un evento. */}
                            <option value="">Selecciona un evento</option>
                            {/* Mapea la lista de eventos para crear opciones en el selector. */}
                            {eventos.map(evento => (
                                // Cada opción tiene como valor el ID del evento y muestra el nombre del evento.
                                <option key={evento.id} value={evento.id}>{evento.nombre}</option>
                            ))}
                        </select>
                    )}

                    {/* Si no se está cargando, no hay eventos y no hay error, muestra un mensaje indicando que no hay eventos. */}
                    {!cargandoEventos && eventos.length === 0 && !errorEventos && (
                        <p>No hay eventos disponibles.</p>
                    )}
                </div>
            </div>
            
            {/* Si se ha seleccionado un evento, muestra la sección de análisis. */}
            {eventoSeleccionado && (
                // Contenedor para los gráficos de análisis
                <div className="bg-white shadow-md rounded-lg p-6 mt-6 w-full max-w-2xl">
                    {/* Título de la sección de análisis. */}
                    <h2 className="text-xl font-semibold text-center mb-4">Análisis de Consumo para el Evento Seleccionado</h2>

                    {/* Botón para mostrar/ocultar el gráfico de consumo total */}
                    {chartData && (
                        <button
                            onClick={() => setMostrarGraficoTotal(!mostrarGraficoTotal)} // Cambia la visibilidad del gráfico al hacer clic.
                            className="w-full p-2 bg-purple-500 text-white rounded mt-4" // Estilos del botón.
                        >
                            {/* Texto del botón que cambia según la visibilidad del gráfico. */}
                            {mostrarGraficoTotal ? "Ocultar Consumo de Productos Totales" : "Ver Consumo de Productos Totales"}
                        </button>
                    )}

                    {/* Botón para mostrar/ocultar el gráfico de cantidad de personas */}
                    {chartDataPorPersonas && (
                        <button
                            onClick={() => setMostrarGraficoPorPersonas(!mostrarGraficoPorPersonas)} // Cambia la visibilidad del gráfico.
                            className="w-full p-2 bg-yellow-500 text-white rounded mt-4" // Estilos del botón.
                        >
                            {/* Texto del botón según la visibilidad. */}
                            {mostrarGraficoPorPersonas ? "Ocultar Consumo de Productos por Cantidad Personas" : "Ver Consumo de Productos por Cantidad Personas"}
                        </button>
                    )}

                    {/* Botón para mostrar/ocultar el gráfico por horario */}
                    {chartDataHorario && (
                        <button
                            onClick={() => setMostrarGraficoHorario(!mostrarGraficoHorario)} // Controla la visibilidad del gráfico.
                            className="w-full p-2 bg-green-500 text-white rounded mt-4" // Estilos del botón.
                        >   
                            {/* Texto del botón dinámico. */}
                            {mostrarGraficoHorario ? "Ocultar Consumo de Productos por Horario" : "Ver Consumo de Productos por Horario"}
                        </button>
                    )}

                    {/* Botón para mostrar/ocultar el gráfico del promedio de consumo por persona */}
                    {chartDataPromedioPorPersona && (
                        <button
                            onClick={() => setMostrarGraficoPromedio(!mostrarGraficoPromedio)} // Cambia la visibilidad.
                            className="w-full p-2 bg-red-500 text-white rounded mt-4" // Estilos del botón.
                        >
                             {/* Texto del botón condicional. */}
                            {mostrarGraficoPromedio ? "Ocultar Promedio de Consumo por Persona" : "Ver Promedio de Consumo por Persona"}
                        </button>
                    )}

                    {/* Gráfico de productos más consumidos (Total) */}
                    {mostrarGraficoTotal && chartData && (
                        <div className="mt-6">
                            {/* Título del gráfico de consumo total. */}
                            <h3 className="text-lg font-semibold mb-2">Productos Más Consumidos (General)</h3>
                            {/* Renderiza el gráfico de barras con los datos de consumo total, haciéndolo responsive y ocultando la leyenda. */}
                            <Bar data={chartData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
                        </div>
                    )}

                    {/* Gráfico por horario */}
                    {mostrarGraficoHorario && chartDataHorario && (
                        <div className="mt-6">
                            {/* Título del gráfico de consumo por horario. */}
                            <h3 className="text-lg font-semibold mb-2">Productos Más Consumidos por Horario</h3>
                            <Bar data={chartDataHorario} options={{
                                responsive: true, // Hace el gráfico responsive.
                                plugins: { legend: { display: true } }, // Muestra la leyenda para diferenciar los horarios.
                                scales: {
                                    x: { stacked: true }, // Apila las barras para cada producto por horario en el eje X.
                                    y: { stacked: true } // Apila las barras en el eje Y (aunque en este caso, la pila principal está en X por producto).
                                }
                            }} />
                        </div>
                    )}

                    {/* Gráfico por cantidad de personas */}
                    {mostrarGraficoPorPersonas && chartDataPorPersonas && (
                        <div className="mt-6">
                            {/* Título del gráfico de cantidad de personas. */}
                            <h3 className="text-lg font-semibold mb-2">Cantidad de Personas que Consumen el Producto</h3>
                            <Bar data={chartDataPorPersonas} options={{
                                responsive: true, // Hace el gráfico responsive.
                                plugins: { legend: { display: true } }, // Muestra la leyenda.
                                scales: {
                                    y: { beginAtZero: true }  // Asegura que el eje Y comience en cero.
                                }
                            }} />
                        </div>
                    )}

                    {/* Gráfico del promedio de consumo por persona */}
                    {mostrarGraficoPromedio && chartDataPromedioPorPersona && (
                        <div className="mt-6">
                            {/* Título del gráfico de promedio de consumo. */}
                            <h3 className="text-lg font-semibold mb-2">Promedio de Consumo por Persona</h3>
                            <Bar data={chartDataPromedioPorPersona} options={{
                                responsive: true, // Gráfico responsive.
                                plugins: { legend: { display: true } }, // Muestra la leyenda.
                                scales: {
                                    y: { beginAtZero: true }  // Eje Y comienza en cero.
                                }
                            }} />
                        </div>
                    )}
                </div>
            )}

            {/* Enlace para volver a la página de estadísticas. */}
            <Link to="/estadisticas" className="p-4 bg-green-500 text-white rounded mt-4">Volver</Link>
        </div>
    );
}