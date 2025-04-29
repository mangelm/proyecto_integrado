package com.gestioneventos.model;

import java.math.BigDecimal;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Ticket {
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "evento_id", nullable = false)
    private Evento evento;

    @ManyToOne
    @JoinColumn(name = "producto_id", nullable = false)
    private Producto producto;

    private Integer cantidad;
    private BigDecimal precioTotal;
	
    public Long getId() {
		return id;
	}
	
    public void setId(Long id) {
		this.id = id;
	}
	
    public Evento getEvento() {
		return evento;
	}
	
    public void setEvento(Evento evento) {
		this.evento = evento;
	}
	
    public Producto getProducto() {
		return producto;
	}
	
    public void setProducto(Producto producto) {
		this.producto = producto;
	}
	
    public Integer getCantidad() {
		return cantidad;
	}
	
    public void setCantidad(Integer cantidad) {
		this.cantidad = cantidad;
	}
	
    public BigDecimal getPrecioTotal() {
		return precioTotal;
	}
	
    public void setPrecioTotal(BigDecimal precioTotal) {
		this.precioTotal = precioTotal;
	}
   
}
