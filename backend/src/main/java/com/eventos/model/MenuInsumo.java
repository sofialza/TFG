package com.eventos.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "menu_insumo")
public class MenuInsumo {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "id_menu", nullable = false)
    private Menu menu;
    
    @ManyToOne
    @JoinColumn(name = "id_insumo", nullable = false)
    private Insumo insumo;
    
    @Column(name = "cantidad_por_persona", nullable = false)
    private Double cantidadPorPersona;
}
