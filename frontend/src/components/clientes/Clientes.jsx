import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function GestionClientes() {
    const [clientes, setClientes] = useState([]);
    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [paginationValue] = useState(2);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);

    const [filtroNombre, setFiltroNombre] = useState("");
    const [filtroRol, setFiltroRol] = useState("");

    useEffect(() => {
        setLoading(true);
        fetch(`http://localhost:8100/api/clientes?page=${page}&size=${size}`)
            .then((response) => response.json())
            .then((data) => {
                setClientes(data.content);
                setTotalPages(data.totalPages);
            })
            .catch((error) => console.error("Error fetching clientes:", error))
            .finally(() => setLoading(false));
    }, [page, size]);

    const handlePrevPage = () => {
        if (page > 0) setPage(page - 1);
    };

    const handleNextPage = () => {
        if (page < totalPages - 1) setPage(page + 1);
    };

    const handleFirstPage = () => {
        setPage(0);
    };

    const handleLastPage = () => {
        setPage(totalPages - 1);
    };

    const handleNextValue = (paginationValue) => {
        setPage((prevPage) => Math.min(prevPage + paginationValue, totalPages - 1));
    };

    const handlePrevValue = (paginationValue) => {
        setPage((prevPage) => Math.max(prevPage - paginationValue, 0));
    };

    const handleDelete = (id) => {
        if (window.confirm("¿Estás seguro de que deseas eliminar este cliente?")) {
            fetch(`http://localhost:8100/api/clientes/${id}`, {
                method: "DELETE",
            })
                .then((response) => {
                    if (response.ok) {
                        setClientes(clientes.filter((cliente) => cliente.id !== id));
                        alert("Cliente eliminado con éxito.");
                    } else {
                        alert("Error al eliminar el cliente.");
                    }
                })
                .catch((error) => {
                    console.error("Error al eliminar el cliente:", error);
                    alert("Error al eliminar el cliente.");
                });
        }
    };

    const clientesFiltrados = clientes.filter((cliente) => {
        const coincideNombre = cliente.nombre.toLowerCase().includes(filtroNombre.toLowerCase());
        const coincideRol = filtroRol === "" || cliente.rol === filtroRol;
        return coincideNombre && coincideRol;
    });

    if (loading) {
        return <div className="text-center p-6">Cargando clientes...</div>;
    }

    return (
        <div className="p-4 sm:p-6 md:p-8 bg-white rounded-lg shadow-md">
            <h1 className="text-xl sm:text-2xl font-bold mb-4">Gestión de Clientes</h1>

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

            <div className="mb-4 p-2 md:p-4 w-full md:w-auto">
                <Link to="/clientes/crear-cliente">
                    <button className="bg-blue-600 text-white px-3 py-1 rounded-lg shadow-md hover:bg-blue-700 transition duration-300 md:px-4 md:py-2 w-full md:w-auto">
                        Crear Cliente
                    </button>
                </Link>
            </div>

            {/* Tabla de Clientes */}
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
                                                onClick={() => handleDelete(cliente.id)}
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

            {/* Paginación */}
            <div className="mt-4 flex flex-col items-center justify-between md:flex-row">
                <div className="flex gap-2 mb-2 md:mb-0 w-full md:w-auto">
                    <button
                        onClick={handleFirstPage}
                        disabled={page === 0}
                        className="bg-gray-300 text-black px-3 py-1 rounded-md shadow-sm disabled:opacity-50 hover:bg-gray-400 transition duration-300 w-1/2 sm:w-auto"
                    >
                        Primero
                    </button>
                    <button
                        onClick={() => handlePrevValue(paginationValue)}
                        disabled={page <= 0}
                        className="bg-gray-300 text-black px-3 py-1 rounded-md shadow-sm disabled:opacity-50 hover:bg-gray-400 transition duration-300 w-1/2 sm:w-auto"
                    >
                        -{paginationValue}
                    </button>
                </div>

                <div className="flex flex-col items-center gap-2 mb-2 md:mb-0 w-full md:w-auto md:flex-row md:justify-center">
                    <button
                        onClick={handlePrevPage}
                        disabled={page === 0}
                        className="bg-gray-300 text-black px-3 py-1 rounded-md shadow-sm disabled:opacity-50 hover:bg-gray-400 transition duration-300 w-full md:w-auto"
                    >
                        Anterior
                    </button>
                    <span className="text-xs font-medium text-gray-700 md:text-sm">
                        Página {page + 1} de {totalPages}
                    </span>
                    <button
                        onClick={handleNextPage}
                        disabled={page === totalPages - 1}
                        className="bg-gray-300 text-black px-3 py-1 rounded-md shadow-sm disabled:opacity-50 hover:bg-gray-400 transition duration-300 w-full md:w-auto"
                    >
                        Siguiente
                    </button>
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                    <button
                        onClick={() => handleNextValue(paginationValue)}
                        disabled={page >= totalPages - 1}
                        className="bg-gray-300 text-black px-3 py-1 rounded-md shadow-sm disabled:opacity-50 hover:bg-gray-400 transition duration-300 w-1/2 sm:w-auto"
                    >
                        +{paginationValue}
                    </button>
                    <button
                        onClick={handleLastPage}
                        disabled={page === totalPages - 1}
                        className="bg-gray-300 text-black px-3 py-1 rounded-md shadow-sm disabled:opacity-50 hover:bg-gray-400 transition duration-300 w-1/2 sm:w-auto"
                    >
                        Último
                    </button>
                </div>
            </div>

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