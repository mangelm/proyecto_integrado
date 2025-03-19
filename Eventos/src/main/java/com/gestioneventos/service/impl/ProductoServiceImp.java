package com.gestioneventos.service.impl;

import java.util.List;

import com.gestioneventos.exception.RecursoNoEncontradoException;
import com.gestioneventos.model.Producto;
import com.gestioneventos.repository.ProductoRepository;
import com.gestioneventos.service.ProductoService;

public class ProductoServiceImp implements ProductoService {
	
	private ProductoRepository productoRepository;
	
	@Override
	public Producto crearProducto(Producto producto) {
		return productoRepository.save(producto);
	}

	@Override
	public List<Producto> obtenerTodosLosProductos() {
		return productoRepository.findAll();
	}

	@Override
	public Producto obtenerProductoPorId(Long id) {
		return productoRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Producto no encontrado con ID: " + id));
	}

	@Override
	public Producto actualizarProducto(Long id, Producto producto) {
		 Producto existente = obtenerProductoPorId(id);
		 existente.setNombre(producto.getNombre());
		 return productoRepository.save(existente);
	}

	@Override
	public void eliminarProducto(Long id) {
		Producto producto = obtenerProductoPorId(id);
		productoRepository.delete(producto);
	}

}
