package com.gestioneventos.config;

import java.math.BigDecimal;
import java.sql.Date;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Locale;
import java.util.Random;


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

    private final Faker faker = new Faker(new Locale("es"));
    private final Random random = new Random();

    @Override
    @Transactional
    public void run(String... args) {
        try {
            logger.info("🔄 Iniciando la carga de datos...");

            // Crear clientes
            List<Cliente> clientes = new ArrayList<>();
            for (int i = 0; i < 20; i++) {
                Cliente cliente = new Cliente();
                cliente.setNombre(faker.name().firstName());
                cliente.setApellido(faker.name().lastName());
                cliente.setEmail(faker.internet().emailAddress());
                cliente.setTelefono(faker.phoneNumber().cellPhone());
                clientes.add(cliente);
            }
            clienteRepository.saveAll(clientes);
            clienteRepository.flush();
            logger.info("✅ Clientes creados y guardados en la base de datos.");

            // Crear productos
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
            logger.info("✅ Productos creados y guardados en la base de datos.");

            // Crear eventos
            List<Evento> eventos = new ArrayList<>();
            for (Cliente cliente : clientes) {
                for (int j = 0; j < 2; j++) {
                    Evento evento = new Evento();
                    evento.setNombre(faker.company().name());
                    evento.setFecha(Date.valueOf(LocalDate.now().plusDays(random.nextInt(30))));
                    evento.setCantidadPersonas(faker.number().numberBetween(10, 200));
                    evento.setEspacio(faker.address().city());
                    evento.setHorario(Horario.values()[random.nextInt(Horario.values().length)]);
                    evento.setEstado(Estado.values()[random.nextInt(Estado.values().length)]);
                    evento.setCliente(cliente);
                    eventos.add(evento);
                }
            }
            eventoRepository.saveAll(eventos);
            eventoRepository.flush();
            logger.info("✅ Eventos creados y guardados en la base de datos.");

            // Crear consumos de productos en eventos
            List<ConsumoProducto> consumos = new ArrayList<>();
            for (Evento evento : eventos) {
                Collections.shuffle(productos);
                int numProductos = faker.number().numberBetween(1, 5);
                for (int k = 0; k < numProductos; k++) {
                    ConsumoProducto consumo = new ConsumoProducto();
                    consumo.setEvento(evento);
                    consumo.setProducto(productos.get(k));
                    consumo.setCantidad(faker.number().numberBetween(1, 10));
                    consumo.setPrecioUnitario(productos.get(k).getPrecio());
                    consumo.setImpuesto(productos.get(k).getImpuesto());
                    consumos.add(consumo);
                }
            }
            consumoProductoRepository.saveAll(consumos);
            consumoProductoRepository.flush();
            logger.info("✅ Consumos de productos creados y guardados en la base de datos.");

            logger.info("🎉 Inicialización de datos completada con éxito.");
        } catch (Exception e) {
            logger.error("❌ Error durante la inicialización de datos: {}", e.getMessage());
            e.printStackTrace();
        }
    }
}
