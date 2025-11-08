package com.eventos.repository;

import com.eventos.model.MenuInsumo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MenuInsumoRepository extends JpaRepository<MenuInsumo, Long> {
    List<MenuInsumo> findByMenuIdMenu(Long idMenu);
}
