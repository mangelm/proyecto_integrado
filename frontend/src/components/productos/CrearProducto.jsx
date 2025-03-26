import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CrearProducto() {
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [precio, setPrecio] = useState("");
    const [impuesto, setImpuesto] = useState("");
    const [disponible, setDisponible] = useState("");
    const [categoria, setCategoria] = useState("");
    const navigate = useNavigate();

    const sanitizeInput = (value, type) => {
        if (type === "text") {
            return value.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ ]/g, ""); // Solo letras, números y espacios
        }
        if (type === "number") {
            return value.replace(/[^0-9]/g, ""); // Solo números
        }
        return value;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        const nuevoProducto = {
            nombre: sanitizeInput(nombre,"text"),
            descripcion: sanitizeInput(descripcion,"text"),
            precio: sanitizeInput(descripcion,"number"),
            impuesto: sanitizeInput(descripcion,"number"),
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
                credentials: 'same-origin',
            });

            console.log("Respuesta:", response);
            if (response.ok) {
                navigate("/productos");
            } else {
                const errorData = await response.text();
                console.log("Error en la respuesta:", errorData);
                throw new Error(errorData || 'Error al crear el producto');
            }
        } catch (error) {
            console.error("Error al crear el producto:", error);
            alert("Error al crear el producto. Verifica la consola para más detalles.");
        }
    };
    

    return (
        <div className="p-6 bg-white rounded-lg shadow-md max-w-lg mx-auto">
            <h1 className="text-2xl font-bold mb-4 text-center">Crear Producto</h1>
            <form 
                onSubmit={handleSubmit} 
                className="space-y-4"
            >
                <div>
                    <label 
                        htmlFor="nombre" 
                        className="block text-sm font-medium">
                            Nombre
                    </label>
                    <input 
                        type="text" id="nombre" 
                        value={nombre} 
                        onChange={(e) => setNombre(sanitizeInput(e.target.value,"text"))}
                        required 
                        className="mt-1 w-full p-2 border rounded-md" />
                </div>

                <div>
                    <label 
                        htmlFor="descripcion" 
                        className="block text-sm font-medium">
                            Descripción
                    </label>
                    <input 
                        type="text" 
                        id="descripcion" 
                        value={descripcion} onChange={(e) => setDescripcion(sanitizeInput(e.target.value,"text"))}
                        required 
                        className="mt-1 w-full p-2 border rounded-md" 
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label 
                            htmlFor="precio" 
                            className="block text-sm font-medium">
                                Precio
                        </label>
                        <input 
                            type="number" 
                            id="precio" 
                            value={precio} 
                            onChange={(e) => setPrecio(sanitizeInput(e.target.value,"number"))}
                            required 
                            className="mt-1 w-full p-2 border rounded-md" 
                        />
                    </div>

                    <div>
                        <label 
                            htmlFor="impuesto" 
                            className="block text-sm font-medium"
                        >
                            Impuesto
                        </label>
                        <input 
                            type="number" 
                            id="impuesto" 
                            value={impuesto} 
                            onChange={(e) => setImpuesto(sanitizeInput(e.target.value,"number"))}
                            required 
                            className="mt-1 w-full p-2 border rounded-md" 
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <input 
                        type="checkbox" 
                        id="disponible" 
                        checked={disponible} 
                        onChange={(e) => setDisponible(e.target.checked)}
                        className="w-5 h-5 text-blue-600 border-gray-300 rounded" 
                    />
                    <label htmlFor="disponible" className="text-sm font-medium">Disponible</label>
                </div>

                <div>
                    <label htmlFor="categoria" className="block text-sm font-medium">Categoría</label>
                    <select id="categoria" value={categoria} onChange={(e) => setCategoria(e.target.value)}
                        required className="mt-1 w-full p-2 border rounded-md">
                        <option value="">Selecciona una categoría</option>
                        <option value="BEBIDA">BEBIDA</option>
                        <option value="COMIDA">COMIDA</option>
                        <option value="SERVICIO">SERVICIO</option>
                    </select>
                </div>

                <div className="flex justify-between">
                    <button 
                        type="submit" 
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Crear Producto
                    </button>
                    <button 
                        type="button" 
                        onClick={() => navigate("/productos")} 
                        className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">
                            Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
}
