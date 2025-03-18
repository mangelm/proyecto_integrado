package com.hlc.cliente_uno_a_muchos_pedido.entidad;

import static org.assertj.core.api.Assertions.*;
import java.util.ArrayList;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;

class ClienteTest {

    private Cliente cliente;
    private Validator validator;

    @BeforeEach
    void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();

        cliente = new Cliente();
        cliente.setId(1L);
        cliente.setNombre("Juan Pérez");
        cliente.setTelefono("123456789");
        cliente.setDireccion("Calle Falsa 123");
        cliente.setPedidos(new ArrayList<>());
    }

    @Test
    @DisplayName("Debe crear un cliente con valores válidos")
    void crearCliente_DeberiaTenerValoresValidos() {
        assertThat(cliente.getId()).isEqualTo(1L);
        assertThat(cliente.getNombre()).isEqualTo("Juan Pérez");
        assertThat(cliente.getTelefono()).isEqualTo("123456789");
        assertThat(cliente.getDireccion()).isEqualTo("Calle Falsa 123");
        assertThat(cliente.getPedidos()).isEmpty();
    }

    @Test
    @DisplayName("No debe permitir un nombre vacío")
    void nombreVacio_DeberiaSerInvalido() {
        cliente.setNombre("");
        var violaciones = validator.validate(cliente);
        assertThat(violaciones).extracting(ConstraintViolation::getMessage)
                               .contains("El nombre de usuario no puede estar vacío");
    }

    @Test
    @DisplayName("No debe permitir un nombre demasiado corto")
    void nombreCorto_DeberiaSerInvalido() {
        cliente.setNombre("A");
        var violaciones = validator.validate(cliente);
        assertThat(violaciones).extracting(ConstraintViolation::getMessage)
                               .contains("El nombre debe tener entre 2 y 100 caracteres");
    }

    @Test
    @DisplayName("No debe permitir un nombre demasiado largo")
    void nombreLargo_DeberiaSerInvalido() {
        cliente.setNombre("A".repeat(101));
        var violaciones = validator.validate(cliente);
        assertThat(violaciones).extracting(ConstraintViolation::getMessage)
                               .contains("El nombre debe tener entre 2 y 100 caracteres");
    }

    @Test
    @DisplayName("No debe permitir un teléfono con caracteres no numéricos")
    void telefonoInvalido_DeberiaSerInvalido() {
        cliente.setTelefono("ABC123");
        var violaciones = validator.validate(cliente);
        assertThat(violaciones).extracting(ConstraintViolation::getMessage)
                               .contains("El teléfono debe contener entre 9 y 15 dígitos");
    }

    @Test
    @DisplayName("Debe permitir un teléfono válido de 9 a 15 dígitos")
    void telefonoValido_DeberiaSerCorrecto() {
        cliente.setTelefono("12345678901");
        var violaciones = validator.validate(cliente);
        assertThat(violaciones).isEmpty();
    }

    @Test
    @DisplayName("No debe permitir una dirección demasiado corta")
    void direccionCorta_DeberiaSerInvalida() {
        cliente.setDireccion("123");
        var violaciones = validator.validate(cliente);
        assertThat(violaciones).extracting(ConstraintViolation::getMessage)
                               .contains("La dirección debe tener entre 5 y 255 caracteres");
    }

    @Test
    @DisplayName("No debe permitir una dirección demasiado larga")
    void direccionLarga_DeberiaSerInvalida() {
        cliente.setDireccion("A".repeat(256));
        var violaciones = validator.validate(cliente);
        assertThat(violaciones).extracting(ConstraintViolation::getMessage)
                               .contains("La dirección debe tener entre 5 y 255 caracteres");
    }

    @Test
    @DisplayName("Debe permitir asignar pedidos a un cliente")
    void agregarPedidos_DeberiaActualizarListaPedidos() {
        Pedido pedido = new Pedido();
        pedido.setId(1L);
        List<Pedido> pedidos = new ArrayList<>();
        pedidos.add(pedido);

        cliente.setPedidos(pedidos);

        assertThat(cliente.getPedidos()).hasSize(1);
        assertThat(cliente.getPedidos().get(0).getId()).isEqualTo(1L);
    }
}
