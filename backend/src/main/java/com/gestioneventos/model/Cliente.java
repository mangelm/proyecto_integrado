package com.gestioneventos.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.gestioneventos.model.enumeration.Rol;

import jakarta.persistence.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@Entity
public class Cliente {
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
	@NotBlank(message = "El nombre del cliente no puede estar vacío.")
    @Size(min = 2, max = 50, message = "El nombre debe tener entre 2 y 50 caracteres.")
	private String nombre;
    
	@NotBlank(message = "El apellido del cliente no puede estar vacío.")
    @Size(min = 2, max = 100, message = "El apellido debe tener entre 2 y 100 caracteres.")
	private String apellido;
	
	@NotBlank(message = "El email no puede estar vacío.")
	@Email(message = "El formato del email no es válido.")
	@Size(max = 254, message = "El email no puede exceder los 254 caracteres.")
	@Column(unique = true, nullable = false)
    private String email;
    
	@NotBlank(message = "El teléfono no puede estar vacío.")
	@Pattern(regexp = "^\\d{3}-\\d{3}-\\d{3}$", message = "El formato del teléfono debe ser XXX-XXX-XXX.")
	@Size(max = 20, message = "El teléfono no puede exceder los 20 caracteres.")
	private String telefono;
    
	@NotNull(message = "El rol no puede ser nulo.")
    @Enumerated(EnumType.STRING)
    private Rol rol = Rol.CLIENTE;
    
    //Para gestionar la relacion y que no serialize los eventos
	@Valid
    @JsonManagedReference("cliente-eventos")
	@OneToMany(mappedBy = "cliente", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY) //Añadido como buena práctica para relaciones
    private List<Evento> eventos;
    
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

	public String getApellido() {
		return apellido;
	}

	public void setApellido(String apellido) {
		this.apellido = apellido;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getTelefono() {
		return telefono;
	}

	public void setTelefono(String telefono) {
		this.telefono = telefono;
	}

	public List<Evento> getEventos() {
		return eventos;
	}

	public void setEventos(List<Evento> eventos) {
		this.eventos = eventos;
	}

	public Rol getRol() {
		return rol;
	}

	public void setRol(Rol rol) {
		this.rol = rol;
	}
	
}
