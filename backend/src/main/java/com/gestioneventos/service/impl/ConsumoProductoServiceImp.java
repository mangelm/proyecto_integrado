package com.gestioneventos.service.impl;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.gestioneventos.model.ConsumoProducto;
import com.gestioneventos.model.dto.ProductoConsumoDTO;
import com.gestioneventos.model.dto.ProductoConsumoPorHorarioDTO;
import com.gestioneventos.repository.ConsumoProductoRepository;
import com.gestioneventos.service.ConsumoProductoService;

@Service
public class ConsumoProductoServiceImp implements ConsumoProductoService{
	
	@Autowired
	private ConsumoProductoRepository consumoProductoRepository;

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
	    List<Object[]> resultados = consumoProductoRepository.obtenerConsumoPorProductoYHorario(fechaInicio, fechaFinal);

	    return resultados.stream()
	        .map(obj -> new ProductoConsumoPorHorarioDTO(
	            (String) obj[0],                // Nombre del producto
	            (String) obj[1],                // Horario del evento
	            ((Number) obj[2]).longValue()   // Total consumido
	        ))
	        .collect(Collectors.toList());
	}

}
