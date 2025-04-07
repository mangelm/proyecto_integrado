package com.gestioneventos.model.dto;

import java.math.BigDecimal;

public class AgregarProductosDTO {
	
	private Long productoId;
    private Integer cantidad;
    private BigDecimal precioUnitario;
    private BigDecimal impuesto;
    
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
