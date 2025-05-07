package com.gestioneventos.model.dto;

public class ClienteInfoDTO {
    private String email;
    private String telefono;

    public ClienteInfoDTO(String email, String telefono) {
        this.email = email;
        this.telefono = telefono;
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
} 