import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Link } from "react-router-dom"; 

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function EstadisticasOcupacion() {
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFinal, setFechaFinal] = useState("");
    const [estadisticas, setEstadisticas] = useState([]);
    const [horariosUnicos, setHorariosUnicos] = useState([]);
    const [horarioSeleccionado, setHorarioSeleccionado] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleFechaInicioChange = (e) => setFechaInicio(e.target.value);
    const handleFechaFinalChange = (e) => setFechaFinal(e.target.value);
    const handleHorarioChange = (e) => setHorarioSeleccionado(e.target.value);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setEstadisticas([]);

        if (new Date(fechaInicio) > new Date(fechaFinal)) {
            setError("La fecha de inicio no puede ser posterior a la fecha final.");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8100/api/estadisticas/ocupacion?fechaInicio=${fechaInicio}&fechaFinal=${fechaFinal}`);
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${await response.text()}`);
            }
            const data = await response.json();
            setEstadisticas(data);

            // Extraer horarios únicos
            const horarios = [...new Set(data.map(item => item.horario))];
            setHorariosUnicos(horarios);
            setHorarioSeleccionado(horarios[0] || ""); // Seleccionar el primero por defecto
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const renderChart = () => {
        if (!estadisticas.length || !horarioSeleccionado) {
            return null;
        }

        // Filtrar los datos por el horario seleccionado
        const datosFiltrados = estadisticas.filter(item => item.horario === horarioSeleccionado);

        // Extraer los espacios únicos
        const espaciosUnicos = [...new Set(datosFiltrados.map(item => item.espacio))];

        // Crear los datasets para cada espacio
        const datasets = espaciosUnicos.map(espacio => {
            const totalEventos = datosFiltrados.find(item => item.espacio === espacio)?.totalEventos || 0;
            return {
                label: espacio,
                data: [totalEventos], // Solo hay un dato porque se filtra por horario
                backgroundColor: randomColor(),
                borderColor: 'rgba(0, 0, 0, 0.1)',
                borderWidth: 1
            };
        });

        return (
            <Bar
                data={{
                    labels: [horarioSeleccionado], // Solo un horario
                    datasets: datasets
                }}
                options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        tooltip: {
                            callbacks: {
                                label: (item) => `Total: ${item.raw}`
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }}
            />
        );
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-semibold text-center mb-4">Generar Estadísticas</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-medium">Fecha Inicio:</label>
                        <input type="date" value={fechaInicio} onChange={handleFechaInicioChange} required className="w-full mt-1 p-2 border rounded-lg focus:ring-blue-300" />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium">Fecha Final:</label>
                        <input type="date" value={fechaFinal} onChange={handleFechaFinalChange} required className="w-full mt-1 p-2 border rounded-lg focus:ring-blue-300" />
                    </div>
                    <button type="submit" disabled={!fechaInicio || !fechaFinal || loading} className={`w-full p-2 rounded-lg text-white transition ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}>{loading ? "Generando..." : "Generar Estadísticas"}</button>
                </form>
            </div>
            {loading && <p className="mt-4 text-gray-600">Cargando datos...</p>}
            {error && <p className="mt-4 text-red-600">{error}</p>}
            {estadisticas.length > 0 && !loading && (
                <div className="bg-white shadow-md rounded-lg p-6 mt-6 w-full max-w-2xl">
                    <h2 className="text-xl font-semibold text-center mb-4">Estadísticas de Ocupación</h2>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium">Selecciona un horario:</label>
                        <select value={horarioSeleccionado} onChange={handleHorarioChange} className="w-full mt-1 p-2 border rounded-lg focus:ring-blue-300">
                            {horariosUnicos.map(horario => (
                                <option key={horario} value={horario}>{horario}</option>
                            ))}
                        </select>
                    </div>
                    <div className="w-full h-96">{renderChart()}</div>
                </div>
            )}

            <div className="p-4 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow mt-1">
                <Link to={`/estadisticas`}>
                    <h2 className="text-lg font-semibold">Volver</h2>
                </Link>
            </div>
        </div>
    );
}

// Función para generar colores aleatorios
const randomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};
