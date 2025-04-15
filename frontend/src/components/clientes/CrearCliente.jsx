import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CrearCliente() {
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [email, setEmail] = useState("");
    const [telefono, setTelefono] = useState("");
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

    // Formatear teléfono a xxx-xxx-xxx
    const formatearNumeroTelefono = (value) => {
        const remplazandoNumero = value.replace(/\D/g, "").slice(0, 9); // Solo números, máx 9 dígitos
        return remplazandoNumero.replace(/(\d{3})(\d{3})(\d{0,3})/, (_, p1, p2, p3) => 
            p3 ? `${p1}-${p2}-${p3}` : `${p1}-${p2}`
        );
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validación del teléfono
        const telefonoSanitizado = telefono.replace(/\D/g, ""); // Eliminar caracteres no numéricos
        if (telefonoSanitizado.length !== 9) {
            alert("El teléfono debe tener exactamente 9 dígitos.");
            return;
        }


        const nuevoCliente = {
            nombre: sanitizeInput(nombre,"text"),
            apellido: sanitizeInput(nombre,"text"),
            email,
            telefono: formatearNumeroTelefono(telefonoSanitizado),
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
        <div className="p-4 sm:p-6 md:p-8 bg-white rounded-lg shadow-md max-w-md mx-auto">
            <h1 className="text-xl font-bold mb-4 text-center sm:text-2xl md:text-3xl">Crear Cliente</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label
                        htmlFor="nombre"
                        className="block text-sm font-medium text-gray-700 sm:text-base"
                    >
                        Nombre
                    </label>
                    <input
                        type="text"
                        id="nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                        className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>

                <div>
                    <label
                        htmlFor="apellido"
                        className="block text-sm font-medium text-gray-700 sm:text-base"
                    >
                        Apellido
                    </label>
                    <input
                        type="text"
                        id="apellido"
                        value={apellido}
                        onChange={(e) => setApellido(e.target.value)}
                        required
                        className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>

                <div className="sm:grid sm:grid-cols-2 sm:gap-4">
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 sm:text-base"
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>
                </div>

                <div className="sm:grid sm:grid-cols-2 sm:gap-4">
                    <div>
                        <label
                            htmlFor="telefono"
                            className="block text-sm font-medium text-gray-700 sm:text-base"
                        >
                            Teléfono
                        </label>
                        <input
                            type="phone"
                            id="telefono"
                            value={telefono}
                            onChange={(e) => setTelefono(e.target.value)}
                            required
                            className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>
                </div>


                <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                    <button 
                        type="submit" 
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full sm:w-auto"
                    >
                        Crear Cliente
                    </button>
                    <button 
                        type="button" 
                        onClick={() => navigate("/clientes")} 
                        className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 w-full sm:w-auto"
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
}
