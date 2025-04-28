package com.gestioneventos.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.gestioneventos.model.Evento;
import com.gestioneventos.model.dto.AgregarProductosDTO;
import com.gestioneventos.model.dto.ProductoCantidadDTO;

// Esta interfaz define los métodos que se implementarán en la clase de servicio para manejar la lógica de negocio relacionada con la entidad Evento.
// La implementación de esta interfaz se encargará de interactuar con el repositorio de Evento y realizar operaciones CRUD.
public interface EventoService {
	//Metodos para implementar
	Evento crearEvento(Evento evento);
	List<Evento> obtenerTodosLosEventos(); // Metodo sin paginacion
	Evento obtenerEventoPorId(Long id);
	Evento actualizarEvento(Long id, Evento evento);
	void eliminarEvento(Long id);
	Page<Evento> obtenerTodosLosEventos(Pageable pageable); // Metodo con paginacion
	Evento agregarProducto(Long eventoId, AgregarProductosDTO productoId);
	List<ProductoCantidadDTO> obtenerProductosConCantidadPorEvento(Long eventoId);
}
