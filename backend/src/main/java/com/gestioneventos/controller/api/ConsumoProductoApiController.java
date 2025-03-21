package com.gestioneventos.controller.api;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.gestioneventos.model.ConsumoProducto;
import com.gestioneventos.service.ConsumoProductoService;

public class ConsumoProductoApiController {
	
	@Autowired
	private ConsumoProductoService consumoProductoService;

	@GetMapping
    public ResponseEntity<List<ConsumoProducto>> listarConsumos() {
        return ResponseEntity.ok(consumoProductoService.listarConsumos());
    }

	@PostMapping
    public ResponseEntity<ConsumoProducto> crearConsumo(@RequestBody ConsumoProducto consumo) {
        return ResponseEntity.ok(consumoProductoService.crearConsumo(consumo));
    }
}
