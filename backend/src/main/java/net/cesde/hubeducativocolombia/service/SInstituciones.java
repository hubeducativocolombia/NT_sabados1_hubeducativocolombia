package net.cesde.hubeducativocolombia.service;

import net.cesde.hubeducativocolombia.model.MInstituciones;
import net.cesde.hubeducativocolombia.repo.IInstituciones;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class SInstituciones {

    @Autowired
    IInstituciones iInstituciones;

    public SInstituciones(IInstituciones iInstituciones) {
        this.iInstituciones = iInstituciones;
    }

    // Consulta general
    public List<MInstituciones> consultaGeneral() throws Exception {
        try {
            return iInstituciones.findAll();
        } catch (Exception error) {
            throw new Exception(error.getMessage());
        }
    }

    // Consulta por ID
    public MInstituciones consultaPorId(Integer idinstitucion) throws Exception {
        try {
            Optional<MInstituciones> registro = iInstituciones.findById(idinstitucion);
            if (registro.isPresent())
                return registro.get();
            else
                throw new Exception("Institución no encontrada");
        } catch (Exception error) {
            throw new Exception(error.getMessage());
        }
    }
}