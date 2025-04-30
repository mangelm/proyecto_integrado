package com.gestioneventos.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class ConflictoRecursoException extends RuntimeException {
    
    private static final long serialVersionUID = 1L;

    public ConflictoRecursoException(String mensaje) {
        super(mensaje);
    }

    public ConflictoRecursoException(String mensaje, Throwable causa) {
        super(mensaje, causa);
    }
} 