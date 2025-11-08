package com.eventos.controller;

import com.eventos.model.Menu;
import com.eventos.repository.MenuRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menus")
@CrossOrigin(origins = "*")
public class MenuController {
    
    @Autowired
    private MenuRepository menuRepository;
    
    @PostMapping
    public ResponseEntity<Menu> crearMenu(@RequestBody Menu menu) {
        Menu nuevoMenu = menuRepository.save(menu);
        return new ResponseEntity<>(nuevoMenu, HttpStatus.CREATED);
    }
    
    @GetMapping
    public ResponseEntity<List<Menu>> obtenerTodosMenus() {
        List<Menu> menus = menuRepository.findAll();
        return ResponseEntity.ok(menus);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Menu> obtenerMenuPorId(@PathVariable Long id) {
        return menuRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Menu> actualizarMenu(@PathVariable Long id, @RequestBody Menu menu) {
        return menuRepository.findById(id)
                .map(menuExistente -> {
                    menuExistente.setNombre(menu.getNombre());
                    menuExistente.setPrimerPlato(menu.getPrimerPlato());
                    menuExistente.setSegundoPlato(menu.getSegundoPlato());
                    menuExistente.setTorta(menu.getTorta());
                    Menu menuActualizado = menuRepository.save(menuExistente);
                    return ResponseEntity.ok(menuActualizado);
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarMenu(@PathVariable Long id) {
        if (menuRepository.existsById(id)) {
            menuRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
