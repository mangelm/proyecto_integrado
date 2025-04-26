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
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.gestioneventos.model.dto.ConsumoPromedioDTO;
import com.gestioneventos.model.dto.ConsumoPromedioFechaDTO;
import com.gestioneventos.model.dto.EstadisticaOcupacionDTO;
import com.gestioneventos.model.dto.ProductoConsumoDTO;
import com.gestioneventos.model.dto.ProductoConsumoPorHorarioDTO;
import com.gestioneventos.model.dto.ProductoConsumoPorHorarioFechaDTO;
import com.gestioneventos.model.dto.ProductoConsumoPorPersonasDTO;
import com.gestioneventos.model.dto.ProductoConsumoPorPersonasFechaDTO;
import com.gestioneventos.model.enumeration.Horario;
import com.gestioneventos.repository.EventoRepository;
import com.gestioneventos.service.ConsumoProductoService;

@RestController
@RequestMapping("/api/estadisticas")
public class EstadisticaApiController {

    // Logger para registrar información y errores
    // Se utiliza SLF4J para la abstracción de logging, lo que permite cambiar la implementación de logging sin modificar el código
    private static final Logger logger = LoggerFactory.getLogger(EstadisticaApiController.class);

    // Inyección de dependencias para el repositorio de eventos y el servicio de consumo de productos
    // Esto permite acceder a la base de datos y realizar operaciones CRUD sobre los eventos y productos consumidos
    @Autowired
    private EventoRepository eventoRepository;
    
    // Servicio que maneja la lógica de negocio relacionada con el consumo de productos
    // Se encarga de interactuar con el repositorio y realizar cálculos o transformaciones necesarias
    // para obtener los datos requeridos por el controlador
    @Autowired
    private ConsumoProductoService consumoProductoService;
    
    // Endpoint para obtener estadísticas de ocupación entre dos fechas
    // Se espera que las fechas sean pasadas como parámetros en formato YYYY-MM-DD
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
            List<Object[]> resultados = eventoRepository.countEventosPorEspacioYHorarioEntreFechas(inicio, fin);
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
    
    // Endpoint para obtener estadísticas de ocupación por evento
    // Se espera que el ID del evento sea pasado como parámetro en la URL
    @GetMapping("/ocupacion/evento/{eventoId}")
    public ResponseEntity<?> obtenerEstadisticasPorEvento(@PathVariable Long eventoId) {
        logger.info("Consultando ocupación para el evento con ID: {}", eventoId);

        List<Object[]> resultados = eventoRepository.countEventosPorEspacioYHorarioPorEvento(eventoId);
        logger.info("Resultados obtenidos para el evento {}: {}", eventoId, resultados.size());

        List<EstadisticaOcupacionDTO> estadisticas = resultados.stream()
            .map(resultado -> new EstadisticaOcupacionDTO(
                (String) resultado[0],
                ((Horario) resultado[1]).name(),
                ((Long) resultado[2]).intValue(),
                ((java.sql.Date) resultado[3]) // Casting a java.sql.Date
            ))
            .collect(Collectors.toList());

        return ResponseEntity.ok(estadisticas);
    }
    
    // Endpoint para obtener estadísticas de consumo de productos entre dos fechas
    // Se espera que las fechas sean pasadas como parámetros en formato YYYY-MM-DD
    @GetMapping("/productos")
    public ResponseEntity<?> obtenerConsumoPorProductoFecha(@RequestParam String fechaInicio, @RequestParam String fechaFinal) {
        try {
            LocalDate inicio = LocalDate.parse(fechaInicio);
            LocalDate fin = LocalDate.parse(fechaFinal);

            if (inicio.isAfter(fin)) {
                return ResponseEntity.badRequest().body("La fecha de inicio no puede ser posterior a la fecha final.");
            }

            logger.info("Consultando consumo de productos entre {} y {}", inicio, fin);
            List<ProductoConsumoDTO> productos = consumoProductoService.obtenerConsumoPorProductoFecha(inicio, fin);

            return ResponseEntity.ok(productos);
        } catch (DateTimeParseException e) {
            logger.error("Formato de fecha inválido: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Formato de fecha inválido. Usa YYYY-MM-DD.");
        } catch (Exception e) {
            logger.error("Error al obtener estadísticas de productos: {}", e.getMessage());
            return ResponseEntity.internalServerError().body("Error interno en el servidor.");
        }
    }
    
