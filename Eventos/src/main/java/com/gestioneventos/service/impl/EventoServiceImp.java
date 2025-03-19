package com.gestioneventos.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.gestioneventos.model.Evento;
import com.gestioneventos.repository.EventoRepository;
import com.gestioneventos.service.EventoService;
import com.gestioneventos.exception.*;

@Service
public class EventoServiceImp implements EventoService {
	
	private EventoRepository eventoRepository;
	
	@Override
	public Evento crearEvento(Evento evento) {
		return eventoRepository.save(evento);
	}

	@Override
	public List<Evento> obtenerTodosLosEventos() {
		return eventoRepository.findAll();
	}
	
	@Override
	public Evento obtenerEventoPorId(Long id) {
		 return eventoRepository.findById(id)
	                .orElseThrow(() -> new RecursoNoEncontradoException("Evento no encontrado con ID: " + id));
	}

	@Override
	public Evento actualizarEvento(Long id, Evento evento) {
		Evento existente = obtenerEventoPorId(id);
		existente.setNombre(evento.getNombre());
		return eventoRepository.save(existente);
	}

	@Override
	public void eliminarEvento(Long id) {
		Evento evento = obtenerEventoPorId(id);
		eventoRepository.delete(evento);
	}

}
