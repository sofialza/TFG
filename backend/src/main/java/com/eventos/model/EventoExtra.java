package com.eventos.model;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Data
@Entity
@Table(name = "evento_extra")
public class EventoExtra {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "id_extra", nullable = false)
    private Extra extra;
    
    @ManyToOne
    @JoinColumn(name = "id_evento", nullable = false)
    private Evento evento;
    
    private String descripcion;
}
