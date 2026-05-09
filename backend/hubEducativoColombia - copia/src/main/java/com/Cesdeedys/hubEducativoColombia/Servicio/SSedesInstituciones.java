package com.Cesdeedys.hubEducativoColombia.Servicio;

import com.Cesdeedys.hubEducativoColombia.Modelo.MSedesIntituciones;
import com.Cesdeedys.hubEducativoColombia.Repositorio.ISedesInstituciones;
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
    public List<MSedesIntituciones> consultarpornombreinstitucion(String nombresede) throws Exception {
        try {
            return iSedesInstituciones.findBynombresede(nombresede);
        } catch (Exception error) {
            throw new Exception(error.getMessage());
        }
    }

    // Consultar por ciudad
    public List<MSedesIntituciones> consultarporciudad(String ciudad) throws Exception {
        try {
            return iSedesInstituciones.findByciudad(ciudad);
        } catch (Exception error) {
            throw new Exception(error.getMessage());
        }
    }


    // ADICIONAR
    public MSedesIntituciones adicionarsedesinstituciones(MSedesIntituciones mSedesIntituciones) throws Exception {
        try {
            return iSedesInstituciones.save(mSedesIntituciones);
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    // ACTUALIZAR
    public MSedesIntituciones actualizarsedesinstituciones(Integer idsede, MSedesIntituciones mSedesIntituciones) throws Exception {
        try {
            Optional<MSedesIntituciones> registroEncontrado = iSedesInstituciones.findById(idsede);
            if (registroEncontrado.isPresent()) {
                MSedesIntituciones reg = registroEncontrado.get();
                reg.setNombresede(mSedesIntituciones.getNombresede());
                reg.setCiudad(mSedesIntituciones.getCiudad());
                reg.setDireccionfisica(mSedesIntituciones.getDireccionfisica());
                reg.setEssedeprincipal(mSedesIntituciones.getEssedeprincipal());
                return iSedesInstituciones.save(reg);
            } else {
                throw new Exception("Sede no encontrada");
            }
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    // ELIMINAR
    public boolean eliminarsedesinstituciones(Integer idsede) throws Exception {
        try {
            Optional<MSedesIntituciones> registroEncontrado = iSedesInstituciones.findById(idsede);
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