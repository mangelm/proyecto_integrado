package com.gestioneventos.service;

import java.util.List;

import com.gestioneventos.model.Evento;

public interface EventoService {
	Evento crearEvento(Evento evento);
	List<Evento> obtenerTodosLosEventos();
	Evento obtenerEventoPorId(Long id);
	Evento actualizarEvento(Long id, Evento evento);
	void eliminarEvento(Long id);
}
