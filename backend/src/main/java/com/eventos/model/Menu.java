package com.eventos.model;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.List;

@Data
@Entity
@Table(name = "menu")
public class Menu {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idMenu;
    
    @Column(nullable = false)
    private String nombre;
    
    @Column(name = "primer_plato")
    private String primerPlato;
    
    @Column(name = "segundo_plato")
    private String segundoPlato;
    
    private String torta;
    
    @OneToMany(mappedBy = "menu", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<MenuInsumo> menuInsumos;
}
