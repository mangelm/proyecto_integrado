package com.gestioneventos.service.impl;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.gestioneventos.exception.RecursoNoEncontradoException;
import com.gestioneventos.exception.ValidacionException;
import com.gestioneventos.exception.ConflictoRecursoException;
import com.gestioneventos.model.Cliente;
import com.gestioneventos.repository.ClienteRepository;
import com.gestioneventos.service.ClienteService;

@Service
public class ClienteServiceImp implements ClienteService {
	
	private static final Logger logger = LoggerFactory.getLogger(ClienteServiceImp.class);
	
	@Autowired
	private ClienteRepository clienteRepository;
	
	@Autowired
	private PasswordEncoder passwordEncoder;
	
	//Metodo para crear un cliente
	@Override
	public Cliente crearCliente(Cliente cliente) {
		logger.info("Intentando crear cliente: {} {}", cliente.getNombre(), cliente.getApellido());
		
		// Validaciones
		if (cliente.getNombre() == null || cliente.getNombre().trim().isEmpty()) {
			throw new ValidacionException("El nombre del cliente no puede estar vacío");
		}
		
		if (cliente.getApellido() == null || cliente.getApellido().trim().isEmpty()) {
			throw new ValidacionException("El apellido del cliente no puede estar vacío");
		}
		
		if (cliente.getEmail() == null || cliente.getEmail().trim().isEmpty()) {
			throw new ValidacionException("El email del cliente no puede estar vacío");
		}
		
		// Si no se proporciona contraseña, usar la predeterminada
		if (cliente.getPassword() == null || cliente.getPassword().trim().isEmpty()) {
			cliente.setPassword("C4mb14m3");
		}
		
		// Verificar si el email ya existe
		if (clienteRepository.existsByEmail(cliente.getEmail())) {
			throw new ConflictoRecursoException("Ya existe un cliente con el email: " + cliente.getEmail());
		}
		
		// Cifrar la contraseña antes de guardar
		cliente.setPassword(passwordEncoder.encode(cliente.getPassword()));
		
		return clienteRepository.save(cliente);
	}
	
	//Metodo para obtener todos los clientes
	@Override
	public List<Cliente> obtenerTodosLosClientes() {
		logger.info("Obteniendo todos los clientes");
		return clienteRepository.findAll();
	}
	
	//Metodo para obtener un cliente por su id
	@Override
	public Cliente obtenerClientePorId(Long id) {
		logger.info("Buscando cliente con ID: {}", id);
		return clienteRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Cliente no encontrado con ID: " + id));
	}
	
	
	//Metodo para actualizar un cliente concreto
	@Override
	public Cliente actualizarCliente(Long id, Cliente cliente) {
		logger.info("Actualizando cliente con ID: {}", id);
		
		// Validaciones
		if (cliente.getNombre() == null || cliente.getNombre().trim().isEmpty()) {
			throw new ValidacionException("El nombre del cliente no puede estar vacío");
		}
		
		if (cliente.getApellido() == null || cliente.getApellido().trim().isEmpty()) {
			throw new ValidacionException("El apellido del cliente no puede estar vacío");
		}
		
		if (cliente.getEmail() == null || cliente.getEmail().trim().isEmpty()) {
			throw new ValidacionException("El email del cliente no puede estar vacío");
		}
		
		Cliente existente = obtenerClientePorId(id);
		
		// Verificar si el email ya existe para otro cliente
		if (!existente.getEmail().equals(cliente.getEmail()) && 
			clienteRepository.existsByEmail(cliente.getEmail())) {
			throw new ConflictoRecursoException("Ya existe un cliente con el email: " + cliente.getEmail());
		}

		// Actualización de campos
		existente.setNombre(cliente.getNombre());
		existente.setApellido(cliente.getApellido());
		existente.setEmail(cliente.getEmail());
		existente.setTelefono(cliente.getTelefono());
		
		// Si se proporciona una nueva contraseña, cifrarla y actualizarla
		if (cliente.getPassword() != null && !cliente.getPassword().trim().isEmpty()) {
			existente.setPassword(passwordEncoder.encode(cliente.getPassword()));
		}
		
		if (cliente.getRol() != null) {
			existente.setRol(cliente.getRol());
		}

		return clienteRepository.save(existente);
	}
	
	//Metodo para eliminar un producto por su id
	@Override
	public void eliminarCliente(Long id) {
		logger.info("Eliminando cliente con ID: {}", id);
		Cliente cliente = obtenerClientePorId(id);
		clienteRepository.delete(cliente);
	}
	
	//Metodo para implementar la paginacion en los clientes
	@Override
	public Page<Cliente> obtenerTodosLosClientes(Pageable pageable) {
		logger.info("Obteniendo clientes paginados");
		return clienteRepository.findAll(pageable);
	}

	@Override
	public boolean existeClientePorEmail(String email) {
		return clienteRepository.existsByEmail(email);
	}

	@Override
	public Cliente obtenerClientePorEmail(String email) {
		return clienteRepository.findByEmail(email)
				.orElseThrow(() -> new RuntimeException("Cliente no encontrado con email: " + email));
	}

}
