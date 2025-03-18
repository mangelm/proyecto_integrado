package com.hlc.cliente_uno_a_muchos_pedido.controlador;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.LocalDate;
import java.util.*;

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

import com.hlc.cliente_uno_a_muchos_pedido.entidad.Pedido;
import com.hlc.cliente_uno_a_muchos_pedido.entidad.Producto;
import com.hlc.cliente_uno_a_muchos_pedido.servicio.ClienteServicio;
import com.hlc.cliente_uno_a_muchos_pedido.servicio.PedidoServicio;
import com.hlc.cliente_uno_a_muchos_pedido.servicio.ProductoServicio;

class PedidoControladorTest {

    private MockMvc mockMvc;

    @Mock
    private PedidoServicio pedidoServicio;
    
    @Mock
    private ClienteServicio clienteServicio;
    
    @Mock
    private ProductoServicio productoServicio;
    
    @InjectMocks
    private PedidoControlador pedidoControlador;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(pedidoControlador).build();
    }

    @Test
    @DisplayName("Debería devolver la vista de lista de pedidos con los pedidos en el modelo")
    void listarPedidos_DeberiaDevolverVistaLista() throws Exception {
        List<Pedido> pedidos = Arrays.asList(new Pedido(), new Pedido());
        when(pedidoServicio.obtenerTodosLosPedidos()).thenReturn(pedidos);

        mockMvc.perform(get("/pedidos"))
               .andExpect(status().isOk())
               .andExpect(view().name("pedidos/lista"))
               .andExpect(model().attributeExists("pedidos"));
    }

    @Test
    @DisplayName("Debería cargar la vista del formulario para un nuevo pedido con clientes y productos")
    void mostrarFormularioNuevoPedido_DeberiaCargarVistaFormulario() throws Exception {
        when(clienteServicio.obtenerTodosLosClientes()).thenReturn(Collections.emptyList());
        when(productoServicio.obtenerTodosLosProductos()).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/pedidos/nuevo"))
               .andExpect(status().isOk())
               .andExpect(view().name("pedidos/formulario"))
               .andExpect(model().attributeExists("pedido"))
               .andExpect(model().attributeExists("clientes"))
               .andExpect(model().attributeExists("productos"));
    }

    @Test
    @DisplayName("Debería guardar un pedido válido y redirigir a la lista de pedidos")
    void guardarPedido_DeberiaRedirigirCuandoEsValido() throws Exception {
        Pedido pedido = new Pedido();
        BindingResult bindingResult = mock(BindingResult.class);
        Model model = mock(Model.class);
        List<Long> productosSeleccionados = List.of(1L);
        Map<String, String> cantidades = new HashMap<>();
        cantidades.put("cantidades[1]", "2");

        Producto producto = new Producto();
        producto.setId(1L);
        producto.setStock(5);
        when(productoServicio.obtenerProductoPorId(1L)).thenReturn(producto);
        when(bindingResult.hasErrors()).thenReturn(false);

        String resultado = pedidoControlador.guardarPedido(pedido, bindingResult, productosSeleccionados, cantidades, 
                                                           LocalDate.now().plusDays(1).toString(), model);

        assertEquals("redirect:/pedidos", resultado);
        verify(pedidoServicio, times(1)).guardarPedido(pedido);
    }

    @Test
    @DisplayName("Debería rechazar una fecha de recogida anterior a hoy")
    void guardarPedido_DeberiaRetornarFormularioSiFechaEsInvalida() throws Exception {
        Pedido pedido = new Pedido();
        BindingResult bindingResult = mock(BindingResult.class);
        Model model = mock(Model.class);

        String resultado = pedidoControlador.guardarPedido(pedido, bindingResult, null, new HashMap<>(), 
                                                           LocalDate.now().minusDays(1).toString(), model);

        assertEquals("pedidos/formulario", resultado);
        verify(bindingResult).rejectValue("fechaRecogida", "error.pedido", "La fecha de recogida debe ser posterior a hoy.");
    }

    @Test
    @DisplayName("Debería rechazar una cantidad de producto que supere el stock disponible")
    void guardarPedido_DeberiaRetornarFormularioSiCantidadSuperaStock() throws Exception {
        Pedido pedido = new Pedido();
        BindingResult bindingResult = mock(BindingResult.class);
        Model model = mock(Model.class);
        List<Long> productosSeleccionados = List.of(1L);
        Map<String, String> cantidades = new HashMap<>();
        cantidades.put("cantidades[1]", "10");

        Producto producto = new Producto();
        producto.setId(1L);
        producto.setStock(5);
        when(productoServicio.obtenerProductoPorId(1L)).thenReturn(producto);

        String resultado = pedidoControlador.guardarPedido(pedido, bindingResult, productosSeleccionados, cantidades, 
                                                           LocalDate.now().plusDays(1).toString(), model);

        assertEquals("pedidos/formulario", resultado);
        verify(bindingResult).rejectValue("cantidad", "error.pedido", "Cantidad supera el stock disponible.");
    }

    @Test
    @DisplayName("Debería mostrar el formulario de edición con los datos del pedido")
    void mostrarFormularioEditarPedido_DeberiaCargarPedidoYRetornarVista() throws Exception {
        Pedido pedido = new Pedido();
        pedido.setId(1L);
        when(pedidoServicio.obtenerPedidoPorId(1L)).thenReturn(pedido);
        when(clienteServicio.obtenerTodosLosClientes()).thenReturn(Collections.emptyList());
        when(productoServicio.obtenerTodosLosProductos()).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/pedidos/editar/1"))
               .andExpect(status().isOk())
               .andExpect(view().name("pedidos/formulario"))
               .andExpect(model().attributeExists("pedido"))
               .andExpect(model().attributeExists("clientes"))
               .andExpect(model().attributeExists("productos"));
    }

    @Test
    @DisplayName("Debería eliminar un pedido y redirigir a la lista")
    void eliminarPedido_DeberiaRedirigirDespuesDeEliminar() throws Exception {
        mockMvc.perform(get("/pedidos/eliminar/1"))
               .andExpect(status().is3xxRedirection())
               .andExpect(redirectedUrl("/pedidos"));

        verify(pedidoServicio, times(1)).eliminarPedido(1L);
    }
}

