package com.gestioneventos.repository;

import com.gestioneventos.model.Evento;
import com.gestioneventos.model.dto.ProductoCantidadDTO;
import com.gestioneventos.model.enumeration.Horario;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface EventoRepository extends JpaRepository <Evento, Long>{
	// Consulta para contar los eventos que ocurren entre las fechas de inicio y final
	@Query("SELECT e.espacio, e.horario, COUNT(e), e.fecha FROM Evento e WHERE e.fecha BETWEEN :fechaInicio AND :fechaFinal GROUP BY e.espacio, e.horario, e.fecha ORDER BY COUNT(e) DESC")
	List<Object[]> countEventosPorEspacioYHorarioEntreFechas(@Param("fechaInicio") LocalDate fechaInicio, @Param("fechaFinal") LocalDate fechaFinal);
	
	// Verifica si hay eventos en la misma fecha y horario, excluyendo el evento actual
    @Query("SELECT COUNT(e) FROM Evento e WHERE e.fecha = :fecha AND e.horario = :horario AND e.espacio = :espacio AND e.id != :eventoId")
    long countEventosExistentesMismoId(@Param("fecha") LocalDate fecha, @Param("horario") Horario horario, @Param("espacio") String espacio, @Param("eventoId") Long eventoId);
    
    // Verifica si hay eventos en la misma fecha y horario
    @Query("SELECT COUNT(e) FROM Evento e WHERE e.fecha = :fecha AND e.horario = :horario AND e.espacio = :espacio")
    long countEventosExistentes(@Param("fecha") LocalDate fecha, @Param("horario") Horario horario, @Param("espacio") String espacio);
	
	// Consulta para obtener el nombre del producto y la cantidad consumida por evento
	// Si no hago lo del new com.gestioneventos no acaba de pillar bien los parametros
    @Query("SELECT NEW com.gestioneventos.model.dto.ProductoCantidadDTO(p.nombre, cp.cantidad) " +
           "FROM ConsumoProducto cp " +
           "JOIN cp.producto p " +
           "WHERE cp.evento.id = :eventoId")
    List<ProductoCantidadDTO> findProductosConCantidadPorEventoId(@Param("eventoId") Long eventoId);
    
    
    // Nueva consulta para contar los eventos por espacio y horario para un evento específico
    @Query("SELECT e.espacio, e.horario, COUNT(e), e.fecha FROM Evento e WHERE e.id = :eventoId GROUP BY e.espacio, e.horario, e.fecha ORDER BY COUNT(e) DESC")
    List<Object[]> countEventosPorEspacioYHorarioPorEvento(@Param("eventoId") Long eventoId);
}

