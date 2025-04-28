package com.gestioneventos.model.dto;

// DTO para representar el consumo promedio de un producto en un evento
// Se utiliza para enviar datos al cliente y recibirlos del servicio correspondiente
public class ConsumoPromedioDTO {
    private String producto; // Nombre del producto
    private Integer cantidadPersonasQueConsumieron; // Cantidad de personas que consumieron el producto
    private Double consumoPromedio; // Consumo promedio del producto

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

    // Método para representar el objeto como una cadena de texto
    // Se utiliza para facilitar la depuración y el registro de información
    @Override
    public String toString() {
        return "ConsumoPromedioDTO{" +
                "producto='" + producto + '\'' +
                ", cantidadPersonasQueConsumieron=" + cantidadPersonasQueConsumieron +
                ", consumoPromedio=" + consumoPromedio +
                '}';
    }
}