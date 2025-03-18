package com.hlc.cliente_uno_a_muchos_pedido.entidad;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;

import java.util.ArrayList;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;

class CategoriaTest {
	
	private Categoria categoria;
	private Producto producto;
	private Validator validator;
	
	@BeforeEach
    void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();

        categoria = new Categoria();
        categoria.setId(1L);
        categoria.setNombre("Cosmética");
        categoria.setDescripcion("Producto belleza");
        categoria.setProductos(new ArrayList<>());
    }
	
	@Test
    @DisplayName("Debe crear una categoria con valores válidos")
    void crearCliente_DeberiaTenerValoresValidos() {
        assertThat(categoria.getId()).isEqualTo(1L);
        assertThat(categoria.getNombre()).isEqualTo("Cosmética");
        assertThat(categoria.getDescripcion()).isEqualTo("Producto belleza");
        assertThat(categoria.getProductos()).isEmpty();
    }
}
