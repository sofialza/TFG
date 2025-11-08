package com.eventos.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "orden_compra_detalle")
public class OrdenCompraDetalle {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idOcDet;
    
    @ManyToOne
    @JoinColumn(name = "id_insumo", nullable = false)
    private Insumo insumo;
    
    @ManyToOne
    @JoinColumn(name = "id_oc", nullable = false)
    private OrdenCompra ordenCompra;
    
    @Column(name = "cantidad_pedida", nullable = false)
    private Double cantidadPedida;
    
    @Column(name = "precio_unitario", nullable = false)
    private Double precioUnitario;
    
    @Column(name = "cantidad_recibida")
    private Double cantidadRecibida;
    
    @Column(name = "estado_linea")
    @Enumerated(EnumType.STRING)
    private EstadoLinea estadoLinea;
    
    public enum EstadoLinea {
        PENDIENTE,
        PARCIAL,
        RECIBIDA
    }
}
