package net.cesde.hubeducativocolombia.repo;


import net.cesde.hubeducativocolombia.model.MUsuarios;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IUsuarios extends JpaRepository<MUsuarios, Integer> {


    //En una interface los métodos tienen que ser declarativos, no se implementa aquí

    //Se guarda en una lista con "LIST" y proceso a llever el mismo formato
    List<MUsuarios> findByNombrecompleto (String nombrecompleto);
}
