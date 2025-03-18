package com.hlc.cliente_uno_a_muchos_pedido.repositorio;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;

import java.util.Optional;

import com.hlc.cliente_uno_a_muchos_pedido.entidad.Categoria;
import com.hlc.cliente_uno_a_muchos_pedido.entidad.Producto;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

@DataJpaTest
public class ProductoRepositoryTest {

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    /**
     * Prueba sencilla para guardar y recuperar un Producto.
     * Se crea una Categoria, se asigna al Producto y se persiste.
     * Luego se verifica que el Producto se guarda correctamente y que
     * la relación con la Categoria se mantiene.
     */
    @Test
    public void testGuardarYRecuperarProducto() {
        // Crear y guardar una categoría
        Categoria categoria = new Categoria();
        categoria.setNombre("Electrónica");
        categoria.setDescripcion("Productos electrónicos");
        Categoria savedCategoria = categoriaRepository.save(categoria);

        // Crear un producto y asignarle la categoría persistida
        Producto producto = new Producto();
        producto.setNombre("Televisor LED");
        producto.setDescripcion("Televisor LED de alta definición");
        producto.setPeso(12.0);
        producto.setStock(30);
        producto.setCategoria(savedCategoria);

        // Guardar el producto
        Producto savedProducto = productoRepository.save(producto);
        assertNotNull(savedProducto.getId(), "El producto debería tener un ID asignado tras ser guardado.");

        // Recuperar el producto por ID
        Optional<Producto> optionalProducto = productoRepository.findById(savedProducto.getId());
        assertTrue(optionalProducto.isPresent(), "El producto debería existir en la base de datos.");
        Producto foundProducto = optionalProducto.get();

        // Verificar que los datos coinciden
        assertEquals("Televisor LED", foundProducto.getNombre());
        assertEquals("Electrónica", foundProducto.getCategoria().getNombre());
    }
}
