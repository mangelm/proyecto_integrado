import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; 

export default function GestionClientes() {
    const [clientes, setClientes] = useState([]);
    const [page, setPage] = useState(0); // Página actual
    const [size] = useState(10); // Tamaño de la página 
    const [paginationValue] = useState(2);
    const [totalPages, setTotalPages] = useState(0); // Total de páginas
    const [loading, setLoading] = useState(false); // Indicador de carga

    useEffect(() => {
        setLoading(true); // Inicia el indicador de carga
        fetch(`http://localhost:8100/api/clientes?page=${page}&size=${size}`)
        .then((response) => response.json())
        .then((data) => {
            setClientes(data.content);
            setTotalPages(data.totalPages);
        })
        .catch((error) => console.error("Error fetching clientes:", error))
        .finally(() => setLoading(false)); // Detiene el indicador de carga
    }, [page, size]);

    // Renderizar mientras carga
    if (loading) {
        return <div className="text-center">Cargando clientes...</div>;
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

    // Función para eliminar un cliente
    const handleDelete = (id) => {
        if (window.confirm("¿Estás seguro de que deseas eliminar este cliente?")) {
        fetch(`http://localhost:8100/api/clientes/${id}`, {
            method: "DELETE",
        })
            .then((response) => {
            if (response.ok) {
                // Eliminar el cliente de la lista en el estado local
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

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Gestión de Clientes</h1>
        <div className="mb-4">
            {/* Botón para crear cliente, que redirige a la página de creación */}
            <Link to="/clientes/crear">
            <button className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition duration-300">
                Crear Cliente
            </button>
            </Link>
        </div>

        {/* Contenedor de la tabla sin scroll, con el ajuste de ancho automático */}
        <table className="min-w-full table-auto table-layout-fixed">
            <thead>
            <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">Id</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">Nombre</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">Email</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">Telefono</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">Acciones</th>
            </tr>
            </thead>
            <tbody>
            {clientes.length > 0 ? (
                clientes.map((cliente) => (
                <tr key={cliente.id} className="hover:bg-gray-100">
                    <td className="px-4 py-2 text-sm font-medium text-gray-900 border-b truncate">{cliente.id}</td>
                    <td className="px-4 py-2 text-sm font-medium text-gray-900 border-b truncate">{cliente.nombre}</td>
                    <td className="px-4 py-2 text-sm font-medium text-gray-900 border-b truncate">{cliente.email}</td>
                    <td className="px-4 py-2 text-sm font-medium text-gray-900 border-b truncate">{cliente.telefono}</td>
                    <td className="px-4 py-2 text-sm font-medium text-gray-900 border-b">
                    {/* Botones para editar y eliminar */}
                    <Link to={`/clientes/editar/${cliente.id}`}>
                        <button className="bg-yellow-500 text-white p-2 rounded-lg hover:bg-yellow-600 transition duration-300 mr-2">
                        Editar
                        </button>
                    </Link>
                    <button 
                        onClick={() => handleDelete(cliente.id)}
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
                    No hay clientes disponibles.
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
        <br></br>
        <Link to={`/`}>
            <button className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition duration-300 mr-2">
                Volver a la página principal
            </button>
        </Link>
        </div>
    );
}
