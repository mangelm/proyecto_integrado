package com.gestioneventos.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.gestioneventos.model.Cliente;
import com.gestioneventos.repository.ClienteRepository;
import com.gestioneventos.service.ClienteService;

@Controller
@RequestMapping("/clientes")
public class ClienteWebController {
	
	private ClienteService clienteService;
	private static final String VISTA_LISTA = "clientes/listar";
	private static final String VISTA_CREAR = "clientes/crear";
	private static final String REDIRECT_LISTADO = "redirect:clientes";
	
	
}
