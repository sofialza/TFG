package com.eventos.controller;

import com.eventos.model.Extra;
import com.eventos.service.ExtraService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/extras")
@CrossOrigin(origins = "*")
public class ExtraController {

    @Autowired
    private ExtraService extraService;

    @GetMapping
    public ResponseEntity<List<Extra>> obtenerTodos() {
        return ResponseEntity.ok(extraService.obtenerTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Extra> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(extraService.obtenerPorId(id));
    }
}
