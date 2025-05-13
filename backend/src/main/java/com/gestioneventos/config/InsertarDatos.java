package com.gestioneventos.config;

import java.math.BigDecimal;
import java.sql.Date;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Random;
import java.util.Set;
import java.util.concurrent.TimeUnit; // Necesario para fechas futuras
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
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
import com.gestioneventos.model.enumeration.Rol;
import com.github.javafaker.Faker;

// Importante: Asegúrate de que la clase esté en el paquete correcto para que Spring la detecte como un componente.
@Component
// Esta anotación indica que esta clase es un componente de Spring y se debe registrar en el contexto de la aplicación.
// Esto permite que Spring la gestione y la inyecte donde sea necesario.
public class InsertarDatos implements CommandLineRunner {
    // Logger para registrar información y errores
    // Se utiliza para registrar mensajes de información, advertencia y error durante la ejecución de la aplicación.
    private static final Logger logger = LoggerFactory.getLogger(InsertarDatos.class);

    // Repositorios para interactuar con la base de datos
    // Estos repositorios son interfaces que extienden de Spring Data JPA y permiten realizar operaciones CRUD en las entidades correspondientes.
    
    // Repositorio para gestionar los clientes
    // Este repositorio permite realizar operaciones CRUD en la entidad Cliente.
    @Autowired
    private ClienteRepository clienteRepository;

    // Repositorio para gestionar los eventos
    // Este repositorio permite realizar operaciones CRUD en la entidad Evento.
    @Autowired
    private EventoRepository eventoRepository;

    // Repositorio para gestionar los productos
    // Este repositorio permite realizar operaciones CRUD en la entidad Producto.
    @Autowired
    private ProductoRepository productoRepository;

    // Repositorio para gestionar los consumos de productos en eventos
    // Este repositorio permite realizar operaciones CRUD en la entidad ConsumoProducto.
    @Autowired
    private ConsumoProductoRepository consumoProductoRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Faker para generar datos aleatorios
    // Se utiliza para generar datos ficticios como nombres, direcciones, correos electrónicos, etc.
    // Esto es útil para poblar la base de datos con datos de prueba durante el desarrollo o las pruebas.
    // Se establece la localización en español (es) para generar datos en español.
    private final Faker faker = new Faker(Locale.forLanguageTag("es"));
    private final Random random = new Random();

