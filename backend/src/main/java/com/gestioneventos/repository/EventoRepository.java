package com.gestioneventos.repository;

import com.gestioneventos.model.Evento;
import com.gestioneventos.model.dto.ProductoCantidadDTO;
import com.gestioneventos.model.enumeration.Horario;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface EventoRepository extends JpaRepository <Evento, Long>{
	 // Consulta para contar los eventos que ocurren entre las fechas de inicio y final
	@Query("SELECT e.espacio, e.horario, COUNT(e), e.fecha FROM Evento e WHERE e.fecha BETWEEN :fechaInicio AND :fechaFinal GROUP BY e.espacio, e.horario, e.fecha ORDER BY COUNT(e) DESC")
	List<Object[]> countEventosPorEspacioYHorario(@Param("fechaInicio") LocalDate fechaInicio, @Param("fechaFinal") LocalDate fechaFinal);
	
	// Consulta para verificar si hay eventos existentes en un horario y fecha concretos
	@Query("SELECT COUNT(e) FROM Evento e WHERE e.fecha = :fecha AND e.horario = :horario AND e.espacio = :espacio")
	long countEventosExistentes(@Param("fecha") LocalDate fecha, @Param("horario") Horario horario, @Param("espacio") String espacio);
	
	// Consulta para obtener el nombre del producto y la cantidad consumida por evento
	// Si no hago lo del new com.gestioneventos no acaba de pillar bien los parametros
    @Query("SELECT NEW com.gestioneventos.model.dto.ProductoCantidadDTO(p.nombre, cp.cantidad) " +
           "FROM ConsumoProducto cp " +
           "JOIN cp.producto p " +
           "WHERE cp.evento.id = :eventoId")
    List<ProductoCantidadDTO> findProductosConCantidadPorEventoId(@Param("eventoId") Long eventoId);

    // Método para encontrar un evento por fecha, horario y excluyendo un ID específico
    Optional<Evento> findByFechaAndHorarioAndIdNot(LocalDate fecha, Horario horario, Long idExcluido);
    
    // Método para encontrar un evento por fecha, horario y espacio
    Optional<Evento> findByFechaAndHorarioAndEspacio(LocalDate fecha, Horario horario, String espacio);
    
    long countEventosExistentes(LocalDate fecha, Horario horario, String espacio);

    @Query("SELECT e FROM Evento e WHERE e.fecha = :fecha AND e.horario = :horario AND e.espacio = :espacio")
    Evento findConflictingEvent(@Param("fecha") LocalDate fecha, @Param("horario") Horario horario, @Param("espacio") String espacio);

}

