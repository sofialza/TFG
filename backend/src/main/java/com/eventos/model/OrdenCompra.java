package com.eventos.model;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.time.LocalDate;
import java.util.List;

@Data
@Entity
@Table(name = "orden_compra")
public class OrdenCompra {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idOc;
    
    @ManyToOne
    @JoinColumn(name = "id_proveedor", nullable = false)
    private Proveedor proveedor;
    
    @ManyToOne
    @JoinColumn(name = "id_evento")
    @JsonIgnore
    private Evento evento;
    
    @Column(name = "fecha_emision", nullable = false)
    private LocalDate fechaEmision;
    
    @Column(name = "fecha_necesidad")
    private LocalDate fechaNecesidad;
    
    @Column(name = "fecha_recepcion")
    private LocalDate fechaRecepcion;
    
    @Enumerated(EnumType.STRING)
    private Estado estado;
    
    private Double total;
    
    @OneToMany(mappedBy = "ordenCompra", cascade = CascadeType.ALL)
    private List<OrdenCompraDetalle> detalles;
    
    public enum Estado {
        PENDIENTE,
        PROCESANDO,
        COMPLETADA,
        RECIBIDA,
        PARCIAL,
        CANCELADA
    }
}
