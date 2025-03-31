package com.gestioneventos.controller.api;

import java.sql.Date;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.gestioneventos.model.dto.ConsumoPromedioDTO;
import com.gestioneventos.model.dto.EstadisticaOcupacionDTO;
import com.gestioneventos.model.dto.ProductoConsumoDTO;
import com.gestioneventos.model.dto.ProductoConsumoPorHorarioDTO;
import com.gestioneventos.model.dto.ProductoConsumoPorPersonasDTO;
import com.gestioneventos.model.enumeration.Horario;
import com.gestioneventos.repository.EventoRepository;
import com.gestioneventos.service.ConsumoProductoService;

@RestController
@RequestMapping("/api/estadisticas")
public class EstadisticaApiController {

    private static final Logger logger = LoggerFactory.getLogger(EstadisticaApiController.class);

    @Autowired
    private EventoRepository eventoRepository;
    
    @Autowired
    private ConsumoProductoService consumoProductoService;

    @GetMapping("/ocupacion")
    public ResponseEntity<?> obtenerEstadisticas(@RequestParam String fechaInicio, @RequestParam String fechaFinal) {
        try {
            // Validación de las fechas
            LocalDate inicio = LocalDate.parse(fechaInicio);
            LocalDate fin = LocalDate.parse(fechaFinal);

            // Verificar que la fecha de inicio no sea posterior a la fecha final
            if (inicio.isAfter(fin)) {
                return ResponseEntity.badRequest().body("La fecha de inicio no puede ser posterior a la fecha final.");
            }

            logger.info("Consultando ocupación entre {} y {}", inicio, fin);

            // Consulta a la base de datos
            List<Object[]> resultados = eventoRepository.countEventosPorEspacioYHorario(inicio, fin);
            logger.info("Resultados obtenidos: {}", resultados.size());

            // Convertir los resultados a DTO, incluyendo la fecha
            List<EstadisticaOcupacionDTO> estadisticas = resultados.stream()
                .map(resultado -> {
                    // Convertir el objeto Date que recibes de la consulta en la fecha
                    Date fecha = (Date) resultado[3];  // Asumiendo que la fecha está en la cuarta posición
                    return new EstadisticaOcupacionDTO(
                        (String) resultado[0], 
                        ((Horario) resultado[1]).name(),  // Convertir el Enum a String
                        ((Long) resultado[2]).intValue(),
                        fecha
                    );
                })
                .collect(Collectors.toList());

            // Devolver la respuesta con los datos
            return ResponseEntity.ok(estadisticas);
        } catch (DateTimeParseException e) {
            logger.error("Formato de fecha inválido: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Formato de fecha inválido. Usa YYYY-MM-DD.");
        } catch (Exception e) {
            logger.error("Error al obtener estadísticas: {}", e.getMessage());
            return ResponseEntity.internalServerError().body("Error interno en el servidor.");
        }
    }
    
    @GetMapping("/productos")
    public ResponseEntity<?> obtenerConsumoPorProducto(@RequestParam String fechaInicio, @RequestParam String fechaFinal) {
        try {
            LocalDate inicio = LocalDate.parse(fechaInicio);
            LocalDate fin = LocalDate.parse(fechaFinal);

            if (inicio.isAfter(fin)) {
                return ResponseEntity.badRequest().body("La fecha de inicio no puede ser posterior a la fecha final.");
            }

            logger.info("Consultando consumo de productos entre {} y {}", inicio, fin);
            List<ProductoConsumoDTO> productos = consumoProductoService.obtenerConsumoPorProducto(inicio, fin);

            return ResponseEntity.ok(productos);
        } catch (DateTimeParseException e) {
            logger.error("Formato de fecha inválido: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Formato de fecha inválido. Usa YYYY-MM-DD.");
        } catch (Exception e) {
            logger.error("Error al obtener estadísticas de productos: {}", e.getMessage());
            return ResponseEntity.internalServerError().body("Error interno en el servidor.");
        }
    }
    
