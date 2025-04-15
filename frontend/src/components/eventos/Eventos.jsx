import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function GestionEventos() {
  // Estados para la gestión de eventos y paginación
  const [eventos, setEventos] = useState([]);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [paginationValue] = useState(3);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [productosEventos, setProductosEventos] = useState({});

  // Estados para los filtros
  const [filtroEspacio, setFiltroEspacio] = useState("");
  const [filtroHorario, setFiltroHorario] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");

  // Cargar los eventos
  useEffect(() => {
    setLoading(true);

    fetch(`http://localhost:8100/api/eventos?page=${page}&size=${size}`)
      .then((response) => {
        if (!response.ok) throw new Error("Error al obtener los eventos");
        return response.json();
      })
      .then(async (data) => {
        setEventos(data.content);
        setTotalPages(data.totalPages);

        // Obtener productos para cada evento utilizando el nuevo endpoint
        const productosPorEvento = {};
        for (const evento of data.content) {
          try {
            const response = await fetch(`http://localhost:8100/api/eventos/${evento.id}/productos-consumidos`);
            if (response.ok) {
              const productosConsumidos = await response.json();
              productosPorEvento[evento.id] = productosConsumidos;
            } else {
              console.error(`Error al obtener productos consumidos para evento ${evento.id}:`, response.status);
              productosPorEvento[evento.id] = [];
            }
          } catch (error) {
            console.error(`Error al obtener productos consumidos para evento ${evento.id}:`, error);
            productosPorEvento[evento.id] = [];
          }
        }
        setProductosEventos(productosPorEvento);
      })
      .catch((error) => {
        console.error("Error fetching eventos:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [page, size]);

  // Filtrar eventos
  const eventosFiltrados = eventos.filter((evento) => {
    const coincideEspacio = evento.espacio.toLowerCase().includes(filtroEspacio.toLowerCase());
    const coincideHorario = filtroHorario === "" || evento.horario === filtroHorario;
    const coincideEstado = filtroEstado === "" || evento.estado === filtroEstado;
    
    return coincideEspacio && coincideHorario && coincideEstado;
  });

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
            setEventos(eventos.filter((evento) => evento.id !== id));
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
    return <div className="text-center">Cargando eventos ...</div>;
  }

  return (
    <div className="w-full p-4 rounded-lg shadow-lg bg-white md:max-w-[768px] lg:max-w-[1280px] xl:max-w-7xl">

    <h1 className="text-2xl font-semibold text-gray-900 text-center mb-4 md:text-3xl">Gestión de Eventos</h1>

    <div className="mb-4 p-2 md:p-4 w-full md:w-auto">
      <Link to="/eventos/crear-evento">
        <button className="bg-blue-600 text-white px-3 py-1 rounded-lg shadow-md hover:bg-blue-700 transition duration-300 md:px-4 md:py-2 w-full md:w-auto">
          Crear Evento
        </button>
      </Link>
    </div>

    {/* Sección de Filtros */}
    <div className="mb-4 grid grid-cols-1 gap-2 md:grid-cols-3 md:gap-4">
      <input
        type="text"
        placeholder="Buscar por espacio"
        value={filtroEspacio}
        onChange={(e) => setFiltroEspacio(e.target.value)}
        className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 md:p-3"
      />

      <select
        value={filtroHorario}
        onChange={(e) => setFiltroHorario(e.target.value)}
        className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 md:p-3"
      >
        <option value="">Todos los horarios</option>
        <option value="MAÑANA">MAÑANA</option>
        <option value="TARDE">TARDE</option>
        <option value="NOCHE">NOCHE</option>
      </select>

      <select
        value={filtroEstado}
        onChange={(e) => setFiltroEstado(e.target.value)}
        className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 md:p-3"
      >
        <option value="">Todos los estados</option>
        <option value="PENDIENTE">PENDIENTE</option>
        <option value="CONFIRMADO">CONFIRMADO</option>
        <option value="CANCELADO">CANCELADO</option>
        <option value="FINALIZADO">FINALIZADO</option>
      </select>
    </div>

    {/* Tabla de Eventos */}
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white table-auto rounded-lg shadow-md md:table-fixed">
      <thead className="bg-gray-100 hidden md:table-header-group">
            <tr>
              <th className="px-2 py-2 text-left text-xs font-semibold text-gray-700 border-b md:px-4 md:py-3 md:text-sm">Nombre</th>
              <th className="px-2 py-2 text-left text-xs font-semibold text-gray-700 border-b md:px-4 md:py-3 md:text-sm whitespace-nowrap">Fecha</th>
              <th className="px-2 py-2 text-left text-xs font-semibold text-gray-700 border-b md:px-4 md:py-3 md:text-sm">Asistentes</th>
              <th className="px-2 py-2 text-left text-xs font-semibold text-gray-700 border-b md:px-4 md:py-3 md:text-sm">Espacio</th>
              <th className="hidden px-2 py-2 text-left text-xs font-semibold text-gray-700 border-b md:table-cell md:px-4 md:py-3 md:text-sm">Horario</th>
              <th className="hidden px-2 py-2 text-left text-xs font-semibold text-gray-700 border-b md:table-cell md:px-4 md:py-3 md:text-sm">Hora</th>
              <th className="px-2 py-2 text-left text-xs font-semibold text-gray-700 border-b md:px-4 md:py-3 md:text-sm">Estado</th>
              <th className="px-2 py-2 text-center text-xs font-semibold text-gray-700 border-b md:px-4 md:py-3 md:text-sm lg:hidden">Productos</th>
              <th className="hidden px-2 py-2 text-left text-xs font-semibold text-gray-700 border-b lg:table-cell lg:px-4 lg:py-3 lg:text-sm">Productos</th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-700 border-b text-left md:text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {eventosFiltrados.length > 0 ? (
              eventosFiltrados.map((evento) => (
                <tr key={evento.id} className="hover:bg-gray-50 md:table-row">
                  <td className="px-2 py-2 text-xs font-medium text-gray-900 md:px-4 md:py-3 md:text-sm block md:table-cell">
                    <div className="md:hidden flex justify-between">
                      <span className="font-semibold text-gray-700">Nombre</span>
                      <span>{evento.nombre}</span>
                    </div>
                    <div className="hidden md:block">{evento.nombre}</div>
                  </td>
                  <td className="px-2 py-2 text-xs font-medium text-gray-900 md:px-4 md:py-3 md:text-sm block md:table-cell whitespace-nowrap">
                    <div className="md:hidden flex justify-between">
                      <span className="font-semibold text-gray-700">Fecha</span>
                      <span>{evento.fecha}</span>
                    </div>
                    <div className="hidden md:block">{evento.fecha}</div>
                  </td>
                  <td className="px-2 py-2 text-xs font-medium text-gray-900 md:px-4 md:py-3 md:text-sm block md:table-cell">
                    <div className="md:hidden flex justify-between">
                      <span className="font-semibold text-gray-700">Asistentes</span>
                      <span>{evento.cantidadPersonas}</span>
                    </div>
                    <div className="hidden md:block">{evento.cantidadPersonas}</div>
                  </td>
                  <td className="px-2 py-2 text-xs font-medium text-gray-900 md:px-4 md:py-3 md:text-sm block md:table-cell">
                    <div className="md:hidden flex justify-between">
                      <span className="font-semibold text-gray-700">Espacio</span>
                      <span>{evento.espacio}</span>
                    </div>
                    <div className="hidden md:block">{evento.espacio}</div>
                  </td>
                  <td className="hidden px-2 py-2 text-xs font-medium text-gray-900 md:table-cell md:px-4 md:py-3 md:text-sm">
                    <div className="md:hidden flex justify-between">
                      <span className="font-semibold text-gray-700">Horario</span>
                      <span>{evento.horario}</span>
                    </div>
                    <div className="hidden md:block">{evento.horario}</div>
                  </td>
                  <td className="hidden px-2 py-2 text-xs font-medium text-gray-900 md:table-cell md:px-4 md:py-3 md:text-sm">
                    <div className="md:hidden flex justify-between">
                      <span className="font-semibold text-gray-700">Hora</span>
                      <span>{evento.hora}</span>
                    </div>
                    <div className="hidden md:block">{evento.hora}</div>
                  </td>
                  <td className="px-2 py-2 text-xs font-medium text-gray-900 md:px-4 md:py-3 md:text-sm block md:table-cell">
                    <div className="md:hidden flex justify-between">
                      <span className="font-semibold text-gray-700">Estado</span>
                      <span>{evento.estado}</span>
                    </div>
                    <div className="hidden md:block">{evento.estado}</div>
                  </td>
                  <td className="px-2 py-2 text-center text-xs font-medium text-gray-900 md:px-4 md:py-3 md:text-sm block lg:hidden">
                    <div className="font-semibold text-gray-700 mb-1">Productos:</div>
                    <ul className="list-none">
                      {productosEventos[evento.id] && productosEventos[evento.id].map((producto) => (
                        <li key={producto.nombreProducto}>{`${producto.nombreProducto} (${producto.cantidad})`}</li>
                      ))}
                      {!productosEventos[evento.id] && <li>Cargando...</li>}
                    </ul>
                  </td>
                  <td className="hidden px-2 py-2 text-xs font-medium text-gray-900 lg:table-cell lg:px-4 lg:py-3 lg:text-sm">
                    <ul className="list-none">
                      {productosEventos[evento.id] && productosEventos[evento.id].map((producto) => (
                        <li key={producto.nombreProducto} className="whitespace-nowrap">{`${producto.nombreProducto} (${producto.cantidad})`}</li>
                      ))}
                      {!productosEventos[evento.id] && <li>Cargando...</li>}
                    </ul>
                  </td>
                  <td className="px-2 py-2 text-xs font-medium text-gray-900 md:px-4 md:py-3 md:text-sm block md:table-cell">
                    <div className="md:hidden font-semibold text-center">Acciones</div>
                    <div className="flex flex-col md:flex-row md:gap-2 space-y-1 md:space-y-0 md:flex-wrap md:justify-center">
                      <Link to={`/eventos/editar-evento/${evento.id}`}>
                        <button className="bg-yellow-500 text-white px-3 py-1 rounded-md shadow-sm hover:bg-yellow-600 transition duration-300 md:px-4 md:py-2 w-full md:w-auto whitespace-nowrap mb-1 md:mb-0">
                          Editar
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDelete(evento.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded-md shadow-sm hover:bg-red-700 transition duration-300 md:px-4 md:py-2 w-full md:w-auto whitespace-nowrap mb-1 md:mb-0"
                      >
                        Eliminar
                      </button>
                      <Link to={`/eventos/detalle-evento/${evento.id}`}>
                        <button className="bg-gray-600 text-white px-3 py-1 rounded-md shadow-sm hover:bg-gray-700 transition duration-300 md:px-4 md:py-2 w-full md:w-auto whitespace-nowrap mb-1 md:mb-0">
                          Detalles
                        </button>
                      </Link>
                      <Link to={`/eventos/${evento.id}/productos`}>
                        <button className="bg-indigo-600 text-white px-3 py-1 rounded-md shadow-sm hover:bg-indigo-700 transition duration-300 md:px-4 md:py-2 w-full md:w-auto whitespace-nowrap mb-1 md:mb-0">
                          Asignar Producto
                        </button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="px-4 py-4 text-center text-sm font-medium text-gray-500">
                  No hay eventos disponibles.
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
