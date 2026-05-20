package com.Cesdeedys.hubEducativoColombia.Repositorio;

import com.Cesdeedys.hubEducativoColombia.Modelo.MCalidadBeneficios;
import com.Cesdeedys.hubEducativoColombia.Modelo.MProgramasAcademicos;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ICalidadBeneficios extends JpaRepository<MCalidadBeneficios, Integer> {

    List<MCalidadBeneficios> findByofrecebecas (Boolean ofrecebecas);
    List<MCalidadBeneficios> findByacreditacionaltacalidad (Boolean acreditacionaltacalidad);

    Optional<MCalidadBeneficios> findByProgramasacademicos_Idprograma(Integer idprograma);

}