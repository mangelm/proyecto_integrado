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
	
	@Override
	public Cliente crearCliente(Cliente cliente) {
		return clienteRepository.save(cliente);
	}
	
	@Override
	public List<Cliente> obtenerTodosLosClientes() {
		return clienteRepository.findAll();
	}
	

	@Override
	public Cliente obtenerClientePorId(Long id) {
		return clienteRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Cliente no encontrado con ID: " + id));
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
	public Page<Cliente> obtenerTodosLosClientes(Pageable pageable) {
		return clienteRepository.findAll(pageable);
	}

}
