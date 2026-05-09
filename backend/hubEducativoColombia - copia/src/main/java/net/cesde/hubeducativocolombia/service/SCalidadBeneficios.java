package net.cesde.hubeducativocolombia.service;

import net.cesde.hubeducativocolombia.model.MCalidadBeneficios;
import net.cesde.hubeducativocolombia.repo.ICalidadBeneficios;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class SCalidadBeneficios {

    @Autowired
    ICalidadBeneficios iCalidadBeneficios;

    public SCalidadBeneficios(ICalidadBeneficios iCalidadBeneficios) {
        this.iCalidadBeneficios = iCalidadBeneficios;
    }

    // Consultar por programa
    public MCalidadBeneficios consultarPorPrograma(Integer idprograma) throws Exception {
        try {
            Optional<MCalidadBeneficios> registro = iCalidadBeneficios.findByIdprograma(idprograma);
            if (registro.isPresent())
                return registro.get();
            else
                throw new Exception("Información de calidad no encontrada");
        } catch (Exception error) {
            throw new Exception(error.getMessage());
        }
    }

    // Programas con becas
    public List<MCalidadBeneficios> buscarConBecas() throws Exception {
        try {
            return iCalidadBeneficios.findByOfrecebecas(true); //Pregunta porque creo que también está malo, por qué no sería la variable "ofrece becas"??
        } catch (Exception error) {
            throw new Exception(error.getMessage());
        }
    }

    // Programas acreditados
    public List<MCalidadBeneficios> buscarAcreditados() throws Exception {
        try {
            return iCalidadBeneficios.findByAcreditacionaltacalidad(true);
        } catch (Exception error) {
            throw new Exception(error.getMessage());
        }
    }


    // ADICIONAR
    public MCalidadBeneficios adicionarCalidadBeneficios(MCalidadBeneficios mCalidadBeneficios) throws Exception {
        try {
            return iCalidadBeneficios.save(mCalidadBeneficios);
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    // ACTUALIZAR
    public MCalidadBeneficios actualizarcalidadbeneficios(Integer idbeneficio, MCalidadBeneficios mCalidadBeneficios) throws Exception {
        try {
            Optional<MCalidadBeneficios> registroEncontrado = iCalidadBeneficios.findById(idbeneficio);
            if (registroEncontrado.isPresent()) {
                MCalidadBeneficios reg = registroEncontrado.get();
                reg.setAcreditacionaltacalidad(mCalidadBeneficios.getAcreditacionaltacalidad());
                reg.setOfrecebecas(mCalidadBeneficios.getOfrecebecas());
                reg.setDobletitulacion(mCalidadBeneficios.getDobletitulacion());
                reg.setRequieresegundoidioma(mCalidadBeneficios.getRequieresegundoidioma());
                return iCalidadBeneficios.save(reg);
            } else {
                throw new Exception("Registro no encontrado");
            }
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    // ELIMINAR
    public boolean eliminarcalidadbeneficios(Integer idbeneficio) throws Exception {
        try {
            Optional<MCalidadBeneficios> registroEncontrado = iCalidadBeneficios.findById(idbeneficio);
            if (registroEncontrado.isPresent()) {
                iCalidadBeneficios.deleteById(idbeneficio);
                return true;
            } else {
                throw new Exception("Registro calidad beneficio no encontrado");
            }
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }
}