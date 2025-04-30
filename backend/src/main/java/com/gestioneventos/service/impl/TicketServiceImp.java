package com.gestioneventos.service.impl;

import java.math.BigDecimal;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.gestioneventos.exception.RecursoNoEncontradoException;
import com.gestioneventos.exception.ValidacionException;
import com.gestioneventos.model.Ticket;
import com.gestioneventos.repository.TicketRepository;
import com.gestioneventos.service.TicketService;

@Service
public class TicketServiceImp implements TicketService {
	
	private static final Logger logger = LoggerFactory.getLogger(TicketServiceImp.class);
	
	@Autowired
    private TicketRepository ticketRepository;
	
	@Override
	public Ticket crearTicket(Ticket ticket) {
		logger.info("Intentando crear ticket para el evento: {}", ticket.getEvento().getId());
		
		// Validaciones
		if (ticket.getEvento() == null) {
			throw new ValidacionException("El ticket debe estar asociado a un evento");
		}
		
		if (ticket.getPrecioTotal() == null || ticket.getPrecioTotal().compareTo(BigDecimal.ZERO) <= 0) {
			throw new ValidacionException("El precio del ticket debe ser mayor que 0");
		}
		
		if (ticket.getCantidad() == null || ticket.getCantidad() < 0) {
			throw new ValidacionException("La cantidad disponible de tickets debe ser mayor o igual a 0");
		}
		
		return ticketRepository.save(ticket);
	}
	
	@Override
	public Ticket obtenerTicketPorId(Long id) {
		logger.info("Buscando ticket con ID: {}", id);
		return ticketRepository.findById(id)
				.orElseThrow(() -> new RecursoNoEncontradoException("Ticket no encontrado con ID: " + id));
	}
	
	@Override
	public void eliminarTicket(Long id) {
		logger.info("Eliminando ticket con ID: {}", id);
		Ticket ticket = obtenerTicketPorId(id);
		ticketRepository.delete(ticket);
	}
}
