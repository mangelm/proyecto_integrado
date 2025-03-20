package com.gestioneventos;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;


@SpringBootApplication
@ComponentScan(basePackages = "com.gestioneventos")
public class GestionEventosApplication {
	
	public static void main(String[] args) {
		SpringApplication.run(GestionEventosApplication.class, args);
	}
	
}
