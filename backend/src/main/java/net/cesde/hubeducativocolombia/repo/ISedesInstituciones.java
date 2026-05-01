package net.cesde.hubeducativocolombia.repo;

import net.cesde.hubeducativocolombia.model.MSedesIntituciones;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ISedesInstituciones extends JpaRepository<MSedesIntituciones, Integer> {

    List<MSedesIntituciones> findByCiudad (String ciudad);

    List<MSedesIntituciones> findByNombresede(String nombresede);


}