import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SeleccionarEvento = () => {
    const [eventos, setEventos] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEventos = async () => {
            try {
                const response = await fetch('http://localhost:8100/api/eventos/todos');
                if (!response.ok) {
                    throw new Error('Error al cargar los eventos');
                }
                const data = await response.json();
                setEventos(data);
            } catch (error) {
                console.error('Error al cargar los eventos:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEventos();
    }, []);

    const handleSeleccionarEvento = (eventoId) => {
        // Guardamos el ID del evento en el localStorage
        localStorage.setItem('eventoSeleccionadoTickets', eventoId);
        // Redirigimos a la gestión de tickets
        navigate('/gestion-de-tickets');
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen md:max-w-4xl md:mx-auto md:p-6 p-4 pb-20">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Seleccionar Evento</h1>
            </div>
            
            <p className="text-gray-600 mb-4">Por favor, selecciona el evento al que deseas asociar los tickets:</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {eventos.map((evento) => (
                    <div 
                        key={evento.id} 
                        className="border rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer"
                        onClick={() => handleSeleccionarEvento(evento.id)}
                    >
                        <h2 className="text-lg font-semibold mb-2">{evento.nombre}</h2>
                        <p className="text-gray-600 text-sm">
                            Espacio: {evento.espacio}
                        </p>
                        <p className="text-gray-600 text-sm">
                            Fecha: {new Date(evento.fecha).toLocaleDateString()}
                        </p>
                    </div>
                ))}
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-lg md:static md:shadow-none md:border-t-0 md:bg-transparent">
                <button
                    onClick={() => navigate('/')}
                    className="w-full md:w-auto bg-green-500 text-white py-3 px-6 rounded-md hover:bg-green-600 transition-colors"
                >
                    Volver al Inicio
                </button>
            </div>
        </div>
    );
};

export default SeleccionarEvento; 