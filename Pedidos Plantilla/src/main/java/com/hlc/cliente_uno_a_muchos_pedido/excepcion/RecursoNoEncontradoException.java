package com.hlc.cliente_uno_a_muchos_pedido.excepcion;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND) // Indica que esta excepción devuelve un código HTTP 404
public class RecursoNoEncontradoException extends RuntimeException {

    private static final long serialVersionUID = 1L; // Identificador único para la serialización

    /**
     * Constructor de la excepción.
     *
     * @param mensaje Mensaje descriptivo del error, que puede incluir información
     *                sobre el recurso no encontrado.
     */
    public RecursoNoEncontradoException(String mensaje) {
        super(mensaje); // Llama al constructor de la clase padre (RuntimeException)
    }
}