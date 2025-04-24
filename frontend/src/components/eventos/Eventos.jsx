import { useState, useEffect } from "react";
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
  const [errorEliminar, setErrorEliminar] = useState(null); // Estado para almacenar cualquier error ocurrido durante la eliminación de un evento.

  // Estados para los filtros
  const [filtroEspacio, setFiltroEspacio] = useState(""); // Estado para almacenar el texto de filtro por espacio.
  const [filtroHorario, setFiltroHorario] = useState(""); // Estado para almacenar el valor del filtro por horario.
  const [filtroEstado, setFiltroEstado] = useState(""); // Estado para almacenar el valor del filtro por estado del evento.

  // Cargar los eventos
  useEffect(() => {
    setcargando(true); // Indica que la carga de eventos ha comenzado.
    // Este efecto se ejecuta cada vez que cambia 'page' o 'size' para cargar los eventos de la página actual.
    fetch(`http://localhost:8100/api/eventos?page=${page}&size=${size}`) // Realiza una petición GET a la API para obtener los eventos paginados.
      .then((response) => {
        // Si la respuesta no es exitosa, lanza un error.
        if (!response.ok) throw new Error("Error al obtener los eventos");
        return response.json(); // Convierte la respuesta a JSON.
      })
      .then(async (data) => {
        setEventos(data.content); // Actualiza el estado 'eventos' con el contenido de la página actual.
        setTotalPages(data.totalPages); // Actualiza el estado 'totalPages' con el número total de páginas.

        // Obtener productos para cada evento utilizando el nuevo endpoint
        const productosPorEvento = {}; // Objeto para almacenar los productos por ID de evento.

        // Itera sobre cada evento obtenido.
        for (const evento of data.content) {
          try {
            // Realiza una petición para obtener los productos consumidos en el evento.
            const response = await fetch(`http://localhost:8100/api/eventos/${evento.id}/productos-consumidos`);
            if (response.ok) {
              const productosConsumidos = await response.json(); // Convierte la respuesta a JSON.
              productosPorEvento[evento.id] = productosConsumidos; // Almacena los productos en el objeto 'productosPorEvento' usando el ID del evento como clave.
            } 
            // Si la respuesta no es exitosa.
            else {
              console.error(`Error al obtener productos consumidos para evento ${evento.id}:`, response.status);
              productosPorEvento[evento.id] = []; // Establece un array vacío si hay un error.
            }
          } 
          // Captura cualquier error durante la petición.
          catch (error) {
            console.error(`Error al obtener productos consumidos para evento ${evento.id}:`, error);
            productosPorEvento[evento.id] = []; // Establece un array vacío si hay un error.
          }
        }
        setProductosEventos(productosPorEvento); // Actualiza el estado 'productosEventos' con los datos obtenidos.
      })
      .catch((error) => {
        console.error("Error fetching eventos:", error); // Muestra un error en la consola si falla la petición inicial de eventos.
      })
      .finally(() => {
        setcargando(false); // Indica que la carga de eventos ha finalizado.
      });
  }, [page, size]); // El efecto se vuelve a ejecutar cada vez que cambia 'page' o 'size'.

  // Aplica filtros a la lista de eventos basándose en los estados de los filtros.
  const eventosFiltrados = eventos.filter((evento) => {
    const coincideEspacio = evento.espacio.toLowerCase().includes(filtroEspacio.toLowerCase()); // Comprueba si el espacio del evento incluye el texto del filtro (ignorando mayúsculas/minúsculas).
    const coincideHorario = filtroHorario === "" || evento.horario === filtroHorario; // Comprueba si el horario del evento coincide con el filtro o si no hay filtro de horario.
    const coincideEstado = filtroEstado === "" || evento.estado === filtroEstado; // Comprueba si el estado del evento coincide con el filtro o si no hay filtro de estado.
    
    return coincideEspacio && coincideHorario && coincideEstado; // Devuelve true si el evento cumple con todos los filtros.
  });

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
        setErrorEliminar(null); // Limpiar cualquier error previo
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
                    // Lee el cuerpo de la respuesta para obtener más detalles del error.
                    return response.text().then(texto => { throw new Error(texto || "Error al eliminar el evento."); });
                }
            })
            .catch((error) => {
                console.error("Error al eliminar el evento:", error); // Muestra el error en la consola.
                setErrorEliminar(`Error al eliminar el evento: ${error.message}`); // Actualiza el estado de error para mostrar un mensaje al usuario.
            });
    }
  };

  // Muestra un mensaje de carga mientras se obtienen los datos.
  if (cargando) {
    return <div className="text-center">Cargando eventos ...</div>;
  }

  return (

  // Contenedor principal 
  <div className="w-full p-4 rounded-lg shadow-lg bg-white md:max-w-[768px] lg:max-w-[1280px] xl:max-w-7xl">

      {/* Título de la sección con estilos para el tamaño de la fuente, peso, color y centrado. */}
      <h1 className="text-2xl font-semibold text-gray-900 text-center mb-4 md:text-3xl">Gestión de Eventos</h1>

      {/* Contenedor para el botón de creación de eventos*/}
      <div className="mb-4 p-2 md:p-4 w-full md:w-auto">
        {/* Enlace a la página de creación de eventos. */}
        <Link to="/eventos/crear-evento">
          <button className="bg-blue-600 text-white px-3 py-1 rounded-lg shadow-md hover:bg-blue-700 transition duration-300 md:px-4 md:py-2 w-full md:w-auto">
            Crear Evento
          </button>
        </Link>
      </div>

    {/* Muestra un mensaje de error si 'errorEliminar' tiene un valor. */}
    {errorEliminar && (
      // Contenedor para el mensaje de error
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
        <strong className="font-bold">Error!</strong>
         {/* Muestra el mensaje de error. */}
        <span className="block sm:inline">{errorEliminar}</span>
      </div>
    )}

    {/* Sección de Filtros */}
    <div className="mb-4 grid grid-cols-1 gap-2 md:grid-cols-3 md:gap-4">

      {/* Campo de texto para filtrar por espacio. */}
      <input
        type="text"
        placeholder="Buscar por espacio"
        value={filtroEspacio}
        onChange={(e) => setFiltroEspacio(e.target.value)}
        className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 md:p-3"
      />

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
    <div className="overflow-x-auto">
      {/* Contenedor con scroll horizontal para la tabla en pantallas pequeñas. */}
      <table className="min-w-full bg-white table-auto rounded-lg shadow-md md:table-fixed">
      
       {/* Encabezado de la tabla, oculto en pantallas pequeñas y mostrado como grupo de encabezado en medianas y grandes. */}
      <thead className="bg-gray-100 hidden md:table-header-group">
            <tr>
              <th className="px-2 py-2 text-left text-xs font-semibold text-gray-700 border-b md:px-4 md:py-3 md:text-sm">Nombre</th>
              <th className="px-2 py-2 text-left text-xs font-semibold text-gray-700 border-b md:px-4 md:py-3 md:text-sm whitespace-nowrap">Fecha</th>
              <th className="px-2 py-2 text-left text-xs font-semibold text-gray-700 border-b md:px-4 md:py-3 md:text-sm">Asistentes</th>
              <th className="px-2 py-2 text-left text-xs font-semibold text-gray-700 border-b md:px-4 md:py-3 md:text-sm">Espacio</th>
              <th className="hidden px-2 py-2 text-left text-xs font-semibold text-gray-700 border-b md:table-cell md:px-4 md:py-3 md:text-sm">Horario</th>
              <th className="hidden px-2 py-2 text-left text-xs font-semibold text-gray-700 border-b md:table-cell md:px-4 md:py-3 md:text-sm">Hora</th>
              <th className="px-2 py-2 text-left text-xs font-semibold text-gray-700 border-b md:px-4 md:py-3 md:text-sm">Estado</th>
              {/* Encabezado para la lista de productos, oculto en pantallas pequeñas y medianas. */}
              <th className="px-2 py-2 text-center text-xs font-semibold text-gray-700 border-b md:px-4 md:py-3 md:text-sm lg:hidden">Productos</th>
              {/* Encabezado para la lista de productos (abreviado en pantallas grandes). */}
              <th className="hidden px-2 py-2 text-left text-xs font-semibold text-gray-700 border-b lg:table-cell lg:px-4 lg:py-3 lg:text-sm">Productos</th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-700 border-b text-left md:text-center">Acciones</th>
            </tr>
      </thead>
      
      <tbody className="divide-y divide-gray-200">
        {/* Si hay eventos filtrados, los mapea para renderizar cada fila. */}
        {eventosFiltrados.length > 0 ? (
            eventosFiltrados.map((evento) => (
              <tr key={evento.id} className="hover:bg-gray-50 md:table-row">
                {/* En pantallas pequeñas, muestra el nombre del campo y el valor uno al lado del otro. */}
                <td className="px-2 py-2 text-xs font-medium text-gray-900 md:px-4 md:py-3 md:text-sm block md:table-cell">

                  {/* Celda para el nombre del evento, mostrada como bloque en pequeñas y como celda en medianas. */}
                  <div className="md:hidden flex justify-between">
                    <span className="font-semibold text-gray-700">Nombre</span>
                    <span>{evento.nombre}</span>
                  </div>
                  {/* En pantallas medianas y grandes, solo muestra el valor. */}
                  <div className="hidden md:block">{evento.nombre}</div>
                </td>
                {/* Celda para la fecha del evento. */}
                <td className="px-2 py-2 text-xs font-medium text-gray-900 md:px-4 md:py-3 md:text-sm block md:table-cell whitespace-nowrap">
                  <div className="md:hidden flex justify-between">
                    <span className="font-semibold text-gray-700">Fecha</span>
                    <span>{evento.fecha}</span>
                  </div>
                  <div className="hidden md:block">{evento.fecha}</div>
                </td>
                {/* Celda para la cantidad de asistentes. */}
                <td className="px-2 py-2 text-xs font-medium text-gray-900 md:px-4 md:py-3 md:text-sm block md:table-cell">
                  <div className="md:hidden flex justify-between">
                    <span className="font-semibold text-gray-700">Asistentes</span>
                    <span>{evento.cantidadPersonas}</span>
                  </div>
                  <div className="hidden md:block">{evento.cantidadPersonas}</div>
                </td>
                {/* Celda para el espacio del evento. */}
                <td className="px-2 py-2 text-xs font-medium text-gray-900 md:px-4 md:py-3 md:text-sm block md:table-cell">
                  <div className="md:hidden flex justify-between">
                    <span className="font-semibold text-gray-700">Espacio</span>
                    <span>{evento.espacio}</span>
                  </div>
                  <div className="hidden md:block">{evento.espacio}</div>
                </td>
                {/* Celda para el horario del evento (oculta en pantallas pequeñas). */}
                <td className="hidden px-2 py-2 text-xs font-medium text-gray-900 md:table-cell md:px-4 md:py-3 md:text-sm">
                  <div className="md:hidden flex justify-between">
                    <span className="font-semibold text-gray-700">Horario</span>
                    <span>{evento.horario}</span>
                  </div>
                  <div className="hidden md:block">{evento.horario}</div>
                </td>
                {/* Celda para la hora del evento (oculta en pantallas pequeñas). */}
                <td className="hidden px-2 py-2 text-xs font-medium text-gray-900 md:table-cell md:px-4 md:py-3 md:text-sm">
                  <div className="md:hidden flex justify-between">
                    <span className="font-semibold text-gray-700">Hora</span>
                    <span>{evento.hora}</span>
                  </div>
                  <div className="hidden md:block">{evento.hora}</div>
                </td>
                {/* Celda para el estado del evento. */}
                <td className="px-2 py-2 text-xs font-medium text-gray-900 md:px-4 md:py-3 md:text-sm block md:table-cell">
                  <div className="md:hidden flex justify-between">
                    <span className="font-semibold text-gray-700">Estado</span>
                    <span>{evento.estado}</span>
                  </div>
                  <div className="hidden md:block">{evento.estado}</div>
                </td>
                {/* Celda para la lista de productos (abreviada en pantallas grandes). */}
                <td className="px-2 py-2 text-center text-xs font-medium text-gray-900 md:px-4 md:py-3 md:text-sm block lg:hidden">
                  <div className="font-semibold text-gray-700 mb-1">Productos:</div>
                    {/* Lista no ordenada de productos consumidos en el evento. */}
                    <ul className="list-none">
                        {/* Mapea la lista de productos para renderizar cada uno como un elemento de la lista. */}
                        {productosEventos[evento.id] && productosEventos[evento.id].map((producto) => (
                            <li key={producto.nombreProducto}>{producto.nombreProducto}</li>
                        ))}
                        {/* Muestra un mensaje de carga si aún no se han obtenido los productos. */}
                        {!productosEventos[evento.id] && <li>Cargando...</li>}
                    </ul>
                </td>
                {/* Celda para la lista de productos (oculta en pantallas pequeñas y medianas). */}
                <td className="hidden px-2 py-2 text-xs font-medium text-gray-900 lg:table-cell lg:px-4 lg:py-3 lg:text-sm">
                  
                    <ul className="list-none">
                        {productosEventos[evento.id] && productosEventos[evento.id].map((producto) => (
                            <li key={producto.nombreProducto} className="whitespace-nowrap">{producto.nombreProducto}</li>
                        ))}
                        
                        {!productosEventos[evento.id] && <li>Cargando...</li>}
                    </ul>
                </td>
                {/* Celda para las acciones (botones de editar, eliminar, detalles, asignar producto). */}
                <td className="px-2 py-2 text-xs font-medium text-gray-900 md:px-4 md:py-3 md:text-sm block md:table-cell">
                  {/* Título de la sección de acciones en pantallas pequeñas. */}
                  <div className="md:hidden font-semibold text-center">Acciones</div>
                  {/* Contenedor para los botones de acción, con diseño de columna en pequeñas y fila en medianas. */}
                  <div className="flex flex-col md:flex-row md:gap-2 space-y-1 md:space-y-0 md:flex-wrap md:justify-center">
                    {/* Enlace a la página de edición del evento. */}
                    <Link to={`/eventos/editar-evento/${evento.id}`}>
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
                    <Link to={`/eventos/detalle-evento/${evento.id}`}>
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
  <div className="mt-4 flex flex-col items-center justify-between md:flex-row">
      
      {/* Contenedor para los botones de ir a la primera página y retroceder varias páginas. */}
      <div className="flex gap-2 mb-2 md:mb-0 w-full md:w-auto">
        {/* Botón para ir a la primera página, deshabilitado si ya está en la primera. */}
        <button
          onClick={manejoPrimeraPagina}
          disabled={page === 0}
          className="bg-gray-300 text-black px-3 py-1 rounded-md shadow-sm disabled:opacity-50 hover:bg-gray-400 transition duration-300 md:px-4 md:py-2 w-1/2"
        >
          Primero
        </button>
        {/* Botón para retroceder 'valorPaginacion' páginas, deshabilitado si está en la primera página o cerca. */}
        <button
          onClick={manejoValorPrevio}
          disabled={page <= 0}
          className="bg-gray-300 text-black px-3 py-1 rounded-md shadow-sm disabled:opacity-50 hover:bg-gray-400 transition duration-300 md:px-4 md:py-2 w-1/2"
        >
          -{valorPaginacion}
        </button>
      </div>

      {/* Contenedor para los botones de página anterior, número de página actual y página siguiente. */}
      <div className="flex flex-col items-center gap-2 mb-2 md:mb-0 w-full md:w-auto md:flex-row md:justify-center">
        {/* Botón para ir a la página anterior, deshabilitado si está en la primera página. */}
        <button
          onClick={manejoPaginaPrevia}
          disabled={page === 0}
          className="bg-gray-300 text-black px-3 py-1 rounded-md shadow-sm disabled:opacity-50 hover:bg-gray-400 transition duration-300 md:px-4 md:py-2 w-full md:w-auto"
        >
          Anterior
        </button>
        {/* Muestra el número de página actual y el total de páginas. */}
        <span className="text-xs font-medium text-gray-700 md:text-sm">
          Página {page + 1} de {totalPages}
        </span>
        {/* Botón para ir a la página siguiente, deshabilitado si está en la última página. */}
        <button
          onClick={manejoSiguentePagina}
          disabled={page === totalPages - 1}
          className="bg-gray-300 text-black px-3 py-1 rounded-md shadow-sm disabled:opacity-50 hover:bg-gray-400 transition duration-300 md:px-4 md:py-2 w-full md:w-auto"
        >
          Siguiente
        </button>
      </div>
      
       {/* Contenedor para los botones de avanzar varias páginas e ir a la última página. */}
      <div className="flex gap-2 w-full md:w-auto">
        {/* Botón para avanzar 'valorPaginacion' páginas, deshabilitado si está en la última página o cerca. */}
        <button
          onClick={manejoSiguienteValor}
          disabled={page >= totalPages - 1}
          className="bg-gray-300 text-black px-3 py-1 rounded-md shadow-sm disabled:opacity-50 hover:bg-gray-400 transition duration-300 md:px-4 md:py-2 w-1/2"
        >
          +{valorPaginacion}
        </button>
        {/* Botón para ir a la última página, deshabilitado si ya está en la última. */}
        <button
          onClick={manejoUltimaPagina}
          disabled={page === totalPages - 1}
          className="bg-gray-300 text-black px-3 py-1 rounded-md shadow-sm disabled:opacity-50 hover:bg-gray-400 transition duration-300 md:px-4 md:py-2 w-1/2"
        >
          Último
        </button>
      </div>
    </div>
    
    {/* Contenedor para el botón de volver a la página principal. */}
    <div className="mt-6 text-center w-full md:w-auto">
      <Link to={`/`}>
        {/* Botón estilizado para volver a la página principal. */}
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700 transition duration-300 w-full md:w-auto">
          Volver a la página principal
        </button>
      </Link>
    </div>
  </div>
  );
}
