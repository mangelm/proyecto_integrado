package com.hlc.cliente_uno_a_muchos_pedido.config;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.github.javafaker.Faker;
import com.hlc.cliente_uno_a_muchos_pedido.entidad.Categoria;
import com.hlc.cliente_uno_a_muchos_pedido.entidad.Cliente;
import com.hlc.cliente_uno_a_muchos_pedido.entidad.Pedido;
import com.hlc.cliente_uno_a_muchos_pedido.entidad.Producto;
import com.hlc.cliente_uno_a_muchos_pedido.repositorio.CategoriaRepository;
import com.hlc.cliente_uno_a_muchos_pedido.repositorio.ClienteRepository;
import com.hlc.cliente_uno_a_muchos_pedido.repositorio.PedidoRepository;
import com.hlc.cliente_uno_a_muchos_pedido.repositorio.ProductoRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
public class InicializadorDatos implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(InicializadorDatos.class);

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private ProductoRepository productoRepository;
    
    @Autowired
    private CategoriaRepository categoriaRepository;

    private final Faker faker = new Faker(new Locale("es"));


    @Override
    @Transactional
    public void run(String... args) {
        try {
            logger.info("🔄 Iniciando la carga de datos...");
            
            //Creo las categorias
            List<Categoria> categorias = new ArrayList<>();
           
            for (int i = 0; i < 10; i++) {
            	Categoria categoria = new Categoria();
            	categoria.setNombre(faker.color().name());
            	categoria.setDescripcion(faker.lorem().sentence());
            	categorias.add(categoria);
            	
            }
            Set<String> nombresVistos = new HashSet<>();
            List<Categoria> categoriasUnicas = categorias.stream()
                .filter(categoria -> nombresVistos.add(categoria.getNombre()))
                .collect(Collectors.toList());

            
            categoriaRepository.saveAll(categoriasUnicas); // Guardar todas las categorias de una vez
            categoriaRepository.flush();

            if(categoriaRepository.findAll().size()>0) {
                logger.info("✅ Categorias creadas y guardadas en la base de datos.");
            }else {
            	logger.error("❌ Error durante la inicialización de datos: {}", "categoriaRepository");
            }

            List<Producto> productos = new ArrayList<>();
            for (int i = 0; i < 10; i++) {
                Producto producto = new Producto();
                producto.setNombre(faker.commerce().material());
                producto.setDescripcion(faker.lorem().sentence());
                producto.setPeso(faker.number().randomDouble(2, 1, 5));
                producto.setStock(faker.number().numberBetween(10, 100));
               
                // Obtenemos la categoría elegida de forma aleatoria
                int indiceAleatorio = faker.random().nextInt(categoriasUnicas.size());
                Categoria categoriaAleatoria = categoriasUnicas.get(indiceAleatorio);

                
                // Asignamos la categoría al producto
                producto.setCategoria(categoriaAleatoria);
                
                productos.add(producto);
            }

            // Guardar todos los productos de una vez
            productoRepository.saveAll(productos);
            productoRepository.flush();

            logger.info("✅ Productos creados y guardados en la base de datos.");


            List<Cliente> clientes = new ArrayList<>();
            for (int i = 0; i < 100; i++) {
                Cliente cliente = new Cliente();
                cliente.setNombre(faker.name().fullName());
                cliente.setTelefono(faker.numerify("#########"));
                cliente.setDireccion(faker.address().fullAddress());
                clientes.add(cliente);
            }
            clienteRepository.saveAll(clientes);
            clienteRepository.flush();

            logger.info("✅ Clientes creados y guardados en la base de datos.");

            List<Pedido> pedidos = new ArrayList<>();
            for (Cliente cliente : clientes) {
                for (int j = 0; j < 3; j++) {
                    Pedido pedido = new Pedido();
                    pedido.setFecha(LocalDate.now());
                    pedido.setFechaRecogida(LocalDate.now().plusDays(faker.number().numberBetween(1, 10)));
                    pedido.setRecogido(false);
                    pedido.setPreparado(faker.bool().bool());
                    pedido.setCliente(cliente);
                    pedido.setDescripcion(faker.lorem().sentence());

                    Collections.shuffle(productos);
                    int numProductos = faker.number().numberBetween(1, Math.min(5, productos.size()));

                    Map<Long, Integer> productosPedido = new HashMap<>();
                    for (int k = 0; k < numProductos; k++) {
                        Producto productoSeleccionado = productos.get(k);
                        int cantidad = faker.number().numberBetween(1, 10);
                        productosPedido.put(productoSeleccionado.getId(), cantidad); // Guardar solo IDs
                    }

                    pedido.setCantidad(productosPedido);
                    pedidos.add(pedido);
                }
            }

            pedidoRepository.saveAll(pedidos);
            pedidoRepository.flush();

            logger.info("✅ Pedidos creados y guardados en la base de datos.");
            logger.info("🎉 Inicialización de datos completada con éxito.");

        } catch (Exception e) {
            logger.error("❌ Error durante la inicialización de datos: {}", e.getMessage());
            e.printStackTrace();
        }
    }
}
