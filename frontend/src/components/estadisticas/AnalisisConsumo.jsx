import React, { useState } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
import { Link } from "react-router-dom";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function AnalisisConsumo() {
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFinal, setFechaFinal] = useState("");
    const [datos, setDatos] = useState(null);
    const [datosPorHorario, setDatosPorHorario] = useState(null);
    const [datosPorPersonas, setDatosPorPersonas] = useState(null); // Datos para el gráfico de cantidad de personas
    const [mostrarGraficoHorario, setMostrarGraficoHorario] = useState(false);
    const [mostrarGraficoPorPersonas, setMostrarGraficoPorPersonas] = useState(false); // Estado para mostrar/ocultar el gráfico por personas

    // Enviamos la petición para obtener los datos de consumo de productos
    const fetchConsumo = async (e) => {
        e.preventDefault();
        if (!fechaInicio || !fechaFinal) return;
        try {
            const response = await fetch(`http://localhost:8100/api/estadisticas/productos?fechaInicio=${fechaInicio}&fechaFinal=${fechaFinal}`);
            const data = await response.json();
            setDatos(data);
        } catch (error) {
            console.error("Error al obtener datos", error);
        }
    };

    // Enviamos la petición para obtener los datos de consumo por horario
    const fetchConsumoPorHorario = async () => {
        if (!fechaInicio || !fechaFinal) return;
        try {
            const response = await fetch(`http://localhost:8100/api/estadisticas/productos-horario?fechaInicio=${fechaInicio}&fechaFinal=${fechaFinal}`);
            const data = await response.json();
            setDatosPorHorario(data);
        } catch (error) {
            console.error("Error al obtener datos por horario", error);
        }
    };

    // Enviamos la petición para obtener los productos más consumidos por cantidad de personas
    const fetchConsumoPorPersonas = async (e) => {
        e.preventDefault();
        if (!fechaInicio || !fechaFinal) return;
        try {
            const response = await fetch(`http://localhost:8100/api/estadisticas/productos-personas?fechaInicio=${fechaInicio}&fechaFinal=${fechaFinal}`);
            const data = await response.json();
            setDatosPorPersonas(data); // Guardamos los datos de cantidad de personas
        } catch (error) {
            console.error("Error al obtener datos por cantidad de personas", error);
        }
    };

    // Creación de datos para Cantidad Consumida Total
    const chartData = datos ? {
        labels: datos.map(p => p.nombre),
        datasets: [{
            label: "Cantidad Consumida Total",
            data: datos.map(p => p.totalConsumido),
            backgroundColor: "rgba(54, 162, 235, 0.6)",
        }]
    } : null;

    // Función para agrupar los datos por producto y horario
    const agruparPorProductoYHorario = (datos) => {
        const productosAgrupados = datos.reduce((acc, item) => {
            if (!acc[item.nombre]) {
                acc[item.nombre] = { MAÑANA: 0, TARDE: 0, NOCHE: 0 };
            }
            acc[item.nombre][item.horario] += item.totalConsumido;
            return acc;
        }, {});

        return productosAgrupados;
    };

    // Datos para el gráfico por horario
    const chartDataHorario = datosPorHorario ? {
        labels: Object.keys(agruparPorProductoYHorario(datosPorHorario)),
        datasets: [
            {
                label: "MAÑANA",
                data: Object.values(agruparPorProductoYHorario(datosPorHorario)).map(item => item.MAÑANA),
                backgroundColor: "rgba(255, 159, 64, 0.6)",
            },
            {
                label: "TARDE",
                data: Object.values(agruparPorProductoYHorario(datosPorHorario)).map(item => item.TARDE),
                backgroundColor: "rgba(54, 162, 235, 0.6)",
            },
            {
                label: "NOCHE",
                data: Object.values(agruparPorProductoYHorario(datosPorHorario)).map(item => item.NOCHE),
                backgroundColor: "rgba(75, 192, 192, 0.6)",
            },
        ]
    } : null;

    // Datos para el gráfico de cantidad de personas
    const chartDataPorPersonas = datosPorPersonas ? {
        labels: datosPorPersonas.map(p => p.nombre),
        datasets: [{
            label: "Cantidad de Personas que Consumen el Producto",
            data: datosPorPersonas.map(p => p.cantidadPersonas),
            backgroundColor: "rgba(75, 192, 192, 0.6)",
        }]
    } : null;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-semibold text-center mb-4">Generar Análisis</h2>
                <form onSubmit={fetchConsumo} className="space-y-4">
                    <input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} required className="w-full p-2 border rounded" />
                    <input type="date" value={fechaFinal} onChange={(e) => setFechaFinal(e.target.value)} required className="w-full p-2 border rounded" />
                    <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">Generar</button>
                </form>

                {/* Botón para mostrar/ocultar el gráfico de cantidad de personas */}
                <button 
                    onClick={(e) => {
                        setMostrarGraficoPorPersonas(!mostrarGraficoPorPersonas);
                        fetchConsumoPorPersonas(e); // Pasamos el evento correctamente
                    }} 
                    className="w-full p-2 bg-yellow-500 text-white rounded mt-4"
                >
                    {mostrarGraficoPorPersonas ? "Ocultar Gráfico por Personas" : "Ver Gráfico por Personas"}
                </button>


                {/* Botón para mostrar/ocultar el gráfico por horario */}
                <button 
                    onClick={() => {
                        setMostrarGraficoHorario(!mostrarGraficoHorario);
                        fetchConsumoPorHorario(); // Llamar a la función para obtener los datos por horario
                    }} 
                    className="w-full p-2 bg-green-500 text-white rounded mt-4"
                >
                    {mostrarGraficoHorario ? "Ocultar Gráfico por Horario" : "Ver Gráfico por Horario"}
                </button>
            </div>

            {/* Gráfico de productos más consumidos (Total) */}
            {chartData && (
                <div className="bg-white shadow-md rounded-lg p-6 mt-6 w-full max-w-2xl">
                    <h2 className="text-xl font-semibold text-center mb-4">Productos Más Consumidos &#40;General&#41;</h2>
                    <Bar data={chartData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
                </div>
            )}

            {/* Gráfico por horario */}
            {mostrarGraficoHorario && chartDataHorario && (
                <div className="bg-white shadow-md rounded-lg p-6 mt-6 w-full max-w-2xl">
                    <h2 className="text-xl font-semibold text-center mb-4">Productos Más Consumidos por Horario</h2>
                    <Bar data={chartDataHorario} options={{
                        responsive: true,
                        plugins: { legend: { display: true } },
                        scales: {
                            x: { stacked: true },
                            y: { stacked: true }
                        }
                    }} />
                </div>
            )}

            {/* Gráfico por cantidad de personas */}
            {mostrarGraficoPorPersonas && chartDataPorPersonas && (
                <div className="bg-white shadow-md rounded-lg p-6 mt-6 w-full max-w-2xl">
                    <h2 className="text-xl font-semibold text-center mb-4">Cantidad de Personas que Consumen el Producto</h2>
                    <Bar data={chartDataPorPersonas} options={{
                        responsive: true,
                        plugins: { legend: { display: true } },
                        scales: {
                            y: { beginAtZero: true }
                        }
                    }} />
                </div>
            )}

            <Link to="/estadisticas" className="p-4 bg-green-500 text-white rounded mt-4">Volver</Link>
        </div>
    );
}
