package com.gestioneventos.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.gestioneventos.model.Ticket;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {
    @Query("SELECT COALESCE(MAX(t.numeroTicket), 0) FROM Ticket t WHERE t.evento.id = :eventoId")
    Integer findMaxNumeroTicketByEventoId(@Param("eventoId") Long eventoId);

    List<Ticket> findByEventoId(Long eventoId);
}
