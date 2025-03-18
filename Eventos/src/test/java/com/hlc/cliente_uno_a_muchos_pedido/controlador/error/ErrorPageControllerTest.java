package com.hlc.cliente_uno_a_muchos_pedido.controlador.error;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.ui.Model;


class ErrorPageControllerTest {

    @InjectMocks
    private ErrorPageController errorPageController;

    @Mock
    private HttpServletRequest request;

    @Mock
    private Model model;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("Debe redirigir a la página error/404 cuando el código de estado es 404")
    void handleError_DeberiaRetornarVista404() {
        when(request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE)).thenReturn(404);

        String viewName = errorPageController.handleError(request);
        assertThat(viewName).isEqualTo("error/404");
    }

    @Test
    @DisplayName("Debe redirigir a la página error/500 cuando el código de estado es 500")
    void handleError_DeberiaRetornarVista500() {
        when(request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE)).thenReturn(500);

        String viewName = errorPageController.handleError(request);
        assertThat(viewName).isEqualTo("error/500");
    }

    @Test
    @DisplayName("Debe redirigir a la página error/403 cuando el código de estado es 403")
    void handleError_DeberiaRetornarVista403() {
        when(request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE)).thenReturn(403);

        String viewName = errorPageController.handleError(request);
        assertThat(viewName).isEqualTo("error/403");
    }

    @Test
    @DisplayName("Debe redirigir a error/default para códigos desconocidos")
    void handleError_DeberiaRetornarVistaDefault() {
        when(request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE)).thenReturn(418); // Código HTTP 418 - Teapot (Ejemplo)

        String viewName = errorPageController.handleError(request);
        assertThat(viewName).isEqualTo("error/default");
    }


}
