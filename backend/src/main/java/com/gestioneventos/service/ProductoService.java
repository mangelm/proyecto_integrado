package com.gestioneventos.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.gestioneventos.model.Producto;

// Esta interfaz define los métodos que se implementarán en la clase de servicio para manejar la lógica de negocio relacionada con la entidad Producto.
// La implementación de esta interfaz se encargará de interactuar con el repositorio de Producto y realizar operaciones CRUD.
public interface ProductoService {
	// Métodos para manejar la lógica de negocio relacionada con la entidad Producto.
	// Estos métodos se implementarán en la clase de servicio correspondiente.
	Producto crearProducto(Producto producto);
	List<Producto> obtenerTodosLosProductos();
	Producto obtenerProductoPorId(Long id);
	Producto actualizarProducto(Long id, Producto producto);
	void eliminarProducto(Long id);
	Page<Producto> obtenerTodosLosProductos(Pageable pageable);
}
