package com.gestioneventos.controller.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.gestioneventos.exception.RecursoNoEncontradoException;
import com.gestioneventos.model.Evento;
import com.gestioneventos.service.EventoService;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/eventos")
public class EventoApiController {

    @Autowired
    private EventoService eventoService;

    @GetMapping
    public ResponseEntity<Page<Evento>> listarEventos(
        @RequestParam(defaultValue = "0") int page, 
        @RequestParam(defaultValue = "20") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<Evento> eventos = eventoService.obtenerTodosLosEventos(pageable);
        
        return ResponseEntity.ok(eventos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Evento> obtenerEvento(@PathVariable Long id) {
        try {
            Evento evento = eventoService.obtenerEventoPorId(id);
            return ResponseEntity.ok(evento);
        } catch (RecursoNoEncontradoException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<Evento> crearEvento(@RequestBody Evento evento) {
        System.out.println("Recibiendo solicitud POST para crear un evento: " + evento);
        return ResponseEntity.ok(eventoService.crearEvento(evento));
    }


    @PutMapping("/{id}")
    public ResponseEntity<Evento> actualizarEvento(@PathVariable Long id, @RequestBody Evento evento) {
        System.out.println("Solicitud PUT recibida para ID: " + id);
        System.out.println("Datos recibidos: " + evento);
        
        Evento eventoActualizado = eventoService.actualizarEvento(id, evento);
        return ResponseEntity.ok(eventoActualizado);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarEvento(@PathVariable Long id) {
        try {
            eventoService.eliminarEvento(id);
            return ResponseEntity.noContent().build();
        } catch (RecursoNoEncontradoException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
