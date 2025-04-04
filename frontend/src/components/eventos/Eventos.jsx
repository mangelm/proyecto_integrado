import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function GestionEventos() {
  // Estados para la gestión de eventos y paginación
  const [eventos, setEventos] = useState([]);
  const [displayedEventos, setDisplayedEventos] = useState([]);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [paginationValue] = useState(3);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  // Estados para los filtros
  const [espacioFiltro, setEspacioFiltro] = useState("");
  const [horarioFiltro, setHorarioFiltro] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("");
  const [filtersApplied, setFiltersApplied] = useState(false);

  // Cargar los eventos
  useEffect(() => {
    setLoading(true);

    fetch(`http://localhost:8100/api/eventos?page=${page}&size=${size}`)
      .then((response) => {
        if (!response.ok) throw new Error("Error al obtener los eventos");
        return response.json();
      })
      .then((data) => {
        setEventos(data.content);
        setDisplayedEventos(data.content);
        setTotalPages(data.totalPages);
      })
      .catch((error) => {
        console.error("Error fetching eventos:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [page, size]);

  // Aplicar filtros
  const applyFilters = () => {
    let filtered = [...eventos];

    if (espacioFiltro) {
      filtered = filtered.filter(evento =>
        evento.espacio.toLowerCase().includes(espacioFiltro.toLowerCase())
      );
    }

    if (horarioFiltro) {
      filtered = filtered.filter(evento => evento.horario === horarioFiltro);
    }

    if (estadoFiltro) {
      filtered = filtered.filter(evento => evento.estado === estadoFiltro);
    }

    setDisplayedEventos(filtered);
    setFiltersApplied(true);
  };

  // Limpiar filtros
  const resetFilters = () => {
    setEspacioFiltro("");
    setHorarioFiltro("");
    setEstadoFiltro("");
    setDisplayedEventos(eventos);
    setFiltersApplied(false);
  };

  // Funciones de paginación
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

  const handleFirstPage = () => {
    setPage(0);
  };

  const handleLastPage = () => {
    setPage(totalPages - 1);
  };

  const handleNextValue = () => {
    setPage((prevPage) => Math.min(prevPage + paginationValue, totalPages - 1));
  };

  const handlePrevValue = () => {
    setPage((prevPage) => Math.max(prevPage - paginationValue, 0));
  };

  // Eliminar evento
  const handleDelete = (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este evento?")) {
      fetch(`http://localhost:8100/api/eventos/${id}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (response.ok) {
            // Actualizar ambos estados
            setEventos(eventos.filter((evento) => evento.id !== id));
            setDisplayedEventos(displayedEventos.filter((evento) => evento.id !== id));
            alert("Evento eliminado con éxito");
          } else {
            alert("Error al eliminar el evento.");
          }
        })
        .catch((error) => {
          console.error("Error al eliminar el evento:", error);
          alert("Error al eliminar el evento.");
        });
    }
  };

  if (loading) {
    return <div className="text-center">Cargando eventos ...</div>; // Muestra un mensaje de carga mientras se obtienen los eventos
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Gestión de Eventos</h1>

      <div className="mb-4">
        <Link to="/eventos/crear">
          <button className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition duration-300">
            Crear Evento
          </button>
        </Link>
      </div>


      {/* Sección de Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label htmlFor="espacioFiltro" className="block text-sm font-medium">
            Espacio
          </label>
          <input
            type="text"
            id="espacioFiltro"
            className="mt-1 w-full p-2 border rounded-md"
            value={espacioFiltro}
            onChange={(e) => setEspacioFiltro(e.target.value)}
            placeholder="Filtrar por espacio"
          />
        </div>

        <div>
          <label htmlFor="horarioFiltro" className="block text-sm font-medium">
            Horario
          </label>
          <select
            id="horarioFiltro"
            className="mt-1 w-full p-2 border rounded-md"
            value={horarioFiltro}
            onChange={(e) => setHorarioFiltro(e.target.value)}
          >
            <option value="">Todos los horarios</option>
            <option value="MAÑANA">MAÑANA</option>
            <option value="TARDE">TARDE</option>
            <option value="NOCHE">NOCHE</option>
          </select>
        </div>

        <div>
          <label htmlFor="estadoFiltro" className="block text-sm font-medium">
            Estado
          </label>
          <select
            id="estadoFiltro"
            className="mt-1 w-full p-2 border rounded-md"
            value={estadoFiltro}
            onChange={(e) => setEstadoFiltro(e.target.value)}
          >
            <option value="">Todos los estados</option>
            <option value="PENDIENTE">PENDIENTE</option>
            <option value="CONFIRMADO">CONFIRMADO</option>
            <option value="CANCELADO">CANCELADO</option>
            <option value="FINALIZADO">FINALIZADO</option>
          </select>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={applyFilters}
          className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition duration-300"
        >
          Aplicar Filtros
        </button>

        {filtersApplied && (
          <button
            onClick={resetFilters}
            className="bg-gray-500 text-white p-2 rounded-lg hover:bg-gray-600 transition duration-300"
          >
            Limpiar Filtros
          </button>
        )}
      </div>

      {/* Tabla de Eventos */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">Id</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">Nombre</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">Fecha</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">Nº Asistentes</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">Espacio</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">Horario</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">Estado</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {displayedEventos.length > 0 ? (
              displayedEventos.map((evento) => (
                <tr key={evento.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm font-medium text-gray-900 border-b">{evento.id}</td>
                  <td className="px-4 py-2 text-sm font-medium text-gray-900 border-b">{evento.nombre}</td>
                  <td className="px-4 py-2 text-sm font-medium text-gray-900 border-b">{evento.fecha}</td>
                  <td className="px-4 py-2 text-sm font-medium text-gray-900 border-b">{evento.cantidadPersonas}</td>
                  <td className="px-4 py-2 text-sm font-medium text-gray-900 border-b">{evento.espacio}</td>
                  <td className="px-4 py-2 text-sm font-medium text-gray-900 border-b">{evento.horario}</td>
                  <td className="px-4 py-2 text-sm font-medium text-gray-900 border-b">{evento.estado}</td>
                  <td className="px-4 py-2 text-sm font-medium text-gray-900 border-b space-x-2">
                    <Link to={`/eventos/editar/${evento.id}`}>
                      <button className="bg-yellow-500 text-white p-2 rounded-lg hover:bg-yellow-600 transition duration-300">
                        Editar
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(evento.id)}
                      className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition duration-300"
                    >
                      Eliminar
                    </button>
                    <Link to={`/eventos/${evento.id}`}>
                      <button className="bg-gray-500 text-white p-2 rounded-lg hover:bg-gray-900 transition duration-300">
                        Detalles
                      </button>
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="px-6 py-4 text-center text-sm font-medium text-gray-500">
                  {filtersApplied 
                    ? "No hay eventos que coincidan con los filtros aplicados" 
                    : "No hay eventos disponibles."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex gap-2">
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
            className="bg-gray-300 text-black p-2 rounded-lg hover:bg-gray-400 disabled:opacity-50 transition duration-300"
          >
            -{paginationValue}
          </button>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handlePrevPage}
            disabled={page === 0}
            className="bg-gray-300 text-black p-2 rounded-lg hover:bg-gray-400 disabled:opacity-50 transition duration-300"
          >
            Anterior
          </button>
          <span className="text-sm font-medium text-gray-700">
            Página {page + 1} de {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={page === totalPages - 1}
            className="bg-gray-300 text-black p-2 rounded-lg hover:bg-gray-400 disabled:opacity-50 transition duration-300"
          >
            Siguiente
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleNextValue}
            disabled={page >= totalPages - paginationValue}
            className="bg-gray-300 text-black p-2 rounded-lg hover:bg-gray-400 disabled:opacity-50 transition duration-300"
          >
            +{paginationValue}
          </button>
          <button
            onClick={handleLastPage}
            disabled={page === totalPages - 1}
            className="bg-gray-300 text-black p-2 rounded-lg hover:bg-gray-400 disabled:opacity-50 transition duration-300"
          >
            Último
          </button>
        </div>
      </div>

      <br />
      <Link to={`/`}>
        <button className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition duration-300">
          Volver a la página principal
        </button>
      </Link>
    </div>
  );
}