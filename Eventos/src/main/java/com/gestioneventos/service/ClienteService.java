package com.gestioneventos.service;

import java.util.List;

import com.gestioneventos.model.Cliente;

public interface ClienteService {
	Cliente crearCliente(Cliente cliente);
	List<Cliente> obtenerTodosLosClientes();
	Cliente obtenerClientePorId(Long id);
	Cliente actualizarCliente(Long id, Cliente cliente);
	void eliminarCliente(Long id);
}
