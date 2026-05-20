package com.Cesdeedys.hubEducativoColombia.Servicio;

import com.Cesdeedys.hubEducativoColombia.Modelo.MProgramasAcademicos;
import com.Cesdeedys.hubEducativoColombia.Repositorio.IProgramasAcademicos;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class SProgramasAcademicos {

    @Autowired
    IProgramasAcademicos iProgramasAcademicos;

    public SProgramasAcademicos(IProgramasAcademicos iProgramasAcademicos) {
        this.iProgramasAcademicos = iProgramasAcademicos;
    }

    // Consulta general
    public List<MProgramasAcademicos> consultageneral() throws Exception {
        try {
            return iProgramasAcademicos.findAll();
        } catch (Exception error) {
            throw new Exception(error.getMessage());
        }
    }

    // Consulta por ID
    public MProgramasAcademicos consultaporid(Integer idprograma) throws Exception {
        try {
            Optional<MProgramasAcademicos> registro = iProgramasAcademicos.findById(idprograma);
            if (registro.isPresent())
                return registro.get();
            else
                throw new Exception("Programa no encontrado");
        } catch (Exception error) {
            throw new Exception(error.getMessage());
        }
    }

    // Buscar por nombre
    public List<MProgramasAcademicos> buscarpornombreprogramaacademico(String nombreprograma) throws Exception {
        try {
            return iProgramasAcademicos.findBynombreprograma(nombreprograma);
        } catch (Exception error) {
            throw new Exception(error.getMessage());
        }
    }

    // Buscar por nivel
    public List<MProgramasAcademicos> buscarpornivel(String nivelformacion) throws Exception {
        try {
            return iProgramasAcademicos.findBynivelformacion(nivelformacion);
        } catch (Exception error) {
            throw new Exception(error.getMessage());
        }
    }

    // Buscar por ID institución
    public List<MProgramasAcademicos> buscarporinstitucion(Integer idinstitucion) throws Exception {
        try {
            return iProgramasAcademicos.findByInstituciones_Idinstitucion(idinstitucion);
        } catch (Exception error) {
            throw new Exception(error.getMessage());
        }
    }

    // Buscar activos
    public List<MProgramasAcademicos> buscaractivos() throws Exception {
        try {
            return iProgramasAcademicos.findByestaactivo(true);
        } catch (Exception error) {
            throw new Exception(error.getMessage());
        }
    }

    // ADICIONAR
    public MProgramasAcademicos adicionarprogramasacademicos(MProgramasAcademicos mProgramasAcademicos) throws Exception {
        try {
            return iProgramasAcademicos.save(mProgramasAcademicos);
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    // ACTUALIZAR
    public MProgramasAcademicos actualizarprogramasacademicos(Integer idprograma, MProgramasAcademicos mProgramasAcademicos) throws Exception {
        try {
            Optional<MProgramasAcademicos> registroEncontrado = iProgramasAcademicos.findById(idprograma);
            if (registroEncontrado.isPresent()) {
                MProgramasAcademicos reg = registroEncontrado.get();
                reg.setCodigosnies(mProgramasAcademicos.getCodigosnies());
                reg.setNombreprograma(mProgramasAcademicos.getNombreprograma());
                reg.setNivelformacion(mProgramasAcademicos.getNivelformacion());
                reg.setTotalsemestres(mProgramasAcademicos.getTotalsemestres());
                reg.setEstaactivo(mProgramasAcademicos.getEstaactivo());
                return iProgramasAcademicos.save(reg);
            } else {
                throw new Exception("Programa no encontrado");
            }
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    // ELIMINAR
    public boolean eliminarprogramasacademicos(Integer idprograma) throws Exception {
        try {
            Optional<MProgramasAcademicos> registroEncontrado = iProgramasAcademicos.findById(idprograma);
            if (registroEncontrado.isPresent()) {
                iProgramasAcademicos.deleteById(idprograma);
                return true;
            } else {
                throw new Exception("Programa no encontrado");
            }
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }
}