import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MensajesDeErrores from "../../pages/MensajesDeErrores";

export default function AsignarProducto() {
    const { id } = useParams();
    const [productos, setProductos] = useState([]);
    const [productosSeleccionados, setProductosSeleccionados] = useState([]);
    const [evento, setEvento] = useState(null);
    const [errores, setErrores] = useState([]);
    const navegar = useNavigate();

    useEffect(() => {
        // Cargar los productos
        fetch("http://localhost:8100/api/productos/todos")
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Error al cargar productos: ${response.status} ${response.statusText}`);
                }
                return response.json();
            })
            .then((productosData) => {
                if (Array.isArray(productosData)) {
                    setProductos(productosData);
                } else {
                    throw new Error("La respuesta de productos no es un array válido.");
                }
            })
            .catch((error) => {
                console.error("Error al cargar productos:", error.message);
                setErrores((prevErrores) => [...prevErrores, "Error al cargar los productos. Intenta nuevamente."]);
            });

        // Cargar el evento específico
        fetch(`http://localhost:8100/api/eventos/${id}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Error al cargar evento: ${response.status} ${response.statusText}`);
                }
                return response.json();
            })
            .then((eventoData) => {
                setEvento(eventoData);
            })
            .catch((error) => {
                console.error("Error al cargar evento:", error.message);
                setErrores((prevErrores) => [...prevErrores, "Error al cargar el evento. Intenta nuevamente."]);
            });
    }, [id]);

    const manejoAsignarProductos = () => {
        if (productosSeleccionados.length === 0) {
            alert("Por favor, selecciona al menos un producto.");
            return;
        }

        // Crear un array de productos para asignar
        const productosParaAsignar = productosSeleccionados.map(productoId => ({
            productoId: productoId
        }));

        // Enviar la solicitud para asignar los productos
        fetch(`http://localhost:8100/api/eventos/${id}/productos`, {
            method: "POST",
            body: JSON.stringify(productosParaAsignar),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                if (!response.ok) {
                    return response.json().then(errorData => {
                        // Obtener el ID del producto del mensaje de error
                        const productoId = errorData.message.match(/ID (\d+)/)[1];
                        // Buscar el nombre del producto en la lista de productos
                        const producto = productos.find(p => p.id === parseInt(productoId));
                        const nombreProducto = producto ? producto.nombre : 'el producto';
                        throw new Error(`El producto ${nombreProducto} ya está asignado a este evento`);
                    });
                }
                return response.json();
            })
            .then(() => {
                alert("Productos asignados con éxito");
                setProductosSeleccionados([]); // Limpiar la selección
                setErrores([]); // Limpiar errores
            })
            .catch((error) => {
                console.error("Error al asignar productos:", error.message);
                setErrores([error.message]);
            });
    };

    const handleSeleccionProducto = (productoId) => {
        setProductosSeleccionados(prev => {
            if (prev.includes(productoId)) {
                return prev.filter(id => id !== productoId);
            } else {
                return [...prev, productoId];
            }
        });
    };

    return (
        <div className="p-4 sm:p-6 md:p-8 lg:p-10 bg-white rounded-lg shadow-md max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto">
            {/* Mostrar errores */}
            {errores.length > 0 && <MensajesDeErrores messages={errores} />}

            {/* Información del evento */}
            {evento && (
                <div className="mb-4 text-center">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-center">Asignar Productos al Evento:</h2>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-center">{evento.nombre}</h2>
                </div>
            )}

            {/* Lista de productos */}
            <div className="mb-4">
                <label className="block text-sm sm:text-md font-medium mb-1">Selecciona los Productos</label>
                <div className="max-h-96 overflow-y-auto border rounded-md p-2">
                    {productos && productos.length > 0 ? (
                        productos.map((producto) => (
                            <div key={producto.id} className="flex items-center p-2 hover:bg-gray-50">
                                <input
                                    type="checkbox"
                                    id={`producto-${producto.id}`}
                                    checked={productosSeleccionados.includes(producto.id)}
                                    onChange={() => handleSeleccionProducto(producto.id)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor={`producto-${producto.id}`} className="ml-2 block text-sm text-gray-900">
                                    {producto.nombre}
                                </label>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-gray-500">No hay productos disponibles</p>
                    )}
                </div>
            </div>

            {/* Botones */}
            <div className="flex flex-col sm:flex-row gap-2 justify-end">
                <button
                    onClick={manejoAsignarProductos}
                    className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition duration-300 text-sm sm:text-md w-full sm:w-auto"
                >
                    Asignar Productos Seleccionados
                </button>
                <button
                    type="button"
                    onClick={() => navegar("/eventos")}
                    className="bg-gray-300 hover:bg-gray-400 text-black p-2 rounded-lg transition duration-300 text-sm sm:text-md w-full sm:w-auto"
                >
                    Volver
                </button>
            </div>
        </div>
    );
}