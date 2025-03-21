package com.gestioneventos.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.gestioneventos.model.ConsumoProducto;
import com.gestioneventos.repository.ConsumoProductoRepository;
import com.gestioneventos.service.ConsumoProductoService;

@Service
public class ConsumoProductoServiceImp implements ConsumoProductoService{
	
	@Autowired
	private ConsumoProductoRepository consumoProductoRepository;
	
	@Override
	public List<ConsumoProducto> listarConsumos() {
		return consumoProductoRepository.findAll();
	}

	@Override
	public ConsumoProducto crearConsumo(ConsumoProducto consumo) {
		return consumoProductoRepository.save(consumo);
	}
	
}
