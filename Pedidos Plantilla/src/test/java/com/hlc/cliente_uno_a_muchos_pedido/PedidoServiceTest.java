package com.hlc.cliente_uno_a_muchos_pedido;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.hlc.cliente_uno_a_muchos_pedido.entidad.Cliente;
import com.hlc.cliente_uno_a_muchos_pedido.entidad.Pedido;
import com.hlc.cliente_uno_a_muchos_pedido.excepcion.RecursoNoEncontradoException;
import com.hlc.cliente_uno_a_muchos_pedido.repositorio.PedidoRepository;
import com.hlc.cliente_uno_a_muchos_pedido.servicio.impl.PedidoServicioImpl;

@ExtendWith(MockitoExtension.class)
public class PedidoServiceTest {

    @Mock
    private PedidoRepository pedidoRepository;

    @InjectMocks
    private PedidoServicioImpl pedidoService;

    private Pedido pedido;

    @BeforeEach
    public void setUp() {
        pedido = new Pedido();
        pedido.setId(1L);
        pedido.setFecha(LocalDate.now());
        pedido.setFechaRecogida(LocalDate.now().plusDays(3));
        pedido.setRecogido(false);
        pedido.setPreparado(true);
        pedido.setDescripcion("Pedido de prueba");

        // Simular un Cliente asociado
        Cliente cliente = new Cliente();
        cliente.setId(1L);
        cliente.setNombre("Juan Pérez");
        pedido.setCliente(cliente);

        // Simular un mapa de productos y cantidades
        Map<Long, Integer> cantidad = new HashMap<>();
        cantidad.put(100L, 2);  // Producto con ID 100, cantidad 2
        cantidad.put(200L, 1);  // Producto con ID 200, cantidad 1
        pedido.setCantidad(cantidad);
    }

    /**
     * Prueba que, al existir un pedido en el repositorio, se retorne correctamente,
     * verificando además los campos adicionales.
     */
    @Test
    public void testObtenerPedidoPorId_Existe() {
        // Simulamos que el repositorio retorna un Optional con el pedido de ID 1L
        when(pedidoRepository.findById(1L)).thenReturn(Optional.of(pedido));

        Pedido resultado = pedidoService.obtenerPedidoPorId(1L);

        assertNotNull(resultado, "El pedido obtenido no debe ser nulo");
        assertEquals(1L, resultado.getId(), "El ID del pedido debe ser 1L");
        assertEquals("Pedido de prueba", resultado.getDescripcion(), "La descripción no coincide");
        assertEquals(LocalDate.now(), resultado.getFecha(), "La fecha no coincide");
        assertEquals(LocalDate.now().plusDays(3), resultado.getFechaRecogida(), "La fecha de recogida no coincide");
        assertFalse(resultado.isRecogido(), "El pedido no debería estar recogido");
        assertTrue(resultado.isPreparado(), "El pedido debería estar preparado");

        // Verificar los datos del Cliente asociado
        assertNotNull(resultado.getCliente(), "El cliente no debe ser nulo");
        assertEquals("Juan Pérez", resultado.getCliente().getNombre(), "El nombre del cliente no coincide");

        // Verificar el mapa de cantidades
        Map<Long, Integer> cantidadEsperada = new HashMap<>();
        cantidadEsperada.put(100L, 2);
        cantidadEsperada.put(200L, 1);
        assertEquals(cantidadEsperada, resultado.getCantidad(), "El mapa de cantidades no coincide");

        verify(pedidoRepository, times(1)).findById(1L);
    }

    /**
     * Prueba que, al no existir un pedido, se lance RecursoNoEncontradoException.
     */
    @Test
    public void testObtenerPedidoPorId_NoExiste() {
        when(pedidoRepository.findById(2L)).thenReturn(Optional.empty());

        RecursoNoEncontradoException exception = assertThrows(
            RecursoNoEncontradoException.class,
            () -> pedidoService.obtenerPedidoPorId(2L)
        );
        assertEquals("Pedido no encontrado con ID: 2", exception.getMessage());
        verify(pedidoRepository, times(1)).findById(2L);
    }
}
