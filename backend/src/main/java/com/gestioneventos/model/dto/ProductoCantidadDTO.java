package com.gestioneventos.model.dto;

public class ProductoCantidadDTO {
    private String nombreProducto;
    private Integer cantidad;

    public ProductoCantidadDTO(String nombreProducto, Integer cantidad) {
        this.nombreProducto = nombreProducto;
        this.cantidad = cantidad;
    }

    public String getNombreProducto() {
        return nombreProducto;
    }

    public void setNombreProducto(String nombreProducto) {
        this.nombreProducto = nombreProducto;
    }

    public Integer getCantidad() {
        return cantidad;
    }

    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }
}
