package com.Cesdeedys.hubEducativoColombia.Repositorio;

import com.Cesdeedys.hubEducativoColombia.Modelo.MInstituciones;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface IInstituciones extends JpaRepository<MInstituciones, Integer> {
    List<MInstituciones> findByNombreoficial(String nombreoficial);
}