package com.hlc.cliente_uno_a_muchos_pedido.controlador;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

class HomeControladorTest {

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        
        // Configurar MockMvc para testear controladores sin servidor
        mockMvc = MockMvcBuilders.standaloneSetup(new HomeControlador()).build();
    }

    @Test
    @DisplayName("Debe devolver la vista 'public/home' con el título correcto en el modelo")
    void mostrarHome_DeberiaRetornarVistaHome() throws Exception {
        mockMvc.perform(get("/home"))
               .andExpect(status().isOk()) // Verifica que la respuesta es 200 OK
               .andExpect(view().name("public/home")) // Verifica la vista retornada
               .andExpect(model().attributeExists("titulo")) // Verifica que el modelo contiene el atributo 'titulo'
               .andExpect(model().attribute("titulo", "Bienvenido a la Gestión de Pedidos")); // Verifica que 'titulo' tiene el valor correcto
    }
}
