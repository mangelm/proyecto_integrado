import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CrearCliente() {
    const [nombre, setNombre] = useState(""); // Estado para el campo nombre, inicializado como una cadena vacía.
    const [apellido, setApellido] = useState(""); // Estado para el campo apellido, inicializado como una cadena vacía.
    const [email, setEmail] = useState(""); // Estado para el campo email, inicializado como una cadena vacía.
    const [telefono, setTelefono] = useState(""); // Estado para el campo teléfono, inicializado como una cadena vacía.
    const [errores, setErrores] = useState({}); // Estado para almacenar errores de validación, inicializado como un objeto vacío.
    const navegar = useNavigate(); // Hook para obtener la función de navegación.

    // Formatear teléfono a xxx-xxx-xxx
    const manejoCambioTelefono = (e) => {
        const telefonoSinModificar = e.target.value.replace(/\D/g, ""); // Elimina todos los caracteres que no son dígitos.
        if (telefonoSinModificar.length <= 9) { // Permite hasta 9 dígitos.
            const telefonoformateado = telefonoSinModificar.replace(/(\d{3})(\d{0,3})(\d{0,3})/, (_, p1, p2, p3) => {
                if (p3) return `${p1}-${p2}-${p3}`; // Formatea a xxx-xxx-xxx si hay 9 dígitos.
                if (p2) return `${p1}-${p2}`; // Formatea a xxx-xxx si hay entre 4 y 6 dígitos.
                return p1; // Devuelve los primeros 3 dígitos si hay menos de 4.
            });
            setTelefono(telefonoformateado); // Actualiza el estado del teléfono con el formato.
             // Limpiar error específico al escribir
            if (errores.telefono) {  // Si había un error de teléfono.
                setErrores(erroresPrevios => ({ ...erroresPrevios, telefono: null })); // Limpia el error de teléfono.
            }
        }
        // Si quieres limitar a exactamente 9 dígitos visualmente, puedes añadir lógica aquí
    };

    // Función asíncrona para manejar el envío del formulario de creación.
    const manejoEnvio = async (e) => {
        e.preventDefault(); // Evita la recarga de la página al enviar el formulario.
        setErrores({}); // Limpiar errores previos al intentar enviar

        
        let formularioValido = true; // Variable para controlar si el formulario es válido en el frontend.
        let erroresVista = {}; // Objeto para almacenar errores de validación del frontend.
        const telefonoSanitizado = telefono.replace(/\D/g, ""); // Obtiene el teléfono sin formato para validación de longitud.

        if (!nombre) erroresVista.nombre = "El nombre es obligatorio."; // Error si el nombre está vacío.
        if (!apellido) erroresVista.apellido = "El apellido es obligatorio."; // Error si el apellido está vacío.
        if (!email) erroresVista.email = "El email es obligatorio."; // Error si el email está vacío.
        else if (!/\S+@\S+\.\S+/.test(email)) erroresVista.email = "El formato del email no es válido."; // Error si el formato del email es incorrecto.

        if (!telefono) {
            erroresVista.telefono = "El teléfono es obligatorio.";  // Error si el teléfono está vacío.
        } else if (telefonoSanitizado.length !== 9) {
            erroresVista.telefono = "El teléfono debe tener exactamente 9 dígitos."; // Error si el teléfono no tiene 9 dígitos.
            formularioValido = false;  // Marca el formulario como inválido si el teléfono no tiene 9 dígitos.
        }

        if (Object.keys(erroresVista).length > 0) { // Si hay errores de validación en el frontend.
            setErrores(erroresVista); // Actualiza el estado de errores con los errores del frontend.
            formularioValido = false; // Marca el formulario como inválido.
        }

        // Si la validación del frontend falla, no enviar
        if (!formularioValido && erroresVista.telefono) { // Si el formulario no es válido y hay un error de teléfono.
            alert("Por favor, corrige los errores del formulario."); // Muestra una alerta.
            return; // Detiene el envío del formulario.
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
                method: "POST", // Utiliza el método POST para crear un nuevo recurso.
                headers: {
                    "Content-Type": "application/json", // Indica que el cuerpo de la petición es JSON.
                },
                body: JSON.stringify(nuevoCliente), // Convierte el objeto cliente a una cadena JSON.
                credentials: 'same-origin', 
            });

            console.log("Respuesta:", response.status, response.statusText); // Muestra en consola el estado de la respuesta.

            if (response.ok) { // Si la respuesta tiene un código de estado exitoso (2xx).
                navegar("/clientes"); // Éxito, navegar a la lista de clientes.
            } else {
                // Error en la respuesta, probablemente validación del backend
                const errorData = await response.json(); // Intenta parsear el cuerpo de la respuesta como JSON.
                console.log("Error en la respuesta:", errorData);  // Muestra en consola los datos del error.
                if (response.status === 400 && errorData && typeof errorData === 'object') {
                    const erroresServidor = {};  // Objeto para almacenar errores del servidor.
                    if (Array.isArray(errorData.errors)) { // Estructura común con lista de errores.
                        errorData.errors.forEach(err => { // Itera sobre la lista de errores.
                            if (err.field && err.defaultMessage) { // Si el error tiene un campo y un mensaje.
                                erroresServidor[err.field] = err.defaultMessage; // Asigna el valor del error al campo correspondiente.
                            }
                        });
                    } else {
                        for (const key in errorData) {
                            // Evita mapear campos genéricos como timestamp, status, error, message, path
                            if (!['timestamp', 'status', 'error', 'message', 'path'].includes(key)) {
                                erroresServidor[key] = errorData[key];
                            }
                        }
                    }


                    // Combina errores de frontend (si los hubiera) con los del backend
                    // Dando prioridad a los del backend si existen para el mismo campo
                    setErrores(prev => ({ ...prev, ...erroresServidor })); // Actualiza el estado de errores combinando los previos con los del servidor.

                } else {
                    // Error no esperado o no es de validación (e.g., 500)
                    setErrores({ general: errorData.message || `Error ${response.status}: ${response.statusText}. Inténtalo de nuevo.` });
                }
            }
        } catch (error) {
            // Error de red o al parsear JSON
            console.error("Error en fetch o procesando la respuesta:", error); // Muestra el error en consola
            setErrores({ general: "No se pudo conectar con el servidor o hubo un error inesperado. Revisa la consola." }); // Establece un error general de conexión o parseo.
        }
    };


    // Funciones para limpiar errores al cambiar el input
    const manejoCambioInput = (setter, nombreCampo) => (e) => {
        setter(e.target.value); // Actualiza el estado del campo.
        if (errores[nombreCampo]) { // Si hay un error para este campo.
            setErrores(erroresPrevios => ({ ...erroresPrevios, [nombreCampo]: null }));  // Limpia el error de este campo.
        }
        if (errores.general) { // Limpia el error general.
            setErrores(erroresPrevios => ({ ...erroresPrevios, general: null }));
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

            <form onSubmit={manejoEnvio} className="space-y-4"> {/* Formulario con el handler de envío y espaciado entre elementos. */}
                <div>  {/* Grupo para el campo Nombre */}
                    <label
                        htmlFor="nombre"
                        className="block text-sm font-medium text-gray-700 sm:text-base" //Etiqueta del campo Nombre
                    >
                        Nombre
                    </label>
                    <input
                        type="text"
                        id="nombre"
                        value={nombre}
                        onChange={manejoCambioInput(setNombre, 'nombre')} //Handler para actualizar el estado y limpiar errores
                        required 
                        className={`mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errores.nombre ? 'border-red-500' : 'border-gray-300'}`} // Estilo condicional basado en errores
                        aria-invalid={errores.nombre ? "true" : "false"} // Accesibilidad para indicar si el campo es inválido
                        aria-describedby={errores.nombre ? "nombre-error" : undefined} // Accesibilidad para asociar con el mensaje de error
                    />
                     {/* Mensaje de error específico para el campo Nombre */}
                    {errores.nombre && <p id="nombre-error" className="mt-1 text-xs text-red-600">{errores.nombre}</p>}
                </div>

                <div> {/* Grupo para el campo Apellido */}
                    <label
                        htmlFor="apellido"
                        className="block text-sm font-medium text-gray-700 sm:text-base" //Etiqueta del campo Apellido
                    >
                        Apellido
                    </label>
                    <input
                        type="text"
                        id="apellido"
                        value={apellido}
                        onChange={manejoCambioInput(setApellido, 'apellido')} //Handler para actualizar el estado y limpiar errores
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
                        className="block text-sm font-medium text-gray-700 sm:text-base" //Etiqueta del campo Email
                    >
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={manejoCambioInput(setEmail, 'email')}  //Handler para actualizar el estado y limpiar errores
                        required
                        className={`mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errores.email ? 'border-red-500' : 'border-gray-300'}`}
                        aria-invalid={errores.email ? "true" : "false"}
                        aria-describedby={errores.email ? "email-error" : undefined}
                    />
                    {errores.email && <p id="email-error" className="mt-1 text-xs text-red-600">{errores.email}</p>}
                </div>

                <div>
                    {/* Grupo para el campo Teléfono */}
                    <label
                        htmlFor="telefono"
                        className="block text-sm font-medium text-gray-700 sm:text-base" //Etiqueta del campo Teléfono
                    >
                        Teléfono (XXX-XXX-XXX)
                    </label>
                    <input
                        type="tel"
                        id="telefono"
                        value={telefono}
                        onChange={manejoCambioTelefono} 
                        required
                        placeholder="123-456-789"
                        maxLength="11" // 9 dígitos + 2 guiones
                        className={`mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errores.telefono ? 'border-red-500' : 'border-gray-300'}`}
                        aria-invalid={errores.telefono ? "true" : "false"}
                        aria-describedby={errores.telefono ? "telefono-error" : undefined}
                    />
                    {errores.telefono && <p id="telefono-error" className="mt-1 text-xs text-red-600">{errores.telefono}</p>}
                </div>

                {/* Contenedor para los botones de Crear y Cancelar */}
                <div className="flex flex-col sm:flex-row sm:justify-between gap-2 pt-4">
                    {/* Botón de Crear Cliente */}
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full sm:w-auto disabled:opacity-50"
                    >
                        Crear Cliente
                    </button>
                    <button
                        type="button"
                        onClick={() => navegar("/clientes")} // Navega a la lista de clientes al hacer clic
                        className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 w-full sm:w-auto" //Botón de Cancelar
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
}