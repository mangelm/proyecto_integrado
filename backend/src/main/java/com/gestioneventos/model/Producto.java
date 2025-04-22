package com.gestioneventos.model;

import java.math.BigDecimal;

import com.gestioneventos.model.enumeration.Categoria;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Entity
public class Producto {
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
	@NotBlank(message = "El nombre del producto no puede estar vacío.")
    @Size(min = 2, max = 100, message = "El nombre del producto debe tener entre 2 y 100 caracteres.")
	private String nombre;
    
	@Size(max = 500, message = "La descripción del producto no puede exceder los 500 caracteres.")
	private String descripcion;
	
	@NotNull(message = "El precio del producto es obligatorio.")
    @DecimalMin(value = "0.01", message = "El precio debe ser mayor que 0.")
    @Digits(integer = 10, fraction = 2, message = "El precio debe tener un formato numérico con máximo 2 decimales.")
    private BigDecimal precio;
	
	@NotNull(message = "El impuesto del producto es obligatorio.")
	@DecimalMin(value = "0.00", message = "El impuesto no puede ser negativo.")
	@Digits(integer = 5, fraction = 2, message = "El impuesto debe tener un formato numérico con máximo 2 decimales.")
    private BigDecimal impuesto;
    
	@NotNull(message = "La disponibilidad del producto es obligatoria.")
	private Boolean disponible;
    
	@NotNull(message = "La categoría del producto es obligatoria.")
    @Enumerated(EnumType.STRING)
    private Categoria categoria;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getNombre() {
		return nombre;
	}

	public void setNombre(String nombre) {
		this.nombre = nombre;
	}

	public String getDescripcion() {
		return descripcion;
	}

	public void setDescripcion(String descripcion) {
		this.descripcion = descripcion;
	}

	public BigDecimal getPrecio() {
		return precio;
	}

	public void setPrecio(BigDecimal precio) {
		this.precio = precio;
	}

	public BigDecimal getImpuesto() {
		return impuesto;
	}

	public void setImpuesto(BigDecimal impuesto) {
		this.impuesto = impuesto;
	}

	public Boolean getDisponible() {
		return disponible;
	}

	public void setDisponible(Boolean disponible) {
		this.disponible = disponible;
	}

	public Categoria getCategoria() {
		return categoria;
	}

	public void setCategoria(Categoria categoria) {
		this.categoria = categoria;
	}
 
}
