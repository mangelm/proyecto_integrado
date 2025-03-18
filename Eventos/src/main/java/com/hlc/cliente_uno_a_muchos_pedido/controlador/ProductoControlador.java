package com.hlc.cliente_uno_a_muchos_pedido.controlador;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import com.hlc.cliente_uno_a_muchos_pedido.entidad.Producto;
import com.hlc.cliente_uno_a_muchos_pedido.servicio.ProductoServicio;

import jakarta.validation.Valid;
import java.util.List;

@Controller
@RequestMapping("/productos")
public class ProductoControlador {

    private static final String VISTA_FORMULARIO = "productos/formulario";
    private static final String REDIRECT_LISTADO = "redirect:/productos";
    private static final String VISTA_LISTA = "productos/lista";
    private static final String VISTA_DETALLE = "productos/detalle";
    private static final String LISTA_CATEGORIAS = "categorias/lista";

    @Autowired
    private ProductoServicio productoServicio;
    
    @GetMapping
    public String listarProductos(Model model) {
        List<Producto> productos = productoServicio.obtenerTodosLosProductos();
        model.addAttribute("productos", productos);
        return VISTA_LISTA;
    }
    
    @GetMapping("{id}")
    public String mostrarProducto(@PathVariable Long id, Model model) {
        Producto producto = productoServicio.obtenerProductoPorId(id);
        if (producto == null) {
            return REDIRECT_LISTADO;
        }
        model.addAttribute("producto", producto);
        return VISTA_DETALLE;
    }

    @GetMapping("/nuevo")
    public String mostrarFormularioNuevoProducto(Model model) {
        model.addAttribute("producto", new Producto());
        
        return VISTA_FORMULARIO;
    }
    
    @GetMapping("/categoria")    
    public String mostrarListadoCategorias(Model model, @RequestParam(value = "nombre", required = false) String nombre_categoria ) {        
    	if (nombre_categoria != null && !nombre_categoria.isBlank()) {            
    		System.out.println(nombre_categoria);            
    		// Buscar productos por nombre de categoría            
    		List<Producto> productos = productoServicio.buscarPorNombreCategoria(nombre_categoria);            
    		model.addAttribute("productos", productos);            
    		return LISTA_CATEGORIAS;        
    	} else {            
    		// Si no hay nombre de categoría especificado, se redirige al listado          
    		return REDIRECT_LISTADO;           
    	} 
    }

    @PostMapping("/guardar")
    public String guardarProducto(@Valid @ModelAttribute Producto producto, BindingResult bindingResult, Model model) {
        if (bindingResult.hasErrors()) {
            model.addAttribute("producto", producto);
            return VISTA_FORMULARIO;
        }
        productoServicio.guardarProducto(producto);
        return REDIRECT_LISTADO;
    }

    @GetMapping("/editar/{id}")
    public String mostrarFormularioEditarProducto(@PathVariable Long id, Model model) {
        Producto producto = productoServicio.obtenerProductoPorId(id);
        model.addAttribute("producto", producto);
        return VISTA_FORMULARIO;
    }

    @GetMapping("/eliminar/{id}")
    public String eliminarProducto(@PathVariable Long id) {
        productoServicio.eliminarProducto(id);
        return REDIRECT_LISTADO;
    }
}
