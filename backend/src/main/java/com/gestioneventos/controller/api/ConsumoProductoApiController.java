package com.gestioneventos.controller.api;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gestioneventos.model.ConsumoProducto;
import com.gestioneventos.service.ConsumoProductoService;

@RestController
@RequestMapping("/api/consumos")
// Se utiliza la anotación @RestController para indicar que esta clase es un controlador REST.
// Esta anotación combina las funcionalidades de @Controller y @ResponseBody, lo que significa que los métodos de este controlador devolverán datos directamente en el cuerpo de la respuesta HTTP, en lugar de una vista.
// La anotación @RequestMapping se utiliza para definir la ruta base para todas las solicitudes manejadas por este controlador. En este caso, la ruta base es "/api/consumos".
// Esto significa que todos los métodos de este controlador manejarán solicitudes que comiencen con "/api/consumos".
public class ConsumoProductoApiController {
    
    // Se utiliza la anotación @Autowired para inyectar automáticamente una instancia de ConsumoProductoService en este controlador.
    // Esto significa que Spring se encargará de crear y proporcionar una instancia de ConsumoProductoService cuando se necesite en este controlador.
	@Autowired
	private ConsumoProductoService consumoProductoService;

	//LLamada a metodo crearConsumoProducto
    // Se utiliza la anotación @PostMapping para indicar que este método manejará solicitudes HTTP POST.
    // Se utiliza la anotación @RequestBody para indicar que el objeto ConsumoProducto se debe deserializar desde el cuerpo de la solicitud HTTP.
    // Esto significa que el consumoProducto se enviará en el cuerpo de la solicitud y se convertirá en un objeto ConsumoProducto.
    // Se devuelve el objeto ConsumoProducto creado en la respuesta HTTP con un código de estado 200 (OK).
    // La respuesta se envuelve en un objeto ResponseEntity, que permite personalizar la respuesta HTTP.
    @GetMapping
    public ResponseEntity<List<ConsumoProducto>> listarConsumos() {
        
        List<ConsumoProducto> consumos = consumoProductoService.obtenerTodosLosConsumos();
        
        return ResponseEntity.ok(consumos);
    }

	
}
