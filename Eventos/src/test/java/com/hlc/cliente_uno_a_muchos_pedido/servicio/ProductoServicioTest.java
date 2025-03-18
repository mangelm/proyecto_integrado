package com.hlc.cliente_uno_a_muchos_pedido.servicio;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.hlc.cliente_uno_a_muchos_pedido.entidad.Producto;
import com.hlc.cliente_uno_a_muchos_pedido.repositorio.ProductoRepository;
import com.hlc.cliente_uno_a_muchos_pedido.servicio.impl.ProductoServicioImpl;

class ProductoServicioTest {

    @Mock
    private ProductoRepository productoRepository;

    @InjectMocks
    private ProductoServicioImpl productoServicio;

    private Producto producto1;
    private Producto producto2;

    /**
     * 🔹 Configuración inicial: Creamos dos productos simulados antes de cada prueba.
     */
    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        producto1 = new Producto();
        producto1.setId(1L);
        producto1.setNombre("Laptop Dell");
        producto1.setStock(10);

        producto2 = new Producto();
        producto2.setId(2L);
        producto2.setNombre("Monitor LG");
        producto2.setStock(5);
    }

    /**
     * 🛠️ Test 1: Guardar un producto
     * ✅ Verifica que el servicio guarda un producto correctamente en el repositorio.
     */
    @Test
    @DisplayName("💾 Debe guardar un producto correctamente")
    void guardarProducto_DeberiaRetornarProductoGuardado() {
        when(productoRepository.save(producto1)).thenReturn(producto1);

        Producto resultado = productoServicio.guardarProducto(producto1);

        assertThat(resultado).isNotNull();
        assertThat(resultado.getNombre()).isEqualTo("Laptop Dell");
        verify(productoRepository, times(1)).save(producto1); // 📌 Verifica que el método fue llamado 1 vez
    }

    /**
     * 🔍 Test 2: Obtener un producto por ID
     * ✅ Verifica que se puede recuperar un producto por su identificador.
     */
    @Test
    @DisplayName("🔍 Debe obtener un producto por su ID")
    void obtenerProductoPorId_DeberiaRetornarProducto() {
        when(productoRepository.findById(1L)).thenReturn(Optional.of(producto1));

        Producto resultado = productoServicio.obtenerProductoPorId(1L);

        assertThat(resultado).isNotNull();
        assertThat(resultado.getId()).isEqualTo(1L);
        assertThat(resultado.getNombre()).isEqualTo("Laptop Dell");
    }

    /**
     * 📋 Test 3: Obtener todos los productos
     * ✅ Verifica que se pueden recuperar todos los productos disponibles en la base de datos.
     */
    @Test
    @DisplayName("📋 Debe obtener todos los productos almacenados")
    void obtenerTodosLosProductos_DeberiaRetornarListaProductos() {
        when(productoRepository.findAll()).thenReturn(Arrays.asList(producto1, producto2));

        List<Producto> productos = productoServicio.obtenerTodosLosProductos();

        assertThat(productos).hasSize(2);
        assertThat(productos).extracting(Producto::getNombre).contains("Laptop Dell", "Monitor LG");
    }

    /**
     * 🛠️ Test 4: Actualizar un producto
     * ✅ Verifica que el servicio puede actualizar un producto existente.
     */
    @Test
    @DisplayName("🛠️ Debe actualizar un producto existente")
    void actualizarProducto_DeberiaRetornarProductoActualizado() {
        when(productoRepository.findById(1L)).thenReturn(Optional.of(producto1));
        when(productoRepository.save(any(Producto.class))).thenReturn(producto1);

        producto1.setStock(15); // Simulamos actualización del stock

        Producto resultado = productoServicio.actualizarProducto(1L, producto1);

        assertThat(resultado.getStock()).isEqualTo(15);
        verify(productoRepository, times(1)).save(producto1);
    }

    /**
     * ❌ Test 5: Eliminar un producto
     * ✅ Verifica que el servicio elimina un producto correctamente.
     */
    @Test
    @DisplayName("🗑️ Debe eliminar un producto correctamente")
    void eliminarProducto_DeberiaEliminarProducto() {
        doNothing().when(productoRepository).deleteById(1L);

        productoServicio.eliminarProducto(1L);

        verify(productoRepository, times(1)).deleteById(1L); // 📌 Verifica que se llamó deleteById(1L) una vez
    }
}
