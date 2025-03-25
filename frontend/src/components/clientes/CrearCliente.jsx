import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CrearCliente() {
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [email, setEmail] = useState("");
    const [telefono, setTelefono] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const nuevoCliente = {
            nombre,
            apellido,
            email,
            telefono,
        };

        try {
            const response = await fetch("http://localhost:8100/api/clientes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(nuevoCliente),
                credentials: 'same-origin',
            });

            console.log("Respuesta:", response);
            if (response.ok) {
                navigate("/clientes");
            } else {
                const errorData = await response.text();
                console.log("Error en la respuesta:", errorData);
                throw new Error(errorData || 'Error al crear el cliente');
            }
        } catch (error) {
            console.error("Error al crear el cliente:", error);
            alert("Error al crear el cliente. Verifica la consola para más detalles.");
        }
    };
    

    return (
        <div className="p-6 bg-white rounded-lg shadow-md max-w-lg mx-auto">
            <h1 className="text-2xl font-bold mb-4 text-center">Crear Cliente</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label 
                        htmlFor="nombre" 
                        className="block text-sm font-medium"
                    >
                        Nombre
                    </label>
                    <input 
                        type="text" 
                        id="nombre" 
                        value={nombre} 
                        onChange={(e) => setNombre(e.target.value)}
                        required 
                        className="mt-1 w-full p-2 border rounded-md" 
                    />
                </div>

                <div>
                    <label 
                        htmlFor="apellido" 
                        className="block text-sm font-medium">
                            Apellido
                    </label>
                    <input 
                        type="text" 
                        id="apellido" 
                        value={apellido} 
                        onChange={(e) => setApellido(e.target.value)}
                        required 
                        className="mt-1 w-full p-2 border rounded-md" 
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label 
                            htmlFor="email" 
                            className="block text-sm font-medium"
                        >
                            Email
                        </label>
                        <input 
                            type="email" 
                            id="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required 
                            className="mt-1 w-full p-2 border rounded-md" 
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label 
                            htmlFor="telefono" 
                            className="block text-sm font-medium"
                        >
                            Teléfono
                        </label>
                        <input 
                            type="phone" 
                            id="telefono" 
                            value={telefono}
                            onChange={(e) => setTelefono(e.target.value)}
                            required 
                            className="mt-1 w-full p-2 border rounded-md" 
                        />
                    </div>
                </div>


                <div className="flex justify-between">
                    <button 
                        type="submit" 
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                            Crear Cliente
                    </button>
                    <button 
                        type="button" 
                        onClick={() => navigate("/clientes")} 
                        className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
}
