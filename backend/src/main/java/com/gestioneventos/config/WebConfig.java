package com.gestioneventos.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

//Para configurar de forma general el cors y poder tener la conexión con el frontend
@Configuration
// Se utiliza la anotación @Configuration para indicar que esta clase es una clase de configuración de Spring.
public class WebConfig implements WebMvcConfigurer {
	@Override
    // Se utiliza el método addCorsMappings para agregar configuraciones de CORS.
    // Este método se llama automáticamente por Spring cuando se inicia la aplicación.
    // El CorsRegistry se utiliza para registrar las configuraciones de CORS.
    // También se especifican los métodos HTTP permitidos (GET, POST, PUT, DELETE) y se permiten todos los encabezados.
    // Finalmente, se permite el uso de cookies si es necesario (allowCredentials(true)).
    // Se permite el acceso a todas las rutas (/**) desde un origen específico (http://localhost:5173).
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Permite CORS para todas las rutas
                .allowedOrigins("http://localhost:5173") // El origen de tu frontend
                .allowedMethods("GET", "POST", "PUT", "DELETE") // Los métodos HTTP permitidos
                .allowedHeaders("*") // Permite todos los encabezados
                .allowCredentials(true); // Permite el uso de cookies si es necesario
    }
}
