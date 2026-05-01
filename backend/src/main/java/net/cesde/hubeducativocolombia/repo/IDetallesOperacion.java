package net.cesde.hubeducativocolombia.repo;

import net.cesde.hubeducativocolombia.model.MDetallesOperacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IDetallesOperacion extends JpaRepository<MDetallesOperacion, Integer> {

    Optional<MDetallesOperacion> findByIdprograma(Integer idprograma);

}