package com.gestioneventos.model.dto;

public class ProductoConsumoDTO {
    private String nombre;
    private Integer totalConsumido;

    public ProductoConsumoDTO() {
    }

    public ProductoConsumoDTO(String nombre, Integer totalConsumido) {
        this.nombre = nombre;
        this.totalConsumido = totalConsumido;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public Integer getTotalConsumido() {
        return totalConsumido;
    }

    public void setTotalConsumido(Integer totalConsumido) {
        this.totalConsumido = totalConsumido;
    }

    @Override
    public String toString() {
        return "ProductoConsumoDTO{" +
                "nombre='" + nombre + '\'' +
                ", totalConsumido=" + totalConsumido +
                '}';
    }
}
