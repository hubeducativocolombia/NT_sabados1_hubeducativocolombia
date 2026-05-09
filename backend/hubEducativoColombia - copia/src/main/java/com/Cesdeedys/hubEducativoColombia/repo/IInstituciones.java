package net.cesde.hubeducativocolombia.repo;

import net.cesde.hubeducativocolombia.model.MInstituciones;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface IInstituciones extends JpaRepository<MInstituciones, Integer> {
    List<MInstituciones> findByNombreoficial(String nombreoficial);
}