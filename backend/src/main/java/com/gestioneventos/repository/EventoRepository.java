package com.gestioneventos.repository;

import com.gestioneventos.model.Evento;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface EventoRepository extends JpaRepository <Evento, Long>{
	 // Consulta personalizada para contar los eventos que ocurren entre las fechas de inicio y final
	@Query("SELECT e.espacio, e.horario, COUNT(e), e.fecha FROM Evento e WHERE e.fecha BETWEEN :fechaInicio AND :fechaFinal GROUP BY e.espacio, e.horario, e.fecha ORDER BY COUNT(e) DESC")
	List<Object[]> countEventosPorEspacioYHorario(@Param("fechaInicio") LocalDate fechaInicio, @Param("fechaFinal") LocalDate fechaFinal);
}
