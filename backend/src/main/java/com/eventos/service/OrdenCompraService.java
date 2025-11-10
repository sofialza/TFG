package com.eventos.service;

import com.eventos.model.*;
import com.eventos.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class OrdenCompraService {
    
    @Autowired
    private OrdenCompraRepository ordenCompraRepository;
    
    @Autowired
    private InsumoRepository insumoRepository;
    
    @Autowired
    private EventoRepository eventoRepository;
    
    @Autowired
    private ProveedorRepository proveedorRepository;
    
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
    
    public OrdenCompra generarDesdeProyeccion(Long idEvento, List<Map<String, Object>> items) {
        Evento evento = eventoRepository.findById(idEvento)
                .orElseThrow(() -> new RuntimeException("Evento no encontrado"));
        
        if (items == null || items.isEmpty()) {
            throw new RuntimeException("No hay items para generar la orden");
        }
        
        Long idProveedor = ((Number) items.get(0).get("idProveedor")).longValue();
        Proveedor proveedor = proveedorRepository.findById(idProveedor)
                .orElseThrow(() -> new RuntimeException("Proveedor no encontrado"));
        
        OrdenCompra ordenCompra = new OrdenCompra();
        ordenCompra.setProveedor(proveedor);
        ordenCompra.setEvento(evento);
        ordenCompra.setFechaEmision(LocalDate.now());
        ordenCompra.setFechaNecesidad(evento.getFecha());
        ordenCompra.setEstado(OrdenCompra.Estado.PENDIENTE);
        
        List<OrdenCompraDetalle> detalles = new ArrayList<>();
        double total = 0.0;
        
        for (Map<String, Object> item : items) {
            Long idInsumo = ((Number) item.get("idInsumo")).longValue();
            Double cantidad = ((Number) item.get("cantidad")).doubleValue();
            
            Insumo insumo = insumoRepository.findById(idInsumo)
                    .orElseThrow(() -> new RuntimeException("Insumo no encontrado: " + idInsumo));
            
            OrdenCompraDetalle detalle = new OrdenCompraDetalle();
            detalle.setInsumo(insumo);
            detalle.setCantidadPedida(cantidad);
            detalle.setPrecioUnitario(0.0);
            detalle.setEstadoLinea(OrdenCompraDetalle.EstadoLinea.PENDIENTE);
            detalle.setOrdenCompra(ordenCompra);
            
            detalles.add(detalle);
        }
        
        ordenCompra.setDetalles(detalles);
        ordenCompra.setTotal(total);
        
        return ordenCompraRepository.save(ordenCompra);
    }
    
    public List<OrdenCompra> obtenerHistorico() {
        List<OrdenCompra.Estado> estadosHistorico = Arrays.asList(
            OrdenCompra.Estado.RECIBIDA, 
            OrdenCompra.Estado.PARCIAL,
            OrdenCompra.Estado.COMPLETADA
        );
        return ordenCompraRepository.findAll().stream()
                .filter(orden -> estadosHistorico.contains(orden.getEstado()))
                .collect(Collectors.toList());
    }
    
    public OrdenCompra confirmarRecepcion(Long idOrden, Map<String, Object> confirmacion) {
        OrdenCompra orden = ordenCompraRepository.findById(idOrden)
                .orElseThrow(() -> new RuntimeException("Orden de compra no encontrada"));
        
        LocalDate fechaRecepcion = LocalDate.parse((String) confirmacion.get("fechaRecepcion"));
        List<Map<String, Object>> detallesRecibidos = (List<Map<String, Object>>) confirmacion.get("detalles");
        
        boolean todasRecibidas = true;
        boolean algunaParcial = false;
        
        for (Map<String, Object> detalleRecibido : detallesRecibidos) {
            Long idDetalle = ((Number) detalleRecibido.get("idDetalle")).longValue();
            Double cantidadRecibida = ((Number) detalleRecibido.get("cantidadRecibida")).doubleValue();
            
            OrdenCompraDetalle detalle = orden.getDetalles().stream()
                    .filter(d -> d.getIdOcDet().equals(idDetalle))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Detalle no encontrado"));
            
            detalle.setCantidadRecibida(cantidadRecibida);
            
            if (cantidadRecibida < detalle.getCantidadPedida()) {
                algunaParcial = true;
                todasRecibidas = false;
                detalle.setEstadoLinea(OrdenCompraDetalle.EstadoLinea.PARCIAL);
            } else if (cantidadRecibida.equals(detalle.getCantidadPedida())) {
                detalle.setEstadoLinea(OrdenCompraDetalle.EstadoLinea.RECIBIDA);
            } else {
                detalle.setEstadoLinea(OrdenCompraDetalle.EstadoLinea.RECIBIDA);
            }
            
            Insumo insumo = detalle.getInsumo();
            insumo.setCantidadActual(insumo.getCantidadActual() + cantidadRecibida);
            insumoRepository.save(insumo);
        }
        
        orden.setFechaRecepcion(fechaRecepcion);
        
        if (todasRecibidas) {
            orden.setEstado(OrdenCompra.Estado.RECIBIDA);
        } else if (algunaParcial) {
            orden.setEstado(OrdenCompra.Estado.PARCIAL);
        }
        
        return ordenCompraRepository.save(orden);
    }
    
    public void autoConfirmarOrdenesPendientes() {
        LocalDate hoy = LocalDate.now();
        List<OrdenCompra> ordenesPendientes = ordenCompraRepository.findByEstado(OrdenCompra.Estado.PENDIENTE);
        
        for (OrdenCompra orden : ordenesPendientes) {
            if (orden.getFechaNecesidad() != null && !orden.getFechaNecesidad().isAfter(hoy)) {
                for (OrdenCompraDetalle detalle : orden.getDetalles()) {
                    detalle.setCantidadRecibida(detalle.getCantidadPedida());
                    detalle.setEstadoLinea(OrdenCompraDetalle.EstadoLinea.RECIBIDA);
                    
                    Insumo insumo = detalle.getInsumo();
                    insumo.setCantidadActual(insumo.getCantidadActual() + detalle.getCantidadPedida());
                    insumoRepository.save(insumo);
                }
                
                orden.setFechaRecepcion(hoy);
                orden.setEstado(OrdenCompra.Estado.RECIBIDA);
                ordenCompraRepository.save(orden);
            }
        }
    }
}
