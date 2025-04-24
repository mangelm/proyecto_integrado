import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function GestionClientes() {
    const [clientes, setClientes] = useState([]); // Estado para almacenar la lista de clientes, inicializado como un array vacío.
    const [page, setPage] = useState(0); // Estado para la página actual de la lista de clientes, inicializado en 0 (primera página).
    const [size] = useState(10); // Estado para la cantidad de clientes por página, inicializado en 10.
    const [valorPaginacion] = useState(2); // Estado para definir el "salto" en la paginación (ej: ir 2 páginas adelante o atrás).
    const [totalPages, setTotalPages] = useState(0); // Estado para almacenar el número total de páginas disponibles.
    const [cargando, setCargando] = useState(false); // Estado para indicar si los datos se están cargando, inicializado en false.

    const [filtroNombre, setFiltroNombre] = useState(""); // Estado para el filtro de nombre, inicializado como una cadena vacía.
    const [filtroRol, setFiltroRol] = useState(""); // Estado para el filtro de rol, inicializado como una cadena vacía.

    // useEffect se ejecuta después de cada renderizado del componente o cuando sus dependencias cambian.
    useEffect(() => {
        setCargando(true); // Establece el estado de carga a true al iniciar la petición.
        // Realiza una petición fetch a la API para obtener la lista de clientes con la paginación y tamaño especificados.
        fetch(`http://localhost:8100/api/clientes?page=${page}&size=${size}`)
            .then((response) => response.json()) // Convierte la respuesta de la API a formato JSON.
            .then((data) => {
                setClientes(data.content); // Actualiza el estado 'clientes' con el contenido de la página actual.
                setTotalPages(data.totalPages); // Actualiza el estado 'totalPages' con el número total de páginas.
            })
            .catch((error) => console.error("Error fetching clientes:", error)) // Captura y muestra cualquier error ocurrido durante la petición.
            .finally(() => setCargando(false)); // Establece el estado de carga a false una vez que la petición se completa (éxito o error).
    }, [page, size]); // El efecto se ejecuta de nuevo si el valor de 'page' o 'size' cambia

    // Función para ir a la página anterior.
    const manejoPaginaPrevia = () => {
        if (page > 0) setPage(page - 1); // Si la página actual es mayor que 0, decrementa el número de página.
    };

    // Función para ir a la página siguiente.
    const manejoSiguentePagina = () => {
        if (page < totalPages - 1) setPage(page + 1); // Si la página actual es menor que el total de páginas - 1, incrementa el número de página.
    };

    // Función para ir a la primera página.
    const manejoPrimeraPagina = () => {
        setPage(0); // Establece el número de página a 0
    };

    // Función para ir a la última página.
    const manejoUltimaPagina = () => {
        setPage(totalPages - 1); // Establece el número de página al último índice disponible.
    };

    // Función para avanzar varias páginas a la vez.
    const manejoSiguienteValor = (paginationValue) => {
        setPage((paginaPrevia) => Math.min(paginaPrevia + paginationValue, totalPages - 1)); // Suma el valor de paginación a la página actual, sin exceder la última página.
    };

    // Función para retroceder varias páginas a la vez.
    const manejoValorPrevio = (paginationValue) => {
        setPage((paginaPrevia) => Math.max(paginaPrevia - paginationValue, 0)); // Resta el valor de paginación a la página actual, sin ser menor que 0.
    };

    // Función para manejar la eliminación de un cliente.
    const manejoBorrar = (id) => {
        // Muestra una confirmación al usuario antes de eliminar.
        if (window.confirm("¿Estás seguro de que deseas eliminar este cliente?")) {
            // Realiza una petición DELETE a la API para eliminar el cliente con el ID especificado.
            fetch(`http://localhost:8100/api/clientes/${id}`, {
                method: "DELETE", // Utiliza el método DELETE para eliminar el recurso.
            })
                .then((response) => {
                    if (response.ok) {
                        // Si la eliminación es exitosa, actualiza la lista de clientes filtrando el cliente eliminado.
                        setClientes(clientes.filter((cliente) => cliente.id !== id));
                        alert("Cliente eliminado con éxito."); // Muestra un mensaje de éxito.
                    } else {
                        alert("Error al eliminar el cliente."); // Muestra un mensaje de error si la eliminación falla.
                    }
                })
                .catch((error) => {
                    console.error("Error al eliminar el cliente:", error);
                    alert("Error al eliminar el cliente."); // Muestra un mensaje de error en caso de fallo en la petición.
                });
        }
    };

    // Filtra la lista de clientes basándose en los estados de filtro de nombre y rol.
    const clientesFiltrados = clientes.filter((cliente) => {
        const coincideNombre = cliente.nombre.toLowerCase().includes(filtroNombre.toLowerCase()); // Comprueba si el nombre del cliente incluye el texto del filtro (ignorando mayúsculas/minúsculas).
        const coincideRol = filtroRol === "" || cliente.rol === filtroRol; // Comprueba si el rol del cliente coincide con el filtro de rol o si no hay filtro de rol aplicado.
        return coincideNombre && coincideRol; // Retorna true si ambas condiciones (nombre y rol) coinciden.
    });

    // Muestra un mensaje de carga mientras se obtienen los datos
    if (cargando) {
        return <div className="text-center p-6">Cargando clientes...</div>;
    }

    // Renderiza la interfaz de gestión de clientes.
    return (
        <div className="p-4 sm:p-6 md:p-8 bg-white rounded-lg shadow-md">
            <h1 className="text-xl sm:text-2xl font-bold mb-4">Gestión de Clientes</h1>

            {/* Sección para los filtros de nombre y rol. */}
            <div className="mb-4 flex flex-wrap gap-2 sm:gap-4">
                <input
                    type="text"
                    placeholder="Buscar por nombre" 
                    value={filtroNombre} // Valor actual del filtro de nombre.
                    onChange={(e) => setFiltroNombre(e.target.value)}  // Actualiza el estado 'filtroNombre' al cambiar el input.
                    className="border border-gray-300 p-2 rounded-lg flex-grow min-w-0"
                />

                <select
                    value={filtroRol} // Valor actual del filtro de rol.
                    onChange={(e) => setFiltroRol(e.target.value)} // Actualiza el estado 'filtroRol' al seleccionar una opción.
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

                    {/* Encabezado de la tabla (oculto en pantallas pequeñas). */}
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

                    {/* Cuerpo de la tabla: itera sobre la lista de clientes filtrados. */}
                    <tbody className="divide-y divide-gray-200">
                        {clientesFiltrados.length > 0 ? (
                            clientesFiltrados.map((cliente) => (
                                // Renderiza una fila por cada cliente. 
                                <tr key={cliente.id} className="hover:bg-gray-50 md:table-row">
                                    {/* Celda para el nombre (muestra etiqueta en móvil). */}
                                    <td className="px-2 py-2 text-xs font-medium text-gray-900 md:px-4 md:py-3 md:text-sm block md:table-cell">
                                        <div className="md:hidden flex justify-between">
                                            <span className="font-semibold text-gray-700">Nombre</span>
                                            <span>{cliente.nombre}</span>
                                        </div>
                                        <div className="hidden md:block">{cliente.nombre}</div>
                                    </td>
                                    
                                    {/* Celda para el apellido (muestra etiqueta en móvil). */}
                                    <td className="px-2 py-2 text-xs font-medium text-gray-900 md:px-4 md:py-3 md:text-sm block md:table-cell whitespace-nowrap">
                                        <div className="md:hidden flex justify-between">
                                            <span className="font-semibold text-gray-700">Apellido</span>
                                            <span>{cliente.apellido}</span>
                                        </div>
                                        <div className="hidden md:block">{cliente.apellido}</div>
                                    </td>
                                    
                                    {/* Celda para el email (muestra etiqueta en móvil). */}
                                    <td className="px-2 py-2 text-xs font-medium text-gray-900 md:px-4 md:py-3 md:text-sm block md:table-cell">
                                        <div className="md:hidden flex justify-between">
                                            <span className="font-semibold text-gray-700">Email</span>
                                            <span>{cliente.email}</span>
                                        </div>
                                        <div className="hidden md:block">{cliente.email}</div>
                                    </td>

                                    {/* Celda para el teléfono (muestra etiqueta en móvil). */}
                                    <td className="px-2 py-2 text-xs font-medium text-gray-900 md:px-4 md:py-3 md:text-sm block md:table-cell">
                                        <div className="md:hidden flex justify-between">
                                            <span className="font-semibold text-gray-700">Teléfono</span>
                                            <span>{cliente.telefono}</span>
                                        </div>
                                        <div className="hidden md:block">{cliente.telefono}</div>
                                    </td>

                                    {/* Celda para el rol (oculta en móvil, muestra etiqueta en móvil). */}
                                    <td className="px-2 py-2 text-xs font-medium text-gray-900 md:px-4 md:py-3 md:text-sm block md:table-cell">
                                        <div className="md:hidden flex justify-between">
                                            <span className="font-semibold text-gray-700">Rol</span>
                                            <span>{cliente.rol}</span>
                                        </div>
                                        <div className="hidden md:block">{cliente.rol}</div>
                                    </td>

                                    {/* Celda para las acciones (editar y eliminar). */}
                                    <td className="px-2 py-2 text-xs font-medium text-gray-900 md:px-4 md:py-3 md:text-sm block md:table-cell">
                                        <div className="md:hidden font-semibold text-center">Acciones</div>
                                        <div className="flex flex-col md:flex-row md:gap-2 space-y-1 md:space-y-0 md:flex-wrap md:justify-center">
                                            {/* Enlace para editar el cliente. */}
                                            <Link to={`/clientes/editar-cliente/${cliente.id}`}>
                                                <button className="bg-yellow-500 text-white px-3 py-1 rounded-md shadow-sm hover:bg-yellow-600 transition duration-300 md:px-4 md:py-2 w-full md:w-auto whitespace-nowrap mb-1 md:mb-0">
                                                    Editar
                                                </button>
                                            </Link>
                                            {/* Botón para eliminar el cliente. */}
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
                        // Mensaje si no hay clientes disponibles. 
                        <tr>
                            <td colSpan="10" className="px-4 py-4 text-center text-sm font-medium text-gray-500">
                                No hay clientes disponibles.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            {/* Sección de paginación. */}
            <div className="mt-4 flex flex-col items-center justify-between md:flex-row">
                {/* Botones para ir a la primera página y retroceder varias páginas. */}
                <div className="flex gap-2 mb-2 md:mb-0 w-full md:w-auto">
                    <button
                        onClick={manejoPrimeraPagina}
                        disabled={page === 0} // Deshabilita el botón si ya está en la primera página.
                        className="bg-gray-300 text-black px-3 py-1 rounded-md shadow-sm disabled:opacity-50 hover:bg-gray-400 transition duration-300 w-1/2 sm:w-auto"
                    >
                        Primero
                    </button>
                    <button
                        onClick={() => manejoValorPrevio(valorPaginacion)}
                        disabled={page <= 0} // Deshabilita si está en la primera página o antes.
                        className="bg-gray-300 text-black px-3 py-1 rounded-md shadow-sm disabled:opacity-50 hover:bg-gray-400 transition duration-300 w-1/2 sm:w-auto"
                    >
                        -{valorPaginacion}
                    </button>
                </div>
                
                {/* Botones para ir a la página anterior, mostrar la página actual y total, y ir a la página siguiente. */}
                <div className="flex flex-col items-center gap-2 mb-2 md:mb-0 w-full md:w-auto md:flex-row md:justify-center">
                    <button
                        onClick={manejoPaginaPrevia}
                        disabled={page === 0} // Deshabilita si está en la primera página.
                        className="bg-gray-300 text-black px-3 py-1 rounded-md shadow-sm disabled:opacity-50 hover:bg-gray-400 transition duration-300 w-full md:w-auto"
                    >
                        Anterior
                    </button>
                    <span className="text-xs font-medium text-gray-700 md:text-sm">
                        Página {page + 1} de {totalPages}
                    </span>
                    <button
                        onClick={manejoSiguentePagina}
                        disabled={page === totalPages - 1} // Deshabilita si está en la última página.
                        className="bg-gray-300 text-black px-3 py-1 rounded-md shadow-sm disabled:opacity-50 hover:bg-gray-400 transition duration-300 w-full md:w-auto"
                    >
                        Siguiente
                    </button>
                </div>
                
                {/* Botones para avanzar varias páginas y ir a la última página. */}
                <div className="flex gap-2 w-full md:w-auto">
                    <button
                        onClick={() => manejoSiguienteValor(valorPaginacion)}
                        disabled={page >= totalPages - 1} // Deshabilita si está en la última página o después.
                        className="bg-gray-300 text-black px-3 py-1 rounded-md shadow-sm disabled:opacity-50 hover:bg-gray-400 transition duration-300 w-1/2 sm:w-auto"
                    >
                        +{valorPaginacion}
                    </button>
                    <button
                        onClick={manejoUltimaPagina}
                        disabled={page === totalPages - 1} // Deshabilita si ya está en la última página.
                        className="bg-gray-300 text-black px-3 py-1 rounded-md shadow-sm disabled:opacity-50 hover:bg-gray-400 transition duration-300 w-1/2 sm:w-auto"
                    >
                        Último
                    </button>
                </div>
            </div>
            
            {/* Enlace para volver a la página principal. */}
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