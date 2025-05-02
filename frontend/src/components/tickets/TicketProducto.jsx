import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';

const TicketProducto = () => {
    const navigate = useNavigate();
    const [evento, setEvento] = useState(null);
    const [productos, setProductos] = useState([]);
    const [productoSeleccionado, setProductoSeleccionado] = useState('');
    const [cantidad, setCantidad] = useState(1);
    const [loading, setLoading] = useState(true);
    const [precioUnitario, setPrecioUnitario] = useState(0);
    const [impuesto, setImpuesto] = useState(0);
    const [total, setTotal] = useState(0);
    const [numeroTicket, setNumeroTicket] = useState(1);

    useEffect(() => {
        const eventoId = localStorage.getItem('eventoSeleccionadoTickets');
        
        if (!eventoId) {
            navigate('/seleccionar-evento-ticket');
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
                const productosResponse = await fetch(`http://localhost:8100/api/eventos/${eventoId}/productos-consumidos`);
                if (!productosResponse.ok) throw new Error('Error al cargar los productos');
                const productosData = await productosResponse.json();
                setProductos(Array.isArray(productosData) ? productosData : []);

                // Obtener el último número de ticket para este evento
                const ticketsResponse = await fetch(`http://localhost:8100/api/tickets/evento/${eventoId}/ultimo-numero`);
                if (ticketsResponse.ok) {
                    const ultimoNumero = await ticketsResponse.json();
                    setNumeroTicket(ultimoNumero + 1);
                }
            } catch (error) {
                console.error('Error:', error);
                setProductos([]);
            } finally {
                setLoading(false);
            }
        };

        fetchDatos();
    }, [navigate]);

    useEffect(() => {
        if (productoSeleccionado) {
            const producto = productos.find(p => p.nombreProducto === productoSeleccionado);
            if (producto) {
                // Obtener el precio unitario y el impuesto del producto
                fetch(`http://localhost:8100/api/productos/todos`)
                    .then(response => response.json())
                    .then(productosCompletos => {
                        const productoCompleto = productosCompletos.find(p => p.nombre === productoSeleccionado);
                        if (productoCompleto) {
                            setPrecioUnitario(productoCompleto.precio);
                            setImpuesto(productoCompleto.impuesto);
                            calcularTotal(productoCompleto.precio, productoCompleto.impuesto, cantidad);
                        }
                    })
                    .catch(error => console.error('Error al obtener detalles del producto:', error));
            }
        }
    }, [productoSeleccionado, cantidad, productos]);

    const calcularTotal = (precio, impuesto, cantidad) => {
        const subtotal = precio * cantidad;
        const iva = subtotal * (impuesto / 100);
        const totalConIva = subtotal + iva;
        setTotal(totalConIva);
    };

    const handleVolverASeleccion = () => {
        localStorage.removeItem('eventoSeleccionadoTickets');
        navigate('/seleccionar-evento-ticket');
    };

    const formatearNombreEvento = (nombre) => {
        // Limitar a 20 caracteres y eliminar espacios
        return nombre.substring(0, 20).replace(/\s+/g, '_');
    };

    const formatearFecha = (fecha) => {
        const date = new Date(fecha);
        return `${date.getDate().toString().padStart(2, '0')}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getFullYear()}`;
    };

    const handleImprimirTicket = async () => {
        if (!productoSeleccionado || cantidad < 1) return;

        const producto = productos.find(p => p.nombreProducto === productoSeleccionado);
        if (!producto) return;

        try {
            // Obtener el producto completo para tener su ID
            const productosResponse = await fetch('http://localhost:8100/api/productos/todos');
            const productosCompletos = await productosResponse.json();
            const productoCompleto = productosCompletos.find(p => p.nombre === productoSeleccionado);

            if (!productoCompleto) {
                throw new Error('No se encontró el producto completo');
            }

            // Crear el ticket para guardar en la base de datos
            const ticketData = {
                evento: { id: evento.id },
                producto: { id: productoCompleto.id },
                cantidad: cantidad,
                precioTotal: total,
                numeroTicket: numeroTicket
            };

            // Guardar el ticket en la base de datos
            const saveResponse = await fetch('http://localhost:8100/api/tickets', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(ticketData)
            });

            if (!saveResponse.ok) {
                throw new Error('Error al guardar el ticket');
            }

            // Crear PDF
            const doc = new jsPDF();
            
            // Configuración de colores
            const primaryColor = [41, 128, 185]; // Azul
            const secondaryColor = [52, 73, 94]; // Gris oscuro
            
            // Función para dibujar línea decorativa
            const drawDecorativeLine = (y) => {
                doc.setDrawColor(...primaryColor);
                doc.setLineWidth(0.5);
                doc.line(20, y, 190, y);
            };
            
            // Encabezado
            doc.setFillColor(...primaryColor);
            doc.rect(0, 0, 210, 30, 'F');
            
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(24);
            doc.text('TICKET', 105, 20, { align: 'center' });
            
            // Información del evento
            doc.setTextColor(...secondaryColor);
            doc.setFontSize(16);
            doc.text(evento.nombre, 105, 45, { align: 'center' });
            
            doc.setFontSize(12);
            doc.text(`Fecha: ${new Date(evento.fecha).toLocaleDateString()}`, 20, 55);
            
            // Línea decorativa
            drawDecorativeLine(65);
            
            // Detalles del producto
            doc.setFontSize(14);
            doc.setTextColor(...primaryColor);
            doc.text('Detalles del Producto', 20, 80);
            
            doc.setFontSize(12);
            doc.setTextColor(...secondaryColor);
            doc.text(`Producto: ${producto.nombreProducto}`, 20, 90);
            doc.text(`Cantidad: ${cantidad}`, 20, 100);
            doc.text(`Precio unitario: ${precioUnitario.toFixed(2)}€`, 20, 110);
            doc.text(`IVA (${impuesto}%): ${(total - (precioUnitario * cantidad)).toFixed(2)}€`, 20, 120);
            
            // Línea decorativa
            drawDecorativeLine(130);
            
            // Total
            doc.setFontSize(18);
            doc.setTextColor(...primaryColor);
            doc.text(`Total: ${total.toFixed(2)}€`, 20, 150);
            
            // Número de ticket
            doc.setFontSize(10);
            doc.setTextColor(...secondaryColor);
            doc.text(`Ticket Nº: ${numeroTicket.toString().padStart(4, '0')}`, 20, 160);
            
            // Pie de página
            doc.setFontSize(8);
            doc.text('Gracias por su compra', 105, 280, { align: 'center' });
            
            // Guardar PDF con el nuevo formato de nombre
            const nombreEventoFormateado = formatearNombreEvento(evento.nombre);
            const fechaFormateada = formatearFecha(evento.fecha);
            doc.save(`ticket_${nombreEventoFormateado}_${fechaFormateada}_${numeroTicket.toString().padStart(4, '0')}.pdf`);

            // Incrementar el número de ticket para la próxima generación
            setNumeroTicket(numeroTicket + 1);
        } catch (error) {
            console.error('Error:', error);
            alert('Error al generar el ticket: ' + error.message);
        }
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
                            productos.map((producto, index) => (
                                <option key={`${producto.nombreProducto}_${index}`} value={producto.nombreProducto}>
                                    {producto.nombreProducto}
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
                        <p>Subtotal: {(precioUnitario * cantidad).toFixed(2)}€</p>
                        <p>IVA ({impuesto}%): {(total - (precioUnitario * cantidad)).toFixed(2)}€</p>
                        <p className="font-bold">Total: {total.toFixed(2)}€</p>
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