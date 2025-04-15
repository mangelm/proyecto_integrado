import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function GestionProductos() {
    const [productos, setProductos] = useState([]);
    const [page, setPage] = useState(0);
    const [size] = useState(5);
    const [paginationValue] = useState(2);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);

    // Filtros
    const [filtroNombre, setFiltroNombre] = useState("");
    const [filtroCategoria, setFiltroCategoria] = useState("");

    useEffect(() => {
        setLoading(true);
        fetch(`http://localhost:8100/api/productos?page=${page}&size=${size}`)
            .then((response) => response.json())
            .then((data) => {
                setProductos(data.content);
                setTotalPages(data.totalPages);
            })
            .catch((error) => console.error("Error fetching productos:", error))
            .finally(() => setLoading(false));
    }, [page, size]);

    // Filtrar productos 
    const productosFiltrados = productos.filter((producto) => {
        const coincideNombre = producto.nombre.toLowerCase().includes(filtroNombre.toLowerCase());
        const coincideCategoria = filtroCategoria === "" || producto.categoria === filtroCategoria;
        return coincideNombre && coincideCategoria;
    });

    // Funciones de paginación 
    const handlePrevPage = () => page > 0 && setPage(page - 1);
    const handleNextPage = () => page < totalPages - 1 && setPage(page + 1);
    const handleFirstPage = () => setPage(0);
    const handleLastPage = () => setPage(totalPages - 1);
    const handleNextValue = () => setPage(prev => Math.min(prev + paginationValue, totalPages - 1));
    const handlePrevValue = () => setPage(prev => Math.max(prev - paginationValue, 0));

    // Eliminar producto
    const handleDelete = (id) => {
        if (window.confirm("¿Estás seguro de que deseas eliminar este producto?")) {
            fetch(`http://localhost:8100/api/productos/${id}`, {
                method: "DELETE",
            })
                .then((response) => {
                    if (response.ok) {
                        setProductos(productos.filter((producto) => producto.id !== id));
                        alert("Producto eliminado con éxito");
                    } else {
                        alert("Error al eliminar el producto.");
                    }
                })
                .catch((error) => console.error("Error al eliminar el producto:", error));
        }
    };

    if (loading) {
        return <div className="text-center">Cargando productos...</div>;
    }

    return (
        <div className="p-4 sm:p-6 md:p-8 bg-white rounded-lg shadow-md max-w-7xl mx-auto">
            <h1 className="text-xl font-bold mb-4 sm:text-2xl md:text-3xl text-center">Gestión de Productos</h1>

            {/* Filtros */}
            <div className="mb-4 flex flex-wrap gap-2 sm:gap-4 items-center justify-between">
                
                <input
                    type="text"
                    placeholder="Buscar por nombre"
                    value={filtroNombre}
                    onChange={(e) => setFiltroNombre(e.target.value)}
                    className="border border-gray-300 p-2 rounded-lg w-full sm:w-auto"
                />

                <select
                    value={filtroCategoria}
                    onChange={(e) => setFiltroCategoria(e.target.value)}
                    className="border border-gray-300 p-2 rounded-lg w-full sm:w-auto"
                >
                    <option value="">Todas</option>
                    <option value="BEBIDA">BEBIDA</option>
                    <option value="COMIDA">COMIDA</option>
                    <option value="SERVICIO">SERVICIO</option>
                </select>
            </div>

            {/* Botón Crear */}
            <div className="mb-4 p-2 md:p-4 w-full md:w-auto">
                <Link to="/productos/crear-producto">
                    <button className="bg-blue-600 text-white px-3 py-1 rounded-lg shadow-md hover:bg-blue-700 transition duration-300 md:px-4 md:py-2 w-full md:w-auto">
                        Crear Producto
                    </button>
                </Link>
            </div>

            {/* Tabla de Eventos */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white table-auto rounded-lg shadow-md md:table-fixed">
                
                    <thead className="bg-gray-100 hidden md:table-header-group">
                        <tr>
                            <th className="px-2 py-2 text-left text-xs font-semibold text-gray-700 border-b md:px-4 md:py-3 md:text-sm">Nombre</th>
                            <th className="px-2 py-2 text-left text-xs font-semibold text-gray-700 border-b md:px-4 md:py-3 md:text-sm whitespace-nowrap">Descripcion</th>
                            <th className="px-2 py-2 text-left text-xs font-semibold text-gray-700 border-b md:px-4 md:py-3 md:text-sm">Precio</th>
                            <th className="px-2 py-2 text-left text-xs font-semibold text-gray-700 border-b md:px-4 md:py-3 md:text-sm">Impuesto</th>
                            <th className="px-2 py-2 text-left text-xs font-semibold text-gray-700 border-b md:table-cell md:px-4 md:py-3 md:text-sm">Disponible</th>
                            <th className="px-2 py-2 text-left text-xs font-semibold text-gray-700 border-b md:table-cell md:px-4 md:py-3 md:text-sm">Categoría</th>
                            <th className="px-4 py-3 text-sm font-semibold text-gray-700 border-b text-left md:text-center">Acciones</th>
                        </tr>
                    </thead>
                    
                    <tbody className="divide-y divide-gray-200">
                        {productosFiltrados.length > 0 ? (
                            productosFiltrados.map((producto) => (
                                <tr key={producto.id} className="hover:bg-gray-50 md:table-row">
                                    <td className="px-2 py-2 text-xs font-medium text-gray-900 md:px-4 md:py-3 md:text-sm block md:table-cell">
                                        <div className="md:hidden flex justify-between">
                                            <span className="font-semibold text-gray-700">Nombre</span>
                                            <span>{producto.nombre}</span>
                                        </div>
                                        <div className="hidden md:block">{producto.nombre}</div>
                                    </td>
                                    <td className="px-2 py-2 text-xs font-medium text-gray-900 md:px-4 md:py-3 md:text-sm block md:table-cell whitespace-nowrap">
                                        <div className="md:hidden flex justify-between">
                                            <span className="font-semibold text-gray-700">Descripción</span>
                                            <span>{producto.descripcion}</span>
                                        </div>
                                        <div className="hidden md:block">{producto.descripcion}</div>
                                    </td>
                                    <td className="px-2 py-2 text-xs font-medium text-gray-900 md:px-4 md:py-3 md:text-sm block md:table-cell">
                                        <div className="md:hidden flex justify-between">
                                            <span className="font-semibold text-gray-700">Precio</span>
                                            <span>{producto.precio}</span>
                                        </div>
                                        <div className="hidden md:block">{producto.precio}</div>
                                    </td>
                                    <td className="px-2 py-2 text-xs font-medium text-gray-900 md:px-4 md:py-3 md:text-sm block md:table-cell">
                                        <div className="md:hidden flex justify-between">
                                            <span className="font-semibold text-gray-700">Impuesto</span>
                                            <span>{producto.impuesto}</span>
                                        </div>
                                        <div className="hidden md:block">{producto.impuesto}</div>
                                    </td>
                                    <td className="px-2 py-2 text-xs font-medium text-gray-900 md:px-4 md:py-3 md:text-sm block md:table-cell">
                                        <div className="md:hidden flex justify-between">
                                            <span className="font-semibold text-gray-700">Disponible</span>
                                            <span>{producto.disponible ? 'Sí' : 'No'}</span>
                                        </div>
                                        <div className="hidden md:block">{producto.disponible ? 'Sí' : 'No'}</div>
                                    </td>
                                    <td className="px-2 py-2 text-xs font-medium text-gray-900 md:px-4 md:py-3 md:text-sm block md:table-cell">
                                        <div className="md:hidden flex justify-between">
                                            <span className="font-semibold text-gray-700">Categoria</span>
                                            <span>{producto.categoria}</span>
                                        </div>
                                        <div className="hidden md:block">{producto.categoria}</div>
                                    </td>
                                    <td className="px-2 py-2 text-xs font-medium text-gray-900 md:px-4 md:py-3 md:text-sm block md:table-cell">
                                        <div className="md:hidden font-semibold text-center">Acciones</div>
                                        <div className="flex flex-col md:flex-row md:gap-2 space-y-1 md:space-y-0 md:flex-wrap md:justify-center">
                                            <Link to={`/productos/editar-producto/${producto.id}`}>
                                                <button className="bg-yellow-500 text-white px-3 py-1 rounded-md shadow-sm hover:bg-yellow-600 transition duration-300 md:px-4 md:py-2 w-full md:w-auto whitespace-nowrap mb-1 md:mb-0">
                                                    Editar
                                                </button>
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(producto.id)}
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
                                    No hay productos disponibles.
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
                    className="bg-gray-300 text-black px-3 py-1 rounded-md shadow-sm disabled:opacity-50 hover:bg-gray-400 transition duration-300 md:px-4 md:py-2 w-1/2"
                    >
                    Primero
                    </button>
                    <button
                    onClick={handlePrevValue}
                    disabled={page <= 0}
                    className="bg-gray-300 text-black px-3 py-1 rounded-md shadow-sm disabled:opacity-50 hover:bg-gray-400 transition duration-300 md:px-4 md:py-2 w-1/2"
                    >
                    -{paginationValue}
                    </button>
                </div>

                <div className="flex flex-col items-center gap-2 mb-2 md:mb-0 w-full md:w-auto md:flex-row md:justify-center">
                    <button
                    onClick={handlePrevPage}
                    disabled={page === 0}
                    className="bg-gray-300 text-black px-3 py-1 rounded-md shadow-sm disabled:opacity-50 hover:bg-gray-400 transition duration-300 md:px-4 md:py-2 w-full md:w-auto"
                    >
                    Anterior
                    </button>
                    <span className="text-xs font-medium text-gray-700 md:text-sm">
                    Página {page + 1} de {totalPages}
                    </span>
                    <button
                    onClick={handleNextPage}
                    disabled={page === totalPages - 1}
                    className="bg-gray-300 text-black px-3 py-1 rounded-md shadow-sm disabled:opacity-50 hover:bg-gray-400 transition duration-300 md:px-4 md:py-2 w-full md:w-auto"
                    >
                    Siguiente
                    </button>
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                    <button
                    onClick={handleNextValue}
                    disabled={page >= totalPages - 1}
                    className="bg-gray-300 text-black px-3 py-1 rounded-md shadow-sm disabled:opacity-50 hover:bg-gray-400 transition duration-300 md:px-4 md:py-2 w-1/2"
                    >
                    +{paginationValue}
                    </button>
                    <button
                    onClick={handleLastPage}
                    disabled={page === totalPages - 1}
                    className="bg-gray-300 text-black px-3 py-1 rounded-md shadow-sm disabled:opacity-50 hover:bg-gray-400 transition duration-300 md:px-4 md:py-2 w-1/2"
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