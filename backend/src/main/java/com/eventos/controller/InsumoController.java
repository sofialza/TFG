package com.eventos.controller;

import com.eventos.model.Insumo;
import com.eventos.service.InsumoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/insumos")
@CrossOrigin(origins = "*")
public class InsumoController {
    
    @Autowired
    private InsumoService insumoService;
    
    @PostMapping
    public ResponseEntity<Insumo> crearInsumo(@RequestBody Insumo insumo) {
        Insumo nuevoInsumo = insumoService.crearInsumo(insumo);
        return new ResponseEntity<>(nuevoInsumo, HttpStatus.CREATED);
    }
    
    @GetMapping
    public ResponseEntity<List<Insumo>> obtenerTodosInsumos() {
        List<Insumo> insumos = insumoService.obtenerTodosInsumos();
        return ResponseEntity.ok(insumos);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Insumo> obtenerInsumoPorId(@PathVariable Long id) {
        return insumoService.obtenerInsumoPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Insumo> actualizarInsumo(@PathVariable Long id, @RequestBody Insumo insumo) {
        try {
            Insumo insumoActualizado = insumoService.actualizarInsumo(id, insumo);
            return ResponseEntity.ok(insumoActualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PatchMapping("/{id}/stock")
    public ResponseEntity<Insumo> actualizarStock(@PathVariable Long id, @RequestBody Map<String, Double> body) {
        try {
            Double nuevaCantidad = body.get("cantidad");
            Insumo insumoActualizado = insumoService.actualizarStock(id, nuevaCantidad);
            return ResponseEntity.ok(insumoActualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarInsumo(@PathVariable Long id) {
        insumoService.eliminarInsumo(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/alertas-stock-bajo")
    public ResponseEntity<List<Map<String, Object>>> obtenerAlertasStockBajo(
            @RequestParam(defaultValue = "10.0") Double umbral) {
        List<Map<String, Object>> alertas = insumoService.obtenerAlertasStockBajo(umbral);
        return ResponseEntity.ok(alertas);
    }
}
