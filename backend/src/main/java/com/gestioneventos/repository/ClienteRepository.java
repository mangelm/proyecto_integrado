package com.gestioneventos.repository;

import com.gestioneventos.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
//Esta interfaz extiende JpaRepository, lo que significa que hereda métodos para realizar operaciones CRUD en la entidad Cliente.
// El primer parámetro es la entidad y el segundo es el tipo de dato del ID de la entidad.
public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    boolean existsByEmail(String email);
    
    @Query("SELECT c FROM Cliente c WHERE c.email = :email")
    Optional<Cliente> findByEmail(@Param("email") String email);
}
