import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";

export default function GestionEventos() {
  // Estados para la gestión de eventos y paginación
  const [eventos, setEventos] = useState([]); // Estado para almacenar la lista de eventos obtenida de la API.
  const [page, setpage] = useState(0); // Estado para controlar la página actual de la paginación, inicializado en 0.
  const size = 10; // Define la cantidad de eventos por página.
  const [valorPaginacion] = useState(3); // Estado para definir el número de páginas a avanzar o retroceder en los botones de paginación +/-.
  const [totalPages, setTotalPages] = useState(0); // Estado para almacenar el número total de páginas disponibles.
  const [cargando, setcargando] = useState(true); // Estado para indicar si los datos están en proceso de carga.
  const [productosEventos, setProductosEventos] = useState({}); // Estado para almacenar los productos consumidos por cada evento. La clave es el ID del evento.
  const [errores, setErrores] = useState([]); // Estado para manejar errores
  const [clientesInfo, setClientesInfo] = useState({});

  // Estados para los filtros
  const [filtroNombre, setFiltroNombre] = useState(""); // Estado para almacenar el texto de filtro por espacio.
  const [filtroHorario, setFiltroHorario] = useState(""); // Estado para almacenar el valor del filtro por horario.
  const [filtroEstado, setFiltroEstado] = useState(""); // Estado para almacenar el valor del filtro por estado del evento.
  const [nombreTemporal, setNombreTemporal] = useState("");

  // Función para manejar el debounce del nombre
  const debounceNombre = useCallback((value) => {
    setNombreTemporal(value);
  }, []);

  // Efecto para el debounce del nombre
  useEffect(() => {
    const timer = setTimeout(() => {
      setFiltroNombre(nombreTemporal);
    }, 500); // Espera 500ms después de que el usuario deje de escribir

    return () => clearTimeout(timer);
  }, [nombreTemporal]);

  // Cargar los eventos
  useEffect(() => {
    setcargando(true);
    const params = new URLSearchParams({
      page: page,
      size: size,
      ...(filtroNombre && { nombre: filtroNombre }),
      ...(filtroHorario && { horario: filtroHorario }),
      ...(filtroEstado && { estado: filtroEstado })
    });

    fetch(`http://localhost:8100/api/eventos?${params.toString()}`)
      .then((response) => {
        if (!response.ok) throw new Error("Error al obtener los eventos");
        return response.json();
      })
      .then(async (data) => {
        setEventos(data.content);
        setTotalPages(data.totalPages);

        const productosPorEvento = {};
        const clientesInfoPorEvento = {};

        for (const evento of data.content) {
          try {
            // Obtener productos consumidos
            const productosResponse = await fetch(`http://localhost:8100/api/eventos/${evento.id}/productos-consumidos`);
            if (productosResponse.ok) {
              const productosConsumidos = await productosResponse.json();
              productosPorEvento[evento.id] = productosConsumidos;
            }

            // Obtener información del cliente
            const clienteResponse = await fetch(`http://localhost:8100/api/eventos/${evento.id}/cliente-info`);
            if (clienteResponse.ok) {
              const clienteInfo = await clienteResponse.json();
              clientesInfoPorEvento[evento.id] = clienteInfo;
            }
          } catch (error) {
            console.error(`Error al obtener datos para evento ${evento.id}:`, error);
            setErrores((prevErrores) => [
              ...prevErrores,
              `Error al obtener datos para el evento ${evento.nombre}.`,
            ]);
          }
        }
        setProductosEventos(productosPorEvento);
        setClientesInfo(clientesInfoPorEvento);
      })
      .catch((error) => {
        console.error("Error al obtener eventos:", error);
        setErrores((prevErrores) => [...prevErrores, "Error al obtener los eventos. Intenta nuevamente."]);
      })
      .finally(() => {
        setcargando(false);
      });
  }, [page, size, filtroNombre, filtroHorario, filtroEstado]);

  // Aplica filtros a la lista de eventos basándose en los estados de los filtros.
  const eventosFiltrados = eventos;

  // Funciones de paginación
  const manejoPaginaPrevia = () => {
    // Decrementa el número de página si no está en la primera página.
    if (page > 0) {
      setpage(page - 1);
    }
  };

  const manejoSiguentePagina = () => {
    // Incrementa el número de página si no está en la última página.
    if (page < totalPages - 1) { 
        setpage(page + 1);
    }
  };

  const manejoPrimeraPagina = () => {
    // Establece la página actual a la primera página (0).
    setpage(0);
  };

  const manejoUltimaPagina = () => {
    // Establece la página actual a la última página.
    setpage(totalPages - 1);
  };

  const manejoSiguienteValor = () => {
    // Avanza la página actual en 'valorPaginacion' páginas, sin exceder la última página.
    setpage((paginaPrevia) => Math.min(paginaPrevia + valorPaginacion, totalPages - 1));
  };

  const manejoValorPrevio = () => {
    // Retrocede la página actual en 'valorPaginacion' páginas, sin bajar de la primera página.
    setpage((paginaPrevia) => Math.max(paginaPrevia - valorPaginacion, 0));
  };

  // Función para eliminar un evento por su ID.
  const manejoBorrar = (id) => {
    // Muestra una confirmación al usuario antes de eliminar.
    if (window.confirm("¿Estás seguro de que deseas eliminar este evento?")) {
        fetch(`http://localhost:8100/api/eventos/${id}`, {
            method: "DELETE", // Utiliza el método DELETE para eliminar el evento.
        })
            .then((response) => {
                // Si la eliminación es exitosa
                if (response.ok) {
                    setEventos(eventos.filter((evento) => evento.id !== id)); // Actualiza la lista de eventos, removiendo el evento eliminado
                    alert("Evento eliminado con éxito");  // Muestra una alerta de éxito.
                } 
                // Si la eliminación falla.
                else {
                  return response.text().then((texto) => {
                    throw new Error(texto || "Error al eliminar el evento.");
                  });
                }
            })
            .catch((error) => {
                console.error("Error al eliminar el evento:", error); // Muestra el error en la consola.
                setErrores((prevErrores) => [...prevErrores, "Error al eliminar el evento"]); // Actualiza el estado de error para mostrar un mensaje al usuario.
            });
    }
  };

  // Muestra un mensaje de carga mientras se obtienen los datos.
  if (cargando) {
    return <div className="text-center">Cargando eventos ...</div>;
  }

  return (

  // Contenedor principal 
  <div className="w-full p-4 rounded-lg shadow-lg bg-white md:max-w-[90%] lg:max-w-[95%] xl:max-w-[1400px] mx-auto">

      {/* Título de la sección con estilos para el tamaño de la fuente, peso, color y centrado. */}
      <h1 className="text-2xl font-semibold text-gray-900 text-center mb-6 md:text-3xl">Gestión de Eventos</h1>

      {/* Mostrar errores */}
      {errores.length > 0 && <MensajesDeErrores messages={errores} />}

      {/* Contenedor para el botón de creación de eventos*/}
      <div className="mb-6 p-2 md:p-4 w-full md:w-auto">
        {/* Enlace a la página de creación de eventos. */}
        <Link to="/eventos/nuevo"> 
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition duration-300 md:px-6 md:py-3 w-full md:w-auto text-sm md:text-base">
            Crear Evento
          </button>
        </Link>
      </div>

    {/* Sección de Filtros */}
    <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-6">

      {/* Campo de texto para filtrar por nombre. */}
      <div className="relative">
        <input
          type="text"
          placeholder="Buscar eventos... "
          value={nombreTemporal}
          onChange={(e) => debounceNombre(e.target.value)}
          className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 md:p-3 w-full"
        />
        {cargando && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
          </div>
        )}
      </div>

      {/* Selector para filtrar por horario del evento. */}
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

      {/* Selector para filtrar por el estado del evento. */}
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
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      {/* Contenedor con scroll horizontal para la tabla en pantallas pequeñas. */}
      <table className="min-w-full bg-white table-auto">
      
       {/* Encabezado de la tabla, oculto en pantallas pequeñas y mostrado como grupo de encabezado en medianas y grandes. */}
      <thead className="bg-gray-100 hidden md:table-header-group">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Nombre</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b whitespace-nowrap">Fecha</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Asistentes</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Espacio</th>
              <th className="hidden px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b md:table-cell">Horario</th>
              <th className="hidden px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b md:table-cell">Hora</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Estado</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Cliente</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Productos</th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-700 border-b text-center">Acciones</th>
            </tr>
      </thead>
      
      <tbody className="divide-y divide-gray-200">
        {/* Si hay eventos filtrados, los mapea para renderizar cada fila. */}
        {eventosFiltrados.length > 0 ? (
            eventosFiltrados.map((evento) => (
              <tr key={evento.id} className="hover:bg-gray-50 md:table-row">
                {/* En pantallas pequeñas, muestra el nombre del campo y el valor uno al lado del otro. */}
                <td className="px-4 py-3 text-xs font-medium text-gray-900 md:px-4 md:py-3 md:text-sm block md:table-cell">

                  {/* Celda para el nombre del evento, mostrada como bloque en pequeñas y como celda en medianas. */}
                  <div className="md:hidden flex justify-between">
                    <span className="font-semibold text-gray-700">Nombre</span>
                    <span>{evento.nombre}</span>
                  </div>
                  {/* En pantallas medianas y grandes, solo muestra el valor. */}
                  <div className="hidden md:block">{evento.nombre}</div>
                </td>
                {/* Celda para la fecha del evento. */}
                <td className="px-4 py-3 text-xs font-medium text-gray-900 md:px-4 md:py-3 md:text-sm block md:table-cell whitespace-nowrap">
                  <div className="md:hidden flex justify-between">
                    <span className="font-semibold text-gray-700">Fecha</span>
                    <span>{new Date(evento.fecha).toLocaleDateString()}</span>
                  </div>
                  <div className="hidden md:block">{new Date(evento.fecha).toLocaleDateString()}</div>
                </td>
                {/* Celda para la cantidad de asistentes. */}
                <td className="px-4 py-3 text-xs font-medium text-gray-900 md:px-4 md:py-3 md:text-sm block md:table-cell">
                  <div className="md:hidden flex justify-between">
                    <span className="font-semibold text-gray-700">Asistentes</span>
                    <span>{evento.cantidadPersonas}</span>
                  </div>
                  <div className="hidden md:block">{evento.cantidadPersonas}</div>
                </td>
                {/* Celda para el espacio del evento. */}
                <td className="px-4 py-3 text-xs font-medium text-gray-900 md:px-4 md:py-3 md:text-sm block md:table-cell">
                  <div className="md:hidden flex justify-between">
                    <span className="font-semibold text-gray-700">Espacio</span>
                    <span>{evento.espacio}</span>
                  </div>
                  <div className="hidden md:block">{evento.espacio}</div>
                </td>
                {/* Celda para el horario del evento (oculta en pantallas pequeñas). */}
                <td className="hidden px-4 py-3 text-xs font-medium text-gray-900 md:table-cell md:px-4 md:py-3 md:text-sm">
                  <div className="md:hidden flex justify-between">
                    <span className="font-semibold text-gray-700">Horario</span>
                    <span>{evento.horario}</span>
                  </div>
                  <div className="hidden md:block">{evento.horario}</div>
                </td>
                {/* Celda para la hora del evento (oculta en pantallas pequeñas). */}
                <td className="hidden px-4 py-3 text-xs font-medium text-gray-900 md:table-cell md:px-4 md:py-3 md:text-sm">
                  <div className="md:hidden flex justify-between">
                    <span className="font-semibold text-gray-700">Hora</span>
                    <span>{evento.hora}</span>
                  </div>
                  <div className="hidden md:block">{evento.hora}</div>
                </td>
                {/* Celda para el estado del evento. */}
                <td className="px-4 py-3 text-xs font-medium text-gray-900 md:px-4 md:py-3 md:text-sm block md:table-cell">
                  <div className="md:hidden flex justify-between">
                    <span className="font-semibold text-gray-700">Estado</span>
                    <span>{evento.estado}</span>
                  </div>
                  <div className="hidden md:block">{evento.estado}</div>
                </td>
                {/* Celda para el cliente asociado al evento */}
                <td className="px-4 py-3 text-xs font-medium text-gray-900 md:px-4 md:py-3 md:text-sm block md:table-cell">
                  <div className="md:hidden flex justify-between">
                    <span className="font-semibold text-gray-700">Cliente</span>
                    <span>{clientesInfo[evento.id] ? (
                      <div>
                        <div>{clientesInfo[evento.id].email}</div>
                        <div className="text-gray-500 text-xs">{clientesInfo[evento.id].telefono}</div>
                      </div>
                    ) : (
                      "No asignado"
                    )}</span>
                  </div>
                  <div className="hidden md:block">{clientesInfo[evento.id] ? (
                    <div>
                      <div>{clientesInfo[evento.id].email}</div>
                      <div className="text-gray-500 text-xs">{clientesInfo[evento.id].telefono}</div>
                    </div>
                  ) : (
                    "No asignado"
                  )}</div>
                </td>
                {/* Celda para la lista de productos */}
                <td className="px-4 py-3 text-xs font-medium text-gray-900 md:px-4 md:py-3 md:text-sm block md:table-cell">
                  <div className="md:hidden flex justify-between">
                    <span className="font-semibold text-gray-700">Productos</span>
                    <div>
                      <ul className="list-none text-right">
                        {productosEventos[evento.id] && productosEventos[evento.id].map((producto, index) => (
                          <li key={`${producto.nombreProducto}_${evento.id}_${index}`}>{producto.nombreProducto}</li>
                        ))}
                        {!productosEventos[evento.id] && <li>Cargando...</li>}
                      </ul>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <ul className="list-none space-y-1">
                      {productosEventos[evento.id] && productosEventos[evento.id].map((producto, index) => (
                        <li 
                          key={`${producto.nombreProducto}_${evento.id}_${index}`}
                          className="py-0.5 px-2 bg-gray-50 rounded-md text-sm"
                        >
                          {producto.nombreProducto}
                        </li>
                      ))}
                      {!productosEventos[evento.id] && <li>Cargando...</li>}
                    </ul>
                  </div>
                </td>
                {/* Celda para las acciones (botones de editar, eliminar, detalles, asignar producto). */}
                <td className="px-4 py-3 text-xs font-medium text-gray-900 md:px-4 md:py-3 md:text-sm block md:table-cell">
                  {/* Título de la sección de acciones en pantallas pequeñas. */}
                  <div className="md:hidden font-semibold text-center">Acciones</div>
                  {/* Contenedor para los botones de acción, con diseño de columna en pequeñas y fila en medianas. */}
                  <div className="flex flex-col md:flex-row md:gap-2 space-y-1 md:space-y-0 md:flex-wrap md:justify-center">
                    {/* Enlace a la página de edición del evento. */}
                    <Link to={`/eventos/${evento.id}/editar`}>
                      <button className="bg-yellow-500 text-white px-3 py-1 rounded-md shadow-sm hover:bg-yellow-600 transition duration-300 md:px-4 md:py-2 w-full md:w-auto whitespace-nowrap mb-1 md:mb-0">
                        Editar
                      </button>
                    </Link>
                    {/* Botón para eliminar el evento. */}
                    <button
                      onClick={() => manejoBorrar(evento.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded-md shadow-sm hover:bg-red-700 transition duration-300 md:px-4 md:py-2 w-full md:w-auto whitespace-nowrap mb-1 md:mb-0"
                    >
                      Eliminar
                    </button>
                    {/* Botón para ver los detalles del evento. */}
                    <Link to={`/eventos/${evento.id}`}>
                      <button className="bg-gray-600 text-white px-3 py-1 rounded-md shadow-sm hover:bg-gray-700 transition duration-300 md:px-4 md:py-2 w-full md:w-auto whitespace-nowrap mb-1 md:mb-0">
                        Detalles
                      </button>
                    </Link>
                    {/* Botón para asignar productos. */}
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
              // Si no hay eventos filtrados, muestra una fila indicándolo.
              
              <tr>
                {/* Celda que ocupa todas las columnas con el mensaje de no hay eventos. */}
                <td colSpan="10" className="px-4 py-4 text-center text-sm font-medium text-gray-500">
                  No hay eventos disponibles.
                </td>
              </tr>
        )}
      </tbody>
    </table>
  </div>

  {/* Paginación */}
  {/* Contenedor para los controles de paginación */}
  <div className="mt-6 flex flex-col items-center justify-between md:flex-row gap-4">
      
      {/* Contenedor para los botones de ir a la primera página y retroceder varias páginas. */}
      <div className="flex gap-3 w-full md:w-auto">
        {/* Botón para ir a la primera página, deshabilitado si ya está en la primera. */}
        <button
          onClick={manejoPrimeraPagina}
          disabled={page === 0}
          className="bg-gray-300 text-black px-4 py-2 rounded-md shadow-sm disabled:opacity-50 hover:bg-gray-400 transition duration-300 w-1/2 md:w-auto text-sm"
        >
          Primero
        </button>
        {/* Botón para retroceder 'valorPaginacion' páginas, deshabilitado si está en la primera página o cerca. */}
        <button
          onClick={manejoValorPrevio}
          disabled={page <= 0}
          className="bg-gray-300 text-black px-4 py-2 rounded-md shadow-sm disabled:opacity-50 hover:bg-gray-400 transition duration-300 w-1/2 md:w-auto text-sm"
        >
          -{valorPaginacion}
        </button>
      </div>

      {/* Contenedor para los botones de página anterior, número de página actual y página siguiente. */}
      <div className="flex flex-col items-center gap-3 w-full md:w-auto md:flex-row md:justify-center">
        {/* Botón para ir a la página anterior, deshabilitado si está en la primera página. */}
        <button
          onClick={manejoPaginaPrevia}
          disabled={page === 0}
          className="bg-gray-300 text-black px-4 py-2 rounded-md shadow-sm disabled:opacity-50 hover:bg-gray-400 transition duration-300 w-full md:w-auto text-sm"
        >
          Anterior
        </button>
        {/* Muestra el número de página actual y el total de páginas. */}
        <span className="text-sm font-medium text-gray-700">
          Página {page + 1} de {totalPages}
        </span>
        {/* Botón para ir a la página siguiente, deshabilitado si está en la última página. */}
        <button
          onClick={manejoSiguentePagina}
          disabled={page === totalPages - 1}
          className="bg-gray-300 text-black px-4 py-2 rounded-md shadow-sm disabled:opacity-50 hover:bg-gray-400 transition duration-300 w-full md:w-auto text-sm"
        >
          Siguiente
        </button>
      </div>
      
       {/* Contenedor para los botones de avanzar varias páginas e ir a la última página. */}
      <div className="flex gap-3 w-full md:w-auto">
        {/* Botón para avanzar 'valorPaginacion' páginas, deshabilitado si está en la última página o cerca. */}
        <button
          onClick={manejoSiguienteValor}
          disabled={page >= totalPages - 1}
          className="bg-gray-300 text-black px-4 py-2 rounded-md shadow-sm disabled:opacity-50 hover:bg-gray-400 transition duration-300 w-1/2 md:w-auto text-sm"
        >
          +{valorPaginacion}
        </button>
        {/* Botón para ir a la última página, deshabilitado si ya está en la última. */}
        <button
          onClick={manejoUltimaPagina}
          disabled={page === totalPages - 1}
          className="bg-gray-300 text-black px-4 py-2 rounded-md shadow-sm disabled:opacity-50 hover:bg-gray-400 transition duration-300 w-1/2 md:w-auto text-sm"
        >
          Último
        </button>
      </div>
    </div>
    
    {/* Contenedor para el botón de volver a la página principal. */}
    <div className="mt-8 text-center w-full md:w-auto">
      <Link to={`/panel-administracion`}>
        {/* Botón estilizado para volver a la página principal. */}
        <button className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-700 transition duration-300 w-full md:w-auto text-sm md:text-base">
          Volver a la página principal
        </button>
      </Link>
    </div>
  </div>
  );
}
