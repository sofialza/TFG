package com.eventos.controller;

import com.eventos.model.Proveedor;
import com.eventos.service.ProveedorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/proveedores")
@CrossOrigin(origins = "*")
public class ProveedorController {
    
    @Autowired
    private ProveedorService proveedorService;
    
    @GetMapping
    public ResponseEntity<List<Proveedor>> obtenerProveedores(
            @RequestParam(required = false) String nombre) {
        List<Proveedor> proveedores;
        if (nombre != null && !nombre.isEmpty()) {
            proveedores = proveedorService.buscarPorNombre(nombre);
        } else {
            proveedores = proveedorService.obtenerTodos();
        }
        return ResponseEntity.ok(proveedores);
    }
}
