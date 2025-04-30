package com.gestioneventos.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.gestioneventos.model.ConsumoProducto;
import com.gestioneventos.model.Producto;

// Esta interfaz extiende JpaRepository, lo que significa que hereda métodos para realizar operaciones CRUD en la entidad ConsumoProducto.
// El primer parámetro es la entidad y el segundo es el tipo de dato del ID de la entidad.
@Repository
public interface ConsumoProductoRepository extends JpaRepository<ConsumoProducto, Long> {
        
        // Verifica si existe un consumo asociado a un producto específico
        boolean existsByProductoId(Long productoId);
        
        // Verifica si existe un consumo asociado a un producto
        boolean existsByProducto(Producto producto);

        // elimina el consumo de un producto específico
        // Se utiliza el ID del producto para eliminar el consumo asociado a ese producto.
        void deleteByProductoId(Long productoId);

        // Consulta para obtener el consumo total de productos por evento
        @Query("SELECT p.nombre, SUM(cp.cantidad) " +
                "FROM ConsumoProducto cp " +
                "JOIN cp.producto p " +
                "JOIN cp.evento e " +
                "WHERE e.fecha BETWEEN :fechaInicio AND :fechaFinal " +
                "GROUP BY p.id, p.nombre " +
                "ORDER BY SUM(cp.cantidad) DESC")
        List<Object[]> obtenerConsumoPorProductoFecha(@Param("fechaInicio") LocalDate fechaInicio, @Param("fechaFinal") LocalDate fechaFinal);

        // Consulta para obtener el consumo total de productos por evento y horario
        @Query("SELECT p.nombre, e.horario, SUM(cp.cantidad) FROM ConsumoProducto cp JOIN cp.producto p JOIN cp.evento e WHERE e.fecha BETWEEN :fechaInicio AND :fechaFinal GROUP BY p.id, p.nombre, e.horario ORDER BY e.horario, SUM(cp.cantidad) DESC")
        List<Object[]> obtenerConsumoPorProductoYHorarioFecha(@Param("fechaInicio") LocalDate fechaInicio, @Param("fechaFinal") LocalDate fechaFinal);

        // Consulta para obtener el consumo total de productos por evento y espacio
        @Query("SELECT p.nombre, e.cantidadPersonas, SUM(cp.cantidad) " +
                "FROM ConsumoProducto cp " +
                "JOIN cp.producto p " +
                "JOIN cp.evento e " +
                "WHERE e.fecha BETWEEN :fechaInicio AND :fechaFinal " +
                "GROUP BY p.id, p.nombre, e.cantidadPersonas " +
                "ORDER BY e.cantidadPersonas DESC, SUM(cp.cantidad) DESC")
        List<Object[]> obtenerProductosMasConsumidosPorPersonasFecha(@Param("fechaInicio") LocalDate fechaInicio, 
                                                                @Param("fechaFinal") LocalDate fechaFinal);

        // Consulta para obtener el consumo promedio por persona de productos por evento
        // Se calcula el consumo promedio dividiendo la suma de las cantidades por el número de personas distintas que consumieron.
        // Se utiliza el DISTINCT para contar solo una vez a cada persona que consumió.
        // Se agrupa por el ID y nombre del producto.
        @Query("SELECT p.nombre, " +
                "COUNT(DISTINCT cp.evento.cantidadPersonas) AS cantidadPersonasQueConsumieron, " + 
                "SUM(cp.cantidad) / COUNT(DISTINCT cp.evento.cantidadPersonas) AS consumoPromedio " +
                "FROM ConsumoProducto cp " +
                "JOIN cp.producto p " +
                "JOIN cp.evento e " +
                "WHERE e.fecha BETWEEN :fechaInicio AND :fechaFinal " +
                "GROUP BY p.id, p.nombre " +
                "ORDER BY consumoPromedio DESC")
                List<Object[]> obtenerConsumoPromedioPorPersona(@Param("fechaInicio") LocalDate fechaInicio, 
                                                                @Param("fechaFinal") LocalDate fechaFinal);