    // Método que se ejecuta al iniciar la aplicación
    // Este método se utiliza para cargar datos iniciales en la base de datos al iniciar la aplicación.
    // La anotación @Transactional indica que este método se ejecutará dentro de una transacción.
    // Si ocurre un error durante la ejecución, se revertirán todos los cambios realizados en la base de datos.
    @Override
    @Transactional
    // Este método se ejecuta al iniciar la aplicación y se utiliza para cargar datos iniciales en la base de datos
    public void run(String... args) {
        try {
            logger.info("🔄 Iniciando la carga de datos...");

            // Crear usuario administrador por defecto si no existe
            if (!clienteRepository.existsByEmail("admin@gestioneventos.com")) {
                Cliente admin = new Cliente();
                admin.setNombre("Administrador");
                admin.setApellido("Sistema");
                admin.setEmail("admin@gestioneventos.com");
                admin.setTelefono("123-456-789");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setRol(Rol.ADMIN);
                clienteRepository.save(admin);
                logger.info("✅ Usuario administrador creado.");
                Cliente staff = new Cliente();
                staff.setNombre("Encarna");
                staff.setApellido("Concepcion");
                staff.setEmail("concepcion.anguiano@hotmail.com");
                staff.setTelefono("123-456-789");
                staff.setPassword(passwordEncoder.encode("staff123"));
                staff.setRol(Rol.STAFF);
                clienteRepository.save(staff);
                logger.info("✅ Usuario staff creado.");
                Cliente cliente = new Cliente();
                cliente.setNombre("Lola");
                cliente.setApellido("Aranda");
                cliente.setEmail("lola.aranda@hotmail.com");
                cliente.setTelefono("123-456-789");
                cliente.setPassword(passwordEncoder.encode("cliente123"));
                cliente.setRol(Rol.CLIENTE);
                clienteRepository.save(cliente);
                logger.info("✅ Usuario cliente creado.");
            }

            // --- Crear clientes y staff ---
            List<Cliente> clientes = new ArrayList<>();
            
            // Crear 5 staff aleatorios
            for (int i = 0; i < 5; i++) {
                Cliente staff = new Cliente();
                staff.setNombre(faker.name().firstName());
                staff.setApellido(faker.name().lastName());
                staff.setEmail(faker.internet().emailAddress());
                staff.setTelefono(generarTelefonoFormato());
                staff.setPassword(passwordEncoder.encode("staff123"));
                staff.setRol(Rol.STAFF);
                clientes.add(staff);
            }
            
            // Crear 15 clientes normales
            for (int i = 0; i < 15; i++) {
                Cliente cliente = new Cliente();
                cliente.setNombre(faker.name().firstName());
                cliente.setApellido(faker.name().lastName());
                cliente.setEmail(faker.internet().emailAddress());
                cliente.setTelefono(generarTelefonoFormato());
                cliente.setPassword(passwordEncoder.encode("cliente123"));
                cliente.setRol(Rol.CLIENTE);
                clientes.add(cliente);
            }
            
            clienteRepository.saveAll(clientes);
            clienteRepository.flush();
            logger.info("✅ Clientes y staff creados y guardados ({}).", clientes.size());

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

            // Filtrar solo los clientes (no staff ni admin)
            List<Cliente> clientesNormales = clientesPersistidos.stream()
                .filter(c -> c.getRol() == Rol.CLIENTE)
                .collect(Collectors.toList());

            if (clientesNormales.isEmpty()) {
                logger.warn("⚠️ No hay clientes normales para asignar a eventos.");
                return;
            }

            // Crear eventos aleatorios y asignarlos a clientes aleatorios
            int numEventos = faker.number().numberBetween(10, 20); // Crear entre 10 y 20 eventos
            for (int i = 0; i < numEventos; i++) {
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
                
                // Asignar un cliente aleatorio de la lista de clientes normales
                Cliente clienteAleatorio = clientesNormales.get(random.nextInt(clientesNormales.size()));
                evento.setCliente(clienteAleatorio);
                
                evento.setConsumos(new ArrayList<>());
                eventos.add(evento);
                
                logger.info("✅ Evento '{}' asignado al cliente: {} {}", 
                    evento.getNombre(), 
                    clienteAleatorio.getNombre(), 
                    clienteAleatorio.getApellido());
            }

            eventoRepository.saveAll(eventos);
            eventoRepository.flush();
            logger.info("✅ Eventos creados y guardados ({}).", eventos.size());

            // --- Crear consumos de productos ---
            List<ConsumoProducto> consumos = new ArrayList<>();
            List<Evento> eventosPersistidos = eventoRepository.findAll();

            if (eventosPersistidos.isEmpty() || productosPersistidos.isEmpty()) {
                logger.warn("⚠️ No hay eventos o productos persistidos para crear consumos.");
            } else {
                for (Evento evento : eventosPersistidos) {
                    List<Producto> productosDisponibles = new ArrayList<>(productosPersistidos);
                    Collections.shuffle(productosDisponibles);
                    
                    int numProductosAAnadir = faker.number().numberBetween(1, Math.min(6, productosDisponibles.size()));
                    Set<Long> productosAsignados = new HashSet<>();
                    
                    for (int k = 0; k < numProductosAAnadir; k++) {
                        Producto productoSeleccionado = productosDisponibles.get(k);
                        
                        if (productosAsignados.contains(productoSeleccionado.getId())) {
                            continue;
                        }
                        
                        productosAsignados.add(productoSeleccionado.getId());
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

    // Método para generar un número de teléfono en formato "XXX-XXX-XXX"
    // Este método utiliza un Random para generar tres grupos de números aleatorios de 3 dígitos cada uno
    // y los formatea en una cadena con guiones entre ellos.
    private String generarTelefonoFormato() {
        return String.format("%03d-%03d-%03d",
                random.nextInt(1000),
                random.nextInt(1000),
                random.nextInt(1000));
    }

    // Método para ajustar la longitud de un texto a un rango específico
    // Este método toma un texto y lo ajusta a una longitud mínima y máxima especificadas.
    // Si el texto es nulo, se rellena con caracteres "x" hasta la longitud mínima.
    // Si el texto es más corto que la longitud mínima, se rellena con espacios hasta alcanzar la longitud mínima.
    // Si el texto es más largo que la longitud máxima, se corta a la longitud máxima.
    // Si el texto está dentro del rango, se devuelve tal cual.
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