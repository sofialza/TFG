package com.eventos.service;

import com.eventos.model.Extra;
import com.eventos.repository.ExtraRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExtraService {

    @Autowired
    private ExtraRepository extraRepository;

    public List<Extra> obtenerTodos() {
        return extraRepository.findAll();
    }

    public Extra obtenerPorId(Long id) {
        return extraRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Extra no encontrado"));
    }
}
