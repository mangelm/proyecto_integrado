package com.gestioneventos.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.gestioneventos.model.Producto;

//Interfaz creada para que siempre se cumpla la misma estructura en cuanto a funciones y parametros
public interface ProductoService {
	//Metodos para implementar
	Producto crearProducto(Producto producto);
	List<Producto> obtenerTodosLosProductos();
	Producto obtenerProductoPorId(Long id);
	Producto actualizarProducto(Long id, Producto producto);
	void eliminarProducto(Long id);
	Page<Producto> obtenerTodosLosProductos(Pageable pageable);
}
