package com.gestioneventos.service;

import java.util.List;

import com.gestioneventos.model.ConsumoProducto;

public interface ConsumoProductoService {
	List<ConsumoProducto> listarConsumos();
	ConsumoProducto crearConsumo(ConsumoProducto consumo);
}
