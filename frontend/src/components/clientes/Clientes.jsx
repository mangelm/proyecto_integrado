import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MensajesDeErrores from "../../pages/MensajesDeErrores"; // Importa el componente para mostrar errores.

export default function GestionClientes() {
    const [clientes, setClientes] = useState([]); // Estado para almacenar la lista de clientes.
    const [page, setPage] = useState(0); // Estado para la página actual.
    const [size] = useState(10); // Estado para la cantidad de clientes por página.
    const [valorPaginacion] = useState(2); // Estado para definir el "salto" en la paginación.
    const [totalPages, setTotalPages] = useState(0); // Estado para almacenar el número total de páginas.
    const [cargando, setCargando] = useState(false); // Estado para indicar si los datos se están cargando.
    const [errores, setErrores] = useState([]); // Estado para manejar errores.

    const [filtroNombre, setFiltroNombre] = useState(""); // Estado para el filtro de nombre.
    const [filtroRol, setFiltroRol] = useState(""); // Estado para el filtro de rol.

    // useEffect para obtener la lista de clientes con paginación.
    useEffect(() => {
        setCargando(true); // Establece el estado de carga a true al iniciar la petición.
        setErrores([]); // Limpia los errores previos.
        fetch(`http://localhost:8100/api/clientes?page=${page}&size=${size}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }
                return response.json();
            })
            .then((data) => {
                setClientes(data.content); // Actualiza el estado 'clientes' con los datos obtenidos.
                setTotalPages(data.totalPages); // Actualiza el estado 'totalPages'.
            })
            .catch((error) => {
                setErrores((prevErrores) => [...prevErrores, `Error al cargar clientes: ${error.message}`]);
            })
            .finally(() => setCargando(false)); // Establece el estado de carga a false al finalizar.
    }, [page, size]); // Se ejecuta cuando cambian 'page' o 'size'.

    // Función para manejar la eliminación de un cliente.
    const manejoBorrar = (id) => {
        if (window.confirm("¿Estás seguro de que deseas eliminar este cliente?")) {
            fetch(`http://localhost:8100/api/clientes/${id}`, {
                method: "DELETE",
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`Error ${response.status}: ${response.statusText}`);
                    }
                    setClientes(clientes.filter((cliente) => cliente.id !== id)); // Filtra el cliente eliminado.
                    alert("Cliente eliminado con éxito.");
                })
                .catch((error) => {
                    setErrores((prevErrores) => [...prevErrores, `Error al eliminar cliente: ${error.message}`]);
                });
        }
    };

    // Filtra la lista de clientes basándose en los filtros de nombre y rol.
    const clientesFiltrados = clientes.filter((cliente) => {
        const coincideNombre = cliente.nombre.toLowerCase().includes(filtroNombre.toLowerCase());
        const coincideRol = filtroRol === "" || cliente.rol === filtroRol;
        return coincideNombre && coincideRol;
    });

    // Muestra un mensaje de carga mientras se obtienen los datos.
    if (cargando) {
        return <div className="text-center p-6">Cargando clientes...</div>;
    }

    // Renderiza la interfaz de gestión de clientes.
    return (
        <div className="p-4 sm:p-6 md:p-8 bg-white rounded-lg shadow-md">
            <h1 className="text-xl sm:text-2xl font-bold mb-4">Gestión de Clientes</h1>

            {/* Mostrar errores */}
            {errores.length > 0 && <MensajesDeErrores messages={errores} />}

            {/* Sección para los filtros de nombre y rol. */}
            <div className="mb-4 flex flex-wrap gap-2 sm:gap-4">
                <input
                    type="text"
                    placeholder="Buscar por nombre"
                    value={filtroNombre}
                    onChange={(e) => setFiltroNombre(e.target.value)}
                    className="border border-gray-300 p-2 rounded-lg flex-grow min-w-0"
                />

                <select
                    value={filtroRol}
                    onChange={(e) => setFiltroRol(e.target.value)}
                    className="border border-gray-300 p-2 rounded-lg w-full sm:w-auto"
                >
                    <option value="">Todos los roles</option>
                    <option value="ADMIN">ADMIN</option>
                    <option value="STAFF">STAFF</option>
                    <option value="CLIENTE">CLIENTE</option>
                </select>
            </div>

            {/* Botón para crear un nuevo cliente. */}
            <div className="mb-4 p-2 md:p-4 w-full md:w-auto">
                <Link to="/clientes/crear-cliente">
                    <button className="bg-blue-600 text-white px-3 py-1 rounded-lg shadow-md hover:bg-blue-700 transition duration-300 md:px-4 md:py-2 w-full md:w-auto">
                        Crear Cliente
                    </button>
                </Link>
            </div>

            {/* Tabla para mostrar la lista de clientes. */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white table-auto rounded-lg shadow-md md:table-fixed">
                    <thead className="bg-gray-100 hidden md:table-header-group">
                        <tr>
                            <th className="px-2 py-2 text-left text-xs font-semibold text-gray-700 border-b md:px-4 md:py-3 md:text-sm">Nombre</th>
                            <th className="px-2 py-2 text-left text-xs font-semibold text-gray-700 border-b md:px-4 md:py-3 md:text-sm whitespace-nowrap">Apellido</th>
                            <th className="px-2 py-2 text-left text-xs font-semibold text-gray-700 border-b md:px-4 md:py-3 md:text-sm">Email</th>
                            <th className="px-2 py-2 text-left text-xs font-semibold text-gray-700 border-b md:px-4 md:py-3 md:text-sm">Teléfono</th>
                            <th className="hidden px-2 py-2 text-left text-xs font-semibold text-gray-700 border-b md:table-cell md:px-4 md:py-3 md:text-sm">Rol</th>
                            <th className="px-4 py-3 text-sm font-semibold text-gray-700 border-b text-left md:text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {clientesFiltrados.length > 0 ? (
                            clientesFiltrados.map((cliente) => (
                                <tr key={cliente.id} className="hover:bg-gray-50 md:table-row">
                                    <td className="px-2 py-2 text-xs font-medium text-gray-900 md:px-4 md:py-3 md:text-sm block md:table-cell">
                                        <div className="md:hidden flex justify-between">
                                            <span className="font-semibold text-gray-700">Nombre</span>
                                            <span>{cliente.nombre}</span>
                                        </div>
                                        <div className="hidden md:block">{cliente.nombre}</div>
                                    </td>
                                    <td className="px-2 py-2 text-xs font-medium text-gray-900 md:px-4 md:py-3 md:text-sm block md:table-cell whitespace-nowrap">
                                        <div className="md:hidden flex justify-between">
                                            <span className="font-semibold text-gray-700">Apellido</span>
                                            <span>{cliente.apellido}</span>
                                        </div>
                                        <div className="hidden md:block">{cliente.apellido}</div>
                                    </td>
                                    <td className="px-2 py-2 text-xs font-medium text-gray-900 md:px-4 md:py-3 md:text-sm block md:table-cell">
                                        <div className="md:hidden flex justify-between">
                                            <span className="font-semibold text-gray-700">Email</span>
                                            <span>{cliente.email}</span>
                                        </div>
                                        <div className="hidden md:block">{cliente.email}</div>
                                    </td>
                                    <td className="px-2 py-2 text-xs font-medium text-gray-900 md:px-4 md:py-3 md:text-sm block md:table-cell">
                                        <div className="md:hidden flex justify-between">
                                            <span className="font-semibold text-gray-700">Teléfono</span>
                                            <span>{cliente.telefono}</span>
                                        </div>
                                        <div className="hidden md:block">{cliente.telefono}</div>
                                    </td>
                                    <td className="px-2 py-2 text-xs font-medium text-gray-900 md:px-4 md:py-3 md:text-sm block md:table-cell">
                                        <div className="md:hidden flex justify-between">
                                            <span className="font-semibold text-gray-700">Rol</span>
                                            <span>{cliente.rol}</span>
                                        </div>
                                        <div className="hidden md:block">{cliente.rol}</div>
                                    </td>
                                    <td className="px-2 py-2 text-xs font-medium text-gray-900 md:px-4 md:py-3 md:text-sm block md:table-cell">
                                        <div className="md:hidden font-semibold text-center">Acciones</div>
                                        <div className="flex flex-col md:flex-row md:gap-2 space-y-1 md:space-y-0 md:flex-wrap md:justify-center">
                                            <Link to={`/clientes/editar-cliente/${cliente.id}`}>
                                                <button className="bg-yellow-500 text-white px-3 py-1 rounded-md shadow-sm hover:bg-yellow-600 transition duration-300 md:px-4 md:py-2 w-full md:w-auto whitespace-nowrap mb-1 md:mb-0">
                                                    Editar
                                                </button>
                                            </Link>
                                            <button
                                                onClick={() => manejoBorrar(cliente.id)}
                                                className="bg-red-600 text-white px-3 py-1 rounded-md shadow-sm hover:bg-red-700 transition duration-300 md:px-4 md:py-2 w-full md:w-auto whitespace-nowrap mb-1 md:mb-0"
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="10" className="px-4 py-4 text-center text-sm font-medium text-gray-500">
                                    No hay clientes disponibles.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Sección de paginación */}
            <div className="mt-4 flex flex-col items-center justify-between md:flex-row">
                <div className="flex gap-2 mb-2 md:mb-0 w-full md:w-auto">
                    <button
                        onClick={() => setPage(0)}
                        disabled={page === 0}
                        className="bg-gray-300 text-black px-3 py-1 rounded-md shadow-sm disabled:opacity-50 hover:bg-gray-400 transition duration-300 w-1/2 sm:w-auto"
                    >
                        Primero
                    </button>
                    <button
                        onClick={() => setPage((prev) => Math.max(prev - valorPaginacion, 0))}
                        disabled={page <= 0}
                        className="bg-gray-300 text-black px-3 py-1 rounded-md shadow-sm disabled:opacity-50 hover:bg-gray-400 transition duration-300 w-1/2 sm:w-auto"
                    >
                        -{valorPaginacion}
                    </button>
                </div>
                <div className="flex flex-col items-center gap-2 mb-2 md:mb-0 w-full md:w-auto md:flex-row md:justify-center">
                    <button
                        onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                        disabled={page === 0}
                        className="bg-gray-300 text-black px-3 py-1 rounded-md shadow-sm disabled:opacity-50 hover:bg-gray-400 transition duration-300 w-full md:w-auto"
                    >
                        Anterior
                    </button>
                    <span className="text-xs font-medium text-gray-700 md:text-sm">
                        Página {page + 1} de {totalPages}
                    </span>
                    <button
                        onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
                        disabled={page === totalPages - 1}
                        className="bg-gray-300 text-black px-3 py-1 rounded-md shadow-sm disabled:opacity-50 hover:bg-gray-400 transition duration-300 w-full md:w-auto"
                    >
                        Siguiente
                    </button>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <button
                        onClick={() => setPage((prev) => Math.min(prev + valorPaginacion, totalPages - 1))}
                        disabled={page >= totalPages - 1}
                        className="bg-gray-300 text-black px-3 py-1 rounded-md shadow-sm disabled:opacity-50 hover:bg-gray-400 transition duration-300 w-1/2 sm:w-auto"
                    >
                        +{valorPaginacion}
                    </button>
                    <button
                        onClick={() => setPage(totalPages - 1)}
                        disabled={page === totalPages - 1}
                        className="bg-gray-300 text-black px-3 py-1 rounded-md shadow-sm disabled:opacity-50 hover:bg-gray-400 transition duration-300 w-1/2 sm:w-auto"
                    >
                        Último
                    </button>
                </div>
            </div>

            {/* Enlace para volver a la página principal */}
            <div className="mt-6 text-center w-full md:w-auto">
                <Link to={`/`}>
                    <button className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700 transition duration-300 w-full md:w-auto">
                        Volver a la página principal
                    </button>
                </Link>
            </div>
        </div>
    );
}