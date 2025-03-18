package com.hlc.cliente_uno_a_muchos_pedido.controlador;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.hlc.cliente_uno_a_muchos_pedido.servicio.ProductoServicio;

@Controller
public class HomeControlador {

	@Autowired
	private ProductoServicio productoServicio;
	private static final String VISTA_HOME = "public/home";
	
	
    @GetMapping("/home")
    public String mostrarHome(Model model) {
    
        model.addAttribute("titulo", "Bienvenido a la Gestión de Pedidos");
        model.addAttribute("categorias", productoServicio.obtenerTodasLasCategorias());
        return VISTA_HOME; // Renderiza templates/public/home.html
    }
}