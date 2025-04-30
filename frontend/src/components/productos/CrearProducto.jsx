import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MensajesDeErrores from "../../pages/MensajesDeErrores";

export default function CrearProducto() {
    const [nombre, setNombre] = useState(""); // Estado para almacenar el nombre del producto
    const [descripcion, setDescripcion] = useState(""); // Estado para almacenar la descripción del producto
    const [precio, setPrecio] = useState(""); // Estado para almacenar el precio del producto
    const [impuesto, setImpuesto] = useState(""); // Estado para almacenar el impuesto del producto
    const [disponible, setDisponible] = useState(false); // Estado para almacenar la disponibilidad del producto
    const [categoria, setCategoria] = useState("BEBIDA"); // Estado para almacenar la categoría del producto
    const [errores, setErrores] = useState([]); // Estado para manejar errores
    const navegar = useNavigate(); // Hook para navegar entre rutas

    const sanitizeInput = (value, type) => {
        if (type === "text") {
            return value.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ ]/g, ""); // Solo letras, números y espacios
        }
        if (type === "number") {
            return value.replace(/[^0-9]/g, ""); // Solo números
        }
        return value;
    };

    const sanitizeDecimal = (value) => {
        return value.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1"); // Permite solo un punto decimal
    };

    const manejarEnvio = async (e) => {
        e.preventDefault();

        const nuevoProducto = {
            nombre: sanitizeInput(nombre, "text"),
            descripcion: sanitizeInput(descripcion, "text"),
            precio: parseFloat(precio) || 0,
            impuesto: parseFloat(impuesto) || 0,
            disponible,
            categoria,
        };

        try {
            const response = await fetch("http://localhost:8100/api/productos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(nuevoProducto),
                credentials: "same-origin",
            });

            if (response.ok) {
                navegar("/productos");
            } else {
                const errorData = await response.json();
                if (errorData && typeof errorData === 'object') {
                    if (Array.isArray(errorData.errors)) {
                        setErrores(errorData.errors.map(err => err.defaultMessage));
                    } else {
                        setErrores([errorData.message || "Error al crear el producto"]);
                    }
                } else {
                    setErrores(["Error al crear el producto. Intenta nuevamente."]);
                }
            }
        } catch (error) {
            console.error("Error al crear el producto:", error);
            if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
                setErrores(["Error de conexión. Verifica tu conexión a internet."]);
            } else {
                setErrores(["Error inesperado al crear el producto. Intenta nuevamente."]);
            }
        }
    };

    return (
        <div className="p-4 sm:p-6 md:p-8 lg:p-10 bg-white rounded-lg shadow-md max-w-md sm:max-w-lg md:max-w-xl mx-auto">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-center">Crear Producto</h1>

            {/* Mostrar errores */}
            {errores.length > 0 && <MensajesDeErrores messages={errores} />}

            <form onSubmit={manejarEnvio} className="space-y-4">
                <div>
                    <label htmlFor="nombre" className="block text-sm sm:text-md font-medium">
                        Nombre
                    </label>
                    <input
                        type="text"
                        id="nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                        className="mt-1 w-full p-2 border rounded-md shadow-sm focus:ring focus:ring-blue-200 focus:border-blue-300 text-sm sm:text-md"
                    />
                </div>

                <div>
                    <label htmlFor="descripcion" className="block text-sm sm:text-md font-medium">
                        Descripción
                    </label>
                    <input
                        type="text"
                        id="descripcion"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        required
                        className="mt-1 w-full p-2 border rounded-md shadow-sm focus:ring focus:ring-blue-200 focus:border-blue-300 text-sm sm:text-md"
                    />
                </div>

                <div className="sm:grid sm:grid-cols-2 sm:gap-4">
                    <div>
                        <label htmlFor="precio" className="block text-sm sm:text-md font-medium">
                            Precio
                        </label>
                        <input
                            type="number"
                            id="precio"
                            value={precio}
                            onChange={(e) => setPrecio(sanitizeDecimal(e.target.value))}
                            required
                            className="mt-1 w-full p-2 border rounded-md shadow-sm focus:ring focus:ring-blue-200 focus:border-blue-300 text-sm sm:text-md"
                        />
                    </div>

                    <div>
                        <label htmlFor="impuesto" className="block text-sm sm:text-md font-medium">
                            Impuesto
                        </label>
                        <input
                            type="number"
                            id="impuesto"
                            value={impuesto}
                            onChange={(e) => setImpuesto(sanitizeDecimal(e.target.value))}
                            required
                            className="mt-1 w-full p-2 border rounded-md shadow-sm focus:ring focus:ring-blue-200 focus:border-blue-300 text-sm sm:text-md"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="disponible"
                        checked={disponible}
                        onChange={(e) => setDisponible(e.target.checked)}
                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring focus:ring-blue-200"
                    />
                    <label htmlFor="disponible" className="text-sm sm:text-md font-medium">
                        Disponible
                    </label>
                </div>

                <div>
                    <label htmlFor="categoria" className="block text-sm sm:text-md font-medium">
                        Categoría
                    </label>
                    <select
                        id="categoria"
                        value={categoria}
                        onChange={(e) => setCategoria(e.target.value)}
                        required
                        className="mt-1 w-full p-2 border rounded-md shadow-sm focus:ring focus:ring-blue-200 focus:border-blue-300 text-sm sm:text-md"
                    >
                        <option value="">Selecciona una categoría</option>
                        <option value="BEBIDA">BEBIDA</option>
                        <option value="COMIDA">COMIDA</option>
                        <option value="SERVICIO">SERVICIO</option>
                    </select>
                </div>

                <div className="flex flex-col sm:flex-row justify-between gap-2">
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300 text-sm sm:text-md w-full sm:w-auto"
                    >
                        Crear Producto
                    </button>
                    <button
                        type="button"
                        onClick={() => navegar("/productos")}
                        className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition duration-300 text-sm sm:text-md w-full sm:w-auto"
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
}