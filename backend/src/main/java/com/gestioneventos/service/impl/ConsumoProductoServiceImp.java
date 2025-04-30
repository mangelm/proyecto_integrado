package com.gestioneventos.service.impl;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.gestioneventos.exception.RecursoNoEncontradoException;
import com.gestioneventos.exception.ValidacionException;
import com.gestioneventos.model.ConsumoProducto;
import com.gestioneventos.model.dto.ConsumoPromedioDTO;
import com.gestioneventos.model.dto.ProductoConsumoDTO;
import com.gestioneventos.model.dto.ProductoConsumoPorHorarioDTO;
import com.gestioneventos.model.dto.ProductoConsumoPorHorarioFechaDTO;
import com.gestioneventos.model.dto.ProductoConsumoPorPersonasDTO;
import com.gestioneventos.model.dto.ProductoConsumoPorPersonasFechaDTO;
import com.gestioneventos.model.enumeration.Horario;
import com.gestioneventos.repository.ConsumoProductoRepository;
import com.gestioneventos.service.ConsumoProductoService;

@Service
public class ConsumoProductoServiceImp implements ConsumoProductoService {

    private static final Logger logger = LoggerFactory.getLogger(ConsumoProductoServiceImp.class);

    @Autowired
    private ConsumoProductoRepository consumoProductoRepository;

    @Override
    public List<ConsumoProducto> obtenerTodosLosConsumos() {
        logger.info("Obteniendo todos los consumos de productos");
        return consumoProductoRepository.findAll();
    }

    @Override
    public List<ProductoConsumoDTO> obtenerConsumoPorProductoFecha(LocalDate fechaInicio, LocalDate fechaFinal) {
        logger.info("Obteniendo consumo por producto entre {} y {}", fechaInicio, fechaFinal);
        
        // Validaciones
        if (fechaInicio == null || fechaFinal == null) {
            throw new ValidacionException("Las fechas de inicio y fin son obligatorias");
        }
        
        if (fechaInicio.isAfter(fechaFinal)) {
            throw new ValidacionException("La fecha de inicio no puede ser posterior a la fecha final");
        }
        
        List<Object[]> resultados = consumoProductoRepository.obtenerConsumoPorProductoFecha(fechaInicio, fechaFinal);
        
        if (resultados.isEmpty()) {
            logger.warn("No se encontraron consumos para el rango de fechas especificado");
        }
        
        return resultados.stream()
            .map(obj -> new ProductoConsumoDTO(
                (String) obj[0],              // Nombre del producto
                ((Number) obj[1]).intValue()  // Total consumido
            ))
            .collect(Collectors.toList());
    }

    @Override
    public List<ProductoConsumoPorHorarioFechaDTO> obtenerConsumoPorProductoYHorarioFecha(LocalDate fechaInicio, LocalDate fechaFinal) {
        logger.info("Obteniendo consumo por producto y horario entre {} y {}", fechaInicio, fechaFinal);
        
        // Validaciones
        if (fechaInicio == null || fechaFinal == null) {
            throw new ValidacionException("Las fechas de inicio y fin son obligatorias");
        }
        
        if (fechaInicio.isAfter(fechaFinal)) {
            throw new ValidacionException("La fecha de inicio no puede ser posterior a la fecha final");
        }
        
        try {
            List<Object[]> resultados = consumoProductoRepository.obtenerConsumoPorProductoYHorarioFecha(fechaInicio, fechaFinal);

            if (resultados.isEmpty()) {
                logger.warn("No se encontraron resultados para el rango de fechas: {} - {}", fechaInicio, fechaFinal);
            }

            return resultados.stream()
                    .map(obj -> new ProductoConsumoPorHorarioFechaDTO(
                            (String) obj[0],                  // Nombre del producto
                            ((Horario) obj[1]).name(),       // Horario
                            ((Number) obj[2]).longValue()    // Total consumido
                    ))
                    .collect(Collectors.toList());
        } catch (Exception e) {
            logger.error("Error al obtener consumos por producto y horario: {}", e.getMessage(), e);
            throw new RuntimeException("Error interno en la consulta de consumo por horario", e);
        }
    }

    @Override
    public List<ProductoConsumoPorPersonasFechaDTO> obtenerProductosMasConsumidosPorPersonasFecha(LocalDate fechaInicio, LocalDate fechaFinal) {
        logger.info("Obteniendo productos más consumidos por personas entre {} y {}", fechaInicio, fechaFinal);
        
        // Validaciones
        if (fechaInicio == null || fechaFinal == null) {
            throw new ValidacionException("Las fechas de inicio y fin son obligatorias");
        }
        
        if (fechaInicio.isAfter(fechaFinal)) {
            throw new ValidacionException("La fecha de inicio no puede ser posterior a la fecha final");
        }
        
        List<Object[]> resultados = consumoProductoRepository.obtenerProductosMasConsumidosPorPersonasFecha(fechaInicio, fechaFinal);
        
        if (resultados.isEmpty()) {
            logger.warn("No se encontraron productos consumidos para el rango de fechas especificado");
        }

        return resultados.stream()
                .map(obj -> new ProductoConsumoPorPersonasFechaDTO(
                        (String) obj[0],                  // Nombre del producto
                        ((Number) obj[1]).intValue(),     // Cantidad de personas
                        ((Number) obj[2]).intValue()      // Total consumido
                ))
                .collect(Collectors.toList());
    }

