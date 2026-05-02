package net.cesde.hubeducativocolombia.service;

import net.cesde.hubeducativocolombia.model.MSedesIntituciones;
import net.cesde.hubeducativocolombia.repo.ISedesInstituciones;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SSedesInstituciones {

    @Autowired
    ISedesInstituciones iSedesInstituciones;

    public SSedesInstituciones(ISedesInstituciones iSedesInstituciones) {
        this.iSedesInstituciones = iSedesInstituciones;
    }

    // Consultar por nombre sede institución
    public List<MSedesIntituciones> consultarPorNombreInstitucion(String nombresede) throws Exception {
        try {
            return iSedesInstituciones.findByNombresede(nombresede);
        } catch (Exception error) {
            throw new Exception(error.getMessage());
        }
    }

    // Consultar por ciudad
    public List<MSedesIntituciones> consultarPorCiudad(String ciudad) throws Exception {
        try {
            return iSedesInstituciones.findByCiudad(ciudad);
        } catch (Exception error) {
            throw new Exception(error.getMessage());
        }
    }
}