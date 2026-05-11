package net.cesde.hubeducativocolombia.repo;

import net.cesde.hubeducativocolombia.model.MSedesInstituciones;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ISedesInstituciones extends JpaRepository<MSedesInstituciones, Integer> {

    List<MSedesInstituciones> findByCiudad (String ciudad);

    List<MSedesInstituciones> findByNombresede(String nombresede);


}