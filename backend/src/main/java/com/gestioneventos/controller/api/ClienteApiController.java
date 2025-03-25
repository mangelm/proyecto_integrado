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
public class ClienteApiController {
	
	 	@Autowired
	    private ClienteService clienteService;
	 
	 	//LLamada a metodo crearCliente
	    @PostMapping
	    public ResponseEntity<Cliente> crearCliente(@RequestBody Cliente cliente) {
	        return ResponseEntity.ok(clienteService.crearCliente(cliente));
	    }

	    //LLamada a metodo para obtener todos los clientes con paginacion
	    @GetMapping
	    public ResponseEntity<Page<Cliente>> listarClientes(
	        @RequestParam(defaultValue = "0") int page, 
	        @RequestParam(defaultValue = "20") int size) {
	        
	        Pageable pageable = PageRequest.of(page, size);
	        Page<Cliente> clientes = clienteService.obtenerTodosLosClientes(pageable);
	        
	        return ResponseEntity.ok(clientes);
	    }
	    
	    //LLamada a metodo para obtener el cliente por Id
	    @GetMapping("/{id}")
	    public ResponseEntity<Cliente> obtenerCliente(@PathVariable Long id) {
	        try {
	            Cliente cliente = clienteService.obtenerClientePorId(id);
	            return ResponseEntity.ok(cliente);
	        } catch (RecursoNoEncontradoException e) {
	            return ResponseEntity.notFound().build();
	        }
	    }

	    @PutMapping("/{id}")
	    public ResponseEntity<Cliente> actualizarCliente(@PathVariable Long id, @RequestBody Cliente cliente) {
	        return ResponseEntity.ok(clienteService.actualizarCliente(id, cliente));
	    }

	    //LLamada a metodo eliminarCliente
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
