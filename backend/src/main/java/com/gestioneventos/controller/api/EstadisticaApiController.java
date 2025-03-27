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

import com.gestioneventos.model.dto.EstadisticaOcupacionDTO;
import com.gestioneventos.model.enumeration.Horario;
import com.gestioneventos.repository.EventoRepository;

@RestController
@RequestMapping("/api/estadisticas")
public class EstadisticaApiController {

    private static final Logger logger = LoggerFactory.getLogger(EstadisticaApiController.class);

    @Autowired
    private EventoRepository eventoRepository;

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
}
