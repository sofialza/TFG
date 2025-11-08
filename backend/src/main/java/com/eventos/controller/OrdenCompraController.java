package com.eventos.controller;

import com.eventos.model.OrdenCompra;
import com.eventos.service.OrdenCompraService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ordenes-compra")
@CrossOrigin(origins = "*")
public class OrdenCompraController {
    
    @Autowired
    private OrdenCompraService ordenCompraService;
    
    @PostMapping
    public ResponseEntity<OrdenCompra> crearOrdenCompra(@RequestBody OrdenCompra ordenCompra) {
        OrdenCompra nuevaOrden = ordenCompraService.crearOrdenCompra(ordenCompra);
        return new ResponseEntity<>(nuevaOrden, HttpStatus.CREATED);
    }
    
    @GetMapping
    public ResponseEntity<List<OrdenCompra>> obtenerTodasOrdenesCompra() {
        List<OrdenCompra> ordenes = ordenCompraService.obtenerTodasOrdenesCompra();
        return ResponseEntity.ok(ordenes);
    }
    
    @GetMapping("/pendientes")
    public ResponseEntity<List<OrdenCompra>> obtenerOrdenesPendientes() {
        List<OrdenCompra> ordenes = ordenCompraService.obtenerOrdenesPendientes();
        return ResponseEntity.ok(ordenes);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<OrdenCompra> obtenerOrdenCompraPorId(@PathVariable Long id) {
        return ordenCompraService.obtenerOrdenCompraPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PatchMapping("/{id}/estado")
    public ResponseEntity<OrdenCompra> actualizarEstado(
            @PathVariable Long id, 
            @RequestBody Map<String, String> body) {
        try {
            OrdenCompra.Estado nuevoEstado = OrdenCompra.Estado.valueOf(body.get("estado"));
            OrdenCompra ordenActualizada = ordenCompraService.actualizarEstado(id, nuevoEstado);
            return ResponseEntity.ok(ordenActualizada);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarOrdenCompra(@PathVariable Long id) {
        ordenCompraService.eliminarOrdenCompra(id);
        return ResponseEntity.noContent().build();
    }
}
