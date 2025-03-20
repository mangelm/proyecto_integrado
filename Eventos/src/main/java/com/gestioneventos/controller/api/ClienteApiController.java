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

import com.gestioneventos.model.Cliente;
import com.gestioneventos.service.ClienteService;
import com.gestioneventos.service.impl.ClienteServiceImp;

@RestController
@RequestMapping("/api/clientes")
public class ClienteApiController {
	
	 @Autowired
	    private ClienteService clienteService;

	    @PostMapping
	    public ResponseEntity<Cliente> crearCliente(@RequestBody Cliente cliente) {
	        return ResponseEntity.ok(clienteService.crearCliente(cliente));
	    }

	    @GetMapping
	    public ResponseEntity<List<Cliente>> obtenerTodosLosClientes() {
	        return ResponseEntity.ok(clienteService.obtenerTodosLosClientes());
	    }

	    @GetMapping("/{id}")
	    public ResponseEntity<Cliente> obtenerClientePorId(@PathVariable Long id) {
	        return ResponseEntity.ok(clienteService.obtenerClientePorId(id));
	    }

	    @PutMapping("/{id}")
	    public ResponseEntity<Cliente> actualizarCliente(@PathVariable Long id, @RequestBody Cliente cliente) {
	        return ResponseEntity.ok(clienteService.actualizarCliente(id, cliente));
	    }

	    @DeleteMapping("/{id}")
	    public ResponseEntity<Void> eliminarCliente(@PathVariable Long id) {
	        clienteService.eliminarCliente(id);
	        return ResponseEntity.noContent().build();
	    }
}
