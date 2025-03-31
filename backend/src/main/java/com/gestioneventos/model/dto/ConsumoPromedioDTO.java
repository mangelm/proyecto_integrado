package com.gestioneventos.model.dto;

public class ConsumoPromedioDTO {
    private String producto;
    private int cantidadPersonas;
    private double consumoPromedio;

    public ConsumoPromedioDTO(String producto, int cantidadPersonas, double consumoPromedio) {
        this.producto = producto;
        this.cantidadPersonas = cantidadPersonas;
        this.consumoPromedio = consumoPromedio;
    }

    public String getProducto() { return producto; }
    public int getCantidadPersonas() { return cantidadPersonas; }
    public double getConsumoPromedio() { return consumoPromedio; }
}

