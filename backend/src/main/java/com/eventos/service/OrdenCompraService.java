package com.eventos.service;

import com.eventos.model.OrdenCompra;
import com.eventos.repository.OrdenCompraRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class OrdenCompraService {
    
    @Autowired
    private OrdenCompraRepository ordenCompraRepository;
    
    public OrdenCompra crearOrdenCompra(OrdenCompra ordenCompra) {
        ordenCompra.setFechaEmision(LocalDate.now());
        if (ordenCompra.getEstado() == null) {
            ordenCompra.setEstado(OrdenCompra.Estado.PENDIENTE);
        }
        return ordenCompraRepository.save(ordenCompra);
    }
    
    public List<OrdenCompra> obtenerTodasOrdenesCompra() {
        return ordenCompraRepository.findAll();
    }
    
    public List<OrdenCompra> obtenerOrdenesPendientes() {
        return ordenCompraRepository.findByEstado(OrdenCompra.Estado.PENDIENTE);
    }
    
    public Optional<OrdenCompra> obtenerOrdenCompraPorId(Long id) {
        return ordenCompraRepository.findById(id);
    }
    
    public OrdenCompra actualizarEstado(Long id, OrdenCompra.Estado nuevoEstado) {
        return ordenCompraRepository.findById(id)
                .map(orden -> {
                    orden.setEstado(nuevoEstado);
                    return ordenCompraRepository.save(orden);
                })
                .orElseThrow(() -> new RuntimeException("Orden de compra no encontrada"));
    }
    
    public void eliminarOrdenCompra(Long id) {
        ordenCompraRepository.deleteById(id);
    }
}
