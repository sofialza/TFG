package com.eventos.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;

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
    private List<EventoExtra> eventoExtras;
}
