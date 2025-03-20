package com.gestioneventos.controller.web;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import com.gestioneventos.model.Evento;
import com.gestioneventos.service.EventoService;

@Controller
@RequestMapping("/eventos")
public class EventoWebController {
	
	@Autowired
	private EventoService eventoService;
	
	private static final String VISTA_LISTA = "eventos/listar";
	private static final String VISTA_CREAR = "eventos/crear";
	private static final String REDIRECT_LISTADO = "redirect:eventos";
	
	@GetMapping
    public String listarEventos(Model model) {
        List<Evento> eventos = eventoService.obtenerTodosLosEventos();
        model.addAttribute("eventos", eventos);
        return VISTA_LISTA;
    }
	
	@GetMapping("/crear")
    public String mostrarFormularioCreacion(Model model) {
        model.addAttribute("evento", new Evento());
        return VISTA_CREAR;
    }
	
	
	@PostMapping("/guardar")
    public String guardarEvento(@ModelAttribute Evento evento) {
        eventoService.crearEvento(evento);
        return REDIRECT_LISTADO;
    }
	
	@GetMapping("/eliminar/{id}")
    public String eliminarEvento(@PathVariable Long id) {
        eventoService.eliminarEvento(id);
        return REDIRECT_LISTADO;
    }
	
}
