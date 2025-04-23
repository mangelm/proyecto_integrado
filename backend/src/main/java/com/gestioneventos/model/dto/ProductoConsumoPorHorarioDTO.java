package com.gestioneventos.model.dto;

public class ProductoConsumoPorHorarioDTO {
    private String nombre;
    private String horario;
    private Integer totalConsumido;

    public ProductoConsumoPorHorarioDTO() {
    }

    public ProductoConsumoPorHorarioDTO(String nombre, String horario, Integer totalConsumido) {
        this.nombre = nombre;
        this.horario = horario;
        this.totalConsumido = totalConsumido;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getHorario() {
        return horario;
    }

    public void setHorario(String horario) {
        this.horario = horario;
    }

    public Integer getTotalConsumido() {
        return totalConsumido;
    }

    public void setTotalConsumido(Integer totalConsumido) {
        this.totalConsumido = totalConsumido;
    }

    @Override
    public String toString() {
        return "ProductoConsumoPorHorarioDTO{" +
                "nombre='" + nombre + '\'' +
                ", horario='" + horario + '\'' +
                ", totalConsumido=" + totalConsumido +
                '}';
    }
}