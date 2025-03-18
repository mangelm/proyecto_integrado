package com.hlc.cliente_uno_a_muchos_pedido.controlador;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.Arrays;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;

import com.hlc.cliente_uno_a_muchos_pedido.entidad.Cliente;
import com.hlc.cliente_uno_a_muchos_pedido.entidad.Pedido;
import com.hlc.cliente_uno_a_muchos_pedido.servicio.ClienteServicio;
import com.hlc.cliente_uno_a_muchos_pedido.servicio.PedidoServicio;

class ClienteControladorTest {

    private MockMvc mockMvc;

    @Mock
    private ClienteServicio clienteServicio;
    
    @Mock
    private PedidoServicio pedidoServicio;
    
    @InjectMocks
    private ClienteControlador clienteControlador;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(clienteControlador).build();
    }

    @Test
    @DisplayName("Debería devolver la vista de lista de clientes con clientes en el modelo")
    void listarClientes_DeberiaDevolverVistaLista() throws Exception {
        List<Cliente> clientes = Arrays.asList(new Cliente(), new Cliente());
        when(clienteServicio.obtenerTodosLosClientes()).thenReturn(clientes);

        mockMvc.perform(get("/clientes"))
               .andExpect(status().isOk())
               .andExpect(view().name("clientes/lista"))
               .andExpect(model().attributeExists("clientes"));
    }

    @Test
    @DisplayName("Debería mostrar la información de un cliente específico en la vista de detalle")
    void mostrarCliente_DeberiaCargarCliente() throws Exception {
        Cliente cliente = new Cliente();
        cliente.setId(1L);
        when(clienteServicio.obtenerClientePorId(1L)).thenReturn(cliente);

        mockMvc.perform(get("/clientes/1"))
               .andExpect(status().isOk())
               .andExpect(view().name("clientes/detalle"))
               .andExpect(model().attributeExists("cliente"));
    }

    @Test
    @DisplayName("Debería mostrar la lista de pedidos de un cliente")
    void mostrarPedidosPorCliente_DeberiaCargarPedidosDelCliente() throws Exception {
        Cliente cliente = new Cliente();
        cliente.setId(1L);
        List<Pedido> pedidos = Arrays.asList(new Pedido(), new Pedido());
        when(clienteServicio.obtenerClientePorId(1L)).thenReturn(cliente);
        when(pedidoServicio.obtenerPedidosPorCliente(cliente)).thenReturn(pedidos);

        mockMvc.perform(get("/clientes/1/pedidos"))
               .andExpect(status().isOk())
               .andExpect(view().name("pedidos/lista"))
               .andExpect(model().attributeExists("cliente"))
               .andExpect(model().attributeExists("pedidos"));
    }

    @Test
    @DisplayName("Debería cargar el formulario para registrar un nuevo cliente")
    void mostrarFormularioNuevoCliente_DeberiaCargarVistaFormulario() throws Exception {
        mockMvc.perform(get("/clientes/nuevo"))
               .andExpect(status().isOk())
               .andExpect(view().name("clientes/formulario"))
               .andExpect(model().attributeExists("cliente"));
    }

    @Test
    @DisplayName("Debería guardar un cliente válido y redirigir a la lista de clientes")
    void guardarCliente_DeberiaRedirigirCuandoEsValido() throws Exception {
        Cliente cliente = new Cliente();
        BindingResult bindingResult = mock(BindingResult.class);
        Model model = mock(Model.class);
        
        when(bindingResult.hasErrors()).thenReturn(false);

        String resultado = clienteControlador.guardarCliente(cliente, bindingResult, model);

        assertEquals("redirect:/clientes", resultado);
        verify(clienteServicio, times(1)).guardarCliente(cliente);
    }

    @Test
    @DisplayName("Debería devolver el formulario si el cliente tiene errores de validación")
    void guardarCliente_DeberiaRetornarFormularioSiEsInvalido() throws Exception {
        Cliente cliente = new Cliente();
        BindingResult bindingResult = mock(BindingResult.class);
        Model model = mock(Model.class);
        
        when(bindingResult.hasErrors()).thenReturn(true);

        String resultado = clienteControlador.guardarCliente(cliente, bindingResult, model);

        assertEquals("clientes/formulario", resultado);
        verify(clienteServicio, never()).guardarCliente(any());
    }

    @Test
    @DisplayName("Debería cargar el formulario de edición con el cliente seleccionado")
    void mostrarFormularioEditarCliente_DeberiaCargarCliente() throws Exception {
        Cliente cliente = new Cliente();
        cliente.setId(1L);
        when(clienteServicio.obtenerClientePorId(1L)).thenReturn(cliente);

        mockMvc.perform(get("/clientes/editar/1"))
               .andExpect(status().isOk())
               .andExpect(view().name("clientes/formulario"))
               .andExpect(model().attributeExists("cliente"));
    }

    @Test
    @DisplayName("Debería eliminar un cliente y redirigir a la lista de clientes")
    void eliminarCliente_DeberiaRedirigirDespuesDeEliminar() throws Exception {
        mockMvc.perform(get("/clientes/eliminar/1"))
               .andExpect(status().is3xxRedirection())
               .andExpect(redirectedUrl("/clientes"));

        verify(clienteServicio, times(1)).eliminarCliente(1L);
    }
}
