package com.gestioneventos.service;

import com.gestioneventos.model.Ticket;

public interface TicketService {
	Ticket crearTicket(Ticket ticket);
	Ticket obtenerTicketPorId(Long id);
	void eliminarTicket(Long id);
}
