package com.Cesdeedys.hubEducativoColombia.Repositorio;


import com.Cesdeedys.hubEducativoColombia.Modelo.MUsuarios;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IUsuarios extends JpaRepository<MUsuarios, Long> {
//Le cambié integer a long por si acasito

    //En una interface los métodos tienen que ser declarativos, no se implementa aquí

    //Se guarda en una lista con "LIST" y proceso a llever el mismo formato
    List<MUsuarios> findByNombrecompleto (String nombrecompleto);
}
