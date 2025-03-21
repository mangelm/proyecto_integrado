package com.gestioneventos.controller.api;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gestioneventos.model.Evento;
import com.gestioneventos.service.EventoService;

@RestController
@RequestMapping("/api/eventos")
public class EventoApiController {
	
	@Autowired
    private EventoService eventoService;

    @GetMapping
    public List<Evento> listarEventos() {
        return eventoService.obtenerTodosLosEventos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Evento> obtenerEvento(@PathVariable Long id) {
        Evento evento = eventoService.obtenerEventoPorId(id);
        return (evento != null) ? ResponseEntity.ok(evento) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public Evento crearEvento(@RequestBody Evento evento) {
        return eventoService.crearEvento(evento);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Evento> actualizarEvento(@PathVariable Long id, @RequestBody Evento eventoDetalles) {
        Evento evento = eventoService.obtenerEventoPorId(id);
        if (evento == null) {
            return ResponseEntity.notFound().build();
        }
        evento.setNombre(eventoDetalles.getNombre());
        evento.setFecha(eventoDetalles.getFecha());
        evento.setCantidadPersonas(eventoDetalles.getCantidadPersonas());
        evento.setEspacio(eventoDetalles.getEspacio());
        evento.setHorario(eventoDetalles.getHorario());
        evento.setEstado(eventoDetalles.getEstado());
        return ResponseEntity.ok(eventoService.crearEvento(evento));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarEvento(@PathVariable Long id) {
        Evento evento = eventoService.obtenerEventoPorId(id);
        if (evento == null) {
            return ResponseEntity.notFound().build();
        }
        eventoService.eliminarEvento(id);
        return ResponseEntity.noContent().build();
    }
    
    /*
    @PostMapping("/{id}/productos")
    public ResponseEntity<Evento> agregarProductosAEvento(@PathVariable Long id, @RequestBody List<Long> productoIds) {
        Evento evento = eventoService.agregarProductos(id, productoIds).orElse(null);
        return (evento != null) ? ResponseEntity.ok(evento) : ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}/estado")
    public ResponseEntity<Evento> cambiarEstadoEvento(@PathVariable Long id, @RequestParam String estado) {
        Evento evento = eventoService.cambiarEstado(id, estado).orElse(null);
        return (evento != null) ? ResponseEntity.ok(evento) : ResponseEntity.notFound().build();
    }
    */
}
