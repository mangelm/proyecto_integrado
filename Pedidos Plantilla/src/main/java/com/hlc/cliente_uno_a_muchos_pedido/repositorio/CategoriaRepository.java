package com.hlc.cliente_uno_a_muchos_pedido.repositorio;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hlc.cliente_uno_a_muchos_pedido.entidad.Categoria;

@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Long>  {

    Optional<Categoria> findByNombreIgnoreCase(String nombre);
}
