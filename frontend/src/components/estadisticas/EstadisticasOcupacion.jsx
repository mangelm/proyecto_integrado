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
    const [graficoHorariosMasSolicitados, setGraficoHorariosMasSolicitados] = useState(null);
    const [mostrarGraficoHorarios, setMostrarGraficoHorarios] = useState(false);
    const [graficoDiasMasSolicitados, setGraficoDiasMasSolicitados] = useState(null);
    const [mostrarGraficoDias, setMostrarGraficoDias] = useState(false);


    const handleFechaInicioChange = (e) => setFechaInicio(e.target.value);
    const handleFechaFinalChange = (e) => setFechaFinal(e.target.value);
    const handleHorarioChange = (e) => setHorarioSeleccionado(e.target.value);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setEstadisticas([]);
        setGraficoHorariosMasSolicitados(null);
    
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
    
            const horarios = [...new Set(data.map(item => item.horario))];
            setHorariosUnicos(horarios);
            setHorarioSeleccionado(horarios[0] || "");
    
            // Calcular horarios más solicitados
            calcularHorariosMasSolicitados(data);
    
            // Calcular días más solicitados
            calcularDiasMasSolicitados(data);
    
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };
    

    const calcularHorariosMasSolicitados = (data) => {
        const horariosSolicitados = data.reduce((acc, item) => {
            const horario = item.horario;
            acc[horario] = (acc[horario] || 0) + 1;
            return acc;
        }, {});

        const horariosOrdenados = Object.entries(horariosSolicitados).sort((a, b) => b[1] - a[1]);
        const topHorarios = horariosOrdenados.slice(0, 5); // Los 5 horarios más solicitados

        const labels = topHorarios.map(horario => horario[0]); // Horarios
        const dataHorarios = topHorarios.map(horario => horario[1]); // Conteo de solicitudes

        setGraficoHorariosMasSolicitados({
            labels: labels,
            datasets: [
                {
                    label: 'Horarios más solicitados',
                    data: dataHorarios,
                    backgroundColor: 'rgba(153, 102, 255, 0.2)',
                    borderColor: 'rgba(153, 102, 255, 1)',
                    borderWidth: 1
                }
            ]
        });
    };
    
    const calcularDiasMasSolicitados = (data) => {
        const diasSolicitados = data.reduce((acc, item) => {
            const fecha = item.fecha;
            const fechaStr = new Date(fecha).toLocaleDateString('es-ES'); // 'dd/MM/yyyy'
            acc[fechaStr] = (acc[fechaStr] || 0) + 1;
            return acc;
        }, {});
        
        const diasOrdenados = Object.entries(diasSolicitados).sort((a, b) => b[1] - a[1]);
        const topDias = diasOrdenados.slice(0, 5); // Los 5 días más solicitados
        
        const labels = topDias.map(dia => dia[0]);  // Fechas formateadas
        const dataDias = topDias.map(dia => dia[1]);  // Conteo de eventos
        
        setGraficoDiasMasSolicitados({
            labels: labels,
            datasets: [
                {
                    label: 'Días más solicitados',
                    data: dataDias,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }
            ]
        });
    };    
    
    const renderChart = () => {
        if (!estadisticas.length || !horarioSeleccionado) return null;

        const datosFiltrados = estadisticas.filter(item => item.horario === horarioSeleccionado);
        const espaciosUnicos = [...new Set(datosFiltrados.map(item => item.espacio))];

        const datasets = espaciosUnicos.map(espacio => {
            const totalEventos = datosFiltrados.find(item => item.espacio === espacio)?.totalEventos || 0;
            return {
                label: espacio,
                data: [totalEventos],
                backgroundColor: randomColor(),
                borderColor: 'rgba(0, 0, 0, 0.1)',
                borderWidth: 1
            };
        });

        return (
            <Bar
                data={{ labels: [horarioSeleccionado], datasets }}
                options={{ responsive: true, maintainAspectRatio: false }}
            />
        );
    };

    const renderGraficoHorariosMasSolicitados = () => {
        if (!graficoHorariosMasSolicitados) return null;
        return (
            <div className="w-full h-96 mt-6">
                <Bar data={graficoHorariosMasSolicitados} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
        );
    };

    const renderGraficoDiasMasSolicitados = () => {
        if (!graficoDiasMasSolicitados) return null;
        return (
            <div className="w-full h-96 mt-6">
                <Bar data={graficoDiasMasSolicitados} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
        );
    };
    

    const handleButtonClickHorarios = () => {
        // console.log("Botón 'Ver horarios más solicitados' clickeado, estado previo:", mostrarGraficoHorarios);
        setMostrarGraficoHorarios(!mostrarGraficoHorarios);
        // console.log("Nuevo estado de mostrarGraficoHorarios:", mostrarGraficoHorarios);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-semibold text-center mb-4">Generar Estadísticas</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="date" value={fechaInicio} onChange={handleFechaInicioChange} required className="w-full p-2 border rounded" />
                    <input type="date" value={fechaFinal} onChange={handleFechaFinalChange} required className="w-full p-2 border rounded" />
                    <button type="submit" disabled={!fechaInicio || !fechaFinal || loading} className="w-full p-2 bg-blue-500 text-white rounded">{loading ? "Generando..." : "Generar Estadísticas"}</button>
                </form>
            </div>
            {loading && <p className="mt-4 text-gray-600">Cargando datos...</p>}
            {error && <p className="mt-4 text-red-600">{error}</p>}
            {estadisticas.length > 0 && !loading && (
                <div className="bg-white shadow-md rounded-lg p-6 mt-6 w-full max-w-2xl">
                    <h2 className="text-xl font-semibold text-center mb-4">Estadísticas de Ocupación</h2>
                    <select value={horarioSeleccionado} onChange={handleHorarioChange} className="w-full p-2 border rounded">
                        {horariosUnicos.map(horario => (
                            <option key={horario} value={horario}>{horario}</option>
                        ))}
                    </select>
                    <div className="w-full h-96">{renderChart()}</div>
                    <button
                        onClick={handleButtonClickHorarios}
                        className="mt-6 w-full p-2 bg-green-500 text-white rounded"
                    >
                        {mostrarGraficoHorarios ? "Ocultar horarios más solicitados" : "Ver horarios más solicitados"}
                    </button>
                    {mostrarGraficoHorarios && renderGraficoHorariosMasSolicitados()}
                    <button
                        onClick={() => {
                            setMostrarGraficoDias(!mostrarGraficoDias);
                        }}
                        className="mt-6 w-full p-2 bg-blue-500 text-white rounded"
                    >
                        {mostrarGraficoDias ? "Ocultar días más solicitados" : "Ver días más solicitados"}
                    </button>
                    {mostrarGraficoDias && renderGraficoDiasMasSolicitados()}
                </div>
            )}

            <Link to="/estadisticas" className="p-4 bg-green-500 text-white rounded mt-4">Volver</Link>
        </div>
    );
}

const randomColor = () => "#" + Math.floor(Math.random() * 16777215).toString(16);
