import React, { useState, useEffect } from "react";

export default function GestionEventos() {
  const [eventos, setEventos] = useState([]);
  const [page, setPage] = useState(0); // Página actual
  const [size] = useState(20); // Tamaño de la página (5 eventos por página)
  const [totalPages, setTotalPages] = useState(0); // Total de páginas

  useEffect(() => {
    // Realizar la solicitud al backend con los parámetros de paginación
    fetch(`http://localhost:8100/api/eventos?page=${page}&size=${size}`)
      .then((response) => response.json())
      .then((data) => {
        setEventos(data.content); // Los eventos están en "content"
        setTotalPages(data.totalPages); // Total de páginas
      })
      .catch((error) => console.error("Error fetching eventos:", error));
  }, [page, size]);
  

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

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Gestión de Eventos</h1>
      <div className="mb-4">
        <button className="bg-blue-500 text-white p-2 rounded">Crear Evento</button>
      </div>
      <table className="min-w-full table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2 border-b">Nombre</th>
            <th className="px-4 py-2 border-b">Fecha</th>
            <th className="px-4 py-2 border-b">Espacio</th>
            <th className="px-4 py-2 border-b">Estado</th>
            <th className="px-4 py-2 border-b">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {eventos.length > 0 ? (
            eventos.map((evento) => (
              <tr key={evento.id} className="hover:bg-gray-100">
                <td className="px-4 py-2 border-b w-1/4 whitespace-nowrap overflow-hidden text-ellipsis">{evento.nombre}</td>
                <td className="px-4 py-2 border-b w-1/4 whitespace-nowrap overflow-hidden text-ellipsis">{evento.fecha}</td>
                <td className="px-4 py-2 border-b w-1/4 whitespace-nowrap overflow-hidden text-ellipsis">{evento.espacio}</td>
                <td className="px-4 py-2 border-b w-1/4 whitespace-nowrap overflow-hidden text-ellipsis">{evento.estado}</td>
                <td className="px-4 py-2 border-b w-1/4 whitespace-nowrap overflow-hidden text-ellipsis">
                  <button className="bg-yellow-500 text-white p-2 rounded mr-2">Editar</button>
                  <button className="bg-red-500 text-white p-2 rounded">Eliminar</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="px-4 py-2 border-b text-center">No hay eventos disponibles.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Paginación */}
      <div className="mt-4 flex justify-between items-center">
        <button 
          onClick={handlePrevPage} 
          disabled={page === 0}
          className="bg-gray-300 text-black p-2 rounded disabled:opacity-50"
        >
          Anterior
        </button>
        <span>{`Página ${page + 1} de ${totalPages}`}</span>
        <button 
          onClick={handleNextPage} 
          disabled={page === totalPages - 1}
          className="bg-gray-300 text-black p-2 rounded disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
