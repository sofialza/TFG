package com.eventos.repository;

import com.eventos.model.OrdenCompra;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrdenCompraRepository extends JpaRepository<OrdenCompra, Long> {
    List<OrdenCompra> findByEstado(OrdenCompra.Estado estado);
    List<OrdenCompra> findByProveedorIdProveedor(Long idProveedor);
}
