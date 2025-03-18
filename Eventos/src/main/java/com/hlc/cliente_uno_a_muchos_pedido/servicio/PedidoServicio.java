package com.hlc.cliente_uno_a_muchos_pedido.servicio;

import java.util.List;

import com.hlc.cliente_uno_a_muchos_pedido.entidad.Cliente;
import com.hlc.cliente_uno_a_muchos_pedido.entidad.Pedido;

public interface PedidoServicio {
	  Pedido guardarPedido(Pedido pedido);
	    Pedido obtenerPedidoPorId(Long id);
	    List<Pedido> obtenerTodosLosPedidos();
	    Pedido actualizarPedido(Long id, Pedido pedido);
	    void eliminarPedido(Long id);
		List<Pedido> obtenerPedidosPorCliente(Cliente cliente);
}
