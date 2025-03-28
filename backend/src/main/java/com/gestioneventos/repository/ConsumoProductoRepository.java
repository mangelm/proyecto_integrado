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
    List<Object[]> obtenerConsumoPorProducto(@Param("fechaInicio") LocalDate fechaInicio, @Param("fechaFinal") LocalDate fechaFinal);
    
    // Consulta productos por horario
    @Query("SELECT p.nombre, e.horario.name(), SUM(cp.cantidad) FROM ConsumoProducto cp " +
    	       "JOIN cp.producto p " +
    	       "JOIN cp.evento e WHERE e.fecha BETWEEN :fechaInicio AND :fechaFinal " +
    	       "GROUP BY p.id, p.nombre, e.horario ORDER BY e.horario, SUM(cp.cantidad) DESC")
   List<Object[]> obtenerConsumoPorProductoYHorario(@Param("fechaInicio") LocalDate fechaInicio, @Param("fechaFinal") LocalDate fechaFinal);

}
