package com.eventos.model;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Data
@Entity
@Table(name = "evento")
public class Evento {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idEvento;
    
    @Column(nullable = false)
    private LocalDate fecha;
    
    @Column(name = "tipo_evento")
    private String tipoEvento;
    
    @Column(name = "cantidad_asistentes", nullable = false)
    private Integer cantidadAsistentes;
    
    @ManyToOne
    @JoinColumn(name = "id_menu")
    private Menu menu;
    
    private String itinerario;
    
    @Column(name = "nombre_cliente")
    private String nombreCliente;
    
    @Column(name = "mail_cliente")
    private String mailCliente;
    
    @OneToMany(mappedBy = "evento", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<EventoExtra> eventoExtras;
    
    @JsonProperty("extras")
    public List<Extra> getExtras() {
        if (eventoExtras == null) {
            return List.of();
        }
        return eventoExtras.stream()
                .map(EventoExtra::getExtra)
                .collect(Collectors.toList());
    }
}
