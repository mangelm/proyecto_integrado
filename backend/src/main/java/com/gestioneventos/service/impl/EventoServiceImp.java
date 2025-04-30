package com.gestioneventos.service.impl;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
import com.gestioneventos.exception.ConflictoRecursoException;
import com.gestioneventos.exception.ValidacionException;

//Implementación de los metodos de EventoService
@Service
public class EventoServiceImp implements EventoService {

    private static final Logger logger = LoggerFactory.getLogger(EventoServiceImp.class);

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
        logger.info("Intentando crear evento: {}", evento.getNombre());
        
        if (evento.getNombre() == null || evento.getNombre().trim().isEmpty()) {
            throw new ValidacionException("El nombre del evento no puede estar vacío");
        }
        
        if (evento.getFecha() == null) {
            throw new ValidacionException("La fecha del evento es obligatoria");
        }
        
        long eventosExistentes = eventoRepository.countEventosExistentes(
            evento.getFecha().toLocalDate(), 
            evento.getHorario(), 
            evento.getEspacio()
        );
        
        if (eventosExistentes > 0) {
            throw new ConflictoRecursoException("El espacio está ocupado en la fecha y horario seleccionados");
        }
        
        return eventoRepository.save(evento);
    }
    
    //Metodo para obtener todos los eventos
    @Override
    public List<Evento> obtenerTodosLosEventos() {
        logger.info("Obteniendo todos los eventos");
        return eventoRepository.findAll();
    }
    
    //Metodo para obtener un evento por su id
    @Override
    public Evento obtenerEventoPorId(Long id) {
        logger.info("Buscando evento con ID: {}", id);
        return eventoRepository.findById(id)
            .orElseThrow(() -> new RecursoNoEncontradoException("Evento no encontrado con ID: " + id));
    }
    
    //Metodo para actualizar un evento concreto
    @Override
    public Evento actualizarEvento(Long id, Evento evento) {
        logger.info("Actualizando evento con ID: {}", id);
        
        if (evento.getNombre() == null || evento.getNombre().trim().isEmpty()) {
            throw new ValidacionException("El nombre del evento no puede estar vacío");
        }
        
        Evento eventoExistente = eventoRepository.findById(id)
            .orElseThrow(() -> new RecursoNoEncontradoException("Evento no encontrado con ID: " + id));

        if (evento.getId() != id) {
            long count = eventoRepository.countEventosExistentesMismoId(
                evento.getFecha().toLocalDate(), 
                evento.getHorario(), 
                evento.getEspacio(), 
                id
            );
            if (count > 0) {
                throw new ConflictoRecursoException("El espacio está ocupado en la misma fecha y horario");
            }
        }

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
        logger.info("Eliminando evento con ID: {}", id);
        Evento evento = obtenerEventoPorId(id);
        eventoRepository.delete(evento);
    }
    
    //Metodo para implementar la paginacion en los eventos
    @Override
    public Page<Evento> obtenerTodosLosEventos(Pageable pageable) {
        logger.info("Obteniendo eventos paginados");
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
