package com.eventos.model;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.List;

@Data
@Entity
@Table(name = "proveedor")
public class Proveedor {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idProveedor;
    
    @Column(nullable = false)
    private String nombre;
    
    private String contacto;
    
    private Double precio;
    
    @OneToMany(mappedBy = "proveedor", cascade = CascadeType.ALL)
    private List<ProvInsumo> provInsumos;
}
