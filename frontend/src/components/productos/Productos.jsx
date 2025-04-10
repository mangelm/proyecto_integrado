import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function GestionProductos() {
    const [productos, setProductos] = useState([]);
    const [page, setPage] = useState(0);
    const [size] = useState(10);
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

    // Filtrar productos (misma lógica que GestionClientes)
    const productosFiltrados = productos.filter((producto) => {
        const coincideNombre = producto.nombre.toLowerCase().includes(filtroNombre.toLowerCase());
        const coincideCategoria = filtroCategoria === "" || producto.categoria === filtroCategoria;
        return coincideNombre && coincideCategoria;
    });

    // Funciones de paginación (igual que en GestionClientes)
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
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-4">Gestión de Productos</h1>

            {/* Filtros - Estilo igual que GestionClientes */}
            <div className="mb-4 flex flex-wrap gap-4">
                <input
                    type="text"
                    placeholder="Buscar por nombre"
                    value={filtroNombre}
                    onChange={(e) => setFiltroNombre(e.target.value)}
                    className="border border-gray-300 p-2 rounded-lg"
                />

                <select
                    value={filtroCategoria}
                    onChange={(e) => setFiltroCategoria(e.target.value)}
                    className="border border-gray-300 p-2 rounded-lg"
                >
                    <option value="">Todas las categorías</option>
                    <option value="BEBIDA">BEBIDA</option>
                    <option value="COMIDA">COMIDA</option>
                    <option value="SERVICIO">SERVICIO</option>
                </select>
            </div>

            {/* Botón Crear - Mismo estilo */}
            <div className="mb-4">
                <Link to="/productos/crear-producto">
                    <button className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition duration-300">
                        Crear Producto
                    </button>
                </Link>
            </div>

            {/* Tabla - Mismo estilo */}
            <table className="min-w-full table-auto table-layout-fixed">
                <thead>
                    <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">Nombre</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">Descripción</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">Precio</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">Impuesto</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">Disponible</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">Categoría</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {productosFiltrados.length > 0 ? (
                        productosFiltrados.map((producto) => (
                            <tr key={producto.id} className="hover:bg-gray-100">
                                <td className="px-4 py-2 text-sm font-medium text-gray-900 border-b truncate">{producto.nombre}</td>
                                <td className="px-4 py-2 text-sm font-medium text-gray-900 border-b truncate">{producto.descripcion}</td>
                                <td className="px-4 py-2 text-sm font-medium text-gray-900 border-b">{producto.precio}€</td>
                                <td className="px-4 py-2 text-sm font-medium text-gray-900 border-b">{producto.impuesto}%</td>
                                <td className="px-4 py-2 text-sm font-medium text-gray-900 border-b">{producto.disponible ? "Sí" : "No"}</td>
                                <td className="px-4 py-2 text-sm font-medium text-gray-900 border-b">{producto.categoria}</td>
                                <td className="px-4 py-2 text-sm font-medium text-gray-900 border-b">
                                    <Link to={`/productos/editar-producto/${producto.id}`}>
                                        <button className="bg-yellow-500 text-white p-2 rounded-lg hover:bg-yellow-600 transition duration-300 mr-2">
                                            Editar
                                        </button>
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(producto.id)}
                                        className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition duration-300"
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" className="px-6 py-4 text-center text-sm font-medium text-gray-500 border-b">
                                No hay productos disponibles.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Paginación - Igual que GestionClientes */}
            <div className="mt-4 flex justify-between items-center">
                <div>
                    <button
                        onClick={handleFirstPage}
                        disabled={page === 0}
                        className="bg-gray-300 text-black p-2 rounded-lg hover:bg-gray-400 disabled:opacity-50 transition duration-300"
                    >
                        Primero
                    </button>
                    <button
                        onClick={handlePrevValue}
                        disabled={page <= 4}
                        className="bg-gray-300 text-black p-2 rounded-lg hover:bg-gray-400 disabled:opacity-50 transition duration-300 ml-2"
                    >
                        -{paginationValue}
                    </button>
                </div>

                <div>
                    <button
                        onClick={handlePrevPage}
                        disabled={page === 0}
                        className="bg-gray-300 text-black p-2 rounded-lg hover:bg-gray-400 disabled:opacity-50 transition duration-300"
                    >
                        Anterior
                    </button>
                    <span className="text-sm font-medium text-gray-700">{`Página ${page + 1} de ${totalPages}`}</span>
                    <button
                        onClick={handleNextPage}
                        disabled={page === totalPages - 1}
                        className="bg-gray-300 text-black p-2 rounded-lg hover:bg-gray-400 disabled:opacity-50 transition duration-300"
                    >
                        Siguiente
                    </button>
                </div>

                <div>
                    <button
                        onClick={handleNextValue}
                        disabled={page >= totalPages - paginationValue}
                        className="bg-gray-300 text-black p-2 rounded-lg hover:bg-gray-400 disabled:opacity-50 transition duration-300 ml-2"
                    >
                        +{paginationValue}
                    </button>
                    <button
                        onClick={handleLastPage}
                        disabled={page === totalPages - 1}
                        className="bg-gray-300 text-black p-2 rounded-lg hover:bg-gray-400 disabled:opacity-50 transition duration-300 ml-2"
                    >
                        Último
                    </button>
                </div>
            </div>

            <br />
            <Link to={`/`}>
                <button className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition duration-300 mr-2">
                    Volver a la página principal
                </button>
            </Link>
        </div>
    );
}