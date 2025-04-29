import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MensajesDeErrores from "../../pages/MensajesDeErrores"; // Importa el componente para mostrar errores generales.

export default function EditarCliente() {
    const { id } = useParams(); // Obtiene el parámetro 'id' de la URL.
    const [nombre, setNombre] = useState(""); // Estado para el nombre del cliente.
    const [apellido, setApellido] = useState(""); // Estado para el apellido del cliente.
    const [email, setEmail] = useState(""); // Estado para el email del cliente.
    const [telefono, setTelefono] = useState(""); // Estado para el teléfono del cliente.
    const [rol, setRol] = useState(""); // Estado para el rol del cliente.
    const [errores, setErrores] = useState({}); // Estado para errores específicos del formulario.
    const [erroresGenerales, setErroresGenerales] = useState([]); // Estado para errores generales no controlados por el formulario.
    const navegar = useNavigate(); // Hook para la navegación.

    useEffect(() => {
        // Este efecto se ejecuta al montar el componente para cargar los datos del cliente.
        fetch(`http://localhost:8100/api/clientes/${id}`, {
            credentials: "include", // Incluye credenciales en la petición.
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }
                return response.json();
            })
            .then((data) => {
                setNombre(data.nombre);
                setApellido(data.apellido);
                setEmail(data.email);
                setTelefono(data.telefono);
                setRol(data.rol);
            })
            .catch((error) => {
                console.error("Error al cargar el cliente:", error);
                setErroresGenerales((prev) => [
                    ...prev,
                    "No se pudo cargar la información del cliente. Inténtalo de nuevo más tarde.",
                ]);
            });
    }, [id]);

    // Función para manejar el cambio en el campo de teléfono.
    const manejoCambioTelefono = (e) => {
        const telefonoSinModificar = e.target.value.replace(/\D/g, ""); // Elimina caracteres no numéricos.
        if (telefonoSinModificar.length <= 9) {
            const telefonoFormateado = telefonoSinModificar.replace(
                /(\d{3})(\d{0,3})(\d{0,3})/,
                (_, p1, p2, p3) => {
                    if (p3) return `${p1}-${p2}-${p3}`;
                    if (p2) return `${p1}-${p2}`;
                    return p1;
                }
            );
            setTelefono(telefonoFormateado);
            if (errores.telefono) {
                setErrores((prevErrores) => ({ ...prevErrores, telefono: null }));
            }
        }
    };

    // Función para manejar el cambio en los campos del formulario.
    const manejoCambioCampo = (setter, fieldName) => (e) => {
        setter(e.target.value);
        if (errores[fieldName]) {
            setErrores((prevErrores) => ({ ...prevErrores, [fieldName]: null }));
        }
    };

    // Función para manejar el envío del formulario.
    const manejoEnvio = async (e) => {
        e.preventDefault();
        setErrores({});
        setErroresGenerales([]);

        let formularioValido = true;
        let erroresVista = {};
        const telefonoSanitizado = telefono.replace(/\D/g, "");

        // Validaciones del formulario.
        if (!nombre) erroresVista.nombre = "El nombre es obligatorio.";
        if (!apellido) erroresVista.apellido = "El apellido es obligatorio.";
        if (!email) erroresVista.email = "El email es obligatorio.";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) erroresVista.email = "El formato del email no es válido.";
        if (!telefono) {
            erroresVista.telefono = "El teléfono es obligatorio.";
        } else if (telefonoSanitizado.length !== 9) {
            erroresVista.telefono = "El teléfono debe tener exactamente 9 dígitos.";
        }

        if (Object.keys(erroresVista).length > 0) {
            setErrores(erroresVista);
            formularioValido = false;
        }

        if (!formularioValido) {
            alert("Por favor, corrige los errores del formulario.");
            return;
        }

        const clienteActualizado = {
            nombre,
            apellido,
            email,
            telefono,
            rol,
        };

        try {
            const response = await fetch(`http://localhost:8100/api/clientes/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(clienteActualizado),
                credentials: "same-origin",
            });

            if (response.ok) {
                navegar("/clientes");
            } else {
                const errorData = await response.json();
                if (response.status === 400 && errorData && typeof errorData === "object") {
                    const erroresServidor = {};
                    if (Array.isArray(errorData.errors)) {
                        errorData.errors.forEach((err) => {
                            if (err.field && err.defaultMessage) {
                                erroresServidor[err.field] = err.defaultMessage;
                            }
                        });
                    } else {
                        for (const key in errorData) {
                            if (!["timestamp", "status", "error", "message", "path"].includes(key)) {
                                erroresServidor[key] = errorData[key];
                            }
                        }
                    }
                    setErrores((prev) => ({ ...prev, ...erroresServidor }));
                } else {
                    setErroresGenerales((prev) => [
                        ...prev,
                        errorData.message || `Error ${response.status}: ${response.statusText}. Inténtalo de nuevo.`,
                    ]);
                }
            }
        } catch (error) {
            console.error("Error al editar el cliente:", error);
            setErroresGenerales((prev) => [
                ...prev,
                "No se pudo conectar con el servidor o hubo un error inesperado. Revisa la consola.",
            ]);
        }
    };

    return (
        <div className="p-4 sm:p-6 md:p-8 bg-white rounded-lg shadow-md max-w-md mx-auto">
            <h1 className="text-xl font-bold mb-4 text-center sm:text-2xl md:text-3xl">Editar Cliente</h1>

            {/* Mostrar errores generales con MensajesDeErrores */}
            {erroresGenerales.length > 0 && <MensajesDeErrores messages={erroresGenerales} />}

            <form onSubmit={manejoEnvio} className="space-y-4">
                <div>
                    <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 sm:text-base">
                        Nombre
                    </label>
                    <input
                        type="text"
                        id="nombre"
                        value={nombre}
                        onChange={manejoCambioCampo(setNombre, "nombre")}
                        required
                        className={`mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                            errores.nombre ? "border-red-500" : "border-gray-300"
                        }`}
                        aria-invalid={errores.nombre ? "true" : "false"}
                        aria-describedby={errores.nombre ? "nombre-error" : undefined}
                    />
                    {errores.nombre && (
                        <p id="nombre-error" className="mt-1 text-xs text-red-600">
                            {errores.nombre}
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="apellido" className="block text-sm font-medium text-gray-700 sm:text-base">
                        Apellido
                    </label>
                    <input
                        type="text"
                        id="apellido"
                        value={apellido}
                        onChange={manejoCambioCampo(setApellido, "apellido")}
                        required
                        className={`mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                            errores.apellido ? "border-red-500" : "border-gray-300"
                        }`}
                        aria-invalid={errores.apellido ? "true" : "false"}
                        aria-describedby={errores.apellido ? "apellido-error" : undefined}
                    />
                    {errores.apellido && (
                        <p id="apellido-error" className="mt-1 text-xs text-red-600">
                            {errores.apellido}
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 sm:text-base">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={manejoCambioCampo(setEmail, "email")}
                        required
                        className={`mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                            errores.email ? "border-red-500" : "border-gray-300"
                        }`}
                        aria-invalid={errores.email ? "true" : "false"}
                        aria-describedby={errores.email ? "email-error" : undefined}
                    />
                    {errores.email && (
                        <p id="email-error" className="mt-1 text-xs text-red-600">
                            {errores.email}
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 sm:text-base">
                        Teléfono (XXX-XXX-XXX)
                    </label>
                    <input
                        type="tel"
                        id="telefono"
                        value={telefono}
                        onChange={manejoCambioTelefono}
                        required
                        placeholder="123-456-789"
                        maxLength="11"
                        className={`mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                            errores.telefono ? "border-red-500" : "border-gray-300"
                        }`}
                        aria-invalid={errores.telefono ? "true" : "false"}
                        aria-describedby={errores.telefono ? "telefono-error" : undefined}
                    />
                    {errores.telefono && (
                        <p id="telefono-error" className="mt-1 text-xs text-red-600">
                            {errores.telefono}
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="rol" className="block text-sm font-medium text-gray-700 sm:text-base">
                        Rol
                    </label>
                    <select
                        id="rol"
                        value={rol}
                        onChange={manejoCambioCampo(setRol, "rol")}
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