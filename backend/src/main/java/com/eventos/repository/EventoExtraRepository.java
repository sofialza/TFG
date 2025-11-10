package com.eventos.repository;

import com.eventos.model.EventoExtra;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EventoExtraRepository extends JpaRepository<EventoExtra, Long> {
}
