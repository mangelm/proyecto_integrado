package com.gestioneventos.repository;

import com.gestioneventos.model.Evento;
import com.gestioneventos.model.dto.ProductoCantidadDTO;
import com.gestioneventos.model.enumeration.Horario;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

// Esta interfaz extiende JpaRepository, lo que significa que hereda métodos para realizar operaciones CRUD en la entidad Evento.
// El primer parámetro es la entidad y el segundo es el tipo de dato del ID de la entidad.
@Repository
public interface EventoRepository extends JpaRepository<Evento, Long>, JpaSpecificationExecutor<Evento> {
	// Consulta para obtener todos los eventos entre dos fechas
	@Query("SELECT e.espacio, e.horario, COUNT(e), e.fecha FROM Evento e WHERE e.fecha BETWEEN :fechaInicio AND :fechaFinal GROUP BY e.espacio, e.horario, e.fecha ORDER BY COUNT(e) DESC")
	List<Object[]> countEventosPorEspacioYHorarioEntreFechas(@Param("fechaInicio") LocalDate fechaInicio, @Param("fechaFinal") LocalDate fechaFinal);
	
	// Consulta para obtener todos los eventos entre dos fechas y por espacio
    @Query("SELECT COUNT(e) FROM Evento e WHERE e.fecha = :fecha AND e.horario = :horario AND e.espacio = :espacio AND e.id != :eventoId")
    long countEventosExistentesMismoId(@Param("fecha") LocalDate fecha, @Param("horario") Horario horario, @Param("espacio") String espacio, @Param("eventoId") Long eventoId);
    
    // Consulta para contar los eventos por espacio y horario
    @Query("SELECT COUNT(e) FROM Evento e WHERE e.fecha = :fecha AND e.horario = :horario AND e.espacio = :espacio")
    long countEventosExistentes(@Param("fecha") LocalDate fecha, @Param("horario") Horario horario, @Param("espacio") String espacio);
	
	// Consulta para obtener el consumo total de productos por evento y fecha
    @Query("SELECT NEW com.gestioneventos.model.dto.ProductoCantidadDTO(p.nombre, cp.cantidad) " +
            "FROM ConsumoProducto cp " +
            "JOIN cp.producto p " +
            "WHERE cp.evento.id = :eventoId")
    List<ProductoCantidadDTO> findProductosConCantidadPorEventoId(@Param("eventoId") Long eventoId);
    
    
    // Consulta para obtener el consumo total de productos por evento y fecha
    @Query("SELECT e.espacio, e.horario, COUNT(e), e.fecha FROM Evento e WHERE e.id = :eventoId GROUP BY e.espacio, e.horario, e.fecha ORDER BY COUNT(e) DESC")
    List<Object[]> countEventosPorEspacioYHorarioPorEvento(@Param("eventoId") Long eventoId);
}

