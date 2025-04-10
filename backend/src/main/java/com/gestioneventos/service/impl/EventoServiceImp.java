package com.gestioneventos.service.impl;

import java.util.List;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.gestioneventos.model.ConsumoProducto;
import com.gestioneventos.model.Evento;
import com.gestioneventos.model.Producto;
import com.gestioneventos.model.dto.AgregarProductosDTO;
import com.gestioneventos.model.dto.ProductoCantidadDTO;
import com.gestioneventos.repository.ConsumoProductoRepository;
import com.gestioneventos.repository.EventoRepository;
import com.gestioneventos.repository.ProductoRepository;
import com.gestioneventos.service.EventoService;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import com.gestioneventos.exception.RecursoNoEncontradoException;

//Implementación de los metodos de EventoService
@Service
public class EventoServiceImp implements EventoService {

    @Autowired
    private EventoRepository eventoRepository;
    
    @Autowired
    private ProductoRepository productoRepository;
    
    @Autowired
    private ConsumoProductoRepository consumoProductoRepository;
    
    @PersistenceContext
    private EntityManager entityManager; 
    
    //Metodo para crear un evento
    @Override
    public Evento crearEvento(Evento evento) {
    	 // Verificar si existe un evento con la misma fecha, horario y espacio
        long eventosExistentes = eventoRepository.countEventosExistentes(evento.getFecha().toLocalDate(), evento.getHorario(), evento.getEspacio());
    	
        if (eventosExistentes > 0) {
            throw new IllegalArgumentException("Horario ocupado, escoge otro horario.");
        }
        
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
    public Evento actualizarEvento(Long id, Evento evento) {
        // Primero, obtenemos el evento a actualizar
        Evento eventoExistente = eventoRepository.findById(id)
            .orElseThrow(() -> new RecursoNoEncontradoException("Evento no encontrado"));

        // Verificamos si el espacio está ocupado en la misma fecha y horario, excepto si es el mismo evento
        if (evento.getId() != id) {
            long count = eventoRepository.countEventosExistentesMismoId(evento.getFecha().toLocalDate(), evento.getHorario(), evento.getEspacio(), id);
            if (count > 0) {
                throw new IllegalArgumentException("El espacio está ocupado en la misma fecha y horario.");
            }
        }

        // Procedemos a actualizar el evento
        eventoExistente.setNombre(evento.getNombre());
        eventoExistente.setFecha(evento.getFecha());
        eventoExistente.setCantidadPersonas(evento.getCantidadPersonas());
        eventoExistente.setEspacio(evento.getEspacio());
        eventoExistente.setHorario(evento.getHorario());
        eventoExistente.setHora(evento.getHora());
        eventoExistente.setEstado(evento.getEstado());

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
    
    
    //Metodo para agregar productos a un evento
	@Override
	public Evento agregarProducto(Long eventoId, AgregarProductosDTO productoId) {
		Evento evento = eventoRepository.findById(eventoId)
                .orElseThrow(() -> new RuntimeException("Evento no encontrado"));

        Producto producto = productoRepository.findById(productoId.getProductoId())
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        ConsumoProducto consumo = new ConsumoProducto();
        consumo.setEvento(evento);
        consumo.setProducto(producto);
        consumo.setCantidad(productoId.getCantidad());
        consumo.setPrecioUnitario(productoId.getPrecioUnitario());
        consumo.setImpuesto(productoId.getImpuesto());

        consumoProductoRepository.save(consumo);

        evento.getConsumos().add(consumo); // Esto actualiza la relación en memoria
        return eventoRepository.save(evento); // Guarda el evento actualizado
		
	}

	@Override
	 public List<ProductoCantidadDTO> obtenerProductosConCantidadPorEvento(Long eventoId) {
        if (!eventoRepository.existsById(eventoId)) {
            throw new RecursoNoEncontradoException("Evento no encontrado con ID: " + eventoId);
        }
        return eventoRepository.findProductosConCantidadPorEventoId(eventoId);
    }
}
