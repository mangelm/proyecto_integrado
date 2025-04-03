package com.gestioneventos.controller.api;

import java.util.List;

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
@RequestMapping("/api/eventos")
public class EventoApiController {

    @Autowired
    private EventoService eventoService;
    
    //Metodo para obtener todos los eventos con paginacion
    @GetMapping
    public ResponseEntity<Page<Evento>> listarEventos(
        @RequestParam(defaultValue = "0") int page, 
        @RequestParam(defaultValue = "20") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<Evento> eventos = eventoService.obtenerTodosLosEventos(pageable);
        
        return ResponseEntity.ok(eventos);
    }
    
    // Método para obtener todos los eventos sin paginación
    @GetMapping("/todos")
    public ResponseEntity<List<Evento>> obtenerTodosLosEventos() {
        List<Evento> eventos = eventoService.obtenerTodosLosEventos(); // Sin paginación
        return ResponseEntity.ok(eventos);
    }

    
    //Metodo para obtener el evento por Id
    @GetMapping("/{id}")
    public ResponseEntity<Evento> obtenerEvento(@PathVariable Long id) {
        try {
            Evento evento = eventoService.obtenerEventoPorId(id);
            return ResponseEntity.ok(evento);
        } catch (RecursoNoEncontradoException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    // Metodo para crear evento
    @PostMapping
    public ResponseEntity<String> crearEvento(@RequestBody Evento evento) { 
        try {
            // Intentamos crear el evento
            eventoService.crearEvento(evento);
            return ResponseEntity.ok("Evento creado exitosamente");
        } catch (IllegalArgumentException e) {
            // Devolvemos el mensaje del error lanzado en el servicio
            return ResponseEntity.status(422).body(e.getMessage()); // Devuelve el error directamente sin 400
        }
    }

    
    //Metodo actualizarEvento
    @PutMapping("/{id}")
    public ResponseEntity<String> actualizarEvento(@PathVariable Long id, @RequestBody Evento evento) {
        try {
            // Intentamos actualizar el evento
            eventoService.actualizarEvento(id, evento);
            return ResponseEntity.ok("Evento actualizado exitosamente");
        } catch (IllegalArgumentException e) {
            // Devolvemos el mensaje de error lanzado en el servicio
            return ResponseEntity.status(422).body(e.getMessage()); // Devuelve el error con el estado 422 (Unprocessable Entity)
        } catch (RecursoNoEncontradoException e) {
            // Si el evento no se encuentra
            return ResponseEntity.notFound().build();
        }
    }


    //Metodo eliminarEvento
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
