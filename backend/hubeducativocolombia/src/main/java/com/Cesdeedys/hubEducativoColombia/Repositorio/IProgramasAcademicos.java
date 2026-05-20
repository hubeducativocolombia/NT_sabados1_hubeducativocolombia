package com.Cesdeedys.hubEducativoColombia.Repositorio;

import com.Cesdeedys.hubEducativoColombia.Modelo.MProgramasAcademicos;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface IProgramasAcademicos extends JpaRepository<MProgramasAcademicos, Integer> {
    List<MProgramasAcademicos> findBynombreprograma(String nombreprograma);
    List<MProgramasAcademicos> findBynivelformacion(String nivelformacion);
    List<MProgramasAcademicos> findByInstituciones_Idinstitucion(Integer idinstitucion);
    List<MProgramasAcademicos> findByestaactivo(Boolean estaactivo);


}