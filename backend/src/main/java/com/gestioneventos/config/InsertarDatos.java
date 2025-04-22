package com.gestioneventos.config;

import java.math.BigDecimal;
import java.sql.Date;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Locale;
import java.util.Random;
import java.util.concurrent.TimeUnit; // Necesario para fechas futuras

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.gestioneventos.repository.ClienteRepository;
import com.gestioneventos.repository.ConsumoProductoRepository;
import com.gestioneventos.repository.EventoRepository;
import com.gestioneventos.repository.ProductoRepository;
import com.gestioneventos.model.Cliente;
import com.gestioneventos.model.ConsumoProducto;
import com.gestioneventos.model.Evento;
import com.gestioneventos.model.Producto;
import com.gestioneventos.model.enumeration.Categoria;
import com.gestioneventos.model.enumeration.Estado;
import com.gestioneventos.model.enumeration.Horario;
import com.github.javafaker.Faker;

@Component
public class InsertarDatos implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(InsertarDatos.class);

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private EventoRepository eventoRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private ConsumoProductoRepository consumoProductoRepository;

    private final Faker faker = new Faker(Locale.forLanguageTag("es"));
    private final Random random = new Random();

    @Override
    @Transactional
    public void run(String... args) {
        try {
            logger.info("🔄 Iniciando la carga de datos...");

            // --- Crear clientes ---
            List<Cliente> clientes = new ArrayList<>();
            for (int i = 0; i < 20; i++) {
                Cliente cliente = new Cliente();
                cliente.setNombre(faker.name().firstName());
                cliente.setApellido(faker.name().lastName());
                cliente.setEmail(faker.internet().emailAddress());
                cliente.setTelefono(generarTelefonoFormato());
                clientes.add(cliente);
            }
            clienteRepository.saveAll(clientes);
            clienteRepository.flush();
            logger.info("✅ Clientes creados y guardados ({}).", clientes.size());

            // --- Crear productos ---
            List<Producto> productos = new ArrayList<>();
            for (int i = 0; i < 15; i++) {
                Producto producto = new Producto();
                producto.setNombre(faker.commerce().productName());
                producto.setDescripcion(faker.lorem().sentence());
                producto.setPrecio(BigDecimal.valueOf(faker.number().randomDouble(2, 5, 100)));
                producto.setImpuesto(BigDecimal.valueOf(faker.number().randomDouble(2, 1, 20)));
                producto.setDisponible(faker.bool().bool());
                producto.setCategoria(Categoria.values()[random.nextInt(Categoria.values().length)]);
                productos.add(producto);
            }
            productoRepository.saveAll(productos);
            productoRepository.flush();
            logger.info("✅ Productos creados y guardados ({}).", productos.size());

            // --- Crear eventos ---
            List<Evento> eventos = new ArrayList<>();
            List<Cliente> clientesPersistidos = clienteRepository.findAll();
            List<Producto> productosPersistidos = productoRepository.findAll();

            if (clientesPersistidos.isEmpty()) {
                 logger.warn("⚠️ No hay clientes persistidos para asignar a eventos.");
                 return;
            }

            for (Cliente cliente : clientesPersistidos) {
                int numEventosPorCliente = faker.number().numberBetween(1, 3);
                for (int j = 0; j < numEventosPorCliente; j++) {
                    Evento evento = new Evento();
                    String nombreEvento = faker.book().title();
                    evento.setNombre(ajustarLongitud(nombreEvento, 3, 100));
                    java.util.Date fechaFuturaUtil = faker.date().future(60, 1, TimeUnit.DAYS);
                    evento.setFecha(new Date(fechaFuturaUtil.getTime()));
                    evento.setCantidadPersonas(faker.number().numberBetween(10, 200));
                    String espacioEvento = faker.address().streetAddress();
                    evento.setEspacio(ajustarLongitud(espacioEvento, 1, 200));
                    evento.setHora(LocalTime.of(faker.number().numberBetween(8, 23), 0));
                    evento.setHorario(Horario.values()[random.nextInt(Horario.values().length)]);
                    evento.setEstado(Estado.values()[random.nextInt(Estado.values().length)]);
                    evento.setCliente(cliente);
                    evento.setConsumos(new ArrayList<>());
                    eventos.add(evento);
                }
            }
            eventoRepository.saveAll(eventos);
            eventoRepository.flush();
            logger.info("✅ Eventos creados y guardados ({}).", eventos.size());

            // --- Crear consumos de productos en eventos ---
            List<ConsumoProducto> consumos = new ArrayList<>();
             List<Evento> eventosPersistidos = eventoRepository.findAll();

             if (eventosPersistidos.isEmpty() || productosPersistidos.isEmpty()) {
                  logger.warn("⚠️ No hay eventos o productos persistidos para crear consumos.");
             } else {
                 for (Evento evento : eventosPersistidos) {
                     Collections.shuffle(productosPersistidos);
                     int numProductosAAnadir = faker.number().numberBetween(0, Math.min(6, productosPersistidos.size()));
                     for (int k = 0; k < numProductosAAnadir; k++) {
                         Producto productoSeleccionado = productosPersistidos.get(k);
                         ConsumoProducto consumo = new ConsumoProducto();
                         consumo.setEvento(evento);
                         consumo.setProducto(productoSeleccionado);
                         consumo.setCantidad(faker.number().numberBetween(1, 10));
                         consumo.setPrecioUnitario(productoSeleccionado.getPrecio());
                         consumo.setImpuesto(productoSeleccionado.getImpuesto());
                         consumos.add(consumo);
                     }
                 }
                 consumoProductoRepository.saveAll(consumos);
                 consumoProductoRepository.flush();
                 logger.info("✅ Consumos de productos creados y guardados ({}).", consumos.size());
            }

            logger.info("🎉 Inicialización de datos completada con éxito.");
        } catch (Exception e) {
            logger.error("❌ Error durante la inicialización de datos: {}", e.getMessage(), e);
        }
    }

    private String generarTelefonoFormato() {
        return String.format("%03d-%03d-%03d",
                random.nextInt(1000),
                random.nextInt(1000),
                random.nextInt(1000));
    }

    private String ajustarLongitud(String texto, int minLen, int maxLen) {
        if (texto == null) {
            texto = String.join("", Collections.nCopies(minLen, "x"));
        }

        if (texto.length() < minLen) {
            return texto + String.join("", Collections.nCopies(minLen - texto.length(), " "));
        } else if (texto.length() > maxLen) {
            return texto.substring(0, maxLen);
        } else {
            return texto;
        }
    }
}