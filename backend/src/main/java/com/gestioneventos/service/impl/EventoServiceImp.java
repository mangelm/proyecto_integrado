package com.gestioneventos.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.gestioneventos.model.Evento;
import com.gestioneventos.repository.EventoRepository;
import com.gestioneventos.service.EventoService;
import com.gestioneventos.exception.RecursoNoEncontradoException;

//Implementación de los metodos de EventoService
@Service
public class EventoServiceImp implements EventoService {

    @Autowired
    private EventoRepository eventoRepository;
    
    //Metodo para crear un evento
    @Override
    public Evento crearEvento(Evento evento) {
        return eventoRepository.save(evento);
    }
    
    //Metodo para obtener todos los eventos
    @Override
    public List<Evento> obtenerTodosLosEventos() {
        return eventoRepository.findAll();
    }
    
    //Metodo para obtener un evento por su id
    @Override
    public Evento obtenerEventoPorId(Long id) {
        return eventoRepository.findById(id)
            .orElseThrow(() -> new RecursoNoEncontradoException("Evento no encontrado con ID: " + id));
    }
    
    //Metodo para actualizar un evento concreto
    @Override
    public Evento actualizarEvento(Long id, Evento eventoDetalles) {
        Evento eventoExistente = obtenerEventoPorId(id);
        eventoExistente.setNombre(eventoDetalles.getNombre());
        eventoExistente.setFecha(eventoDetalles.getFecha());
        eventoExistente.setCantidadPersonas(eventoDetalles.getCantidadPersonas());
        eventoExistente.setEspacio(eventoDetalles.getEspacio());
        eventoExistente.setHorario(eventoDetalles.getHorario());
        eventoExistente.setEstado(eventoDetalles.getEstado());

        return eventoRepository.save(eventoExistente);
    }
    
    //Metodo para eliminar un producto por su id
    @Override
    public void eliminarEvento(Long id) {
        Evento evento = obtenerEventoPorId(id);
        eventoRepository.delete(evento);
    }
    
    //Metodo para implementar la paginacion en los eventos
    @Override
    public Page<Evento> obtenerTodosLosEventos(Pageable pageable) {
        return eventoRepository.findAll(pageable);
    }
}
