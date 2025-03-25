package com.gestioneventos.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.gestioneventos.model.ConsumoProducto;

@Repository
public interface ConsumoProductoRepository extends JpaRepository<ConsumoProducto, Long> {
	// Verifica si existen consumos asociados a un producto específico
    boolean existsByProductoId(Long productoId);
    
    // Elimina todos los consumos asociados a un producto específico
    void deleteByProductoId(Long productoId);
}