    @GetMapping("/productos-horario")
    public ResponseEntity<?> obtenerConsumoPorProductoYHorario(@RequestParam String fechaInicio, @RequestParam String fechaFinal) {
        try {
            // Validación de fechas
            LocalDate inicio = LocalDate.parse(fechaInicio);
            LocalDate fin = LocalDate.parse(fechaFinal);

            // Comprobación extra de las fechas
            logger.info("Fechas recibidas: inicio = {}, fin = {}", inicio, fin);

            if (inicio.isAfter(fin)) {
                return ResponseEntity.badRequest().body("La fecha de inicio no puede ser posterior a la fecha final.");
            }

            // Llamada al servicio
            List<ProductoConsumoPorHorarioDTO> productos = consumoProductoService.obtenerConsumoPorProductoYHorario(inicio, fin);

            // Comprobación de los resultados antes de enviarlos al frontend
            logger.info("Cantidad de productos por horario obtenidos: {}", productos.size());

            return ResponseEntity.ok(productos);
        } catch (DateTimeParseException e) {
            logger.error("Formato de fecha inválido: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Formato de fecha inválido. Usa YYYY-MM-DD.");
        } catch (Exception e) {
            logger.error("Error al obtener consumos por producto y horario: {}", e.getMessage());
            return ResponseEntity.internalServerError().body("Error interno en el servidor.");
        }
    }
    
    @GetMapping("/productos-personas")
    public ResponseEntity<?> obtenerProductosMasConsumidosPorPersonas(@RequestParam String fechaInicio, @RequestParam String fechaFinal) {
        try {
            // Convertimos las fechas recibidas en LocalDate
            LocalDate inicio = LocalDate.parse(fechaInicio);
            LocalDate fin = LocalDate.parse(fechaFinal);

            // Validamos que la fecha de inicio no sea posterior a la fecha final
            if (inicio.isAfter(fin)) {
                return ResponseEntity.badRequest().body("La fecha de inicio no puede ser posterior a la fecha final.");
            }

            logger.info("Consultando productos más consumidos por personas entre {} y {}", inicio, fin);

            // Llamada al servicio para obtener los productos más consumidos por personas
            List<ProductoConsumoPorPersonasDTO> productos = consumoProductoService.obtenerProductosMasConsumidosPorPersonas(inicio, fin);

            // Devolvemos la lista de productos consumidos por personas
            return ResponseEntity.ok(productos);
        } catch (DateTimeParseException e) {
            logger.error("Formato de fecha inválido: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Formato de fecha inválido. Usa YYYY-MM-DD.");
        } catch (Exception e) {
            logger.error("Error al obtener productos más consumidos por personas: {}", e.getMessage());
            return ResponseEntity.internalServerError().body("Error interno en el servidor.");
        }
    }

    @GetMapping("/productos-promedio-personas")
    public ResponseEntity<?> obtenerConsumoPromedioPorPersona(@RequestParam String fechaInicio, @RequestParam String fechaFinal) {
        try {
            LocalDate inicio = LocalDate.parse(fechaInicio);
            LocalDate fin = LocalDate.parse(fechaFinal);

            if (inicio.isAfter(fin)) {
                return ResponseEntity.badRequest().body("La fecha de inicio no puede ser posterior a la fecha final.");
            }

            logger.info("Consultando consumo promedio por persona entre {} y {}", inicio, fin);

            List<ConsumoPromedioDTO> productos = consumoProductoService.obtenerConsumoPromedioPorPersona(inicio, fin);

            return ResponseEntity.ok(productos);
        } catch (DateTimeParseException e) {
            logger.error("Formato de fecha inválido: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Formato de fecha inválido. Usa YYYY-MM-DD.");
        } catch (Exception e) {
            logger.error("Error al obtener consumo promedio por persona: {}", e.getMessage());
            return ResponseEntity.internalServerError().body("Error interno en el servidor.");
        }
    }

}
