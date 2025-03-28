import React,{ useState } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
import { Link } from "react-router-dom";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function AnalisisConsumo() {
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFinal, setFechaFinal] = useState("");
    const [datos, setDatos] = useState(null);

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

    const chartData = datos ? {
        labels: datos.map(p => p.nombre),
        datasets: [{
            label: "Cantidad Consumida",
            data: datos.map(p => p.totalConsumido),
            backgroundColor: "rgba(54, 162, 235, 0.6)",
        }]
    } : null;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-semibold text-center mb-4">Generar Ánalisis</h2>
                <form onSubmit={fetchConsumo} className="space-y-4">
                    <input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} required className="w-full p-2 border rounded" />
                    <input type="date" value={fechaFinal} onChange={(e) => setFechaFinal(e.target.value)} required className="w-full p-2 border rounded" />
                    <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">Generar</button>
                </form>
            </div>

            {chartData && (
                <div className="bg-white shadow-md rounded-lg p-6 mt-6 w-full max-w-2xl">
                    <h2 className="text-xl font-semibold text-center mb-4">Productos Más Consumidos &#40;General&#41;</h2>
                    <Bar data={chartData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
                </div>
            )}

            <Link to="/estadisticas" className="p-4 bg-green-500 text-white rounded mt-4">Volver</Link>
        </div>
    );
}
