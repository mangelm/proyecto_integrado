package com.gestioneventos.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

//Para configurar de forma general el cors y poder tener la conexión con el frontend
@Configuration
public class WebConfig implements WebMvcConfigurer {
	@Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Permite CORS para todas las rutas
                .allowedOrigins("http://localhost:5173") // El origen de tu frontend
                .allowedMethods("GET", "POST", "PUT", "DELETE") // Los métodos HTTP permitidos
                .allowedHeaders("*") // Permite todos los encabezados
                .allowCredentials(true); // Permite el uso de cookies si es necesario
    }
}
