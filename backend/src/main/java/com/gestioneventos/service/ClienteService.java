package com.gestioneventos.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.gestioneventos.model.Cliente;

//Interfaz creada para que siempre se cumpla la misma estructura en cuanto a funciones y parametros
public interface ClienteService {
	//Metodos para implementar
	Cliente crearCliente(Cliente cliente);
	List<Cliente> obtenerTodosLosClientes();
	Cliente obtenerClientePorId(Long id);
	Cliente actualizarCliente(Long id, Cliente cliente);
	void eliminarCliente(Long id);
	Page<Cliente> obtenerTodosLosClientes(Pageable pageable);
}
