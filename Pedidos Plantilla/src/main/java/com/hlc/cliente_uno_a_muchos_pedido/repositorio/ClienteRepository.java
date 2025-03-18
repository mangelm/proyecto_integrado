package com.hlc.cliente_uno_a_muchos_pedido.repositorio;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hlc.cliente_uno_a_muchos_pedido.entidad.Cliente;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long>  {

	Page<Cliente> findByNombreContaining(String nombre, Pageable pageable);
	
}
