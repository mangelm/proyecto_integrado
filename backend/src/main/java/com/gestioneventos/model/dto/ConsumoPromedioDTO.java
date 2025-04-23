package com.gestioneventos.model.dto;

public class ConsumoPromedioDTO {
    private String producto;
    private Integer cantidadPersonasQueConsumieron;
    private Double consumoPromedio;

    public ConsumoPromedioDTO() {
    }

    public ConsumoPromedioDTO(String producto, Integer cantidadPersonasQueConsumieron, Double consumoPromedio) {
        this.producto = producto;
        this.cantidadPersonasQueConsumieron = cantidadPersonasQueConsumieron;
        this.consumoPromedio = consumoPromedio;
    }

    public String getProducto() {
        return producto;
    }

    public void setProducto(String producto) {
        this.producto = producto;
    }

    public Integer getCantidadPersonasQueConsumieron() {
        return cantidadPersonasQueConsumieron;
    }

    public void setCantidadPersonasQueConsumieron(Integer cantidadPersonasQueConsumieron) {
        this.cantidadPersonasQueConsumieron = cantidadPersonasQueConsumieron;
    }

    public Double getConsumoPromedio() {
        return consumoPromedio;
    }

    public void setConsumoPromedio(Double consumoPromedio) {
        this.consumoPromedio = consumoPromedio;
    }

    @Override
    public String toString() {
        return "ConsumoPromedioDTO{" +
                "producto='" + producto + '\'' +
                ", cantidadPersonasQueConsumieron=" + cantidadPersonasQueConsumieron +
                ", consumoPromedio=" + consumoPromedio +
                '}';
    }
}