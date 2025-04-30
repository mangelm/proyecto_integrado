import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const TicketProducto = () => {
    const navigate = useNavigate();
    const [evento, setEvento] = useState(null);
    const [productos, setProductos] = useState([]);
    const [productoSeleccionado, setProductoSeleccionado] = useState('');
    const [cantidad, setCantidad] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const eventoId = localStorage.getItem('eventoSeleccionadoTickets');
        
        if (!eventoId) {
            navigate('/seleccionar-evento');
            return;
        }

        const fetchDatos = async () => {
            try {
                // Obtener datos del evento
                const eventoResponse = await fetch(`http://localhost:8100/api/eventos/${eventoId}`);
                if (!eventoResponse.ok) throw new Error('Error al cargar el evento');
                const eventoData = await eventoResponse.json();
                setEvento(eventoData);

                // Obtener lista de productos
                const productosResponse = await fetch('http://localhost:8100/api/productos');
                if (!productosResponse.ok) throw new Error('Error al cargar los productos');
                const productosData = await productosResponse.json();
                // Aseguramos que productosData sea un array
                setProductos(Array.isArray(productosData) ? productosData : []);
            } catch (error) {
                console.error('Error:', error);
                setProductos([]); // En caso de error, establecemos un array vacío
            } finally {
                setLoading(false);
            }
        };

        fetchDatos();
    }, [navigate]);

    const handleVolverASeleccion = () => {
        localStorage.removeItem('eventoSeleccionadoTickets');
        navigate('/seleccionar-evento-ticket');
    };

    const handleImprimirTicket = () => {
        if (!productoSeleccionado || cantidad < 1) return;

        const producto = productos.find(p => p.id === parseInt(productoSeleccionado));
        if (!producto) return;

        const subtotal = producto.precio * cantidad;
        const impuesto = subtotal * (producto.impuesto / 100);
        const total = subtotal + impuesto;

        // Crear ventana de impresión
        const ventanaImpresion = window.open('', '_blank');
        ventanaImpresion.document.write(`
            <html>
                <head>
                    <title>Ticket de Venta</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; }
                        .ticket { max-width: 300px; margin: 0 auto; }
                        .header { text-align: center; margin-bottom: 20px; }
                        .info { margin-bottom: 15px; }
                        .total { font-weight: bold; margin-top: 20px; }
                        @media print {
                            body { padding: 0; }
                            .ticket { max-width: 100%; }
                        }
                    </style>
                </head>
                <body>
                    <div class="ticket">
                        <div class="header">
                            <h2>Ticket de Venta</h2>
                            <p>Evento: ${evento.nombre}</p>
                            <p>Fecha: ${new Date(evento.fecha).toLocaleDateString()}</p>
                        </div>
                        <div class="info">
                            <p>Producto: ${producto.nombre}</p>
                            <p>Cantidad: ${cantidad}</p>
                            <p>Precio unitario: ${producto.precio.toFixed(2)}€</p>
                            <p>Subtotal: ${subtotal.toFixed(2)}€</p>
                            <p>Impuesto (${producto.impuesto}%): ${impuesto.toFixed(2)}€</p>
                        </div>
                        <div class="total">
                            <p>Total: ${total.toFixed(2)}€</p>
                        </div>
                    </div>
                </body>
            </html>
        `);
        ventanaImpresion.document.close();
        ventanaImpresion.print();
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Generar Ticket</h1>
                <button
                    onClick={handleVolverASeleccion}
                    className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
                >
                    Cambiar Evento
                </button>
            </div>
            
            {evento && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h2 className="text-lg font-semibold mb-2">Evento Seleccionado</h2>
                    <p className="text-gray-600">Nombre: {evento.nombre}</p>
                    <p className="text-gray-600">Fecha: {new Date(evento.fecha).toLocaleDateString()}</p>
                </div>
            )}

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Seleccionar Producto
                    </label>
                    <select
                        value={productoSeleccionado}
                        onChange={(e) => setProductoSeleccionado(e.target.value)}
                        className="w-full p-2 border rounded-md"
                    >
                        <option value="">Selecciona un producto</option>
                        {productos && productos.length > 0 ? (
                            productos.map((producto) => (
                                <option key={producto.id} value={producto.id}>
                                    {producto.nombre} - {producto.precio.toFixed(2)}€
                                </option>
                            ))
                        ) : (
                            <option disabled>No hay productos disponibles</option>
                        )}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cantidad
                    </label>
                    <input
                        type="number"
                        min="1"
                        value={cantidad}
                        onChange={(e) => setCantidad(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full p-2 border rounded-md"
                    />
                </div>

                {productoSeleccionado && productos.length > 0 && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <h3 className="font-semibold mb-2">Resumen</h3>
                        {(() => {
                            const producto = productos.find(p => p.id === parseInt(productoSeleccionado));
                            if (!producto) return null;
                            
                            const subtotal = producto.precio * cantidad;
                            const impuesto = subtotal * (producto.impuesto / 100);
                            const total = subtotal + impuesto;

                            return (
                                <>
                                    <p>Subtotal: {subtotal.toFixed(2)}€</p>
                                    <p>Impuesto ({producto.impuesto}%): {impuesto.toFixed(2)}€</p>
                                    <p className="font-bold">Total: {total.toFixed(2)}€</p>
                                </>
                            );
                        })()}
                    </div>
                )}

                <button
                    onClick={handleImprimirTicket}
                    disabled={!productoSeleccionado || productos.length === 0}
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
                >
                    Imprimir Ticket
                </button>
            </div>
        </div>
    );
};

export default TicketProducto; 