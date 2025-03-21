package com.gestioneventos.controller.web;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.gestioneventos.model.Producto;
import com.gestioneventos.repository.ProductoRepository;

@Controller
@RequestMapping("/productos")
public class ProductoWebController {
	
	private ProductoRepository productoRepository;
	private static final String VISTA_LISTA = "productos/listar";
	private static final String VISTA_CREAR = "productos/crear";
	private static final String REDIRECT_LISTADO = "redirect:productos";
	
	public ProductoWebController(ProductoRepository productoRepository) {
        this.productoRepository = productoRepository;
    }

    @GetMapping
    public String listarProductos(Model model) {
        model.addAttribute("productos", productoRepository.findAll());
        return VISTA_LISTA;
    }

    @GetMapping("/crear")
    public String mostrarFormularioCreacion(Model model) {
        model.addAttribute("producto", new Producto());
        return VISTA_CREAR;
    }

    @PostMapping("/guardar")
    public String guardarProducto(@ModelAttribute Producto producto) {
        productoRepository.save(producto);
        return REDIRECT_LISTADO;
    }

    @GetMapping("/eliminar/{id}")
    public String eliminarProducto(@PathVariable Long id) {
        productoRepository.deleteById(id);
        return REDIRECT_LISTADO;
    }
}