    @Override
    public List<ConsumoPromedioDTO> obtenerConsumoPromedioPorPersonaFecha(LocalDate fechaInicio, LocalDate fechaFinal) {
        logger.info("Obteniendo consumo promedio por persona entre {} y {}", fechaInicio, fechaFinal);
        
        // Validaciones
        if (fechaInicio == null || fechaFinal == null) {
            throw new ValidacionException("Las fechas de inicio y fin son obligatorias");
        }
        
        if (fechaInicio.isAfter(fechaFinal)) {
            throw new ValidacionException("La fecha de inicio no puede ser posterior a la fecha final");
        }
        
        List<Object[]> resultados = consumoProductoRepository.obtenerConsumoPromedioPorPersona(fechaInicio, fechaFinal);
        
        if (resultados.isEmpty()) {
            logger.warn("No se encontraron consumos promedio para el rango de fechas especificado");
        }

        return resultados.stream()
                .map(obj -> new ConsumoPromedioDTO(
                        (String) obj[0],                  // Nombre del producto
                        ((Number) obj[1]).intValue(),     // Cantidad de personas
                        ((Number) obj[2]).doubleValue()   // Consumo promedio
                ))
                .collect(Collectors.toList());
    }
    
    @Override
    public List<ProductoConsumoDTO> obtenerConsumoPorProductoPorEvento(Long eventoId) {
        logger.info("Obteniendo consumo por producto para el evento: {}", eventoId);
        
        if (eventoId == null) {
            throw new ValidacionException("El ID del evento es obligatorio");
        }
        
        List<Object[]> resultados = consumoProductoRepository.sumarCantidadPorProductoPorEvento(eventoId);
        
        if (resultados.isEmpty()) {
            logger.warn("No se encontraron consumos para el evento: {}", eventoId);
        }
        
        return resultados.stream()
                .map(resultado -> new ProductoConsumoDTO(
                        (String) resultado[0], // Nombre del producto
                        ((Number) resultado[1]).intValue() // Total consumido
                ))
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductoConsumoPorHorarioDTO> obtenerConsumoPorProductoYHorarioPorEvento(Long eventoId) {
        logger.info("Obteniendo consumo por producto y horario para el evento: {}", eventoId);
        
        if (eventoId == null) {
            throw new ValidacionException("El ID del evento es obligatorio");
        }
        
        List<Object[]> resultados = consumoProductoRepository.sumarCantidadPorProductoPorHorarioPorEvento(eventoId);
        
        if (resultados.isEmpty()) {
            logger.warn("No se encontraron consumos por horario para el evento: {}", eventoId);
        }
        
        return resultados.stream()
                .map(resultado -> {
                    String nombreProducto = (String) resultado[0];
                    java.time.LocalTime horaEvento = ((java.time.LocalTime) resultado[1]);
                    int totalConsumido = ((Number) resultado[2]).intValue();
                    Horario horario;

                    if (horaEvento != null) {
                        int hora = horaEvento.getHour();
                        if (hora >= 6 && hora <= 12) {
                            horario = Horario.MAÑANA;
                        } else if (hora > 12 && hora <= 18) {
                            horario = Horario.TARDE;
                        } else {
                            horario = Horario.NOCHE;
                        }
                        return new ProductoConsumoPorHorarioDTO(nombreProducto, horario.name(), totalConsumido);
                    } else {
                        logger.warn("Hora nula encontrada para el producto: {}", nombreProducto);
                        return null;
                    }
                })
                .filter(dto -> dto != null)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<ProductoConsumoPorPersonasDTO> obtenerCantidadPersonasPorProductoPorEvento(Long eventoId) {
        logger.info("Obteniendo cantidad de personas por producto para el evento: {}", eventoId);
        
        if (eventoId == null) {
            throw new ValidacionException("El ID del evento es obligatorio");
        }
        
        List<Object[]> resultados = consumoProductoRepository.contarPersonasPorProductoPorEvento(eventoId);
        
        if (resultados.isEmpty()) {
            logger.warn("No se encontraron datos de personas por producto para el evento: {}", eventoId);
        }
        
        return resultados.stream()
                .map(resultado -> new ProductoConsumoPorPersonasDTO(
                        (String) resultado[0], // Nombre del producto
                        ((Number) resultado[1]).intValue(), // Cantidad de personas
                        0 // Valor por defecto para totalConsumido
                ))
                .collect(Collectors.toList());
    }

    @Override
    public List<ConsumoPromedioDTO> obtenerConsumoPromedioPorPersonaPorEvento(Long eventoId) {
        logger.info("Obteniendo consumo promedio por persona para el evento: {}", eventoId);
        
        if (eventoId == null) {
            throw new ValidacionException("El ID del evento es obligatorio");
        }
        
        List<Object[]> resultados = consumoProductoRepository.calcularPromedioConsumoPorProductoPorEvento(eventoId);
        
        if (resultados.isEmpty()) {
            logger.warn("No se encontraron consumos promedio para el evento: {}", eventoId);
        }
        
        return resultados.stream()
                .map(resultado -> new ConsumoPromedioDTO(
                        (String) resultado[0], // Nombre del producto
                        0, // Valor por defecto para cantidad de personas
                        ((Number) resultado[1]).doubleValue() // Consumo promedio por persona
                ))
                .collect(Collectors.toList());
    }
}