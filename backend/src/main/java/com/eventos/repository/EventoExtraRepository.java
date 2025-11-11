package com.eventos.repository;

import com.eventos.model.EventoExtra;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface EventoExtraRepository extends JpaRepository<EventoExtra, Long> {
    
    @Modifying
    @Query("DELETE FROM EventoExtra ee WHERE ee.evento.idEvento = :eventoId")
    void deleteByEventoId(@Param("eventoId") Long eventoId);
}
