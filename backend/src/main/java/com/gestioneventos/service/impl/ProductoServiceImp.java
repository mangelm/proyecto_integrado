package com.gestioneventos.service.impl;

import java.util.List;
import java.math.BigDecimal;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gestioneventos.exception.RecursoNoEncontradoException;
import com.gestioneventos.exception.ValidacionException;
import com.gestioneventos.exception.ConflictoRecursoException;
import com.gestioneventos.model.Producto;
import com.gestioneventos.repository.ConsumoProductoRepository;
import com.gestioneventos.repository.ProductoRepository;
import com.gestioneventos.service.ProductoService;

//Implementación de los metodos de ProductoService
@Service
public class ProductoServiceImp implements ProductoService {
	
	private static final Logger logger = LoggerFactory.getLogger(ProductoServiceImp.class);
	
	@Autowired
	private ProductoRepository productoRepository;
	
	@Autowired
	private ConsumoProductoRepository consumoProductoRepository;
	
	//Metodo para crear un producto
	@Override
	public Producto crearProducto(Producto producto) {
		logger.info("Intentando crear producto: {}", producto.getNombre());
		
		// Validaciones
		if (producto.getNombre() == null || producto.getNombre().trim().isEmpty()) {
			throw new ValidacionException("El nombre del producto no puede estar vacío");
		}
		
		if (producto.getPrecio() == null || producto.getPrecio().compareTo(BigDecimal.ZERO) <= 0) {
			throw new ValidacionException("El precio del producto debe ser mayor que 0");
		}
		
		// Verificar si el producto ya existe
		if (productoRepository.existsByNombre(producto.getNombre())) {
			throw new ConflictoRecursoException("Ya existe un producto con el nombre: " + producto.getNombre());
		}
		
		return productoRepository.save(producto);
	}
	
	//Metodo para obtener todos los productos
	@Override
	public List<Producto> obtenerTodosLosProductos() {
		logger.info("Obteniendo todos los productos");
		return productoRepository.findAll();
	}
	
	//Metodo para obtener un producto por su id
	@Override
	public Producto obtenerProductoPorId(Long id) {
		logger.info("Buscando producto con ID: {}", id);
		return productoRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Producto no encontrado con ID: " + id));
	}
	
	//Metodo para actualizar un producto concreto
	 @Override
	    public Producto actualizarProducto(Long id, Producto producto) {
	        logger.info("Actualizando producto con ID: {}", id);
	        
	        // Validaciones
	        if (producto.getNombre() == null || producto.getNombre().trim().isEmpty()) {
	            throw new ValidacionException("El nombre del producto no puede estar vacío");
	        }
	        
	        if (producto.getPrecio() == null || producto.getPrecio().compareTo(BigDecimal.ZERO) <= 0) {
	            throw new ValidacionException("El precio del producto debe ser mayor que 0");
	        }
	        
	        Producto existente = obtenerProductoPorId(id);
	        
	        // Verificar si el nombre ya existe para otro producto
	        if (!existente.getNombre().equals(producto.getNombre()) && 
	        	productoRepository.existsByNombre(producto.getNombre())) {
	            throw new ConflictoRecursoException("Ya existe un producto con el nombre: " + producto.getNombre());
	        }

	        // Actualización de campos
	        existente.setNombre(producto.getNombre());
	        existente.setPrecio(producto.getPrecio());
	        existente.setDescripcion(producto.getDescripcion());
	        existente.setCategoria(producto.getCategoria());

	        return productoRepository.save(existente);
	    }
	
	//Metodo para eliminar un producto por su id
	 @Override
	 @Transactional
	 public void eliminarProducto(Long id) {
	     logger.info("Eliminando producto con ID: {}", id);
	     Producto producto = obtenerProductoPorId(id);
	     
	     // Verificar si el producto está siendo usado en algún consumo
	     if (consumoProductoRepository.existsByProducto(producto)) {
	         throw new ConflictoRecursoException("No se puede eliminar el producto porque está siendo utilizado en eventos");
	     }
	     
	     productoRepository.delete(producto);
	 }
	
	//Metodo para implementar la paginacion en los productos
	@Override
	public Page<Producto> obtenerTodosLosProductos(Pageable pageable) {
		logger.info("Obteniendo productos paginados");
		return productoRepository.findAll(pageable);
	}
	

}
