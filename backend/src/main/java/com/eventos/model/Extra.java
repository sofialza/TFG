package com.eventos.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "extra")
public class Extra {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idExtra;
    
    @Column(nullable = false)
    private String nombre;
    
    private String descripcion;
    
    private Double precio;
}
