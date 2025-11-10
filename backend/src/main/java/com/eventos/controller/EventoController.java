package com.eventos.controller;

import com.eventos.dto.EventoCreateDTO;
import com.eventos.model.Evento;
import com.eventos.service.EventoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/eventos")
@CrossOrigin(origins = "*")
public class EventoController {
    
    @Autowired
    private EventoService eventoService;
    
    @PostMapping
    public ResponseEntity<Evento> crearEvento(@RequestBody EventoCreateDTO dto) {
        Evento nuevoEvento = eventoService.crearEvento(dto);
        return new ResponseEntity<>(nuevoEvento, HttpStatus.CREATED);
    }
    
    @GetMapping
    public ResponseEntity<List<Evento>> obtenerTodosEventos() {
        List<Evento> eventos = eventoService.obtenerTodosEventos();
        return ResponseEntity.ok(eventos);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Evento> obtenerEventoPorId(@PathVariable Long id) {
        return eventoService.obtenerEventoPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Evento> actualizarEvento(@PathVariable Long id, @RequestBody Evento evento) {
        try {
            Evento eventoActualizado = eventoService.actualizarEvento(id, evento);
            return ResponseEntity.ok(eventoActualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarEvento(@PathVariable Long id) {
        eventoService.eliminarEvento(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/{id}/proyeccion-consumo")
    public ResponseEntity<Map<String, Object>> obtenerProyeccionConsumo(@PathVariable Long id) {
        try {
            Map<String, Object> proyeccion = eventoService.calcularProyeccionConsumo(id);
            return ResponseEntity.ok(proyeccion);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
