package com.eventos.repository;

import com.eventos.model.Insumo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface InsumoRepository extends JpaRepository<Insumo, Long> {
    List<Insumo> findByNombreContaining(String nombre);
    
    @Query("SELECT i FROM Insumo i WHERE i.cantidadActual < :umbral")
    List<Insumo> findInsumosConStockBajo(Double umbral);
}
