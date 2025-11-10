package com.eventos.dto;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class EventoCreateDTO {
    private String nombreCliente;
    private String mailCliente;
    private String tipoEvento;
    private Integer cantidadAsistentes;
    private LocalDate fecha;
    private String itinerario;
    private Long menuId;
    private List<Long> extraIds = new ArrayList<>();

    public String getNombreCliente() {
        return nombreCliente;
    }

    public void setNombreCliente(String nombreCliente) {
        this.nombreCliente = nombreCliente;
    }

    public String getMailCliente() {
        return mailCliente;
    }

    public void setMailCliente(String mailCliente) {
        this.mailCliente = mailCliente;
    }

    public String getTipoEvento() {
        return tipoEvento;
    }

    public void setTipoEvento(String tipoEvento) {
        this.tipoEvento = tipoEvento;
    }

    public Integer getCantidadAsistentes() {
        return cantidadAsistentes;
    }

    public void setCantidadAsistentes(Integer cantidadAsistentes) {
        this.cantidadAsistentes = cantidadAsistentes;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public String getItinerario() {
        return itinerario;
    }

    public void setItinerario(String itinerario) {
        this.itinerario = itinerario;
    }

    public Long getMenuId() {
        return menuId;
    }

    public void setMenuId(Long menuId) {
        this.menuId = menuId;
    }

    public List<Long> getExtraIds() {
        return extraIds;
    }

    public void setExtraIds(List<Long> extraIds) {
        this.extraIds = extraIds != null ? extraIds : new ArrayList<>();
    }
}
