package com.Cesdeedys.hubEducativoColombia.Repositorio;

import com.Cesdeedys.hubEducativoColombia.Modelo.MDetallesOperacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IDetallesOperacion extends JpaRepository<MDetallesOperacion, Integer> {

    Optional<MDetallesOperacion> findByiddetalle(Integer iddetalle);

    Optional<MDetallesOperacion> findByProgramasacademicos_Idprograma(Integer idprograma);

}