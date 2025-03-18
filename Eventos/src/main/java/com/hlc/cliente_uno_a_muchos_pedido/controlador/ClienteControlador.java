package com.hlc.cliente_uno_a_muchos_pedido.controlador;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import com.hlc.cliente_uno_a_muchos_pedido.entidad.Cliente;
import com.hlc.cliente_uno_a_muchos_pedido.entidad.Pedido;
import com.hlc.cliente_uno_a_muchos_pedido.servicio.ClienteServicio;
import com.hlc.cliente_uno_a_muchos_pedido.servicio.PedidoServicio;
import jakarta.validation.Valid;
import java.util.List;

@Controller
@RequestMapping("/clientes")
public class ClienteControlador {

    private static final String VISTA_FORMULARIO = "clientes/formulario";
    private static final String REDIRECT_LISTADO = "redirect:/clientes";
    private static final String VISTA_LISTA = "clientes/lista";
    private static final String VISTA_DETALLE = "clientes/detalle";
    private static final String VISTA_PEDIDOS_CLIENTE = "pedidos/lista";

    @Autowired
    @Qualifier("clienteServicioImpl") // <-- Se especifica la implementación correcta
    private ClienteServicio clienteServicio;

    @Autowired
    private PedidoServicio pedidoServicio;

    @GetMapping
    public String listarClientes(Model model, @PageableDefault(size = 20) Pageable pageable,
            @RequestParam(required = false) String nombre) {
        
        Page<Cliente> clientes;
        
        if (nombre != null && !nombre.trim().isEmpty()) {
            clientes = clienteServicio.buscarClientesPorNombre(nombre,pageable);
        } else {
            clientes = clienteServicio.obtenerTodosLosClientes(pageable);
        }
        
        model.addAttribute("clientes", clientes);
        model.addAttribute("nombreBusqueda", nombre);
        model.addAttribute("total", clientes.getTotalElements());
        model.addAttribute("paginaActual", clientes.getNumber());
        return VISTA_LISTA;
    }
    

    @GetMapping("/{id}")
    public String mostrarCliente(@PathVariable Long id, Model model) {
        Cliente cliente = clienteServicio.obtenerClientePorId(id);
        model.addAttribute("cliente", cliente);
        return VISTA_DETALLE;
    }

    @GetMapping("/{id}/pedidos")
    public String mostrarPedidosPorCliente(@PathVariable Long id, Model model) {
        Cliente cliente = clienteServicio.obtenerClientePorId(id);
        List<Pedido> pedidos = pedidoServicio.obtenerPedidosPorCliente(cliente);
        model.addAttribute("cliente", cliente);
        model.addAttribute("pedidos", pedidos);
        return VISTA_PEDIDOS_CLIENTE;
    }

    @GetMapping("/nuevo")
    public String mostrarFormularioNuevoCliente(Model model) {
        model.addAttribute("cliente", new Cliente());
        return VISTA_FORMULARIO;
    }

    @PostMapping("/guardar")
    public String guardarCliente(@Valid @ModelAttribute Cliente cliente, BindingResult bindingResult, Model model) {
        if (bindingResult.hasErrors()) {
            model.addAttribute("cliente", cliente);
            return VISTA_FORMULARIO;
        }
        clienteServicio.guardarCliente(cliente);
        return REDIRECT_LISTADO;
    }

    @GetMapping("/editar/{id}")
    public String mostrarFormularioEditarCliente(@PathVariable Long id, Model model) {
        Cliente cliente = clienteServicio.obtenerClientePorId(id);
        model.addAttribute("cliente", cliente);
        return VISTA_FORMULARIO;
    }

    @GetMapping("/eliminar/{id}")
    public String eliminarCliente(@PathVariable Long id) {
        clienteServicio.eliminarCliente(id);
        return REDIRECT_LISTADO;
    }
   

}
