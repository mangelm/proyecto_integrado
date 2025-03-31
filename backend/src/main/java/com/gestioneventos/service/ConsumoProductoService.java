package com.gestioneventos.service;

import java.time.LocalDate;
import java.util.List;

import com.gestioneventos.model.ConsumoProducto;
import com.gestioneventos.model.dto.ConsumoPromedioDTO;
import com.gestioneventos.model.dto.ProductoConsumoDTO;
import com.gestioneventos.model.dto.ProductoConsumoPorHorarioDTO;
import com.gestioneventos.model.dto.ProductoConsumoPorPersonasDTO;

public interface ConsumoProductoService {
    List<ConsumoProducto> obtenerTodosLosConsumos();
    
    List<ProductoConsumoDTO> obtenerConsumoPorProducto(LocalDate inicio, LocalDate fin);
    
    List<ProductoConsumoPorHorarioDTO> obtenerConsumoPorProductoYHorario(LocalDate fechaInicio, LocalDate fechaFinal);
    
    List<ProductoConsumoPorPersonasDTO> obtenerProductosMasConsumidosPorPersonas(LocalDate fechaInicio, LocalDate fechaFinal);
    
    List<ConsumoPromedioDTO> obtenerConsumoPromedioPorPersona(LocalDate fechaInicio, LocalDate fechaFinal);
}
