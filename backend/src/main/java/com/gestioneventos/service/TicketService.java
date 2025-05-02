package com.gestioneventos.service;

import java.util.List;

import com.gestioneventos.model.Ticket;

public interface TicketService {
	Ticket crearTicket(Ticket ticket);
	Ticket obtenerTicketPorId(Long id);
	void eliminarTicket(Long id);
	Integer obtenerUltimoNumeroTicket(Long eventoId);
	List<Ticket> obtenerTicketsPorEvento(Long eventoId);
}
