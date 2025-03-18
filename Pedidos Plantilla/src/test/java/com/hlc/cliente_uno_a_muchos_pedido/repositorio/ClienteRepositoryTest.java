package com.hlc.cliente_uno_a_muchos_pedido.repositorio;

import static org.assertj.core.api.Assertions.*;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import com.hlc.cliente_uno_a_muchos_pedido.entidad.Cliente;


@DataJpaTest // 🔥 Carga solo los componentes de JPA y usa una base de datos en memoria (H2 por defecto)
class ClienteRepositoryTest {

    @Autowired
    private ClienteRepository clienteRepository;

    private Cliente cliente1;
    private Cliente cliente2;

    /**
     * 🔹 Configuración inicial: Antes de cada prueba, guardamos dos clientes en la base de datos.
     * Esto nos permite probar operaciones de consulta y eliminación sobre datos reales.
     */
    @BeforeEach
    void setUp() {
        cliente1 = new Cliente();
        cliente1.setNombre("Juan Pérez");
        cliente1.setTelefono("123456789");
        cliente1.setDireccion("Calle Principal 123");

        cliente2 = new Cliente();
        cliente2.setNombre("Ana Gómez");
        cliente2.setTelefono("987654321");
        cliente2.setDireccion("Avenida Secundaria 456");

        clienteRepository.save(cliente1);
        clienteRepository.save(cliente2);
    }

    /**
     * 🔍 Test 1: Guardar y recuperar un cliente por su ID
     * ✅ Verifica que un cliente guardado en la base de datos puede ser recuperado correctamente.
     */
    @Test
    @DisplayName("🔍 Debe guardar un cliente y recuperarlo por ID")
    void guardarYRecuperarClientePorId() {
        Optional<Cliente> clienteGuardado = clienteRepository.findById(cliente1.getId());

        assertThat(clienteGuardado).isPresent(); // 📌 El cliente debería existir en la BD
        assertThat(clienteGuardado.get().getNombre()).isEqualTo("Juan Pérez"); // 📌 Su nombre debe coincidir
        assertThat(clienteGuardado.get().getTelefono()).isEqualTo("123456789"); // 📌 También el teléfono
    }

    /**
     * 🔍 Test 2: Recuperar todos los clientes almacenados
     * ✅ Verifica que se pueden obtener todos los clientes que hemos guardado previamente.
     */
    @Test
    @DisplayName("📋 Debe recuperar todos los clientes almacenados")
    void recuperarTodosLosClientes() {
        List<Cliente> clientes = clienteRepository.findAll();

        assertThat(clientes).hasSize(2); // 📌 Deberíamos tener exactamente 2 clientes
        assertThat(clientes).extracting(Cliente::getNombre).contains("Juan Pérez", "Ana Gómez"); // 📌 Validamos sus nombres
    }

    /**
     * ❌ Test 3: Eliminar un cliente y verificar que ya no existe
     * ✅ Simulamos la eliminación de un cliente y comprobamos que ya no puede ser encontrado en la BD.
     */
    @Test
    @DisplayName("🗑️ Debe eliminar un cliente y verificar que ya no existe")
    void eliminarClienteYVerificarEliminacion() {
        clienteRepository.delete(cliente1); // 🗑️ Eliminamos el cliente Juan Pérez

        Optional<Cliente> clienteEliminado = clienteRepository.findById(cliente1.getId());

        assertThat(clienteEliminado).isEmpty(); // 📌 El cliente ya no debería existir en la BD
    }

    /**
     * ❌ Test 4: Buscar un cliente inexistente
     * ✅ Si intentamos buscar un cliente con un ID que no existe, el repositorio debe devolver un Optional vacío.
     */
    @Test
    @DisplayName("🚫 Debe retornar vacío al buscar un cliente inexistente")
    void buscarClienteInexistente() {
        Optional<Cliente> clienteNoExiste = clienteRepository.findById(999L); // 🚫 ID inexistente

        assertThat(clienteNoExiste).isEmpty(); // 📌 Debe retornar vacío
    }
}
