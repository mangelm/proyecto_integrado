package com.hlc.cliente_uno_a_muchos_pedido.servicio.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.hlc.cliente_uno_a_muchos_pedido.entidad.Cliente;
import com.hlc.cliente_uno_a_muchos_pedido.entidad.Pedido;
import com.hlc.cliente_uno_a_muchos_pedido.excepcion.*;
import com.hlc.cliente_uno_a_muchos_pedido.repositorio.ClienteRepository;
import com.hlc.cliente_uno_a_muchos_pedido.servicio.ClienteServicio;

@Service
public class ClienteServicioImpl implements ClienteServicio {

    private ClienteRepository clienteRepository;
    
    public ClienteServicioImpl(ClienteRepository clienteRepository) {
    	this.clienteRepository = clienteRepository;
    }

    @Override
    public Cliente guardarCliente(Cliente cliente) {
        return clienteRepository.save(cliente);
    }

    @Override
    public Cliente obtenerClientePorId(Long id) {
        return clienteRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Cliente no encontrado con ID: " + id));
    }

    @Override
    public List<Cliente> obtenerTodosLosClientes() {
        return clienteRepository.findAll();
    }

    @Override
    public Cliente actualizarCliente(Long id, Cliente cliente) {
        Cliente existente = obtenerClientePorId(id);
        existente.setNombre(cliente.getNombre());
        return clienteRepository.save(existente);
    }

    @Override
    public void eliminarCliente(Long id) {
        Cliente cliente = obtenerClientePorId(id);
        clienteRepository.delete(cliente);
    }

	@Override
	public List<Pedido> obtenerPedidosPorCliente(Cliente cliente) {
		return cliente.getPedidos();
	}

	@Override
	public Page<Cliente> obtenerTodosLosClientes(Pageable pageable) {
		return clienteRepository.findAll(pageable);
	}

	@Override
	public Page<Cliente> buscarClientesPorNombre(String nombre, Pageable pageable) {
		return clienteRepository.findByNombreContaining(nombre,pageable);
	}

	
}