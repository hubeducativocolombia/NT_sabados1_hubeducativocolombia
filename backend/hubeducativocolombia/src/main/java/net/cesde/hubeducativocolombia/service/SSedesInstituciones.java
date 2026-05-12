package net.cesde.hubeducativocolombia.service;

import net.cesde.hubeducativocolombia.model.MSedesInstituciones;
import net.cesde.hubeducativocolombia.repo.ISedesInstituciones;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SSedesInstituciones {

    @Autowired
    ISedesInstituciones iSedesInstituciones;

    public SSedesInstituciones(ISedesInstituciones iSedesInstituciones) {
        this.iSedesInstituciones = iSedesInstituciones;
    }

    // Consultar por nombre sede institución
    public List<MSedesInstituciones> consultarPorNombreInstitucion(String nombresede) throws Exception {
        try {
            return iSedesInstituciones.findByNombresede(nombresede);
        } catch (Exception error) {
            throw new Exception(error.getMessage());
        }
    }

    // Consultar por ciudad
    public List<MSedesInstituciones> consultarPorCiudad(String ciudad) throws Exception {
        try {
            return iSedesInstituciones.findByCiudad(ciudad);
        } catch (Exception error) {
            throw new Exception(error.getMessage());
        }
    }


    // ADICIONAR
    public MSedesInstituciones adicionarSedeInstitucion(MSedesInstituciones mSedesInstituciones) throws Exception {
        try {
            return iSedesInstituciones.save(mSedesInstituciones);
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    // ACTUALIZAR
    public MSedesInstituciones actualizarSedesInstitucion(Integer idsede, MSedesInstituciones mSedesInstituciones) throws Exception {
        try {
            Optional<MSedesInstituciones> registroEncontrado = iSedesInstituciones.findById(idsede);
            if (registroEncontrado.isPresent()) {
                MSedesInstituciones reg = registroEncontrado.get();
                reg.setNombresede(mSedesInstituciones.getNombresede());
                reg.setCiudad(mSedesInstituciones.getCiudad());
                reg.setDireccionfisica(mSedesInstituciones.getDireccionfisica());
                reg.setEssedeprincipal(mSedesInstituciones.getEssedeprincipal());
                return iSedesInstituciones.save(reg);
            } else {
                throw new Exception("Sede no encontrada");
            }
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    // ELIMINAR
    public boolean eliminarsedeinstituciones(Integer idsede) throws Exception {
        try {
            Optional<MSedesInstituciones> registroEncontrado = iSedesInstituciones.findById(idsede);
            if (registroEncontrado.isPresent()) {
                iSedesInstituciones.deleteById(idsede);
                return true;
            } else {
                throw new Exception("Sede no encontrada");
            }
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

}