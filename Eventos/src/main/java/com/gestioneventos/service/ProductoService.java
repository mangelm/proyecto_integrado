package com.gestioneventos.service;

import java.util.List;

import com.gestioneventos.model.Producto;

public interface ProductoService {
	Producto crearProducto(Producto producto);
	List<Producto> obtenerTodosLosProductos();
	Producto obtenerProductoPorId(Long id);
	Producto actualizarProducto(Long id, Producto producto);
	void eliminarProducto(Long id);
}
