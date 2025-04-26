import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function AsignarProducto() {
    const { id } = useParams(); // Extrae el ID del evento de la URL
    const [productos, setProductos] = useState([]); // Estado para almacenar los productos
    const [productoSeleccionado, setProductoSeleccionado] = useState(""); // Estado para almacenar el producto seleccionado
    const [evento, setEvento] = useState(null); // Estado para almacenar el evento
    const navegar = useNavigate(); // Hook para navegar entre rutas

    // Cargar los productos y el evento al montar el componente
    useEffect(() => {
        // Cargar los productos
        fetch("http://localhost:8100/api/productos/todos")
            // Realiza una solicitud GET a la API para obtener todos los productos
            .then((response) => response.json())
            .then((productosData) => {
                // Si la respuesta es un array, lo asignamos al estado de productos
                if (Array.isArray(productosData)) {
                    setProductos(productosData);
                } else {
                    console.error("La respuesta de productos no es un array:", productosData);
                    setProductos([]);
                }
            })
            .catch((error) => {
                console.error("Error fetching productos:", error);
                setProductos([]);
            });

        /// Cargar el evento específico
        fetch(`http://localhost:8100/api/eventos/${id}`)
            .then((response) => response.json())
            .then((eventoData) => {
                setEvento(eventoData); // Establecemos el evento
            })
            .catch((error) => console.error("Error fetching evento:", error));
    }, [id]);

    /*
        Función para manejar la asignación del producto al evento.
        Se encarga de validar la selección del producto y enviar la solicitud a la API. 
        Si no se selecciona un producto, muestra una alerta.
        Si se selecciona un producto, envía una solicitud POST a la API para asignar el producto al evento.
        Si la asignación es exitosa, muestra una alerta de éxito.
        Si ocurre un error, lo muestra en la consola.
    */
    const manejoAsignarProducto = () => {
        if (!productoSeleccionado) {
            alert("Por favor, selecciona un producto.");
            return;
        }

        // Lógica para asignar el producto al evento (sin cantidad)
        const productoElegido = {
            productoId: productoSeleccionado,
        };

        fetch(`http://localhost:8100/api/eventos/${id}/productos`, {
            method: "POST",
            body: JSON.stringify(productoElegido),
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
        <div className="p-4 sm:p-6 md:p-8 lg:p-10 bg-white rounded-lg shadow-md max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto">
            {/* Información del evento */}
            {evento && (
                <div className="mb-4 text-center">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-center">Asignar Producto al Evento:</h2>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-center">{evento.nombre}</h2>
                </div>
            )}

            {/* Selección de producto */}
            <div className="mb-4">
                <label htmlFor="producto" className="block text-sm sm:text-md font-medium mb-1">Selecciona un Producto</label>
                <select
                    id="producto"
                    className="mt-1 w-full p-2 border rounded-md shadow-sm focus:ring focus:ring-blue-200 focus:border-blue-300 text-sm sm:text-md"
                    value={productoSeleccionado}
                    onChange={(e) => setProductoSeleccionado(e.target.value)}
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

            {/* Botones */}
            <div className="flex flex-col sm:flex-row gap-2 justify-end">
                <button
                    onClick={manejoAsignarProducto}
                    className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition duration-300 text-sm sm:text-md w-full sm:w-auto"
                >
                    Asignar Producto
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