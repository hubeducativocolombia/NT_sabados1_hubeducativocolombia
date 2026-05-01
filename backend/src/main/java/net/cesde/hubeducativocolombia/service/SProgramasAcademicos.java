package net.cesde.hubeducativocolombia.service;

import net.cesde.hubeducativocolombia.model.MProgramasAcademicos;
import net.cesde.hubeducativocolombia.repo.IProgramasAcademicos;
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
    public List<MProgramasAcademicos> consultaGeneral() throws Exception {
        try {
            return iProgramasAcademicos.findAll();
        } catch (Exception error) {
            throw new Exception(error.getMessage());
        }
    }

    // Consulta por ID
    public MProgramasAcademicos consultaPorId(Integer idprograma) throws Exception {
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
    public List<MProgramasAcademicos> buscarPorNombreProgramaAcademico(String nombreprograma) throws Exception {
        try {
            return iProgramasAcademicos.findByNombreprograma(nombreprograma);
        } catch (Exception error) {
            throw new Exception(error.getMessage());
        }
    }

    // Buscar por nivel
    public List<MProgramasAcademicos> buscarPorNivel(String nivelformacion) throws Exception {
        try {
            return iProgramasAcademicos.findBynivelformacion(nivelformacion);
        } catch (Exception error) {
            throw new Exception(error.getMessage());
        }
    }

    // Buscar por ID institución
    public List<MProgramasAcademicos> buscarPorInstitucion(Integer idinstitucion) throws Exception {
        try {
            return iProgramasAcademicos.findByIdinstitucion(idinstitucion);
        } catch (Exception error) {
            throw new Exception(error.getMessage());
        }
    }

    // Buscar activos
    public List<MProgramasAcademicos> buscarActivos() throws Exception {
        try {
            return iProgramasAcademicos.findByEstaactivo(true);
        } catch (Exception error) {
            throw new Exception(error.getMessage());
        }
    }
}