package com.Cesdeedys.hubEducativoColombia.Repositorio;

import com.Cesdeedys.hubEducativoColombia.Modelo.MSedesIntituciones;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ISedesInstituciones extends JpaRepository<MSedesIntituciones, Integer> {

    List<MSedesIntituciones> findByciudad (String ciudad);

    List<MSedesIntituciones> findBynombresede(String nombresede);


}