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
import com.gestioneventos.model.dto.AgregarProductosDTO;
import com.gestioneventos.model.dto.ProductoCantidadDTO;
import com.gestioneventos.service.EventoService;

@RestController
@RequestMapping("/api/eventos")
public class EventoApiController {

    // Inyectamos el servicio de eventos
    // para manejar la lógica de negocio relacionada con los eventos
    // y la interacción con la base de datos.
    @Autowired
    private EventoService eventoService;
    
    // Método para listar eventos con paginación
    // Se utiliza la anotación @RequestParam para recibir los parámetros de paginación
    // y se establece un valor por defecto para la página y el tamaño de la página.
    // La paginación se maneja a través de la interfaz Pageable de Spring Data.
    @GetMapping
    public ResponseEntity<Page<Evento>> listarEventos(
        @RequestParam(defaultValue = "0") int page, 
        @RequestParam(defaultValue = "10") int size
        ) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<Evento> eventos = eventoService.obtenerTodosLosEventos(pageable);
        
        return ResponseEntity.ok(eventos);
    }
    
    // Método para listar todos los eventos sin paginación
    // Este método se utiliza para obtener una lista completa de eventos sin paginación.
    @GetMapping("/todos")
    public ResponseEntity<List<Evento>> obtenerTodosLosEventos() {
        List<Evento> eventos = eventoService.obtenerTodosLosEventos(); // Sin paginación
        return ResponseEntity.ok(eventos);
    }

    
    // Método para obtener un evento por su ID
    // Se utiliza la anotación @PathVariable para recibir el ID del evento desde la URL.
    // Si el evento no se encuentra, se lanza una excepción personalizada RecursoNoEncontradoException.
    // En caso de que el evento no se encuentre, se devuelve un código de estado 404 (Not Found).
    @GetMapping("/{id}")
    public ResponseEntity<Evento> obtenerEvento(@PathVariable Long id) {
        try {
            Evento evento = eventoService.obtenerEventoPorId(id);
            return ResponseEntity.ok(evento);
        } catch (RecursoNoEncontradoException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    // Método para crear un nuevo evento
    // Se utiliza la anotación @RequestBody para recibir el objeto Evento desde el cuerpo de la solicitud.
    // Si el evento no es válido, se lanza una excepción IllegalArgumentException.
    // En caso de que el evento no sea válido, se devuelve un código de estado 422 (Unprocessable Entity).
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

    
    // Método para actualizar un evento existente
    // Se utiliza la anotación @PathVariable para recibir el ID del evento desde la URL
    // y la anotación @RequestBody para recibir el objeto Evento desde el cuerpo de la solicitud.
    // Si el evento no se encuentra, se lanza una excepción RecursoNoEncontradoException.
    // En caso de que el evento no se encuentre, se devuelve un código de estado 404 (Not Found).
    // Si el evento no es válido, se lanza una excepción IllegalArgumentException.
    // En caso de que el evento no sea válido, se devuelve un código de estado 422 (Unprocessable Entity).
    @PutMapping("/{id}")
    public ResponseEntity<String> actualizarEvento(@PathVariable Long id, @RequestBody Evento evento) {
        try {
            eventoService.actualizarEvento(id, evento);
            return ResponseEntity.ok("Evento actualizado exitosamente");
        } catch (IllegalArgumentException e) {
            // Devolvemos el mensaje de error en caso de conflicto con el espacio
            return ResponseEntity.status(422).body(e.getMessage());
        } catch (RecursoNoEncontradoException e) {
            // Si el evento no se encuentra
            return ResponseEntity.notFound().build();
        }
    }


    // Método para eliminar un evento por su ID
    // Se utiliza la anotación @PathVariable para recibir el ID del evento desde la URL.
    // Si el evento no se encuentra, se lanza una excepción RecursoNoEncontradoException.
    // En caso de que el evento no se encuentre, se devuelve un código de estado 404 (Not Found).
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarEvento(@PathVariable Long id) {
        try {
            eventoService.eliminarEvento(id);
            return ResponseEntity.noContent().build();
        } catch (RecursoNoEncontradoException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    // Método para agregar productos a un evento
    // Se utiliza la anotación @PathVariable para recibir el ID del evento desde la URL
    // y la anotación @RequestBody para recibir el objeto AgregarProductosDTO desde el cuerpo de la solicitud.
    @PostMapping("/{id}/productos")
    public ResponseEntity<Evento> agregarProducto(
            @PathVariable("id") Long evento,
            @RequestBody AgregarProductosDTO producto) {
        Evento eventoActualizado = eventoService.agregarProducto(evento, producto);
        return ResponseEntity.ok(eventoActualizado);
    }
    
    // Método para eliminar un producto de un evento
    // Se utiliza la anotación @PathVariable para recibir el ID del evento desde la URL
    // y la anotación @RequestParam para recibir el ID del producto como parámetro de consulta.
    @GetMapping("/{id}/productos-consumidos")
    public ResponseEntity<List<ProductoCantidadDTO>> obtenerProductosConsumidos(@PathVariable("id") Long eventoId) {
        try {
            List<ProductoCantidadDTO> productosConCantidad = eventoService.obtenerProductosConCantidadPorEvento(eventoId);
            return ResponseEntity.ok(productosConCantidad);
        } catch (RecursoNoEncontradoException e) {
            return ResponseEntity.notFound().build();
        }
    }


}
