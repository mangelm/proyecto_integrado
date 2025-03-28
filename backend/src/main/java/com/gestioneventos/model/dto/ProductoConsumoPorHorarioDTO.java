package com.gestioneventos.model.dto;

public class ProductoConsumoPorHorarioDTO {
	private String nombre;
    private String horario;
    private Long totalConsumido;

    public ProductoConsumoPorHorarioDTO(String nombre, String horario, Long totalConsumido) {
        this.nombre = nombre;
        this.horario = horario;
        this.totalConsumido = totalConsumido;
    }

    // Getters
    public String getNombre() {
        return nombre;
    }

    public String getHorario() {
        return horario;
    }

    public Long getTotalConsumido() {
        return totalConsumido;
    }
}
