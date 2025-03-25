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
import com.gestioneventos.model.Producto;
import com.gestioneventos.service.ProductoService;

@RestController
@RequestMapping("/api/productos")
public class ProductoApiController {
	
	@Autowired
    private ProductoService productoService;

	//LLamada a metodo para obtener todos los productos con paginacion
    @GetMapping
    public ResponseEntity<Page<Producto>> listarProductos(
        @RequestParam(defaultValue = "0") int page, 
        @RequestParam(defaultValue = "20") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<Producto> productos = productoService.obtenerTodosLosProductos(pageable);
        
        return ResponseEntity.ok(productos);
    }

    //LLamada a metodo crearProducto
    @PostMapping
    public ResponseEntity<Producto> crearProducto(@RequestBody Producto producto) {
        System.out.println("Recibiendo solicitud POST para crear un producto: " + producto);
        return ResponseEntity.ok(productoService.crearProducto(producto));
    }
    
    //LLamada a metodo para obtener el producto por Id
    @GetMapping("/{id}")
    public ResponseEntity<Producto> obtenerProducto(@PathVariable Long id) {
        try {
            Producto producto = productoService.obtenerProductoPorId(id);
            return ResponseEntity.ok(producto);
        } catch (RecursoNoEncontradoException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    
    //LLamada a metodo actualizarProducto
    @PutMapping("/{id}")
    public ResponseEntity<Producto> actualizarProducto(@PathVariable Long id, @RequestBody Producto producto) {
        System.out.println("Solicitud PUT recibida para ID: " + id);
        System.out.println("Datos recibidos: " + producto);
        
        Producto productoActualizado = productoService.actualizarProducto(id, producto);
        return ResponseEntity.ok(productoActualizado);
    }

    //LLamada a metodo eliminarProducto
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarProducto(@PathVariable Long id) {
        try {
            productoService.eliminarProducto(id);
            return ResponseEntity.noContent().build();
        } catch (RecursoNoEncontradoException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
