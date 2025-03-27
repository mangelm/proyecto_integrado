package com.gestioneventos.model.dto;

import java.util.Date;

public class EstadisticaOcupacionDTO {

    private String espacio;
    private String horario;
    private int totalEventos;
    private Date fecha;  // Nueva propiedad para la fecha

    public EstadisticaOcupacionDTO(String espacio, String horario, int totalEventos, Date fecha) {
        this.espacio = espacio;
        this.horario = horario;
        this.totalEventos = totalEventos;
        this.fecha = fecha;
    }

    // Getters y Setters
    public int getTotalEventos() {
        return totalEventos;
    }

    public String getEspacio() {
        return espacio;
    }

    public void setEspacio(String espacio) {
        this.espacio = espacio;
    }

    public String getHorario() {
        return horario;
    }

    public void setHorario(String horario) {
        this.horario = horario;
    }

    public void setTotalEventos(int totalEventos) {
        this.totalEventos = totalEventos;
    }

    public Date getFecha() {  // Getter para la fecha
        return fecha;
    }

    public void setFecha(Date fecha) {  // Setter para la fecha
        this.fecha = fecha;
    }
}
