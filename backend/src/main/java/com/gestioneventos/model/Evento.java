package com.gestioneventos.model;

import java.sql.Date;
import java.time.LocalTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.gestioneventos.model.enumeration.Estado;
import com.gestioneventos.model.enumeration.Horario;

import jakarta.persistence.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

@Entity
public class Evento {
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
	@NotBlank(message = "El nombre del evento no puede estar vacío.")
    @Size(min = 3, max = 100, message = "El nombre debe tener entre 3 y 100 caracteres.")
	private String nombre;
    
	@NotNull(message = "La fecha del evento no puede ser nula.")
    @Future(message = "La fecha del evento debe ser una fecha futura.") // O @Future si solo se permiten futuras
	private Date fecha;
    
	@NotNull(message = "La cantidad de personas no puede ser nula.")
    @Positive(message = "La cantidad de personas debe ser un número positivo.")
	private Integer cantidadPersonas;
	
	@NotBlank(message = "El espacio asignado no puede estar vacío.")
    @Size(max = 200, message = "El nombre del espacio no puede exceder los 200 caracteres.")
    private String espacio;
	
	@NotNull(message = "La hora del evento no puede ser nula.")
    private LocalTime hora;
    
	@NotNull(message = "El horario (turno) del evento no puede ser nulo.")
	@Enumerated(EnumType.STRING)
    private Horario horario;
    
	@NotNull(message = "El estado del evento no puede ser nulo.")
    @Enumerated(EnumType.STRING)
    private Estado estado = Estado.PENDIENTE;
    
    //Para gestionar la relacion y que no serialize los clientes
	//@NotNull(message = "El evento debe estar asociado a un cliente.")
	@Valid // Importante: valida el objeto Cliente asociado si tiene sus propias validaciones.
    @JsonBackReference("cliente-eventos")
    @ManyToOne
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;
    
    //Para gestionar la relacion y que no serialize los consumos
	@Valid // Importante: valida cada objeto ConsumoProducto dentro de la lista.
	@OneToMany(mappedBy = "evento", cascade = CascadeType.ALL, orphanRemoval = true)
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
	
	//definir cómo se debe serializar el atributo hora
	@JsonFormat(pattern = "HH:mm") 
    public LocalTime getHora() {
        return hora;
    }

	public void setHora(LocalTime hora) {
		this.hora = hora;
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
