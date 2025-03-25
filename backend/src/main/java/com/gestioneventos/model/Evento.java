package com.gestioneventos.model;

import java.sql.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.gestioneventos.model.enumeration.Estado;
import com.gestioneventos.model.enumeration.Horario;

import jakarta.persistence.*;

@Entity
public class Evento {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nombre;
    private Date fecha;
    private Integer cantidadPersonas;
    private String espacio;
    
    @Enumerated(EnumType.STRING)
    private Horario horario;
    
    @Enumerated(EnumType.STRING)
    private Estado estado;
    
    //Para gestionar la relacion y que no serialize los clientes
    @JsonBackReference("cliente-eventos")
    @ManyToOne
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;
    
    //Para gestionar la relacion y que no serialize los consumos
    @OneToMany(mappedBy = "evento", cascade = CascadeType.ALL)
    @JsonManagedReference("evento-consumos")
    private List<ConsumoProducto> consumos;
    
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

	public Date getFecha() {
		return fecha;
	}

	public void setFecha(Date fecha) {
		this.fecha = fecha;
	}

	public Integer getCantidadPersonas() {
		return cantidadPersonas;
	}

	public void setCantidadPersonas(Integer cantidadPersonas) {
		this.cantidadPersonas = cantidadPersonas;
	}

	public String getEspacio() {
		return espacio;
	}

	public void setEspacio(String espacio) {
		this.espacio = espacio;
	}

	public Horario getHorario() {
		return horario;
	}

	public void setHorario(Horario horario) {
		this.horario = horario;
	}

	public Estado getEstado() {
		return estado;
	}

	public void setEstado(Estado estado) {
		this.estado = estado;
	}

	public Cliente getCliente() {
		return cliente;
	}

	public void setCliente(Cliente cliente) {
		this.cliente = cliente;
	}

	public List<ConsumoProducto> getConsumos() {
		return consumos;
	}

	public void setConsumos(List<ConsumoProducto> consumos) {
		this.consumos = consumos;
	}

	
    
}
