package net.cesde.hubeducativocolombia.service;

import net.cesde.hubeducativocolombia.model.MDetallesOperacion;
import net.cesde.hubeducativocolombia.repo.IDetallesOperacion;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class SDetallesOperacion {

    @Autowired
    IDetallesOperacion iDetallesOperacion;

    public SDetallesOperacion(IDetallesOperacion iDetallesOperacion) {
        this.iDetallesOperacion = iDetallesOperacion;
    }

    // Consultar por programa
    public MDetallesOperacion consultarPorPrograma(Integer idprograma) throws Exception {
        try {
            Optional<MDetallesOperacion> registro = iDetallesOperacion.findByIdprograma(idprograma);
            if (registro.isPresent())
                return registro.get();
            else
                throw new Exception("Detalle no encontrado");
        } catch (Exception error) {
            throw new Exception(error.getMessage());
        }
    }
}