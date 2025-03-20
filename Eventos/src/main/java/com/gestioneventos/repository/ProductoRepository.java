package com.gestioneventos.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.gestioneventos.model.Producto;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {

}
