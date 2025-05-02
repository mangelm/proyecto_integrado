package com.gestioneventos.controller.api;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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

    @GetMapping("/evento/{eventoId}/ultimo-numero")
    public ResponseEntity<Integer> obtenerUltimoNumeroTicket(@PathVariable Long eventoId) {
        Integer ultimoNumero = ticketService.obtenerUltimoNumeroTicket(eventoId);
        return ResponseEntity.ok(ultimoNumero);
    }

    @GetMapping("/evento/{eventoId}")
    public ResponseEntity<List<Ticket>> obtenerTicketsPorEvento(@PathVariable Long eventoId) {
        List<Ticket> tickets = ticketService.obtenerTicketsPorEvento(eventoId);
        return ResponseEntity.ok(tickets);
    }
}
