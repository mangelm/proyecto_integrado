package com.gestioneventos.model.dto;

//ProductoConsumoPorPersonasDTO
public class ProductoConsumoPorPersonasDTO {
 private String nombre;
 private int cantidadPersonas;
 private long totalConsumido;  // Cambiar a 'long' para ser consistente

 // Constructor
 public ProductoConsumoPorPersonasDTO(String nombre, int cantidadPersonas, long totalConsumido) {
     this.nombre = nombre;
     this.cantidadPersonas = cantidadPersonas;
     this.totalConsumido = totalConsumido;
 }

 // Getters y Setters
 public String getNombre() {
     return nombre;
 }

 public void setNombre(String nombre) {
     this.nombre = nombre;
 }

 public int getCantidadPersonas() {
     return cantidadPersonas;
 }

 public void setCantidadPersonas(int cantidadPersonas) {
     this.cantidadPersonas = cantidadPersonas;
 }

 public long getTotalConsumido() {
     return totalConsumido;
 }

 public void setTotalConsumido(long totalConsumido) {
     this.totalConsumido = totalConsumido;
 }
}


