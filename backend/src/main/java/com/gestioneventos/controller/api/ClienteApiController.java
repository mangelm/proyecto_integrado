package com.gestioneventos.controller.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.gestioneventos.exception.RecursoNoEncontradoException;
import com.gestioneventos.model.Cliente;
import com.gestioneventos.service.ClienteService;

@RestController
@RequestMapping("/api/clientes")
// Se utiliza la anotación @RestController para indicar que esta clase es un controlador REST.
// Esta anotación combina las funcionalidades de @Controller y @ResponseBody, lo que significa que los métodos de este controlador devolverán datos directamente en el cuerpo de la respuesta HTTP, en lugar de una vista.
// La anotación @RequestMapping se utiliza para definir la ruta base para todas las solicitudes manejadas por este controlador. En este caso, la ruta base es "/api/clientes".
// Esto significa que todos los métodos de este controlador manejarán solicitudes que comiencen con "/api/clientes".
public class ClienteApiController {
	
	// Se utiliza la anotación @Autowired para inyectar automáticamente una instancia de ClienteService en este controlador.
	// Esto significa que Spring se encargará de crear y proporcionar una instancia de ClienteService cuando se necesite en este controlador.
	@Autowired
	private ClienteService clienteService;
	
	//LLamada a metodo crearCliente
	// Se utiliza la anotación @PostMapping para indicar que este método manejará solicitudes HTTP POST.
	@PostMapping
	public ResponseEntity<Cliente> crearCliente(@RequestBody Cliente cliente) {
		return ResponseEntity.ok(clienteService.crearCliente(cliente));
		// Se utiliza la anotación @RequestBody para indicar que el objeto Cliente se debe deserializar desde el cuerpo de la solicitud HTTP.
		// Esto significa que el cliente se enviará en el cuerpo de la solicitud y se convertirá en un objeto Cliente.
	}

	//LLamada a metodo listarClientes
	// Se utiliza la anotación @GetMapping para indicar que este método manejará solicitudes HTTP GET.
	// Se utiliza la anotación @RequestParam para indicar que los parámetros de consulta "page" y "size" son opcionales y tienen valores predeterminados.
	// El parámetro "page" se utiliza para especificar el número de página que se desea obtener, y "size" se utiliza para especificar el número de elementos por página.
	// Si no se proporcionan estos parámetros en la solicitud, se utilizarán los valores predeterminados (0 para "page" y 20 para "size").
	// Se utiliza la clase Pageable para crear un objeto que representa la paginación.
	// La clase PageRequest se utiliza para crear una instancia de Pageable con el número de página y el tamaño especificados.
	// Luego, se llama al método obtenerTodosLosClientes del servicio clienteService para obtener una lista paginada de clientes.
	// Finalmente, se devuelve la lista de clientes en la respuesta HTTP con un código de estado 200 (OK).
	// La respuesta se envuelve en un objeto ResponseEntity, que permite personalizar la respuesta HTTP.
	// La clase ResponseEntity se utiliza para representar una respuesta HTTP completa, incluyendo el cuerpo, los encabezados y el código de estado.
	// En este caso, se devuelve un objeto ResponseEntity con el cuerpo que contiene la lista de clientes y el código de estado 200 (OK).
	// La clase Page se utiliza para representar una página de resultados, que incluye información sobre el número total de elementos, el número total de páginas y la lista de elementos en la página actual.
	@GetMapping
	public ResponseEntity<Page<Cliente>> listarClientes(
		@RequestParam(defaultValue = "0") int page, 
		@RequestParam(defaultValue = "20") int size) {
			
			Pageable pageable = PageRequest.of(page, size);
			Page<Cliente> clientes = clienteService.obtenerTodosLosClientes(pageable);
			return ResponseEntity.ok(clientes);
	}

	//LLamada a metodo obtenerClientePorId
	// Se utiliza la anotación @PathVariable para indicar que el parámetro "id" se extraerá de la URL.
	// Esto significa que el valor del "id" se pasará como parte de la ruta de la solicitud.
	@GetMapping("/{id}")
	public ResponseEntity<Cliente> obtenerCliente(@PathVariable Long id) {
		try {
			Cliente cliente = clienteService.obtenerClientePorId(id);
			return ResponseEntity.ok(cliente);
		} catch (RecursoNoEncontradoException e) {
			return ResponseEntity.notFound().build();
		}
	}

	//LLamada a metodo actualizarCliente
	// Se utiliza la anotación @PutMapping para indicar que este método manejará solicitudes HTTP PUT.
	// Esto significa que este método se utilizará para actualizar un recurso existente.
	@PutMapping("/{id}")
	public ResponseEntity<Cliente> actualizarCliente(@PathVariable Long id, @RequestBody Cliente cliente) {
		// Si el rol es enviado como string, asegúrate de que se deserialice correctamente
		if (cliente.getRol() == null) {
			return ResponseEntity.badRequest().body(null);  // Si el rol es null, enviar error
		}
		
		Cliente clienteActualizado = clienteService.actualizarCliente(id, cliente);
		return ResponseEntity.ok(clienteActualizado);
	}

	//LLamada a metodo eliminarCliente
	// Se utiliza la anotación @DeleteMapping para indicar que este método manejará solicitudes HTTP DELETE.
	// Esto significa que este método se utilizará para eliminar un recurso existente.
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> eliminarCliente(@PathVariable Long id) {
		try {
			clienteService.eliminarCliente(id);
			return ResponseEntity.noContent().build();
		} catch (RecursoNoEncontradoException e) {
			return ResponseEntity.notFound().build();
		}
	}
}
