package com.gestioneventos.controller.error;


import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.http.HttpServletRequest;

@Controller
public class ErrorPageController implements ErrorController {

    /**
     * Maneja las solicitudes a la URL de error.
     * 
     * <p>Este método determina el código de estado HTTP y redirige a la página
     * de error correspondiente.</p>
     * 
     * @param request el objeto {@link HttpServletRequest} que contiene la solicitud del cliente
     * @return el nombre de la vista para la página de error correspondiente
     */
    @GetMapping("/error")
    public String handleError(HttpServletRequest request) {
        Object statusObj = request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE);

        if (statusObj instanceof Integer statusCode) {
            return switch (statusCode) {
                case 404 -> "error/404";
                case 500 -> "error/500";
                case 403 -> "error/403";
                default -> "error/default";
            };
        }
        return "error/default";
    }
}