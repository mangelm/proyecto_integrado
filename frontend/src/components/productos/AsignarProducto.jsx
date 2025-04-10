import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function AsignarProducto() {
    const { id } = useParams(); // Obtienes el ID del evento desde la URL
    const [productos, setProductos] = useState([]);
    const [selectedProducto, setSelectedProducto] = useState("");
    const [cantidad, setCantidad] = useState(1); // Para definir la cantidad del producto
    const [evento, setEvento] = useState(null);
    const navigate = useNavigate();

    // Cargar productos
    useEffect(() => {
        fetch("http://localhost:8100/api/productos/todos")
            .then((response) => response.json())
            .then((productosData) => {
                // Verificar si 'productosData' es un array
                if (Array.isArray(productosData)) {
                    setProductos(productosData); // Establecemos los productos si es un array
                } else {
                    console.error("La respuesta de productos no es un array:", productosData);
                    setProductos([]); // Establecer un array vacío si no es un array
                }
            })
            .catch((error) => {
                console.error("Error fetching productos:", error);
                setProductos([]); // Establecer un array vacío si ocurre un error
            });

        // Cargar el evento
        fetch(`http://localhost:8100/api/eventos/${id}`)
            .then((response) => response.json())
            .then((eventoData) => {
                setEvento(eventoData); // Establecemos el evento
            })
            .catch((error) => console.error("Error fetching evento:", error));
    }, [id]);

    const handleAsignarProducto = () => {
        if (!selectedProducto || !cantidad) {
            alert("Por favor, selecciona un producto y una cantidad.");
            return;
        }

        // Lógica para asignar el producto al evento
        const productoSeleccionado = {
            productoId: selectedProducto,
            cantidad,
        };

        fetch(`http://localhost:8100/api/eventos/${id}/productos`, {
            method: "POST",
            body: JSON.stringify(productoSeleccionado),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then(() => {
                alert("Producto asignado con éxito");
            })
            .catch((error) => console.error("Error al asignar producto:", error));
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Asignar Producto al Evento</h2>

            {/* Información del evento */}
            {evento && (
                <div className="mb-4">
                    <h3 className="text-lg font-semibold">Evento: {evento.nombre}</h3>
                    <p>Fecha: {evento.fecha}</p>
                    <p>Cantidad de personas: {evento.cantidadPersonas}</p>
                    <p>Espacio: {evento.espacio}</p>
                    <p>Horario: {evento.horario}</p>
                    <p>Estado: {evento.estado}</p>
                </div>
            )}

            {/* Selección de producto */}
            <div>
                <label htmlFor="producto" className="block text-sm font-medium">Selecciona un Producto</label>
                <select
                    id="producto"
                    className="mt-1 w-full p-2 border rounded-md"
                    value={selectedProducto}
                    onChange={(e) => setSelectedProducto(e.target.value)}
                >
                    <option value="">Seleccionar producto...</option>
                    {productos && productos.length > 0 ? (
                        productos.map((producto) => (
                            <option key={producto.id} value={producto.id}>
                                {producto.nombre}
                            </option>
                        ))
                    ) : (
                        <option disabled>No hay productos disponibles</option>
                    )}
                </select>
            </div>

            {/* Cantidad */}
            <div className="mt-4">
                <label htmlFor="cantidad" className="block text-sm font-medium">Cantidad</label>
                <input
                    id="cantidad"
                    type="number"
                    className="mt-1 w-full p-2 border rounded-md"
                    value={cantidad}
                    onChange={(e) => setCantidad(e.target.value)}
                    min="1"
                />
            </div>

            <div className="mt-4">
                <button
                    onClick={handleAsignarProducto}
                    className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition duration-300"
                >
                    Asignar Producto
                </button>
                <button
                        type="button"
                        onClick={() => navigate("/eventos")} 
                        className="bg-gray-300 hover:bg-gray-400 text-black p-2 rounded"
                    >
                        Volver
                    </button>
            </div>

        </div>
    );
}
