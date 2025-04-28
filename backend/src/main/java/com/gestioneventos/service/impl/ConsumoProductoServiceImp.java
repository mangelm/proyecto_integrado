package com.gestioneventos.service.impl;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class ConsumoProductoServiceImp implements ConsumoProductoService {

    @Autowired
    private ConsumoProductoRepository consumoProductoRepository;

    // Declaración del Logger a nivel de clase
    private static final Logger logger = LoggerFactory.getLogger(ConsumoProductoServiceImp.class);

    @Override
    public List<ConsumoProducto> obtenerTodosLosConsumos() {
        return consumoProductoRepository.findAll();
    }

    @Override
    public List<ProductoConsumoDTO> obtenerConsumoPorProductoFecha(LocalDate fechaInicio, LocalDate fechaFinal) {
        List<Object[]> resultados = consumoProductoRepository.obtenerConsumoPorProductoFecha(fechaInicio, fechaFinal);
        
        return resultados.stream()
            .map(obj -> new ProductoConsumoDTO(
                (String) obj[0],              // Nombre del producto
                ((Number) obj[1]).intValue()// Total consumido (asegurando conversión correcta)
            ))
            .collect(Collectors.toList());
    }

    @Override
    public List<ProductoConsumoPorHorarioFechaDTO> obtenerConsumoPorProductoYHorarioFecha(LocalDate fechaInicio, LocalDate fechaFinal) {
        try {
            List<Object[]> resultados = consumoProductoRepository.obtenerConsumoPorProductoYHorarioFecha(fechaInicio, fechaFinal);

            // Log de resultados obtenidos
            logger.info("Resultados obtenidos por producto y horario: {}", resultados.size());

            // Verificación de si los resultados están vacíos
            if (resultados.isEmpty()) {
                logger.warn("No se encontraron resultados para el rango de fechas: {} - {}", fechaInicio, fechaFinal);
            }

            return resultados.stream()
                    .map(obj -> new ProductoConsumoPorHorarioFechaDTO(
                            (String) obj[0],                  // Nombre del producto
                            ((Horario) obj[1]).name(),      // Utilizar name() para obtener el valor String del enum
                            ((Number) obj[2]).longValue()   // Total consumido
                    ))
                    .collect(Collectors.toList());
        } catch (Exception e) {
            logger.error("Error al obtener consumos por producto y horario: {}", e.getMessage());
            throw new RuntimeException("Error interno en la consulta de consumo por horario", e);
        }
    }

    @Override
    public List<ProductoConsumoPorPersonasFechaDTO> obtenerProductosMasConsumidosPorPersonasFecha(LocalDate fechaInicio, LocalDate fechaFinal) {
        // Llamamos al repositorio para obtener los resultados de la consulta
        List<Object[]> resultados = consumoProductoRepository.obtenerProductosMasConsumidosPorPersonasFecha(fechaInicio, fechaFinal);

        // Mapeamos los resultados a DTOs
        return resultados.stream()
                .map(obj -> new ProductoConsumoPorPersonasFechaDTO(
                        (String) obj[0],                  // Nombre del producto
                        ((Number) obj[1]).intValue(),      // Cantidad de personas
                        ((Number) obj[2]).intValue()       // Total consumido
                ))
                .collect(Collectors.toList());
    }

    @Override
    public List<ConsumoPromedioDTO> obtenerConsumoPromedioPorPersonaFecha(LocalDate fechaInicio, LocalDate fechaFinal) {
        List<Object[]> resultados = consumoProductoRepository.obtenerConsumoPromedioPorPersona(fechaInicio, fechaFinal);

        return resultados.stream()
                .map(obj -> new ConsumoPromedioDTO(
                        (String) obj[0],                  // Nombre del producto
                        ((Number) obj[1]).intValue(),      // Cantidad de personas
                        ((Number) obj[2]).doubleValue()   // Consumo promedio
                ))
                .collect(Collectors.toList());
    }
    
    
    @Override
    public List<ProductoConsumoDTO> obtenerConsumoPorProductoPorEvento(Long eventoId) {
        List<Object[]> resultados = consumoProductoRepository.sumarCantidadPorProductoPorEvento(eventoId);
        return resultados.stream()
                .map(resultado -> new ProductoConsumoDTO(
                        (String) resultado[0], // Nombre del producto
                        ((Number) resultado[1]).intValue() // Total consumido
                ))
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductoConsumoPorHorarioDTO> obtenerConsumoPorProductoYHorarioPorEvento(Long eventoId) {
        List<Object[]> resultados = consumoProductoRepository.sumarCantidadPorProductoPorHorarioPorEvento(eventoId);
        return resultados.stream()
                .map(resultado -> {
                    String nombreProducto = (String) resultado[0];
                    java.time.LocalTime horaEvento = ((java.time.LocalTime) resultado[1]); // Correcto: es LocalTime
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
                        return null; // O manejar de otra manera si la hora es nula
                    }
                })
                .filter(dto -> dto != null) // Filtra los casos donde la hora del evento es nula
                .collect(Collectors.toList());
    }
    
    
    @Override
    public List<ProductoConsumoPorPersonasDTO> obtenerCantidadPersonasPorProductoPorEvento(Long eventoId) {
        List<Object[]> resultados = consumoProductoRepository.contarPersonasPorProductoPorEvento(eventoId);
        return resultados.stream()
                .map(resultado -> new ProductoConsumoPorPersonasDTO(
                        (String) resultado[0], // Nombre del producto
                        ((Number) resultado[1]).intValue(), // Cantidad de personas
                        0 // O null si tu DTO permite valores nulos para totalConsumido, o algún valor por defecto lógico.
                ))
                .collect(Collectors.toList());
    }

    @Override
    public List<ConsumoPromedioDTO> obtenerConsumoPromedioPorPersonaPorEvento(Long eventoId) {
        List<Object[]> resultados = consumoProductoRepository.calcularPromedioConsumoPorProductoPorEvento(eventoId);
        return resultados.stream()
                .map(resultado -> new ConsumoPromedioDTO(
                        (String) resultado[0], // Nombre del producto
                        0, // O algún otro valor por defecto lógico si la consulta no devuelve la cantidad de personas directamente.
                        ((Number) resultado[1]).doubleValue() // Consumo promedio por persona
                ))
                .collect(Collectors.toList());
    }
}