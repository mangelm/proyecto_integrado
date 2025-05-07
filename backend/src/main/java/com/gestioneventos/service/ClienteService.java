package com.gestioneventos.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.gestioneventos.model.Cliente;

// Esta interfaz define los métodos que se implementarán en la clase de servicio para manejar la lógica de negocio relacionada con la entidad Cliente.
// La implementación de esta interfaz se encargará de interactuar con el repositorio de Cliente y realizar operaciones CRUD.
public interface ClienteService {
	// Métodos para manejar la lógica de negocio relacionada con la entidad Cliente.
	Cliente crearCliente(Cliente cliente);
	List<Cliente> obtenerTodosLosClientes();
	Cliente obtenerClientePorId(Long id);
	Cliente actualizarCliente(Long id, Cliente cliente);
	void eliminarCliente(Long id);
	Page<Cliente> obtenerTodosLosClientes(Pageable pageable);
	boolean existeClientePorEmail(String email);
	Cliente obtenerClientePorEmail(String email);
}
