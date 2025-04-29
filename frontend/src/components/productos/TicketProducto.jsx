import { useEffect, useState } from 'react';
import Select from 'react-select';
import jsPDF from 'jspdf';
import { Link } from "react-router-dom";
import MensajesDeErrores from '../../pages/MensajesDeErrores';

export default function TicketProducto() {
    const [productos, setProductos] = useState([]);
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const [cantidad, setCantidad] = useState('');
    const [eventos, setEventos] = useState([]);
    const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
    const [errores, setErrores] = useState([]);

    useEffect(() => {
        async function fetchEventos() {
            try {
                const response = await fetch("http://localhost:8100/api/eventos/todos");
                if (!response.ok) {
                    throw new Error(`Error al obtener eventos: ${response.statusText}`);
                }
                const data = await response.json();

                const lista = Array.isArray(data)
                    ? data
                    : data._embedded?.eventos || [];

                const opciones = lista.map((e) => ({
                    value: e.id,
                    label: e.nombre,
                }));
                setEventos(opciones);
            } catch (error) {
                console.error("Error al obtener eventos:", error);
                setErrores((prevErrores) => [...prevErrores, "No se pudieron cargar los eventos. Intenta nuevamente más tarde."]);
            }
        }

        fetchEventos();
    }, []);

    useEffect(() => {
        async function fetchProductosPorEvento() {
            if (!eventoSeleccionado) {
                setProductos([]);
                return;
            }

            try {
                const response = await fetch(`http://localhost:8100/api/eventos/${eventoSeleccionado.value}/productos-consumidos`);
                const data = await response.json();

                const opciones = data.map((p, index) => ({
                    value: index,
                    label: p.nombreProducto,
                    cantidad: p.cantidad,
                }));
                setProductos(opciones);
            } catch (error) {
                console.error("Error al obtener productos por evento:", error);
                setErrores((prevErrores) => [...prevErrores, "No se pudieron cargar los productos. Intenta nuevamente más tarde."]);
            }
        }

        fetchProductosPorEvento();
    }, [eventoSeleccionado]);

    const manejoImprimir = () => {
        const nuevosErrores = [];

        if (!eventoSeleccionado) {
            nuevosErrores.push("Por favor selecciona un evento.");
        }

        if (!productoSeleccionado) {
            nuevosErrores.push("Por favor selecciona un producto.");
        }

        if (!cantidad) {
            nuevosErrores.push("Por favor ingresa una cantidad.");
        }

        if (nuevosErrores.length > 0) {
            setErrores(nuevosErrores);
            return;
        }

        setErrores([]);

        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a6',
        });

        const margin = 10;
        let yPosition = 15;
        const lineHeight = 7;

        doc.setFillColor(245, 245, 220);
        doc.rect(0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight(), 'F');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.setTextColor(40, 40, 40);
        doc.text("Ticket de Producto", doc.internal.pageSize.getWidth() / 2, yPosition, { align: "center" });
        yPosition += lineHeight * 2;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(12);
        doc.setTextColor(50, 50, 50);

        doc.text(`Evento:`, margin, yPosition);
        doc.setFont('helvetica', 'bold');
        doc.text(eventoSeleccionado.label, margin + 25, yPosition);
        yPosition += lineHeight;

        doc.setFont('helvetica', 'normal');
        doc.text(`Producto:`, margin, yPosition);
        doc.setFont('helvetica', 'bold');
        doc.text(productoSeleccionado.label, margin + 25, yPosition);
        yPosition += lineHeight;

        doc.text(`Cantidad:`, margin, yPosition);
        doc.setFont('helvetica', 'bold');
        doc.text(cantidad.toString(), margin + 25, yPosition);
        yPosition += lineHeight * 1.5;

        doc.save(`ticket_${productoSeleccionado.label.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`);
    };

    return (
        <div className="max-w-md mx-auto p-4 border rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-center">Ticket Producto</h2>

            {errores.length > 0 && <MensajesDeErrores messages={errores} />}

            <label className="block mb-2">Selecciona un evento</label>
            <Select
                options={eventos}
                value={eventoSeleccionado}
                onChange={setEventoSeleccionado}
                placeholder="Buscar evento..."
                isClearable
                getOptionLabel={(option) => option.label}
                getOptionValue={(option) => option.value}
            />

            <label className="block mt-4 mb-2">Selecciona un producto</label>
            <Select
                options={productos}
                value={productoSeleccionado}
                onChange={setProductoSeleccionado}
                placeholder="Buscar producto..."
                isClearable
                getOptionLabel={(option) => `${option.label})`}
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
}