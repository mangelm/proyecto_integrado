package com.hlc.cliente_uno_a_muchos_pedido.controlador;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import com.hlc.cliente_uno_a_muchos_pedido.entidad.Pedido;
import com.hlc.cliente_uno_a_muchos_pedido.entidad.Producto;
import com.hlc.cliente_uno_a_muchos_pedido.servicio.ClienteServicio;
import com.hlc.cliente_uno_a_muchos_pedido.servicio.PedidoServicio;
import com.hlc.cliente_uno_a_muchos_pedido.servicio.ProductoServicio;

import jakarta.validation.Valid;

@Controller
@RequestMapping("/pedidos")
public class PedidoControlador {

    private static final String VISTA_FORMULARIO = "pedidos/formulario";
    private static final String REDIRECT_LISTADO = "redirect:/pedidos";
    private static final String VISTA_DETALLE = "pedidos/detalle";

    private final PedidoServicio pedidoServicio;
    private final ClienteServicio clienteServicio;
    private final ProductoServicio productoServicio;

    public PedidoControlador(PedidoServicio pedidoServicio, ClienteServicio clienteServicio, ProductoServicio productoServicio) {
        this.pedidoServicio = pedidoServicio;
        this.clienteServicio = clienteServicio;
        this.productoServicio = productoServicio;
    }

    @GetMapping
    public String listarPedidos(Model model) {
        List<Pedido> pedidos = pedidoServicio.obtenerTodosLosPedidos();
        model.addAttribute("pedidos", pedidos);
        return "pedidos/lista";
    }

    @GetMapping("/nuevo")
    public String mostrarFormularioNuevoPedido(Model model) {
        Pedido pedido = new Pedido();
        pedido.setFecha(LocalDate.now());

        model.addAttribute("pedido", pedido);
        model.addAttribute("clientes", clienteServicio.obtenerTodosLosClientes());
        model.addAttribute("productos", productoServicio.obtenerTodosLosProductos());

        return VISTA_FORMULARIO;
    }

    @PostMapping("/guardar")
    public String guardarPedido(@Valid @ModelAttribute Pedido pedido,
                                BindingResult bindingResult,
                                @RequestParam(value = "productosSeleccionados", required = false) List<Long> productosSeleccionados,
                                @RequestParam Map<String, String> cantidades,
                                @RequestParam("fechaRecogida") String fechaRecogidaStr,
                                Model model) {
        
        if (bindingResult.hasErrors()) {
            model.addAttribute("clientes", clienteServicio.obtenerTodosLosClientes());
            model.addAttribute("productos", productoServicio.obtenerTodosLosProductos());
            return "pedidos/formulario";
        }

        pedido.setFecha(LocalDate.now()); // La fecha del pedido es siempre la actual

        // Validar la fecha de recogida
        try {
            LocalDate fechaRecogida = LocalDate.parse(fechaRecogidaStr);
            if (!fechaRecogida.isAfter(LocalDate.now())) {
                bindingResult.rejectValue("fechaRecogida", "error.pedido", "La fecha de recogida debe ser posterior a hoy.");
                return "pedidos/formulario";
            }
            pedido.setFechaRecogida(fechaRecogida);
        } catch (DateTimeParseException e) {
            bindingResult.rejectValue("fechaRecogida", "error.pedido", "Formato de fecha incorrecto.");
            return "pedidos/formulario";
        }

        // Procesar productos seleccionados
        Map<Long, Integer> cantidadMap = new HashMap<>();
        if (productosSeleccionados != null) {
            for (Long productoId : productosSeleccionados) {
                Integer cantidad = cantidades.containsKey("cantidades[" + productoId + "]")
                        ? Integer.parseInt(cantidades.get("cantidades[" + productoId + "]"))
                        : 0;

                Producto producto = productoServicio.obtenerProductoPorId(productoId);
                if (cantidad > producto.getStock()) {
                    bindingResult.rejectValue("cantidad", "error.pedido", "Cantidad supera el stock disponible.");
                    return "pedidos/formulario";
                }

                cantidadMap.put(productoId, cantidad);
            }
        }

        pedido.setCantidad(cantidadMap);
        pedidoServicio.guardarPedido(pedido);
        return REDIRECT_LISTADO;
    }


    @GetMapping("/editar/{id}")
    public String mostrarFormularioEditarPedido(@PathVariable Long id, Model model) {
        Pedido pedido = pedidoServicio.obtenerPedidoPorId(id);
        model.addAttribute("pedido", pedido);
        model.addAttribute("clientes", clienteServicio.obtenerTodosLosClientes());
        model.addAttribute("productos", productoServicio.obtenerTodosLosProductos());
        return VISTA_FORMULARIO;
    }

    @GetMapping("/eliminar/{id}")
    public String eliminarPedido(@PathVariable Long id) {
        pedidoServicio.eliminarPedido(id);
        return REDIRECT_LISTADO;
    }
    
    
    @GetMapping("/detalle/{id}")
    public String mostrarPedido(@PathVariable Long id, Model model) {
        Pedido pedido = pedidoServicio.obtenerPedidoPorId(id);
        if (pedido == null) {
            return "redirect:/pedidos";
        }
        model.addAttribute("pedido", pedido);
        return VISTA_DETALLE;
    }
}
