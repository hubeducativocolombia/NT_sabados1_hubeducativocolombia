package net.cesde.hubeducativocolombia.service;


import net.cesde.hubeducativocolombia.model.MUsuarios;
import net.cesde.hubeducativocolombiaa.repo.IUsuarios;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SUsuarios {
    @Autowired
    IUsuarios iUsuarios;

    public SUsuarios(IUsuarios iUsuarios) {
        this.iUsuarios = iUsuarios;
    }

    //Adicionar un registro de Usuario

    public MUsuarios adicionarRegistroUsuario(MUsuarios mUsuarios) throws Exception {
        try{
           return iUsuarios.save(mUsuarios);
        }catch (Exception error){
            throw new Exception(error.getMessage());
        }
    }

    //Consulta de todos los registros del usuario
    public List<MUsuarios> consultaGeneralUsuarios() throws Exception{
        try {
            return iUsuarios.findAll();
        }catch (Exception error){
            throw new Exception(error.getMessage());
        }
    }

    //Consulta individual por llave primaria
    public MUsuarios consultaIndividualPorID(Integer idUsuario) throws Exception{
        try {
            Optional<MUsuarios> registroEncontrado=iUsuarios.findById(idUsuario);
            if (registroEncontrado.isPresent())
                return registroEncontrado.get();
            else
                throw new Exception("Usuario no registrado");
        }catch (Exception error){
            throw new Exception(error.getMessage());
        }
    }

    //Consulta individual por nombre
    public List<MUsuarios> consultaIndividualPorNombre(String nombrecompleto) throws Exception{
        try {
            return iUsuarios.findByNombrecompleto(nombrecompleto);
        }catch (Exception error){
            throw new Exception(error.getMessage());
        }
    }

    //Modificar un registro de usuario
    public MUsuarios modificarUsuario(Integer idusuario, MUsuarios mUsuarios) throws Exception{
        try {
            Optional<MUsuarios> registroEncontrado=iUsuarios.findById(idusuario);
            if (registroEncontrado.isPresent()){
                MUsuarios nuevoRegistro=registroEncontrado.get();
                nuevoRegistro.setIdusuario(mUsuarios.getIdusuario());
                nuevoRegistro.setNombrecompleto(mUsuarios.getNombrecompleto());
                nuevoRegistro.setCorreoelectronico(mUsuarios.getCorreoelectronico());
                nuevoRegistro.setHashcontrasena(mUsuarios.getHashcontrasena());
                nuevoRegistro.setRol(mUsuarios.getRol());
                nuevoRegistro.setEstaactivo(mUsuarios.getEstaactivo());
                nuevoRegistro.setFechamodificacion(mUsuarios.getFechamodificacion());
                return iUsuarios.save(nuevoRegistro);
            }else
                throw new Exception("No se puede modificar porque el usuario no está registrado");
        }catch (Exception error){
            throw new Exception(error.getMessage());
        }
    }

    //Eliminar un registro Usuario
    public Boolean eliminarUsuario(Integer idUsuario) throws Exception{
        try {
            Optional<MUsuarios> registroEncontrado=iUsuarios.findById(idUsuario);
            if (registroEncontrado.isPresent()){
                iUsuarios.deleteById(idUsuario);
                return true;
            }else {
                throw new Exception("No se pudo eliminar porque el usuario no está registrado");
            }
        }catch (Exception error){
            throw new Exception(error.getMessage());
        }
    }
}
