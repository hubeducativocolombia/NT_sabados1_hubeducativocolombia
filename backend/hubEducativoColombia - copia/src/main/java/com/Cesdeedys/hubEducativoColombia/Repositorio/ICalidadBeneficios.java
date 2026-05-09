package net.cesde.hubeducativocolombia.repo;

import net.cesde.hubeducativocolombia.model.MCalidadBeneficios;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ICalidadBeneficios extends JpaRepository<MCalidadBeneficios, Integer> {

    List<MCalidadBeneficios> findByOfrecebecas (Boolean ofrecebecas);
    List<MCalidadBeneficios> findByAcreditacionaltacalidad (Boolean acreditacionaltacalidad);

    Optional<MCalidadBeneficios> findByIdprograma(Integer idprograma);


}