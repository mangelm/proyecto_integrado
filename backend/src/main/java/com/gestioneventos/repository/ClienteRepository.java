package com.gestioneventos.repository;

import com.gestioneventos.model.Cliente;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
//Esta interfaz extiende JpaRepository, lo que significa que hereda métodos para realizar operaciones CRUD en la entidad Cliente.
// El primer parámetro es la entidad y el segundo es el tipo de dato del ID de la entidad.
public interface ClienteRepository extends JpaRepository<Cliente, Long> {

}
