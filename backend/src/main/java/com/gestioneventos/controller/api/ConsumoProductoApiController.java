package com.gestioneventos.controller.api;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gestioneventos.model.ConsumoProducto;
import com.gestioneventos.service.ConsumoProductoService;

@RestController
@RequestMapping("/api/consumos")
public class ConsumoProductoApiController {
	
	@Autowired
	private ConsumoProductoService consumoProductoService;

	//LLamada a metodo para obtener todos los clientes con paginacion
    @GetMapping
    public ResponseEntity<List<ConsumoProducto>> listarConsumos() {
        
        List<ConsumoProducto> consumos = consumoProductoService.obtenerTodosLosConsumos();
        
        return ResponseEntity.ok(consumos);
    }

	
}
