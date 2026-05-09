package net.cesde.hubeducativocolombia.repo;

import net.cesde.hubeducativocolombia.model.MProgramasAcademicos;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface IProgramasAcademicos extends JpaRepository<MProgramasAcademicos, Integer> {
    List<MProgramasAcademicos> findByNombreprograma(String nombreprograma);
    List<MProgramasAcademicos> findBynivelformacion(String nivelformacion);
    List<MProgramasAcademicos> findByIdinstitucion(Integer idinstitucion);
    List<MProgramasAcademicos> findByEstaactivo(Boolean estaactivo);


}