import { useEffect, useState } from 'react';
import Select from 'react-select';
import jsPDF from 'jspdf';
import { Link } from "react-router-dom"; 

const TicketProducto = () => {
    const [productos, setProductos] = useState([]);
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const [cantidad, setCantidad] = useState('');

    useEffect(() => {
    async function fetchProductos() {
        try {
        const response = await fetch("http://localhost:8100/api/productos/todos");
        const data = await response.json();

        // ⚠️ Ajusta esta línea si la estructura cambia
        const lista = Array.isArray(data)
            ? data
            : data._embedded?.productos || [];

        const opciones = lista.map((p) => ({
            value: p.id,
            label: p.nombre,
        }));
        setProductos(opciones);
        } catch (error) {
        console.error("Error al obtener productos:", error);
        }
    }

    fetchProductos();
    }, []);

    const handleImprimir = () => {
        if (!productoSeleccionado || !cantidad) {
            alert("Por favor selecciona un producto y una cantidad");
            return;
        }

        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a6', // tamaño tipo ticket
        });

        // Estilos generales
        doc.setFillColor(230, 230, 250); // lavanda claro
        doc.rect(0, 0, 105, 148, 'F'); // fondo completo

        // Encabezado
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.setTextColor(33, 37, 41); // gris oscuro
        doc.text("Ticket de Producto", 52.5, 20, { align: "center" });

        // Línea decorativa
        doc.setDrawColor(100, 100, 255); // azul suave
        doc.line(10, 25, 95, 25);

        // Detalles del producto
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(14);
        doc.setTextColor(50, 50, 50);

        doc.text(`Producto:`, 15, 40);
        doc.setFont('helvetica', 'bold');
        doc.text(productoSeleccionado.label, 45, 40);

        doc.setFont('helvetica', 'normal');
        doc.text(`Cantidad:`, 15, 55);
        doc.setFont('helvetica', 'bold');
        doc.text(cantidad.toString(), 45, 55);

        // Línea inferior
        doc.setDrawColor(180, 180, 180);
        doc.line(10, 70, 95, 70);

        // Pie
        doc.setFontSize(10);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(120, 120, 120);
        doc.text("Gracias por su compra", 52.5, 80, { align: "center" });

        // Guardar
        doc.save("ticket_producto.pdf");
    };

    return (
        <div className="max-w-md mx-auto p-4 border rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-center">Ticket Producto</h2>

            <label className="block mb-2">Selecciona un producto</label>
            <Select
            options={productos}
            value={productoSeleccionado}
            onChange={setProductoSeleccionado}
            placeholder="Buscar producto..."
            isClearable
            />

            <label className="block mt-4 mb-2">Cantidad</label>
            <input
            type="number"
            min="1"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            className="w-full border rounded px-2 py-1"
            />

            <button
            onClick={handleImprimir}
            className="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
            >
            Imprimir
            </button>

            <div className="mt-6 text-center w-full md:w-auto">
                <Link to={`/`}>
                    <button className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700 transition duration-300 w-full md:w-auto">
                    Volver a la página principal
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default TicketProducto;
