package com.gestioneventos.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.gestioneventos.model.Producto;

public interface ProductoRepository extends JpaRepository<Producto, Long> {

}
