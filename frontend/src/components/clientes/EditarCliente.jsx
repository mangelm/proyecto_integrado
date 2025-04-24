import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function EditarCliente() {
    const { id } = useParams(); // Obtiene el parámetro 'id' de la URL, que se utiliza para identificar al cliente a editar.
    const [nombre, setNombre] = useState(""); // Estado para almacenar el nombre del cliente y la función para actualizarlo.
    const [apellido, setApellido] = useState(""); // Estado para almacenar el apellido del cliente y la función para actualizarlo.
    const [email, setEmail] = useState(""); // Estado para almacenar el email del cliente y la función para actualizarlo.
    const [telefono, setTelefono] = useState(""); // Estado para almacenar el teléfono del cliente y la función para actualizarlo.
    const [rol, setRol] = useState(""); // Estado para almacenar el rol del cliente y la función para actualizarlo.
    const [errores, setErrores] = useState({}); // Estado para almacenar los errores de validación del formulario.
    const navegar = useNavigate(); // Inicializa la función para navegar entre rutas.

    useEffect(() => {
        // Este efecto se ejecuta una vez al montar el componente y cada vez que cambia el 'id'.
        fetch(`http://localhost:8100/api/clientes/${id}`, {  // Realiza una petición GET a la API para obtener los datos del cliente específico.
            credentials: 'include' // Incluye las credenciales (cookies, encabezados de autorización) en la petición.
        })
            .then((response) => response.json()) // Convierte la respuesta de la API a formato JSON.
            .then((data) => {
                // Actualiza los estados con los datos del cliente obtenidos de la API.
                setNombre(data.nombre);
                setApellido(data.apellido);
                setEmail(data.email);
                setTelefono(data.telefono);
                setRol(data.rol);
            })
            .catch((error) => console.error("Error al cargar el cliente:", error)); // Captura y muestra cualquier error ocurrido durante la petición. 
    }, [id]); // El efecto se vuelve a ejecutar si el valor de 'id' cambia.

    // Función para controlar lo que se escribe en el campo de telefono.
    const manejoCambioTelefono = (e) => {
        const telefonoSinModificar = e.target.value.replace(/\D/g, ""); // Obtiene el valor del input y elimina todos los caracteres que no son dígitos.
        if (telefonoSinModificar.length <= 9) { // Limita la longitud del número de teléfono a 9 dígitos.
            const telefonoformateado = telefonoSinModificar.replace(/(\d{3})(\d{0,3})(\d{0,3})/, (_, p1, p2, p3) => {
                // Formatea el número de teléfono añadiendo guiones después de cada 3 dígitos.
                if (p3) return `${p1}-${p2}-${p3}`;
                if (p2) return `${p1}-${p2}`;
                return p1;
            });
            setTelefono(telefonoformateado); // Actualiza el estado del teléfono con el formato aplicado.
            // Limpiar error específico al escribir
            if (errores.telefono) { // Si había un error de validación en el teléfono, lo elimina al empezar a escribir.
                setErrores(prevErrors => ({ ...prevErrors, telefono: null })); // Actualiza el estado de errores eliminando el error de 'telefono'.
            }
        }
    };

    // Función para actualizar el estado de un campo y limpiar su error asociado.
    const manejoCambioCampo = (setter, fieldName) => (e) => {
        setter(e.target.value); // Actualiza el estado del campo utilizando la función 'setter' proporcionada.
        if (errores[fieldName]) { // Si había un error de validación para este campo, lo elimina al cambiar el valor.
            setErrores(prevErrors => ({ ...prevErrors, [fieldName]: null })); // Actualiza el estado de errores eliminando el error del campo actual.
        }
        if (errores.general) { // Limpiar error general también
            setErrores(prevErrors => ({ ...prevErrors, general: null })); // Si hay un error general, también lo limpia al interactuar con cualquier campo.
        }
    };


    // Función para controlar los datos que envia el formulario
    const manejoEnvio = async (e) => {
        e.preventDefault(); // Evita el comportamiento por defecto del formulario al ser enviado (recargar la página).
        setErrores({}); // Limpia el estado de errores al intentar enviar el formulario.

        let formularioValido = true; // Variable para controlar si el formulario es válido.
        let erroresVista = {}; // Objeto para almacenar los errores de validación en el lado del cliente.
        const telefonoSanitizado = telefono.replace(/\D/g, ""); // Elimina los caracteres no numéricos del teléfono para la validación.

        // Realiza validaciones para cada campo del formulario.
        if (!nombre) erroresVista.nombre = "El nombre es obligatorio.";
        if (!apellido) erroresVista.apellido = "El apellido es obligatorio.";
        if (!email) erroresVista.email = "El email es obligatorio.";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) erroresVista.email = "El formato del email no es válido.";

        if (!telefono) {
            erroresVista.telefono = "El teléfono es obligatorio.";
        } else if (telefonoSanitizado.length !== 9) {
            erroresVista.telefono = "El teléfono debe tener exactamente 9 dígitos.";
            formularioValido = false;
        }

        // Si se encontraron errores en la validación del cliente, actualiza el estado de errores y marca el formulario como no válido.
        if (Object.keys(erroresVista).length > 0) {
            setErrores(erroresVista);
            formularioValido = false;
        }

        // Si el formulario no es válido, muestra una alerta y detiene el proceso de envío.
        if (!formularioValido) {
            alert("Por favor, corrige los errores del formulario.");
            return;
        }

        // Crea un objeto con los datos actualizados del cliente.
        const clienteActualizado = {
            nombre: nombre,
            apellido: apellido,
            email: email,
            telefono: telefono,
            rol: rol
        };

        try {
            // Realiza una petición PUT a la API para actualizar los datos del cliente.
            const response = await fetch(`http://localhost:8100/api/clientes/${id}`, {
                method: "PUT", // Utiliza el método PUT para la actualización.
                headers: {
                    "Content-Type": "application/json",  // Indica que el cuerpo de la petición es JSON.
                },
                body: JSON.stringify(clienteActualizado), // Convierte el objeto del cliente a formato JSON para enviarlo en el cuerpo de la petición.
                credentials: 'same-origin', // Envía las credenciales solo si la petición es al mismo origen.
            });

            if (response.ok) { // Si la respuesta de la API es exitosa (código de estado 2xx).
                navegar("/clientes"); // Redirige al usuario a la página de la lista de clientes.
            } else { // Si la respuesta de la API indica un error.
                const errorData = await response.json(); // Intenta parsear el cuerpo de la respuesta como JSON para obtener detalles del error.
                console.error("Error al editar el cliente:", errorData); // Muestra el error en la consola.
                // Procesa diferentes tipos de errores de la API.
                if (response.status === 400 && errorData && typeof errorData === 'object') {
                    const erroresServidor = {}; // Objeto para almacenar los errores devueltos por el servidor.
                    if (Array.isArray(errorData.errors)) {
                        errorData.errors.forEach(err => {
                            if (err.field && err.defaultMessage) {
                                erroresServidor[err.field] = err.defaultMessage; // Asigna el mensaje de error al campo correspondiente.
                            }
                        });
                    } else { // Si los errores vienen en un formato de objeto diferente.
                        // Excluye campos comunes de errores como 'timestamp', 'status', etc.
                        for (const key in errorData) {
                            if (!['timestamp', 'status', 'error', 'message', 'path'].includes(key)) {
                                erroresServidor[key] = errorData[key];  // Asigna el valor del error al campo correspondiente.
                            }
                        }
                    }
                    setErrores(prev => ({ ...prev, ...erroresServidor })); // Actualiza el estado de errores con los errores del servidor.
                } else {
                    // Si el error no tiene un formato conocido, muestra un mensaje de error general.
                    setErrores({ general: errorData.message || `Error ${response.status}: ${response.statusText}. Inténtalo de nuevo.` });
                }
            }
        } catch (error) {
            // Captura errores que ocurren durante la petición (ej., problemas de red).
            console.error("Error al editar el cliente:", error);
            setErrores({ general: "No se pudo conectar con el servidor o hubo un error inesperado. Revisa la consola." });
        }
    };

    return (
        // Contenedor principal del formulario

        <div className="p-4 sm:p-6 md:p-8 bg-white rounded-lg shadow-md max-w-md mx-auto">
            {/* Título del formulario */}
            <h1 className="text-xl font-bold mb-4 text-center sm:text-2xl md:text-3xl">Editar Cliente</h1>

            {errores.general && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {/* Muestra un mensaje de error general si existe en el estado de 'errores'. */}
                    {errores.general}
                </div>
            )}

            <form onSubmit={manejoEnvio} className="space-y-4">
                {/* Formulario que se envía al hacer clic en el botón de "Guardar Cambios". */}
                <div>
                    <label
                        htmlFor="nombre"
                        className="block text-sm font-medium text-gray-700 sm:text-base"
                    >
                        Nombre
                    </label>
                    {/* Input para el nombre del cliente, con validación y estilos dinámicos según si hay error. */}
                    <input
                        type="text"
                        id="nombre"
                        value={nombre}
                        onChange={manejoCambioCampo(setNombre, 'nombre')}
                        required
                        className={`mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errores.nombre ? 'border-red-500' : 'border-gray-300'}`}
                        aria-invalid={errores.nombre ? "true" : "false"}
                        aria-describedby={errores.nombre ? "nombre-error" : undefined}
                    />
                    {/* Muestra el mensaje de error para el nombre si existe en el estado de 'errores'. */}
                    {errores.nombre && <p id="nombre-error" className="mt-1 text-xs text-red-600">{errores.nombre}</p>}
                </div>

                <div>
                    <label
                        htmlFor="apellido"
                        className="block text-sm font-medium text-gray-700 sm:text-base"
                    >
                        Apellido
                    </label>
                    {/* Input para el apellido del cliente, con validación y estilos dinámicos según si hay error. */}
                    <input
                        type="text"
                        id="apellido"
                        value={apellido}
                        onChange={manejoCambioCampo(setApellido, 'apellido')}
                        required
                        className={`mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errores.apellido ? 'border-red-500' : 'border-gray-300'}`}
                        aria-invalid={errores.apellido ? "true" : "false"}
                        aria-describedby={errores.apellido ? "apellido-error" : undefined}
                    />
                    {/* Muestra el mensaje de error para el apellido si existe en el estado de 'errores'. */}
                    {errores.apellido && <p id="apellido-error" className="mt-1 text-xs text-red-600">{errores.apellido}</p>}
                </div>
                
                {/* Contenedor para los campos de email y teléfono, dispuesto en dos columnas en pantallas medianas o grandes. */}
                <div className="sm:grid sm:grid-cols-2 sm:gap-4">
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 sm:text-base"
                        >
                            Email
                        </label>
                        {/* Input para el email del cliente, con validación y estilos dinámicos según si hay error. */}
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={manejoCambioCampo(setEmail, 'email')}
                            required
                            className={`mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errores.email ? 'border-red-500' : 'border-gray-300'}`}
                            aria-invalid={errores.email ? "true" : "false"}
                            aria-describedby={errores.email ? "email-error" : undefined}
                        />

                        {/* Muestra el mensaje de error para el email si existe en el estado de 'errores'. */}
                        {errores.email && <p id="email-error" className="mt-1 text-xs text-red-600">{errores.email}</p>}
                    </div>
                </div>

                <div className="sm:grid sm:grid-cols-2 sm:gap-4">
                    <div>
                        <label
                            htmlFor="telefono"
                            className="block text-sm font-medium text-gray-700 sm:text-base"
                        >
                            Teléfono (XXX-XXX-XXX)
                        </label>
                        {/* Input para el telefono del cliente, con validación y estilos dinámicos según si hay error. */}
                        <input
                            type="tel"
                            id="telefono"
                            value={telefono}
                            onChange={manejoCambioTelefono}
                            required
                            placeholder="123-456-789"
                            maxLength="11"
                            className={`mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errores.telefono ? 'border-red-500' : 'border-gray-300'}`}
                            aria-invalid={errores.telefono ? "true" : "false"}
                            aria-describedby={errores.telefono ? "telefono-error" : undefined}
                        />
                         {/* Muestra el mensaje de error para el telefono si existe en el estado de 'errores'. */}
                        {errores.telefono && <p id="telefono-error" className="mt-1 text-xs text-red-600">{errores.telefono}</p>}
                    </div>
                </div>

                <div>
                    <label
                        htmlFor="rol"
                        className="block text-sm font-medium text-gray-700 sm:text-base"
                    >
                        Rol
                    </label>
                    {/* Selector para el rol del cliente, con opciones predefinidas. */}
                    <select
                        id="rol"
                        value={rol}
                        onChange={manejoCambioCampo(setRol, 'rol')}
                        required
                        className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                        <option value="CLIENTE">CLIENTE</option>
                        <option value="ADMIN">ADMIN</option>
                        <option value="STAFF">STAFF</option>
                    </select>
                     {/* Muestra el mensaje de error para el rol si existe en el estado de 'errores'. */}
                    {errores.rol && <p id="rol-error" className="mt-1 text-xs text-red-600">{errores.rol}</p>}
                </div>

                 {/* Contenedor para los botones de "Guardar Cambios" y "Cancelar", dispuestos en columna en pantallas pequeñas y en fila con espacio entre ellos en pantallas medianas o grandes. */}
                <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                    {/* Botón para enviar el formulario. */}
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full sm:w-auto"
                    >
                        Guardar Cambios
                    </button>
                    {/* Botón para cancelar la edición y volver a la lista de clientes. */}
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