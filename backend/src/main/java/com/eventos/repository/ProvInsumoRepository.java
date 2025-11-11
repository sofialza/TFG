package com.eventos.repository;

import com.eventos.model.ProvInsumo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProvInsumoRepository extends JpaRepository<ProvInsumo, Long> {
    List<ProvInsumo> findByInsumo_IdInsumo(Long idInsumo);
    Optional<ProvInsumo> findByInsumo_IdInsumoAndProveedor_IdProveedor(Long idInsumo, Long idProveedor);
    void deleteByInsumo_IdInsumo(Long idInsumo);
}
