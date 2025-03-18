package com.gestioneventos.repository;

import com.gestioneventos.model.Evento;
import org.springframework.data.jpa.repository.JpaRepository;


public interface EventoRepository extends JpaRepository <Evento, Long>{

}
