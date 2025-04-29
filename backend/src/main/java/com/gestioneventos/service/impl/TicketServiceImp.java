package com.gestioneventos.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.gestioneventos.model.Ticket;
import com.gestioneventos.repository.TicketRepository;
import com.gestioneventos.service.TicketService;

@Service
public class TicketServiceImp implements TicketService{
	
	@Autowired
    private TicketRepository ticketRepository;
	
	@Override
	public Ticket crearTicket(Ticket ticket) {
        return ticketRepository.save(ticket);
    }

}
