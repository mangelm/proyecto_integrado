package com.gestioneventos.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.gestioneventos.model.Producto;

// Esta interfaz extiende JpaRepository, lo que significa que hereda métodos para realizar operaciones CRUD en la entidad Producto.
// El primer parámetro es la entidad y el segundo es el tipo de dato del ID de la entidad.
@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {

}
