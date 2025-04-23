package com.gestioneventos.service;

import java.time.LocalDate;
import java.util.List;

import com.gestioneventos.model.ConsumoProducto;
import com.gestioneventos.model.dto.ConsumoPromedioDTO;
import com.gestioneventos.model.dto.ConsumoPromedioFechaDTO;
import com.gestioneventos.model.dto.ProductoConsumoDTO;
import com.gestioneventos.model.dto.ProductoConsumoPorHorarioDTO;
import com.gestioneventos.model.dto.ProductoConsumoPorHorarioFechaDTO;
import com.gestioneventos.model.dto.ProductoConsumoPorPersonasDTO;
import com.gestioneventos.model.dto.ProductoConsumoPorPersonasFechaDTO;

public interface ConsumoProductoService {
    List<ConsumoProducto> obtenerTodosLosConsumos();
    
    List<ProductoConsumoDTO> obtenerConsumoPorProductoFecha(LocalDate fechaInicio, LocalDate fechaFinal);
    
    List<ProductoConsumoPorHorarioFechaDTO> obtenerConsumoPorProductoYHorarioFecha(LocalDate fechaInicio, LocalDate fechaFinal);
    
    List<ProductoConsumoPorPersonasFechaDTO> obtenerProductosMasConsumidosPorPersonasFecha(LocalDate fechaInicio, LocalDate fechaFinal);
    
    List<ConsumoPromedioFechaDTO> obtenerConsumoPromedioPorPersonaFecha(LocalDate fechaInicio, LocalDate fechaFinal);
    
    List<ProductoConsumoDTO> obtenerConsumoPorProductoPorEvento(Long eventoId);
    
    List<ProductoConsumoPorHorarioDTO> obtenerConsumoPorProductoYHorarioPorEvento(Long eventoId);
    
    List<ProductoConsumoPorPersonasDTO> obtenerCantidadPersonasPorProductoPorEvento(Long eventoId);
    
    List<ConsumoPromedioDTO> obtenerConsumoPromedioPorPersonaPorEvento(Long eventoId);
}
