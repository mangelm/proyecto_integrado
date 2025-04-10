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

  // Función para formatear la lista de productos consumidos
  const formatProductosConsumidos = (productos) => {
    if (!productos || productos.length === 0) return "Ninguno";

    return productos.map(producto => `${producto.nombreProducto} (${producto.cantidad})`).join(", ");
  };

  if (loading) {
    return <div className="text-center">Cargando eventos ...</div>;
  }

  return (
    <div className="p-8 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-semibold text-gray-900 mb-6">Gestión de Eventos</h1>

      <div className="mb-6">
        <Link to="/eventos/crear-evento">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition duration-300">
            Crear Evento
          </button>
        </Link>
      </div>

      {/* Sección de Filtros */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Buscar por espacio"
          value={filtroEspacio}
          onChange={(e) => setFiltroEspacio(e.target.value)}
          className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          value={filtroHorario}
          onChange={(e) => setFiltroHorario(e.target.value)}
          className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos los horarios</option>
          <option value="MAÑANA">MAÑANA</option>
          <option value="TARDE">TARDE</option>
          <option value="NOCHE">NOCHE</option>
        </select>

        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        <table className="min-w-full bg-white table-auto rounded-lg shadow-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Nombre</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Fecha</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Nº Asistentes</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Espacio</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Horario</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Hora</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Estado</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Productos</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {eventosFiltrados.length > 0 ? (
              eventosFiltrados.map((evento) => (
                <tr key={evento.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{evento.nombre}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{evento.fecha}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{evento.cantidadPersonas}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{evento.espacio}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{evento.horario}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{evento.hora}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{evento.estado}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {productosEventos[evento.id] ? formatProductosConsumidos(productosEventos[evento.id]) : "Cargando..."}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 space-x-2">
                    <Link to={`/eventos/editar-evento/${evento.id}`}>
                      <button className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-yellow-600 transition duration-300">
                        Editar
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(evento.id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-700 transition duration-300"
                    >
                      Eliminar
                    </button>
                    <Link to={`/eventos/detalle-evento/${evento.id}`}>
                      <button className="bg-gray-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-700 transition duration-300">
                        Detalles
                      </button>
                    </Link>
                    <Link to={`/eventos/${evento.id}/productos`}>
                      <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-indigo-700 transition duration-300">
                        Asignar Producto
                      </button>
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="px-6 py-4 text-center text-sm font-medium text-gray-500">
                  No hay eventos disponibles.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="mt-6 flex justify-between items-center">
        <div className="flex gap-4">
          <button
            onClick={handleFirstPage}
            disabled={page === 0}
            className="bg-gray-300 text-black px-4 py-2 rounded-lg shadow-md disabled:opacity-50 hover:bg-gray-400 transition duration-300"
          >
            Primero
          </button>
          <button
            onClick={handlePrevValue}
            disabled={page <= 0}
            className="bg-gray-300 text-black px-4 py-2 rounded-lg shadow-md disabled:opacity-50 hover:bg-gray-400 transition duration-300"
          >
            -{paginationValue}
          </button>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handlePrevPage}
            disabled={page === 0}
            className="bg-gray-300 text-black px-4 py-2 rounded-lg shadow-md disabled:opacity-50 hover:bg-gray-400 transition duration-300"
          >
            Anterior
          </button>
          <span className="text-sm font-medium text-gray-700">
            Página {page + 1} de {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={page === totalPages - 1}
            className="bg-gray-300 text-black px-4 py-2 rounded-lg shadow-md disabled:opacity-50 hover:bg-gray-400 transition duration-300"
          >
            Siguiente
          </button>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleNextValue}
            disabled={page >= totalPages - 1}
            className="bg-gray-300 text-black px-4 py-2 rounded-lg shadow-md disabled:opacity-50 hover:bg-gray-400 transition duration-300"
          >
            +{paginationValue}
          </button>
          <button
            onClick={handleLastPage}
            disabled={page === totalPages - 1}
            className="bg-gray-300 text-black px-4 py-2 rounded-lg shadow-md disabled:opacity-50 hover:bg-gray-400 transition duration-300"
          >
            Último
          </button>
        </div>
      </div>

      <div className="mt-6">
        <Link to={`/`}>
          <button className="bg-green-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-green-700 transition duration-300">
            Volver a la página principal
          </button>
        </Link>
      </div>
    </div>
  );
}
