import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function EditarCliente() {
    const { id } = useParams();
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [email, setEmail] = useState("");
    const [telefono, setTelefono] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`http://localhost:8100/api/clientes/${id}`, {
            credentials: 'include'
        })
            .then((response) => response.json())
            .then((data) => {
                setNombre(data.nombre);
                setApellido(data.apellido);
                setEmail(data.email);
                setTelefono(data.telefono);
            })
            .catch((error) => console.error("Error al cargar el cliente:", error));
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

        const clienteActualizado = {
            nombre: sanitizeInput(nombre,"text"),
            apellido: sanitizeInput(nombre,"text"),
            email,
            telefono: formatearNumeroTelefono(telefonoSanitizado),
        };
        
        try {
            const response = await fetch(`http://localhost:8100/api/clientes/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(clienteActualizado),
                credentials: 'same-origin',
            });
    
            if (response.ok) {
                // Redirigir a la lista de clientes después de la actualización exitosa
                navigate("/clientes");
            } else {
                // Si no es una respuesta OK, intenta obtener el cuerpo de la respuesta.
                const errorData = await response.text(); // Cambiado a .text() para manejar respuestas vacías
                throw new Error(errorData || 'Error al actualizar el cliente');
            }
        } catch (error) {
            console.error("Error al editar el cliente:", error);
        }
    };
    
    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-4">Editar Cliente</h1>
            <form onSubmit={handleSubmit}>            
                <div className="mb-4">
                    <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre</label>
                    <input
                        type="text"
                        id="nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="apellido" className="block text-sm font-medium text-gray-700">Apellido</label>
                    <input
                        type="text"
                        id="apellido"
                        value={apellido}
                        onChange={(e) => setApellido(e.target.value)}
                        required
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="text"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="telefono" className="block text-sm font-medium text-gray-700">Teléfono</label>
                    <input
                        type="phone"
                        id="telefono"
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                        required
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div className="flex justify-between items-center">
                    <button
                        type="submit"
                        className="bg-blue-500 text-white p-2 rounded"
                    >
                        Guardar Cambios
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate("/clientes")}
                        className="bg-gray-300 text-black p-2 rounded"
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
}
