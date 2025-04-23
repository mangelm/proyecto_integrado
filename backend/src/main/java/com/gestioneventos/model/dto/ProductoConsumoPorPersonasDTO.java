package com.gestioneventos.model.dto;

public class ProductoConsumoPorPersonasDTO {
    private String nombre;
    private Integer cantidadPersonas;
    private Integer totalConsumido;

    // Constructor vacío
    public ProductoConsumoPorPersonasDTO() {
    }

    // Constructor con todos los campos
    public ProductoConsumoPorPersonasDTO(String nombre, Integer cantidadPersonas, Integer totalConsumido) {
        this.nombre = nombre;
        this.cantidadPersonas = cantidadPersonas;
        this.totalConsumido = totalConsumido;
    }

    // Getter para nombre
    public String getNombre() {
        return nombre;
    }

    // Setter para nombre
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    // Getter para cantidadPersonas
    public Integer getCantidadPersonas() {
        return cantidadPersonas;
    }

    // Setter para cantidadPersonas
    public void setCantidadPersonas(Integer cantidadPersonas) {
        this.cantidadPersonas = cantidadPersonas;
    }

    // Getter para totalConsumido
    public Integer getTotalConsumido() {
        return totalConsumido;
    }

    // Setter para totalConsumido
    public void setTotalConsumido(Integer totalConsumido) {
        this.totalConsumido = totalConsumido;
    }

    @Override
    public String toString() {
        return "ProductoConsumoPorPersonasDTO{" +
                "nombre='" + nombre + '\'' +
                ", cantidadPersonas=" + cantidadPersonas +
                ", totalConsumido=" + totalConsumido +
                '}';
    }
}