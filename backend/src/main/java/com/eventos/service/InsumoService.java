package com.eventos.service;

import com.eventos.model.Insumo;
import com.eventos.repository.InsumoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
@Transactional
public class InsumoService {
    
    @Autowired
    private InsumoRepository insumoRepository;
    
    public Insumo crearInsumo(Insumo insumo) {
        insumo.setFechaActualizacion(LocalDateTime.now());
        return insumoRepository.save(insumo);
    }
    
    public List<Insumo> obtenerTodosInsumos() {
        return insumoRepository.findAll();
    }
    
    public Optional<Insumo> obtenerInsumoPorId(Long id) {
        return insumoRepository.findById(id);
    }
    
    public Insumo actualizarInsumo(Long id, Insumo insumoActualizado) {
        return insumoRepository.findById(id)
                .map(insumo -> {
                    insumo.setNombre(insumoActualizado.getNombre());
                    insumo.setCantidadActual(insumoActualizado.getCantidadActual());
                    insumo.setUnidadMedida(insumoActualizado.getUnidadMedida());
                    insumo.setFechaActualizacion(LocalDateTime.now());
                    return insumoRepository.save(insumo);
                })
                .orElseThrow(() -> new RuntimeException("Insumo no encontrado"));
    }
    
    public Insumo actualizarStock(Long id, Double nuevaCantidad) {
        return insumoRepository.findById(id)
                .map(insumo -> {
                    insumo.setCantidadActual(nuevaCantidad);
                    insumo.setFechaActualizacion(LocalDateTime.now());
                    return insumoRepository.save(insumo);
                })
                .orElseThrow(() -> new RuntimeException("Insumo no encontrado"));
    }
    
    public void eliminarInsumo(Long id) {
        insumoRepository.deleteById(id);
    }
    
    public List<Map<String, Object>> obtenerAlertasStockBajo(Double umbral) {
        List<Insumo> insumosStockBajo = insumoRepository.findInsumosConStockBajo(umbral);
        
        List<Map<String, Object>> alertas = new ArrayList<>();
        
        for (Insumo insumo : insumosStockBajo) {
            Map<String, Object> alerta = new HashMap<>();
            alerta.put("idInsumo", insumo.getIdInsumo());
            alerta.put("nombre", insumo.getNombre());
            alerta.put("stockActual", insumo.getCantidadActual());
            alerta.put("umbral", umbral);
            alerta.put("unidadMedida", insumo.getUnidadMedida());
            alerta.put("tipo", "STOCK_BAJO");
            alerta.put("mensaje", "El stock de " + insumo.getNombre() + " está por debajo del umbral");
            
            alertas.add(alerta);
        }
        
        return alertas;
    }
}
