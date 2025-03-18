package com.hlc.cliente_uno_a_muchos_pedido.entidad;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;


public class ProductoTest {

	private Producto producto;
        private Categoria categoria;

        /**
         * Inicializa el objeto Producto y la Categoria asociada antes de cada prueba.
         */
        @BeforeEach
        public void setUp() {
            // Creamos una instancia de Producto y asignamos valores de prueba
            producto = new Producto();
            producto.setId(1L);
            producto.setNombre("Test Producto");
            producto.setDescripcion("Descripción de producto de prueba");
            producto.setPeso(5.5);
            producto.setStock(100);

            // Creamos una instancia de Categoria y asignamos valores de prueba
            categoria = new Categoria();
            categoria.setId(1L);
            categoria.setNombre("Test Categoría");
            categoria.setDescripcion("Descripción de categoría de prueba");

            // Asignamos la categoria al producto
            producto.setCategoria(categoria);
        }

        /**
         * Verifica que los valores asignados en setUp() se puedan recuperar correctamente mediante los getters.
         */
        @Test
        public void testProductoProperties() {
            assertEquals(1L, producto.getId(), "El ID del producto debería ser 1L");
            assertEquals("Test Producto", producto.getNombre(), "El nombre del producto no coincide");
            assertEquals("Descripción de producto de prueba", producto.getDescripcion(), "La descripción no coincide");
            assertEquals(5.5, producto.getPeso(), "El peso no coincide");
            assertEquals(100, producto.getStock(), "El stock no coincide");
            assertEquals(categoria, producto.getCategoria(), "La categoría asignada no es la esperada");
        }
    
}
