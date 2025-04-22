import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CrearCliente() {
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [email, setEmail] = useState("");
    const [telefono, setTelefono] = useState("");
    const [errores, setErrores] = useState({}); // Estado para almacenar errores de validación
    const navegar = useNavigate();

    // Formatear teléfono a xxx-xxx-xxx 
    const handleTelefonoChange = (e) => {
        const telefonoSinModificar = e.target.value.replace(/\D/g, ""); // Solo números
        if (telefonoSinModificar.length <= 9) {
            const telefonoformateado = telefonoSinModificar.replace(/(\d{3})(\d{0,3})(\d{0,3})/, (_, p1, p2, p3) => {
                if (p3) return `${p1}-${p2}-${p3}`;
                if (p2) return `${p1}-${p2}`;
                return p1;
            });
            setTelefono(telefonoformateado);
             // Limpiar error específico al escribir
            if (errores.telefono) {
                setErrores(prevErrors => ({ ...prevErrors, telefono: null }));
            }
        }
        // Si quieres limitar a exactamente 9 dígitos visualmente, puedes añadir lógica aquí
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrores({}); // Limpiar errores previos al intentar enviar

        // Validación *básica* en frontend (opcional, la principal es la del backend)
        let formularioValido = true;
        let erroresVista = {};
        const telefonoSanitizado = telefono.replace(/\D/g, "");

        if (!nombre) erroresVista.nombre = "El nombre es obligatorio.";
        if (!apellido) erroresVista.apellido = "El apellido es obligatorio.";
        if (!email) erroresVista.email = "El email es obligatorio.";
        // Simple validación de formato email (HTML5 ya ayuda con type="email")
        else if (!/\S+@\S+\.\S+/.test(email)) erroresVista.email = "El formato del email no es válido.";

        if (!telefono) {
            erroresVista.telefono = "El teléfono es obligatorio.";
        } else if (telefonoSanitizado.length !== 9) {
            erroresVista.telefono = "El teléfono debe tener exactamente 9 dígitos.";
            formularioValido = false; // Marcar como inválido si el teléfono no tiene 9 dígitos
        }

        if (Object.keys(erroresVista).length > 0) {
            setErrores(erroresVista);
            formularioValido = false;
        }

        // Si la validación básica del frontend falla, no enviar
        if (!formularioValido && erroresVista.telefono) {
            alert("Por favor, corrige los errores del formulario.");
            return;
        }


        // Preparamos el cliente con el formato esperado por el backend
        const nuevoCliente = {
            nombre: nombre, 
            apellido: apellido,
            email: email,
            telefono: telefono, // Enviamos el teléfono formateado (XXX-XXX-XXX)
        };

        try {
            const response = await fetch("http://localhost:8100/api/clientes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(nuevoCliente),
                credentials: 'same-origin', // Asegúrate que esto es necesario para tu configuración
            });

            console.log("Respuesta:", response.status, response.statusText);

            if (response.ok) {
                navegar("/clientes"); // Éxito, navegar a la lista
            } else {
                // Error en la respuesta, probablemente validación del backend
                const errorData = await response.json(); // Intenta parsear como JSON
                console.log("Error en la respuesta:", errorData);

                if (response.status === 400 && errorData && typeof errorData === 'object') {
                    // Asumiendo una estructura común de error de Spring Validation
                    // Puede ser errorData.errors o directamente un mapa campo -> mensaje
                    const erroresServidor = {};
                    if (Array.isArray(errorData.errors)) { // Estructura común con lista de errores
                        errorData.errors.forEach(err => {
                            if (err.field && err.defaultMessage) {
                                erroresServidor[err.field] = err.defaultMessage;
                            }
                        });
                    } else {
                        // Intenta mapear directamente si es un objeto campo:mensaje
                        for (const key in errorData) {
                            // Evita mapear campos genéricos como timestamp, status, error, message, path
                            if (!['timestamp', 'status', 'error', 'message', 'path'].includes(key)) {
                                erroresServidor[key] = errorData[key];
                            }
                        }
                    }


                    // Combina errores de frontend (si los hubiera) con los del backend
                    // Dando prioridad a los del backend si existen para el mismo campo
                    setErrores(prev => ({ ...prev, ...erroresServidor }));

                } else {
                    // Error no esperado o no es de validación (e.g., 500)
                    setErrores({ general: errorData.message || `Error ${response.status}: ${response.statusText}. Inténtalo de nuevo.` });
                }
            }
        } catch (error) {
            // Error de red o al parsear JSON
            console.error("Error en fetch o procesando la respuesta:", error);
            setErrores({ general: "No se pudo conectar con el servidor o hubo un error inesperado. Revisa la consola." });
        }
    };


    // Funciones para limpiar errores al cambiar el input
    const handleInputChange = (setter, fieldName) => (e) => {
        setter(e.target.value);
        if (errores[fieldName]) {
            setErrores(prevErrors => ({ ...prevErrors, [fieldName]: null }));
        }
        if (errores.general) { // Limpiar error general también
            setErrores(prevErrors => ({ ...prevErrors, general: null }));
        }
    };

    return (
        <div className="p-4 sm:p-6 md:p-8 bg-white rounded-lg shadow-md max-w-md mx-auto">
            <h1 className="text-xl font-bold mb-4 text-center sm:text-2xl md:text-3xl">Crear Cliente</h1>

            {/* Mostrar error general si existe */}
            {errores.general && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {errores.general}
                </div>
            )}

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
                        onChange={handleInputChange(setNombre, 'nombre')}
                        required // Mantenemos required para validación del navegador
                        className={`mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errores.nombre ? 'border-red-500' : 'border-gray-300'}`} // Estilo condicional
                        aria-invalid={errores.nombre ? "true" : "false"} // Accesibilidad
                        aria-describedby={errores.nombre ? "nombre-error" : undefined}
                    />
                    {/* Mensaje de error específico */}
                    {errores.nombre && <p id="nombre-error" className="mt-1 text-xs text-red-600">{errores.nombre}</p>}
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
                        onChange={handleInputChange(setApellido, 'apellido')}
                        required
                        className={`mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errores.apellido ? 'border-red-500' : 'border-gray-300'}`}
                        aria-invalid={errores.apellido ? "true" : "false"}
                        aria-describedby={errores.apellido ? "apellido-error" : undefined}
                    />
                    {errores.apellido && <p id="apellido-error" className="mt-1 text-xs text-red-600">{errores.apellido}</p>}
                </div>

                {/* Email y Teléfono pueden estar en una fila o separados */}
                {/* Aquí separados para claridad con sus errores */}
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
                        onChange={handleInputChange(setEmail, 'email')}
                        required
                        className={`mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errores.email ? 'border-red-500' : 'border-gray-300'}`}
                        aria-invalid={errores.email ? "true" : "false"}
                        aria-describedby={errores.email ? "email-error" : undefined}
                    />
                    {errores.email && <p id="email-error" className="mt-1 text-xs text-red-600">{errores.email}</p>}
                </div>

                <div>
                    <label
                        htmlFor="telefono"
                        className="block text-sm font-medium text-gray-700 sm:text-base"
                    >
                        Teléfono (XXX-XXX-XXX)
                    </label>
                    <input
                        type="tel" // Cambiado a 'tel' para semántica y posible ayuda del navegador/móvil
                        id="telefono"
                        value={telefono}
                        onChange={handleTelefonoChange} // Usamos el handler específico para formato/limpieza
                        required
                        placeholder="123-456-789"
                        maxLength="11" // 9 dígitos + 2 guiones
                        className={`mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errores.telefono ? 'border-red-500' : 'border-gray-300'}`}
                        aria-invalid={errores.telefono ? "true" : "false"}
                        aria-describedby={errores.telefono ? "telefono-error" : undefined}
                    />
                    {errores.telefono && <p id="telefono-error" className="mt-1 text-xs text-red-600">{errores.telefono}</p>}
                </div>


                <div className="flex flex-col sm:flex-row sm:justify-between gap-2 pt-4">
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full sm:w-auto disabled:opacity-50"
                    >
                        Crear Cliente
                    </button>
                    <button
                        type="button"
                        onClick={() => navegar("/clientes")}
                        className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 w-full sm:w-auto"
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
}