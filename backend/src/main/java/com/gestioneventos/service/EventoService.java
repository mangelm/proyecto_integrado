package com.gestioneventos.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.gestioneventos.model.Evento;



//Interfaz creada para que siempre se cumpla la misma estructura en cuanto a funciones y parametros
public interface EventoService {
	//Metodos para implementar
	Evento crearEvento(Evento evento);
	List<Evento> obtenerTodosLosEventos(); // Metodo sin paginacion
	Evento obtenerEventoPorId(Long id);
	Evento actualizarEvento(Long id, Evento evento);
	void eliminarEvento(Long id);
	Page<Evento> obtenerTodosLosEventos(Pageable pageable); // Metodo con paginacion
}
