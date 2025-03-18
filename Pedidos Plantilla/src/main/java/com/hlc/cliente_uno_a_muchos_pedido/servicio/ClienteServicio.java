package com.hlc.cliente_uno_a_muchos_pedido.servicio;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.hlc.cliente_uno_a_muchos_pedido.entidad.Cliente;
import com.hlc.cliente_uno_a_muchos_pedido.entidad.Pedido;

public interface ClienteServicio {
	 Cliente guardarCliente(Cliente cliente);
	 Cliente obtenerClientePorId(Long id);
	 List<Cliente> obtenerTodosLosClientes();
	 Cliente actualizarCliente(Long id, Cliente cliente);
	 void eliminarCliente(Long id);
	 List<Pedido> obtenerPedidosPorCliente(Cliente cliente);
	 Page<Cliente> obtenerTodosLosClientes(Pageable pageable);
	 Page<Cliente> buscarClientesPorNombre(String nombre, Pageable pageable);
}
