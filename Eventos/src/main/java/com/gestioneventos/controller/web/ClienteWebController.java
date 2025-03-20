package com.gestioneventos.controller.web;

import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.gestioneventos.model.Cliente;
import com.gestioneventos.service.ClienteService;

@Controller
@RequestMapping("/clientes")
public class ClienteWebController {
	
	private ClienteService clienteService;
	private static final String VISTA_LISTA = "clientes/listar";
	private static final String VISTA_CREAR = "clientes/crear";
	private static final String REDIRECT_LISTADO = "redirect:clientes";
	
	@GetMapping
    public String listarClientes(Model model) {
        List<Cliente> clientes = clienteService.obtenerTodosLosClientes();
        model.addAttribute("clientes", clientes);
        return VISTA_LISTA;
    }
	
	@GetMapping("/crear")
    public String mostrarFormularioCreacion(Model model) {
        model.addAttribute("cliente", new Cliente());
        return VISTA_CREAR;
    }
	
	
	@PostMapping("/guardar")
    public String guardarCliente(@ModelAttribute Cliente cliente) {
        clienteService.crearCliente(cliente);
        return REDIRECT_LISTADO;
    }
	
	@GetMapping("/eliminar/{id}")
    public String eliminarCliente(@PathVariable Long id) {
        clienteService.eliminarCliente(id);
        return REDIRECT_LISTADO;
    }
}
