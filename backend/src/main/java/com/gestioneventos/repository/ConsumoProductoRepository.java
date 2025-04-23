package com.gestioneventos.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.gestioneventos.model.ConsumoProducto;

@Repository
public interface ConsumoProductoRepository extends JpaRepository<ConsumoProducto, Long> {
	// Verifica si existen consumos asociados a un producto específico
    boolean existsByProductoId(Long productoId);
    
    // Elimina todos los consumos asociados a un producto específico
    void deleteByProductoId(Long productoId);
    
    // Consulta para productos generales
    @Query("SELECT p.nombre, SUM(cp.cantidad) " +
    	       "FROM ConsumoProducto cp " +
    	       "JOIN cp.producto p " +
    	       "JOIN cp.evento e " +
    	       "WHERE e.fecha BETWEEN :fechaInicio AND :fechaFinal " +
    	       "GROUP BY p.id, p.nombre " +
    	       "ORDER BY SUM(cp.cantidad) DESC")
    List<Object[]> obtenerConsumoPorProductoFecha(@Param("fechaInicio") LocalDate fechaInicio, @Param("fechaFinal") LocalDate fechaFinal);
    
    // Consulta productos por horario
    @Query("SELECT p.nombre, e.horario, SUM(cp.cantidad) FROM ConsumoProducto cp JOIN cp.producto p JOIN cp.evento e WHERE e.fecha BETWEEN :fechaInicio AND :fechaFinal GROUP BY p.id, p.nombre, e.horario ORDER BY e.horario, SUM(cp.cantidad) DESC")
    List<Object[]> obtenerConsumoPorProductoYHorarioFecha(@Param("fechaInicio") LocalDate fechaInicio, @Param("fechaFinal") LocalDate fechaFinal);

    // Método para obtener productos más consumidos por cantidad de personas
    @Query("SELECT p.nombre, e.cantidadPersonas, SUM(cp.cantidad) " +
           "FROM ConsumoProducto cp " +
           "JOIN cp.producto p " +
           "JOIN cp.evento e " +
           "WHERE e.fecha BETWEEN :fechaInicio AND :fechaFinal " +
           "GROUP BY p.id, p.nombre, e.cantidadPersonas " +
           "ORDER BY e.cantidadPersonas DESC, SUM(cp.cantidad) DESC")
    List<Object[]> obtenerProductosMasConsumidosPorPersonasFecha(@Param("fechaInicio") LocalDate fechaInicio, 
                                                             @Param("fechaFinal") LocalDate fechaFinal);
    
    // Método para obtener promedio de productos consumidos por persona
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
    	
    	@Query("SELECT cp.producto.nombre, SUM(cp.cantidad) " +
                "FROM ConsumoProducto cp " +
                "WHERE cp.evento.id = :eventoId " +
                "GROUP BY cp.producto.nombre")
        List<Object[]> sumarCantidadPorProductoPorEvento(@Param("eventoId") Long eventoId);

        @Query("SELECT cp.producto.nombre, e.hora, SUM(cp.cantidad) " +
                "FROM ConsumoProducto cp JOIN cp.evento e " +
                "WHERE e.id = :eventoId " +
                "GROUP BY cp.producto.nombre, e.hora")
        List<Object[]> sumarCantidadPorProductoPorHorarioPorEvento(@Param("eventoId") Long eventoId);

        @Query("SELECT cp.producto.nombre, COUNT(DISTINCT e.cliente.id) " +
                "FROM ConsumoProducto cp JOIN cp.evento e " +
                "WHERE e.id = :eventoId " +
                "GROUP BY cp.producto.nombre")
        List<Object[]> contarPersonasPorProductoPorEvento(@Param("eventoId") Long eventoId);

        @Query("SELECT cp.producto.nombre, AVG(cp.cantidad) " +
                "FROM ConsumoProducto cp JOIN cp.evento e " +
                "WHERE e.id = :eventoId " +
                "GROUP BY cp.producto.nombre")
        List<Object[]> calcularPromedioConsumoPorProductoPorEvento(@Param("eventoId") Long eventoId);
    	
	     
}
