package com.Cesdeedys.hubEducativoColombia.Servicio;

import com.Cesdeedys.hubEducativoColombia.Modelo.MDetallesOperacion;
import com.Cesdeedys.hubEducativoColombia.Repositorio.IDetallesOperacion;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class SDetallesOperacion {

    private static final Logger log = LoggerFactory.getLogger(SDetallesOperacion.class);
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

    // ADICIONAR
    public MDetallesOperacion adicionarDetallesOperacion(MDetallesOperacion mDetallesOperacion) throws Exception {
        try {
            return iDetallesOperacion.save(mDetallesOperacion);
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    // ACTUALIZAR
    public MDetallesOperacion actualizarDetallesOperacion(Integer iddetalle, MDetallesOperacion mDetallesOperacion) throws Exception {
        try {
            Optional<MDetallesOperacion> registroEncontrado = iDetallesOperacion.findById(iddetalle);
            if (registroEncontrado.isPresent()) {
                MDetallesOperacion reg = registroEncontrado.get();
                reg.setCostosemestre(mDetallesOperacion.getCostosemestre());
                reg.setModalidad(mDetallesOperacion.getModalidad());
                reg.setJornada(mDetallesOperacion.getJornada());
                reg.setEstudiantesactivos(mDetallesOperacion.getEstudiantesactivos());
                reg.setFechaactualizacion(mDetallesOperacion.getFechaactualizacion());
                return iDetallesOperacion.save(reg);
            } else {
                throw new Exception("Detalle no encontrado");
            }
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    // ELIMINAR
    public boolean eliminardetalleoperacion(Integer iddetalle) throws Exception {
        try {
            Optional<MDetallesOperacion> registroEncontrado = iDetallesOperacion.findById(iddetalle);
            if (registroEncontrado.isPresent()) {
                iDetallesOperacion.deleteById(iddetalle);
                return true;
            } else {
                throw new Exception("Detalle no encontrado");
            }
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }
}