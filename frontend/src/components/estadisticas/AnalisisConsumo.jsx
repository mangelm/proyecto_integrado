import React, { useState, useEffect } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
import { Link } from "react-router-dom";
import MensajesDeErrores from "../../pages/MensajesDeErrores";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function AnalisisConsumoPorEvento() {
    const [eventos, setEventos] = useState([]); // Lista de eventos
    const [eventoSeleccionado, setEventoSeleccionado] = useState(""); // Evento seleccionado
    const [datos, setDatos] = useState(null); // Datos de consumo total
    const [datosPorHorario, setDatosPorHorario] = useState(null); // Datos de consumo por horario
    const [datosPorPersonas, setDatosPorPersonas] = useState(null); // Datos de consumo por personas
    const [datosPromedioPorPersona, setDatosPromedioPorPersona] = useState(null); // Datos de promedio por persona
    const [cargandoEventos, setCargandoEventos] = useState(true); // Estado de carga de eventos
    const [errores, setErrores] = useState([]); // Estado para manejar errores

    const [mostrarGraficoTotal, setMostrarGraficoTotal] = useState(false);
    const [mostrarGraficoHorario, setMostrarGraficoHorario] = useState(false);
    const [mostrarGraficoPorPersonas, setMostrarGraficoPorPersonas] = useState(false);
    const [mostrarGraficoPromedio, setMostrarGraficoPromedio] = useState(false);

    // Cargar eventos al montar el componente
    useEffect(() => {
        const obtenerEventos = async () => {
            setCargandoEventos(true);
            setErrores([]);
            try {
                const response = await fetch("http://localhost:8100/api/eventos/todos");
                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${await response.text()}`);
                }
                const data = await response.json();
                if (Array.isArray(data)) {
                    setEventos(data);
                    if (data.length > 0) {
                        setEventoSeleccionado(data[0].id);
                    }
                } else {
                    setEventos([]);
                    setErrores((prevErrores) => [
                        ...prevErrores,
                        "Error: La respuesta del servidor no es un array de eventos.",
                    ]);
                }
            } catch (error) {
                setErrores((prevErrores) => [
                    ...prevErrores,
                    `Error al cargar los eventos: ${error.message}`,
                ]);
            } finally {
                setCargandoEventos(false);
            }
        };
        obtenerEventos();
    }, []);

    // Cargar datos de consumo al cambiar el evento seleccionado
    useEffect(() => {
        const fetchConsumo = async () => {
            if (!eventoSeleccionado) return;
            try {
                const response = await fetch(`http://localhost:8100/api/estadisticas/productos/evento/${eventoSeleccionado}`);
                if (!response.ok) {
                    throw new Error(`Error al obtener datos de consumo: ${response.status}`);
                }
                const data = await response.json();
                setDatos(data);
            } catch (error) {
                setErrores((prevErrores) => [
                    ...prevErrores,
                    `Error al obtener datos de consumo: ${error.message}`,
                ]);
            }
        };

        const fetchConsumoPorHorario = async () => {
            if (!eventoSeleccionado) return;
            try {
                const response = await fetch(`http://localhost:8100/api/estadisticas/productos-horario/evento/${eventoSeleccionado}`);
                if (!response.ok) {
                    throw new Error(`Error al obtener datos por horario: ${response.status}`);
                }
                const data = await response.json();
                setDatosPorHorario(data);
            } catch (error) {
                setErrores((prevErrores) => [
                    ...prevErrores,
                    `Error al obtener datos por horario: ${error.message}`,
                ]);
            }
        };

        const fetchConsumoPorPersonas = async () => {
            if (!eventoSeleccionado) return;
            try {
                const response = await fetch(`http://localhost:8100/api/estadisticas/productos-personas/evento/${eventoSeleccionado}`);
                if (!response.ok) {
                    throw new Error(`Error al obtener datos por personas: ${response.status}`);
                }
                const data = await response.json();
                setDatosPorPersonas(data);
            } catch (error) {
                setErrores((prevErrores) => [
                    ...prevErrores,
                    `Error al obtener datos por personas: ${error.message}`,
                ]);
            }
        };

        const fetchPromedioPorPersona = async () => {
            if (!eventoSeleccionado) return;
            try {
                const response = await fetch(`http://localhost:8100/api/estadisticas/productos-promedio-personas/evento/${eventoSeleccionado}`);
                if (!response.ok) {
                    throw new Error(`Error al obtener promedio por persona: ${response.status}`);
                }
                const text = await response.text();
                const data = text ? JSON.parse(text) : [];
                setDatosPromedioPorPersona(data);
            } catch (error) {
                setErrores((prevErrores) => [
                    ...prevErrores,
                    `Error al obtener promedio por persona: ${error.message}`,
                ]);
            }
        };

        fetchConsumo();
        fetchConsumoPorHorario();
        fetchConsumoPorPersonas();
        fetchPromedioPorPersona();
    }, [eventoSeleccionado]);

    const manejoEventoSeleccionado = (e) => {
        setEventoSeleccionado(e.target.value);
    };

    // Datos para los gráficos
    const chartData = datos
        ? {
              labels: datos.map((p) => p.nombre),
              datasets: [
                  {
                      label: "Cantidad Consumida Total",
                      data: datos.map((p) => p.totalConsumido),
                      backgroundColor: "rgba(54, 162, 235, 0.6)",
                  },
              ],
          }
        : null;

    const chartDataHorario = datosPorHorario
        ? {
              labels: Object.keys(datosPorHorario.reduce((acc, item) => {
                  if (!acc[item.nombre]) acc[item.nombre] = { MAÑANA: 0, TARDE: 0, NOCHE: 0 };
                  acc[item.nombre][item.horario] += item.totalConsumido;
                  return acc;
              }, {})),
              datasets: [
                  {
                      label: "MAÑANA",
                      data: Object.values(datosPorHorario.reduce((acc, item) => {
                          if (!acc[item.nombre]) acc[item.nombre] = { MAÑANA: 0, TARDE: 0, NOCHE: 0 };
                          acc[item.nombre][item.horario] += item.totalConsumido;
                          return acc;
                      }, {})).map((item) => item.MAÑANA),
                      backgroundColor: "rgba(255, 159, 64, 0.6)",
                  },
                  {
                      label: "TARDE",
                      data: Object.values(datosPorHorario.reduce((acc, item) => {
                          if (!acc[item.nombre]) acc[item.nombre] = { MAÑANA: 0, TARDE: 0, NOCHE: 0 };
                          acc[item.nombre][item.horario] += item.totalConsumido;
                          return acc;
                      }, {})).map((item) => item.TARDE),
                      backgroundColor: "rgba(54, 162, 235, 0.6)",
                  },
                  {
                      label: "NOCHE",
                      data: Object.values(datosPorHorario.reduce((acc, item) => {
                          if (!acc[item.nombre]) acc[item.nombre] = { MAÑANA: 0, TARDE: 0, NOCHE: 0 };
                          acc[item.nombre][item.horario] += item.totalConsumido;
                          return acc;
                      }, {})).map((item) => item.NOCHE),
                      backgroundColor: "rgba(75, 192, 192, 0.6)",
                  },
              ],
          }
        : null;

    const chartDataPorPersonas = datosPorPersonas
        ? {
              labels: datosPorPersonas.map((p) => p.nombre),
              datasets: [
                  {
                      label: "Cantidad de Personas que Consumen el Producto",
                      data: datosPorPersonas.map((p) => p.cantidadPersonas),
                      backgroundColor: "rgba(75, 192, 192, 0.6)",
                  },
              ],
          }
        : null;

    const chartDataPromedioPorPersona = datosPromedioPorPersona
        ? {
              labels: datosPromedioPorPersona.map((p) => p.producto),
              datasets: [
                  {
                      label: "Promedio de Consumo por Persona",
                      data: datosPromedioPorPersona.map((p) => p.consumoPromedio),
                      backgroundColor: "rgba(255, 99, 132, 0.6)",
                  },
              ],
          }
        : null;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-semibold text-center mb-4">Seleccionar Evento para Análisis de Consumo</h2>
                {errores.length > 0 && <MensajesDeErrores messages={errores} />}
                <div className="space-y-4">
                    {cargandoEventos && <p>Cargando eventos...</p>}
                    {!cargandoEventos && eventos.length > 0 && (
                        <select
                            value={eventoSeleccionado}
                            onChange={manejoEventoSeleccionado}
                            className="w-full p-2 border rounded"
                        >
                            <option value="">Selecciona un evento</option>
                            {eventos.map((evento) => (
                                <option key={evento.id} value={evento.id}>
                                    {evento.nombre}
                                </option>
                            ))}
                        </select>
                    )}
                    {!cargandoEventos && eventos.length === 0 && !errores.length && <p>No hay eventos disponibles.</p>}
                </div>
            </div>

            {eventoSeleccionado && (
                <div className="bg-white shadow-md rounded-lg p-6 mt-6 w-full max-w-2xl">
                    <h2 className="text-xl font-semibold text-center mb-4">Análisis de Consumo para el Evento Seleccionado</h2>
                    {chartData && (
                        <button
                            onClick={() => setMostrarGraficoTotal(!mostrarGraficoTotal)}
                            className="w-full p-2 bg-purple-500 text-white rounded mt-4"
                        >
                            {mostrarGraficoTotal ? "Ocultar Consumo de Productos Totales" : "Ver Consumo de Productos Totales"}
                        </button>
                    )}
                    {chartDataPorPersonas && (
                        <button
                            onClick={() => setMostrarGraficoPorPersonas(!mostrarGraficoPorPersonas)}
                            className="w-full p-2 bg-yellow-500 text-white rounded mt-4"
                        >
                            {mostrarGraficoPorPersonas
                                ? "Ocultar Consumo de Productos por Cantidad Personas"
                                : "Ver Consumo de Productos por Cantidad Personas"}
                        </button>
                    )}
                    {chartDataHorario && (
                        <button
                            onClick={() => setMostrarGraficoHorario(!mostrarGraficoHorario)}
                            className="w-full p-2 bg-green-500 text-white rounded mt-4"
                        >
                            {mostrarGraficoHorario
                                ? "Ocultar Consumo de Productos por Horario"
                                : "Ver Consumo de Productos por Horario"}
                        </button>
                    )}
                    {chartDataPromedioPorPersona && (
                        <button
                            onClick={() => setMostrarGraficoPromedio(!mostrarGraficoPromedio)}
                            className="w-full p-2 bg-red-500 text-white rounded mt-4"
                        >
                            {mostrarGraficoPromedio
                                ? "Ocultar Promedio de Consumo por Persona"
                                : "Ver Promedio de Consumo por Persona"}
                        </button>
                    )}
                    {mostrarGraficoTotal && chartData && (
                        <div className="mt-6">
                            <h3 className="text-lg font-semibold mb-2">Productos Más Consumidos (General)</h3>
                            <Bar data={chartData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
                        </div>
                    )}
                    {mostrarGraficoHorario && chartDataHorario && (
                        <div className="mt-6">
                            <h3 className="text-lg font-semibold mb-2">Productos Más Consumidos por Horario</h3>
                            <Bar
                                data={chartDataHorario}
                                options={{
                                    responsive: true,
                                    plugins: { legend: { display: true } },
                                    scales: { x: { stacked: true }, y: { stacked: true } },
                                }}
                            />
                        </div>
                    )}
                    {mostrarGraficoPorPersonas && chartDataPorPersonas && (
                        <div className="mt-6">
                            <h3 className="text-lg font-semibold mb-2">Cantidad de Personas que Consumen el Producto</h3>
                            <Bar
                                data={chartDataPorPersonas}
                                options={{
                                    responsive: true,
                                    plugins: { legend: { display: true } },
                                    scales: { y: { beginAtZero: true } },
                                }}
                            />
                        </div>
                    )}
                    {mostrarGraficoPromedio && chartDataPromedioPorPersona && (
                        <div className="mt-6">
                            <h3 className="text-lg font-semibold mb-2">Promedio de Consumo por Persona</h3>
                            <Bar
                                data={chartDataPromedioPorPersona}
                                options={{
                                    responsive: true,
                                    plugins: { legend: { display: true } },
                                    scales: { y: { beginAtZero: true } },
                                }}
                            />
                        </div>
                    )}
                </div>
            )}

            <Link to="/estadisticas" className="p-4 bg-green-500 text-white rounded mt-4">
                Volver
            </Link>
        </div>
    );
}