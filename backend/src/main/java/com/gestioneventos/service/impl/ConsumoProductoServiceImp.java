package com.gestioneventos.service.impl;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.gestioneventos.model.ConsumoProducto;
import com.gestioneventos.model.dto.ProductoConsumoDTO;
import com.gestioneventos.model.dto.ProductoConsumoPorHorarioDTO;
import com.gestioneventos.model.dto.ProductoConsumoPorPersonasDTO;
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
    public List<ProductoConsumoDTO> obtenerConsumoPorProducto(LocalDate fechaInicio, LocalDate fechaFinal) {
        List<Object[]> resultados = consumoProductoRepository.obtenerConsumoPorProducto(fechaInicio, fechaFinal);
        
        return resultados.stream()
            .map(obj -> new ProductoConsumoDTO(
                (String) obj[0],              // Nombre del producto
                ((Number) obj[1]).longValue() // Total consumido (asegurando conversión correcta)
            ))
            .collect(Collectors.toList());
    }

    @Override
    public List<ProductoConsumoPorHorarioDTO> obtenerConsumoPorProductoYHorario(LocalDate fechaInicio, LocalDate fechaFinal) {
        try {
            List<Object[]> resultados = consumoProductoRepository.obtenerConsumoPorProductoYHorario(fechaInicio, fechaFinal);

            // Log de resultados obtenidos
            logger.info("Resultados obtenidos por producto y horario: {}", resultados.size());

            // Verificación de si los resultados están vacíos
            if (resultados.isEmpty()) {
                logger.warn("No se encontraron resultados para el rango de fechas: {} - {}", fechaInicio, fechaFinal);
            }

            return resultados.stream()
                .map(obj -> new ProductoConsumoPorHorarioDTO(
                    (String) obj[0],                // Nombre del producto
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
    public List<ProductoConsumoPorPersonasDTO> obtenerProductosMasConsumidosPorPersonas(LocalDate fechaInicio, LocalDate fechaFinal) {
        // Llamamos al repositorio para obtener los resultados de la consulta
        List<Object[]> resultados = consumoProductoRepository.obtenerProductosMasConsumidosPorPersonas(fechaInicio, fechaFinal);
        
        // Mapeamos los resultados a DTOs
        return resultados.stream()
            .map(obj -> new ProductoConsumoPorPersonasDTO(
                (String) obj[0],              // Nombre del producto
                ((Number) obj[1]).intValue(), // Cantidad de personas
                ((Number) obj[2]).intValue()  // Total consumido
            ))
            .collect(Collectors.toList());
    }



}
