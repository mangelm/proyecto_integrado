package com.gestioneventos.controller.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gestioneventos.model.Ticket;
import com.gestioneventos.service.TicketService;

@RestController
@RequestMapping("/api/tickets")
public class TicketApiController {
	
	@Autowired
    private TicketService ticketService;

    @PostMapping
    public ResponseEntity<Ticket> crearTicket(@RequestBody Ticket ticket) {
        Ticket nuevoTicket = ticketService.crearTicket(ticket);
        return ResponseEntity.ok(nuevoTicket);
    }
}
