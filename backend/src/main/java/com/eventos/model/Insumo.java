package com.eventos.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Table(name = "insumo")
public class Insumo {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idInsumo;
    
    @Column(nullable = false)
    private String nombre;
    
    @Column(name = "cantidad_actual", nullable = false)
    private Double cantidadActual;
    
    @Column(name = "unidad_medida", nullable = false)
    private String unidadMedida;
    
    @Column(name = "fecha_actualizacion")
    private LocalDateTime fechaActualizacion = LocalDateTime.now();
    
    @OneToMany(mappedBy = "insumo", cascade = CascadeType.ALL)
    private List<MenuInsumo> menuInsumos;
    
    @OneToMany(mappedBy = "insumo", cascade = CascadeType.ALL)
    private List<ProvInsumo> provInsumos;
}
