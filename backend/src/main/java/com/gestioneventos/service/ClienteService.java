package com.gestioneventos.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.gestioneventos.model.Cliente;

public interface ClienteService {
	Cliente crearCliente(Cliente cliente);
	List<Cliente> obtenerTodosLosClientes();
	Cliente obtenerClientePorId(Long id);
	Cliente actualizarCliente(Long id, Cliente cliente);
	void eliminarCliente(Long id);
	Page<Cliente> obtenerTodosLosClientes(Pageable pageable);
}
