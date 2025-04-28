package com.gestioneventos.model.dto;

import java.math.BigDecimal;

// DTO para agregar productos a un evento
// Se utiliza para recibir los datos del cliente y enviarlos al servicio correspondiente
public class AgregarProductosDTO {
	
	private Long productoId; // ID del producto a agregar
    private Integer cantidad; // Cantidad de productos a agregar
    private BigDecimal precioUnitario; // Precio unitario del producto
    private BigDecimal impuesto; // Impuesto aplicado al producto
    
	public Long getProductoId() {
		return productoId;
	}
	
	public void setProductoId(Long productoId) {
		this.productoId = productoId;
	}
	
	public Integer getCantidad() {
		return cantidad;
	}
	
	public void setCantidad(Integer cantidad) {
		this.cantidad = cantidad;
	}
	
	public BigDecimal getPrecioUnitario() {
		return precioUnitario;
	}
	
	public void setPrecioUnitario(BigDecimal precioUnitario) {
		this.precioUnitario = precioUnitario;
	}
	
	public BigDecimal getImpuesto() {
		return impuesto;
	}
	
	public void setImpuesto(BigDecimal impuesto) {
		this.impuesto = impuesto;
	}
    
    
}
