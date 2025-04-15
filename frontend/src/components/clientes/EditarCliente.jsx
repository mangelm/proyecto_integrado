import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function EditarCliente() {
    const { id } = useParams();
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [email, setEmail] = useState("");
    const [telefono, setTelefono] = useState("");
    const [rol,setRol] = useState("");
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
                setRol(data.rol);
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
            rol
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
        <div className="p-4 sm:p-6 md:p-8 bg-white rounded-lg shadow-md max-w-md mx-auto">
            <h1 className="text-xl font-bold mb-4 text-center sm:text-2xl md:text-3xl">Editar Cliente</h1>
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
                            type="text"
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

                <div>
                    <label
                        htmlFor="rol"
                        className="block text-sm font-medium text-gray-700 sm:text-base"
                    >
                        Rol
                    </label>
                    <select
                        id="rol"
                        value={rol}
                        onChange={(e) => setRol(e.target.value)}
                        required
                        className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                        <option value="CLIENTE">CLIENTE</option>
                        <option value="ADMIN">ADMIN</option>
                        <option value="STAFF">STAFF</option>
                    </select>
                </div>

                <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                    <button 
                        type="submit" 
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full sm:w-auto"
                    >
                        Guardar Cambios
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
