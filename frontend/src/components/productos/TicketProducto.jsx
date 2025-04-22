import { useEffect, useState } from 'react';
import Select from 'react-select';
import jsPDF from 'jspdf';
import { Link } from "react-router-dom";

export default function TicketProducto() {
    const [productos, setProductos] = useState([]);
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const [cantidad, setCantidad] = useState('');

    useEffect(() => {
        async function fetchProductos() {
            try {
                const response = await fetch("http://localhost:8100/api/productos/todos");
                const data = await response.json();

                const lista = Array.isArray(data)
                    ? data
                    : data._embedded?.productos || [];

                const opciones = lista.map((p) => ({
                    value: p.id,
                    label: p.nombre,
                    precio: p.precio, // Incluimos el precio para el ticket
                    impuesto: p.impuesto, // Incluimos el impuesto para el ticket
                }));
                setProductos(opciones);
            } catch (error) {
                console.error("Error al obtener productos:", error);
            }
        }

        fetchProductos();
    }, []);

    const manejoImprimir = () => {
        if (!productoSeleccionado || !cantidad) {
            alert("Por favor selecciona un producto y una cantidad");
            return;
        }

        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a6', // tamaño tipo ticket
        });

        const margin = 10;
        let yPosition = 15;
        const lineHeight = 7;

        // Estilos generales
        doc.setFillColor(245, 245, 220); // Beige claro
        doc.rect(0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight(), 'F'); // fondo completo

        // Encabezado
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.setTextColor(40, 40, 40); // Gris oscuro
        doc.text("Ticket de Producto", doc.internal.pageSize.getWidth() / 2, yPosition, { align: "center" });
        yPosition += lineHeight * 2;

        // Línea decorativa
        doc.setDrawColor(150, 150, 150); // Gris suave
        doc.line(margin, yPosition, doc.internal.pageSize.getWidth() - margin, yPosition);
        yPosition += lineHeight;

        // Detalles del producto
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(12);
        doc.setTextColor(50, 50, 50);

        doc.text(`Producto:`, margin, yPosition);
        doc.setFont('helvetica', 'bold');
        const productoLabelLines = doc.splitTextToSize(productoSeleccionado.label, doc.internal.pageSize.getWidth() - 2 * margin);
        productoLabelLines.forEach(line => {
            doc.text(line, margin + 25, yPosition);
            yPosition += lineHeight;
        });
        doc.setFont('helvetica', 'normal');

        doc.text(`Cantidad:`, margin, yPosition);
        doc.setFont('helvetica', 'bold');
        doc.text(cantidad.toString(), margin + 25, yPosition);
        yPosition += lineHeight * 1.5;

        // Precio e Impuesto
        doc.setFont('helvetica', 'normal');
        doc.text(`Precio Unitario:`, margin, yPosition);
        doc.text(`${productoSeleccionado.precio.toFixed(2)} €`, doc.internal.pageSize.getWidth() - margin, yPosition, { align: "right" });
        yPosition += lineHeight;

        doc.text(`Impuesto:`, margin, yPosition);
        doc.text(`${productoSeleccionado.impuesto.toFixed(2)} €`, doc.internal.pageSize.getWidth() - margin, yPosition, { align: "right" });
        yPosition += lineHeight * 1.5;

        // Total
        const precioTotal = (productoSeleccionado.precio * parseInt(cantidad, 10));
        const impuestoTotal = (productoSeleccionado.impuesto * parseInt(cantidad, 10));
        const totalConImpuesto = precioTotal + impuestoTotal;

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0); // Negro
        doc.line(margin, yPosition, doc.internal.pageSize.getWidth() - margin, yPosition);
        yPosition += lineHeight;
        doc.text(`Total:`, margin, yPosition);
        doc.text(`${totalConImpuesto.toFixed(2)} €`, doc.internal.pageSize.getWidth() - margin, yPosition, { align: "right" });
        yPosition += lineHeight * 2;

        // Línea inferior
        doc.setDrawColor(180, 180, 180);
        doc.line(margin, yPosition, doc.internal.pageSize.getWidth() - margin, yPosition);
        yPosition += lineHeight;

        // Pie
        doc.setFontSize(10);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(100, 100, 100);
        doc.text("Gracias por su compra", doc.internal.pageSize.getWidth() / 2, yPosition, { align: "center" });

        // Guardar
        doc.save(`ticket_${productoSeleccionado.label.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`);
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
                getOptionLabel={(option) => option.label}
                getOptionValue={(option) => option.value}
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
                onClick={manejoImprimir}
                className="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
            >
                Imprimir Ticket
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