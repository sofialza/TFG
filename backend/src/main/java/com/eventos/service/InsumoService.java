package com.eventos.service;

import com.eventos.model.Insumo;
import com.eventos.model.ProvInsumo;
import com.eventos.model.Proveedor;
import com.eventos.repository.InsumoRepository;
import com.eventos.repository.ProvInsumoRepository;
import com.eventos.repository.ProveedorRepository;
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
    
    @Autowired
    private ProvInsumoRepository provInsumoRepository;
    
    @Autowired
    private ProveedorRepository proveedorRepository;
    
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
    
    public Insumo asignarProveedorPrincipal(Long idInsumo, Long idProveedor) {
        Insumo insumo = insumoRepository.findById(idInsumo)
                .orElseThrow(() -> new RuntimeException("Insumo no encontrado"));
        
        Proveedor proveedor = proveedorRepository.findById(idProveedor)
                .orElseThrow(() -> new RuntimeException("Proveedor no encontrado"));
        
        Optional<ProvInsumo> relacionExistente = provInsumoRepository
                .findByInsumo_IdInsumoAndProveedor_IdProveedor(idInsumo, idProveedor);
        
        if (relacionExistente.isEmpty()) {
            List<ProvInsumo> relacionesAnteriores = provInsumoRepository.findByInsumo_IdInsumo(idInsumo);
            Double precioPreservado = relacionesAnteriores.isEmpty() ? 0.0 : 
                    relacionesAnteriores.get(0).getPrecioUnitario();
            
            provInsumoRepository.deleteByInsumo_IdInsumo(idInsumo);
            
            ProvInsumo nuevaRelacion = new ProvInsumo();
            nuevaRelacion.setInsumo(insumo);
            nuevaRelacion.setProveedor(proveedor);
            nuevaRelacion.setPrecioUnitario(precioPreservado);
            nuevaRelacion.setFechaActualizacion(LocalDateTime.now());
            
            provInsumoRepository.save(nuevaRelacion);
        }
        
        return insumoRepository.findById(idInsumo).orElse(insumo);
    }
}
