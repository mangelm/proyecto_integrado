package com.gestioneventos.model.dto;

public class ProductoConsumoDTO {
	private String nombre;
    private Long totalConsumido;

    public ProductoConsumoDTO(String nombre, Long totalConsumido) {
        this.nombre = nombre;
        this.totalConsumido = totalConsumido;
    }

    public String getNombre() {
        return nombre;
    }

    public Long getTotalConsumido() {
        return totalConsumido;
    }
}
