package com.gestioneventos.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.gestioneventos.exception.RecursoNoEncontradoException;
import com.gestioneventos.model.Cliente;
import com.gestioneventos.repository.ClienteRepository;
import com.gestioneventos.service.ClienteService;

@Service
public class ClienteServiceImp implements ClienteService {
	
	@Autowired
	private ClienteRepository clienteRepository;
	
	//Metodo para crear un cliente
	@Override
	public Cliente crearCliente(Cliente cliente) {
		return clienteRepository.save(cliente);
	}
	
	//Metodo para obtener todos los clientes
	@Override
	public List<Cliente> obtenerTodosLosClientes() {
		return clienteRepository.findAll();
	}
	
	//Metodo para obtener un cliente por su id
	@Override
	public Cliente obtenerClientePorId(Long id) {
		return clienteRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Cliente no encontrado con ID: " + id));
	}
	
	
	//Metodo para actualizar un cliente concreto
	@Override
	public Cliente actualizarCliente(Long id, Cliente cliente) {
		Cliente existente = obtenerClientePorId(id);
		existente.setNombre(cliente.getNombre());
		existente.setApellido(cliente.getApellido());
		existente.setEmail(cliente.getEmail());
		existente.setTelefono(cliente.getTelefono());
		return clienteRepository.save(existente);
	}
	
	//Metodo para eliminar un producto por su id
	@Override
	public void eliminarCliente(Long id) {
		Cliente cliente = obtenerClientePorId(id);
		clienteRepository.delete(cliente);
	}
	
	//Metodo para implementar la paginacion en los clientes
	@Override
	public Page<Cliente> obtenerTodosLosClientes(Pageable pageable) {
		return clienteRepository.findAll(pageable);
	}

}
