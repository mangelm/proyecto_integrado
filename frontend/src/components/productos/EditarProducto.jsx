import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function EditarProducto() {
    const { id } = useParams();
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [precio, setPrecio] = useState("");
    const [impuesto, setImpuesto] = useState("");
    const [disponible, setDisponible] = useState("");
    const [categoria, setCategoria] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`http://localhost:8100/api/productos/${id}`, {
            credentials: 'include'
        })
            .then((response) => response.json())
            .then((data) => {
                setNombre(data.nombre);
                setDescripcion(data.descripcion);
                setPrecio(data.precio);
                setImpuesto(data.impuesto);
                setDisponible(data.disponible);
                setCategoria(data.categoria);
            })
            .catch((error) => console.error("Error al cargar el producto:", error));
    }, [id]);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const productoActualizado = {
            nombre: sanitizeInput(nombre, "text"),
            descripcion: sanitizeInput(descripcion, "text"),
            precio: parseFloat(precio) || 0, 
            impuesto: parseFloat(impuesto) || 0,
            disponible,
            categoria,
        };
        
        try {
            const response = await fetch(`http://localhost:8100/api/productos/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(productoActualizado),
                credentials: 'same-origin',
            });
    
            if (response.ok) {
                // Redirigir a la lista de productos después de la actualización exitosa
                navigate("/productos");
            } else {
                // Si no es una respuesta OK, intenta obtener el cuerpo de la respuesta.
                const errorData = await response.text(); // Cambiado a .text() para manejar respuestas vacías
                throw new Error(errorData || 'Error al actualizar el producto');
            }
        } catch (error) {
            console.error("Error al editar el producto:", error);
        }
    };
    
    

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg border border-gray-200">
            <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Editar Producto</h1>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-6 mb-6">
                    <div>
                        <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre</label>
                        <input
                            type="text"
                            id="nombre"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            required
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                        />
                    </div>

                    <div>
                        <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">Descripción</label>
                        <input
                            type="text"
                            id="descripcion"
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            required
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                        />
                    </div>

                    <div>
                        <label htmlFor="precio" className="block text-sm font-medium text-gray-700">Precio</label>
                        <input
                            type="number"
                            id="precio"
                            value={precio}
                            onChange={(e) => setPrecio(sanitizeDecimal(e.target.value))}
                            required
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                        />
                    </div>

                    <div>
                        <label htmlFor="impuesto" className="block text-sm font-medium text-gray-700">Impuesto</label>
                        <input
                            type="number"
                            id="impuesto"
                            value={impuesto}
                            onChange={(e) => setImpuesto(sanitizeDecimal(e.target.value))}
                            required
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                        />
                    </div>

                    <div>
                        <label htmlFor="disponible" className="block text-sm font-medium text-gray-700">Disponible</label>
                        <input
                            type="checkbox"
                            id="disponible"
                            checked={disponible}
                            onChange={(e) => setDisponible(e.target.checked)}
                            className="mt-1 block w-6 h-6 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                        />
                    </div>

                    <div>
                        <label htmlFor="categoria" className="block text-sm font-medium text-gray-700">Categoría</label>
                        <select
                            id="categoria"
                            value={categoria}
                            onChange={(e) => setCategoria(e.target.value)}
                            required
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                        >
                            <option value="BEBIDA">BEBIDA</option>
                            <option value="COMIDA">COMIDA</option>
                            <option value="SERVICIO">SERVICIO</option>
                        </select>
                    </div>
                </div>

                <div className="flex justify-between items-center mt-6">
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-6 py-2 rounded-md shadow-md hover:bg-blue-700 transition duration-200"
                    >
                        Guardar Cambios
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate("/productos")}
                        className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md shadow-md hover:bg-gray-400 transition duration-200"
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
}
