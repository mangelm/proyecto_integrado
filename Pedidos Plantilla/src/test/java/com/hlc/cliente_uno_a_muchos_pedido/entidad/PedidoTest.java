package com.hlc.cliente_uno_a_muchos_pedido.entidad;

import static org.assertj.core.api.Assertions.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class PedidoTest {

    private Pedido pedido;

    @BeforeEach
    void setUp() {
        pedido = new Pedido();
        pedido.setId(1L);
        pedido.setFecha(LocalDate.now());
        pedido.setFechaRecogida(LocalDate.now().plusDays(3));
        pedido.setRecogido(false);
        pedido.setPreparado(false);
        pedido.setDescripcion("Pedido de prueba");
        
        Cliente cliente = new Cliente();
        cliente.setId(1L);
        pedido.setCliente(cliente);
        
        Map<Long, Integer> productos = new HashMap<>();
        productos.put(100L, 2); // Producto con ID 100 y cantidad 2
        pedido.setCantidad(productos);
    }

    @Test
    @DisplayName("Debe crear un pedido con valores válidos")
    void crearPedido_DeberiaTenerValoresValidos() {
        assertThat(pedido.getId()).isEqualTo(1L);
        assertThat(pedido.getFecha()).isEqualTo(LocalDate.now());
        assertThat(pedido.getFechaRecogida()).isAfter(LocalDate.now());
        assertThat(pedido.getCliente()).isNotNull();
        assertThat(pedido.getCantidad()).containsEntry(100L, 2);
        assertThat(pedido.getDescripcion()).isEqualTo("Pedido de prueba");
    }

    @Test
    @DisplayName("Debe obtener el estado correcto del pedido")
    void obtenerEstado_DeberiaDevolverEstadoCorrecto() {
        assertThat(pedido.getEstado()).isEqualTo("Pendiente");

        pedido.setPreparado(true);
        assertThat(pedido.getEstado()).isEqualTo("Preparado");

        pedido.setRecogido(true);
        assertThat(pedido.getEstado()).isEqualTo("Recogido");
    }

    @Test
    @DisplayName("Debe modificar correctamente la fecha de recogida")
    void modificarFechaRecogida_DeberiaActualizarFecha() {
        LocalDate nuevaFecha = LocalDate.now().plusDays(5);
        pedido.setFechaRecogida(nuevaFecha);
        assertThat(pedido.getFechaRecogida()).isEqualTo(nuevaFecha);
    }

    @Test
    @DisplayName("Debe modificar correctamente la descripción del pedido")
    void modificarDescripcion_DeberiaActualizarDescripcion() {
        String nuevaDescripcion = "Nuevo pedido actualizado";
        pedido.setDescripcion(nuevaDescripcion);
        assertThat(pedido.getDescripcion()).isEqualTo(nuevaDescripcion);
    }

    @Test
    @DisplayName("Debe modificar correctamente la cantidad de productos en el pedido")
    void modificarCantidad_DeberiaActualizarMapaProductos() {
        pedido.getCantidad().put(200L, 5);
        assertThat(pedido.getCantidad()).containsEntry(200L, 5);
    }

    @Test
    @DisplayName("No debe permitir una descripción mayor a 255 caracteres")
    void descripcionLarga_DeberiaSerInvalida() {
        String descripcionLarga = "A".repeat(256);
        pedido.setDescripcion(descripcionLarga);
        assertThat(pedido.getDescripcion().length()).isGreaterThan(255);
    }
}
