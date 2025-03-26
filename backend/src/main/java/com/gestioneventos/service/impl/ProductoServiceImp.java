package com.gestioneventos.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import com.gestioneventos.exception.RecursoNoEncontradoException;
import com.gestioneventos.model.Producto;
import com.gestioneventos.repository.ConsumoProductoRepository;
import com.gestioneventos.repository.ProductoRepository;
import com.gestioneventos.service.ProductoService;

//Implementación de los metodos de ProductoService
@Service
public class ProductoServiceImp implements ProductoService {
	
	@Autowired
	private ProductoRepository productoRepository;
	
	@Autowired
	private ConsumoProductoRepository consumoProductoRepository;
	
	//Metodo para crear un producto
	@Override
	public Producto crearProducto(Producto producto) {
		return productoRepository.save(producto);
	}
	
	//Metodo para obtener todos los productos
	@Override
	public List<Producto> obtenerTodosLosProductos() {
		return productoRepository.findAll();
	}
	
	//Metodo para obtener un producto por su id
	@Override
	public Producto obtenerProductoPorId(Long id) {
		return productoRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Producto no encontrado con ID: " + id));
	}
	
	//Metodo para actualizar un producto concreto
	 @Override
	    public Producto actualizarProducto(Long id, Producto productoDetalles) {
	        Producto productoExistente = obtenerProductoPorId(id);
	        productoExistente.setNombre(productoDetalles.getNombre());
	        productoExistente.setDescripcion(productoDetalles.getDescripcion());
	        productoExistente.setPrecio(productoDetalles.getPrecio());
	        productoExistente.setImpuesto(productoDetalles.getImpuesto());
	        productoExistente.setDisponible(productoDetalles.getDisponible());
	        productoExistente.setCategoria(productoDetalles.getCategoria());

	        return productoRepository.save(productoExistente);
	    }
	
	//Metodo para eliminar un producto por su id
	 @Transactional
	 public void eliminarProducto(Long productoId) {
	     consumoProductoRepository.deleteByProductoId(productoId);
	     productoRepository.deleteById(productoId);
	 }
	
	//Metodo para implementar la paginacion en los productos
	@Override
	public Page<Producto> obtenerTodosLosProductos(Pageable pageable) {
		return productoRepository.findAll(pageable);
	}
	

}
