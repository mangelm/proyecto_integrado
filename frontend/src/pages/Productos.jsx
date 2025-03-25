import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Asegúrate de tener react-router-dom instalado

export default function GestionProductos() {
    const [productos, setProductos] = useState([]);
    const [page, setPage] = useState(0); // Página actual
    const [size] = useState(10); // Tamaño de la página
    const [paginationValue] = useState(2);
    const [totalPages, setTotalPages] = useState(0); // Total de páginas
    const [loading, setLoading] = useState(false); // Indicador de carga

    useEffect(() => {
        setLoading(true); // Inicia el indicador de carga
        fetch(`http://localhost:8100/api/productos?page=${page}&size=${size}`)
        .then((response) => response.json())
        .then((data) => {
            setProductos(data.content);
            setTotalPages(data.totalPages);
        })
        .catch((error) => console.error("Error fetching productos:", error))
        .finally(() => setLoading(false)); // Detiene el indicador de carga
    }, [page, size]);

    // Renderizar mientras carga
    if (loading) {
        return <div className="text-center">Cargando productos...</div>;
    }

    // Funciones para cambiar de página
    const handlePrevPage = () => {
        if (page > 0) {
        setPage(page - 1);
        }
    };

    const handleNextPage = () => {
        if (page < totalPages - 1) {
        setPage(page + 1);
        }
    };

    // Ir a la primera página
    const handleFirstPage = () => {
        setPage(0);
    };

    // Ir a la última página
    const handleLastPage = () => {
        setPage(totalPages - 1);
    };

    // Avanzar de x en x
    const handleNextValue = (paginationValue) => {
        setPage((prevPage) => Math.min(prevPage + paginationValue, totalPages - 1));
    };

    // Retroceder de x en x
    const handlePrevValue = (paginationValue) => {
        setPage((prevPage) => Math.max(prevPage - paginationValue, 0));
    };

    // Función para eliminar un producto
    const handleDelete = (id) => {
        if (window.confirm("¿Estás seguro de que deseas eliminar este producto?")) {
        fetch(`http://localhost:8100/api/productos/${id}`, {
            method: "DELETE",
        })
            .then((response) => {
            if (response.ok) {
                // Eliminar el producto de la lista en el estado local
                setProductos(productos.filter((producto) => producto.id !== id));
                alert("Producto eliminado con éxito");
            } else {
                alert("Error al eliminar el producto.");
            }
            })
            .catch((error) => {
                console.error("Error al eliminar el producto:", error);
                alert("Error al eliminar el producto.");
            });
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-4">Gestión de Productos</h1>
            <div className="mb-4">
                {/* Botón para crear producto, que redirige a la página de creación */}
                <Link to="/productos/crear">
                    <button className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition duration-300">
                        Crear Producto
                    </button>
                </Link>
            </div>

            {/* Contenedor de la tabla sin scroll, con el ajuste de ancho automático */}
            <table className="min-w-full table-fixed">
                <thead>
                    <tr>
                        <th className="px-2 py-3 text-left text-sm font-medium text-gray-700 border-b w-1/12">Id</th>
                        <th className="px-2 py-3 text-left text-sm font-medium text-gray-700 border-b w-1/6">Nombre</th>
                        <th className="px-2 py-3 text-left text-sm font-medium text-gray-700 border-b w-1/4">Descripción</th>
                        <th className="px-2 py-3 text-left text-sm font-medium text-gray-700 border-b w-1/8">Precio</th>
                        <th className="px-2 py-3 text-left text-sm font-medium text-gray-700 border-b w-1/8">Impuesto</th>
                        <th className="px-2 py-3 text-left text-sm font-medium text-gray-700 border-b w-1/8">Disponible</th>
                        <th className="px-2 py-3 text-left text-sm font-medium text-gray-700 border-b w-1/8">Categoría</th>
                        <th className="px-2 py-3 text-left text-sm font-medium text-gray-700 border-b w-1/8">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {productos.length > 0 ? (
                        productos.map((producto) => (
                        <tr key={producto.id} className="hover:bg-gray-100">
                            <td className="px-2 py-2 text-sm font-medium text-gray-900 border-b truncate">{producto.id}</td>
                            <td className="px-2 py-2 text-sm font-medium text-gray-900 border-b truncate">{producto.nombre}</td>
                            <td className="px-2 py-2 text-sm font-medium text-gray-900 border-b truncate">{producto.descripcion}</td>
                            <td className="px-2 py-2 text-sm font-medium text-gray-900 border-b truncate">{producto.precio}</td>
                            <td className="px-2 py-2 text-sm font-medium text-gray-900 border-b truncate">{producto.impuesto}</td>
                            <td className="px-2 py-2 text-sm font-medium text-gray-900 border-b truncate">
                                {producto.disponible ? "Sí" : "No"}
                            </td>
                            <td className="px-2 py-2 text-sm font-medium text-gray-900 border-b truncate">{producto.categoria}</td>
                            <td className="px-2 py-2 text-sm font-medium text-gray-900 border-b">
                            {/* Botones para editar y eliminar */}
                            <Link to={`/productos/editar/${producto.id}`}>
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
                        <td colSpan="8" className="px-6 py-4 text-center text-sm font-medium text-gray-500 border-b">
                            No hay productos disponibles.
                        </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Paginación */}
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
                    onClick={() => handlePrevValue(paginationValue)} 
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
                    onClick={() => handleNextValue(paginationValue)}
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
        </div>
    );
}