    // Endpoint para obtener estadísticas de consumo de productos por horario entre dos fechas
    // Se espera que las fechas sean pasadas como parámetros en formato YYYY-MM-DD
    @GetMapping("/productos-horario")
    public ResponseEntity<?> obtenerConsumoPorProductoYHorarioFecha(@RequestParam String fechaInicio, @RequestParam String fechaFinal) {
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
            List<ProductoConsumoPorHorarioFechaDTO> productos = consumoProductoService.obtenerConsumoPorProductoYHorarioFecha(inicio, fin);

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
    
    // Endpoint para obtener estadísticas de productos más consumidos por personas entre dos fechas
    // Se espera que las fechas sean pasadas como parámetros en formato YYYY-MM-DD
    @GetMapping("/productos-personas")
    public ResponseEntity<?> obtenerProductosMasConsumidosPorPersonasFecha(@RequestParam String fechaInicio, @RequestParam String fechaFinal) {
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
            List<ProductoConsumoPorPersonasFechaDTO> productos = consumoProductoService.obtenerProductosMasConsumidosPorPersonasFecha(inicio, fin);

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

    // Endpoint para obtener estadísticas de consumo promedio por persona entre dos fechas
    // Se espera que las fechas sean pasadas como parámetros en formato YYYY-MM-DD
    @GetMapping("/productos-promedio-personas")
    public ResponseEntity<?> obtenerConsumoPromedioPorPersonaFecha(@RequestParam String fechaInicio, @RequestParam String fechaFinal) {
        try {
            LocalDate inicio = LocalDate.parse(fechaInicio);
            LocalDate fin = LocalDate.parse(fechaFinal);

            if (inicio.isAfter(fin)) {
                return ResponseEntity.badRequest().body("La fecha de inicio no puede ser posterior a la fecha final.");
            }

            logger.info("Consultando consumo promedio por persona entre {} y {}", inicio, fin);

            List<ConsumoPromedioFechaDTO> productos = consumoProductoService.obtenerConsumoPromedioPorPersonaFecha(inicio, fin);

            return ResponseEntity.ok(productos);
        } catch (DateTimeParseException e) {
            logger.error("Formato de fecha inválido: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Formato de fecha inválido. Usa YYYY-MM-DD.");
        } catch (Exception e) {
            logger.error("Error al obtener consumo promedio por persona: {}", e.getMessage());
            return ResponseEntity.internalServerError().body("Error interno en el servidor.");
        }
    }
    
    // Endpoints para obtener estadísticas de consumo por evento
    // Se espera que el ID del evento sea pasado como parámetro en la URL
    @GetMapping("/productos/evento/{eventoId}")
    public ResponseEntity<List<ProductoConsumoDTO>> obtenerConsumoPorProductoPorEvento(@PathVariable Long eventoId) {
        return ResponseEntity.ok(consumoProductoService.obtenerConsumoPorProductoPorEvento(eventoId));
    }

    // Endpoint para obtener estadísticas de consumo por producto y horario por evento
    // Se espera que el ID del evento sea pasado como parámetro en la URL
    @GetMapping("/productos-horario/evento/{eventoId}")
    public ResponseEntity<List<ProductoConsumoPorHorarioDTO>> obtenerConsumoPorProductoYHorarioPorEvento(@PathVariable Long eventoId) {
        return ResponseEntity.ok(consumoProductoService.obtenerConsumoPorProductoYHorarioPorEvento(eventoId));
    }

    // Endpoint para obtener estadísticas de productos más consumidos por personas por evento
    // Se espera que el ID del evento sea pasado como parámetro en la URL
    @GetMapping("/productos-personas/evento/{eventoId}")
    public ResponseEntity<List<ProductoConsumoPorPersonasDTO>> obtenerCantidadPersonasPorProductoPorEvento(@PathVariable Long eventoId) {
        return ResponseEntity.ok(consumoProductoService.obtenerCantidadPersonasPorProductoPorEvento(eventoId));
    }

    // Endpoint para obtener estadísticas de consumo promedio por persona por evento
    // Se espera que el ID del evento sea pasado como parámetro en la URL
    // Este endpoint devuelve una lista de objetos ConsumoPromedioDTO que contienen el ID del producto y el consumo promedio por persona
    @GetMapping("/productos-promedio-personas/evento/{eventoId}")
    public ResponseEntity<List<ConsumoPromedioDTO>> obtenerConsumoPromedioPorPersonaPorEvento(@PathVariable Long eventoId) {
        return ResponseEntity.ok(consumoProductoService.obtenerConsumoPromedioPorPersonaPorEvento(eventoId));
    }
}
