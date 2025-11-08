package com.eventos.service;

import com.eventos.model.*;
import com.eventos.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class EventoService {
    
    @Autowired
    private EventoRepository eventoRepository;
    
    @Autowired
    private MenuInsumoRepository menuInsumoRepository;
    
    @Autowired
    private InsumoRepository insumoRepository;
    
    public Evento crearEvento(Evento evento) {
        return eventoRepository.save(evento);
    }
    
    public List<Evento> obtenerTodosEventos() {
        return eventoRepository.findAll();
    }
    
    public Optional<Evento> obtenerEventoPorId(Long id) {
        return eventoRepository.findById(id);
    }
    
    public Evento actualizarEvento(Long id, Evento eventoActualizado) {
        return eventoRepository.findById(id)
                .map(evento -> {
                    evento.setFecha(eventoActualizado.getFecha());
                    evento.setTipoEvento(eventoActualizado.getTipoEvento());
                    evento.setCantidadAsistentes(eventoActualizado.getCantidadAsistentes());
                    evento.setMenu(eventoActualizado.getMenu());
                    evento.setItinerario(eventoActualizado.getItinerario());
                    evento.setNombreCliente(eventoActualizado.getNombreCliente());
                    evento.setMailCliente(eventoActualizado.getMailCliente());
                    return eventoRepository.save(evento);
                })
                .orElseThrow(() -> new RuntimeException("Evento no encontrado"));
    }
    
    public void eliminarEvento(Long id) {
        eventoRepository.deleteById(id);
    }
    
    public Map<String, Object> calcularProyeccionConsumo(Long idEvento) {
        Evento evento = eventoRepository.findById(idEvento)
                .orElseThrow(() -> new RuntimeException("Evento no encontrado"));
        
        if (evento.getMenu() == null) {
            throw new RuntimeException("El evento no tiene menú asignado");
        }
        
        List<MenuInsumo> menuInsumos = menuInsumoRepository.findByMenuIdMenu(evento.getMenu().getIdMenu());
        
        List<Map<String, Object>> proyecciones = new ArrayList<>();
        List<Map<String, Object>> alertas = new ArrayList<>();
        
        for (MenuInsumo menuInsumo : menuInsumos) {
            Insumo insumo = menuInsumo.getInsumo();
            
            double consumoProyectado = menuInsumo.getCantidadPorPersona() * evento.getCantidadAsistentes();
            
            double stockActual = insumo.getCantidadActual();
            
            boolean stockInsuficiente = stockActual < consumoProyectado;
            
            double faltante = stockInsuficiente ? consumoProyectado - stockActual : 0;
            
            Map<String, Object> proyeccion = new HashMap<>();
            proyeccion.put("insumo", insumo.getNombre());
            proyeccion.put("stockActual", stockActual);
            proyeccion.put("consumoProyectado", consumoProyectado);
            proyeccion.put("unidadMedida", insumo.getUnidadMedida());
            proyeccion.put("stockSuficiente", !stockInsuficiente);
            proyeccion.put("faltante", faltante);
            
            proyecciones.add(proyeccion);
            
            if (stockInsuficiente) {
                Map<String, Object> alerta = new HashMap<>();
                alerta.put("tipo", "STOCK_BAJO");
                alerta.put("insumo", insumo.getNombre());
                alerta.put("mensaje", "Stock insuficiente para el evento. Faltan " + faltante + " " + insumo.getUnidadMedida());
                alerta.put("stockActual", stockActual);
                alerta.put("consumoProyectado", consumoProyectado);
                alerta.put("faltante", faltante);
                
                alertas.add(alerta);
            }
        }
        
        Map<String, Object> resultado = new HashMap<>();
        resultado.put("evento", evento.getIdEvento());
        resultado.put("nombreEvento", evento.getTipoEvento());
        resultado.put("fecha", evento.getFecha());
        resultado.put("cantidadAsistentes", evento.getCantidadAsistentes());
        resultado.put("proyecciones", proyecciones);
        resultado.put("alertas", alertas);
        resultado.put("tieneAlertas", !alertas.isEmpty());
        
        return resultado;
    }
}