        // Consulta para obtener el consumo total de productos por evento
        // Se utiliza el ID del evento para filtrar los resultados.
        // Se agrupan los resultados por el nombre del producto.
        // Se utiliza la función SUM para sumar las cantidades consumidas de cada producto.
        // Se utiliza el JOIN para unir las tablas de ConsumoProducto y Evento.
        // Se utiliza el WHERE para filtrar los resultados por el ID del evento.
        // Se utiliza el GROUP BY para agrupar los resultados por el nombre del producto.
        // Se utiliza el ORDER BY para ordenar los resultados por la suma de las cantidades consumidas de cada producto.
        @Query("SELECT cp.producto.nombre, SUM(cp.cantidad) " +
                "FROM ConsumoProducto cp " +
                "WHERE cp.evento.id = :eventoId " +
                "GROUP BY cp.producto.nombre")
        List<Object[]> sumarCantidadPorProductoPorEvento(@Param("eventoId") Long eventoId);

        // Consulta para obtener el consumo total de productos por evento y horario
        // Se utiliza el ID del evento para filtrar los resultados.
        // Se agrupan los resultados por el nombre del producto y la hora del evento.
        // Se utiliza la función SUM para sumar las cantidades consumidas de cada producto.
        // Se utiliza el JOIN para unir las tablas de ConsumoProducto y Evento.
        // Se utiliza el WHERE para filtrar los resultados por el ID del evento.
        // Se utiliza el GROUP BY para agrupar los resultados por el nombre del producto y la hora del evento.
        // Se utiliza el ORDER BY para ordenar los resultados por la hora del evento y la suma de las cantidades consumidas de cada producto.
        @Query("SELECT cp.producto.nombre, e.hora, SUM(cp.cantidad) " +
                "FROM ConsumoProducto cp JOIN cp.evento e " +
                "WHERE e.id = :eventoId " +
                "GROUP BY cp.producto.nombre, e.hora")
        List<Object[]> sumarCantidadPorProductoPorHorarioPorEvento(@Param("eventoId") Long eventoId);
        
        // Consulta para contar el número de personas que consumieron cada producto por evento
        // Se utiliza el ID del evento para filtrar los resultados.
        // Se agrupan los resultados por el nombre del producto.
        // Se utiliza la función COUNT para contar el número de personas distintas que consumieron cada producto.
        // Se utiliza el JOIN para unir las tablas de ConsumoProducto y Evento.
        // Se utiliza el WHERE para filtrar los resultados por el ID del evento.
        // Se utiliza el GROUP BY para agrupar los resultados por el nombre del producto.
        // Se utiliza el ORDER BY para ordenar los resultados por el nombre del producto.
        @Query("SELECT cp.producto.nombre, COUNT(DISTINCT e.cliente.id) " +
                "FROM ConsumoProducto cp JOIN cp.evento e " +
                "WHERE e.id = :eventoId " +
                "GROUP BY cp.producto.nombre")
        List<Object[]> contarPersonasPorProductoPorEvento(@Param("eventoId") Long eventoId);

        // Consulta para calcular el promedio de consumo por producto por evento
        // Se utiliza el ID del evento para filtrar los resultados.
        // Se agrupan los resultados por el nombre del producto.
        // Se utiliza la función AVG para calcular el promedio de las cantidades consumidas de cada producto.
        // Se utiliza el JOIN para unir las tablas de ConsumoProducto y Evento.
        // Se utiliza el WHERE para filtrar los resultados por el ID del evento.
        // Se utiliza el GROUP BY para agrupar los resultados por el nombre del producto.
        @Query("SELECT cp.producto.nombre, AVG(cp.cantidad) " +
                "FROM ConsumoProducto cp JOIN cp.evento e " +
                "WHERE e.id = :eventoId " +
                "GROUP BY cp.producto.nombre")
        List<Object[]> calcularPromedioConsumoPorProductoPorEvento(@Param("eventoId") Long eventoId);

}
