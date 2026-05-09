package net.cesde.hubeducativocolombia.model;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table (name = "usuarios")
public class MUsuarios {

    //Atributos (los campos de la tabla)

    @Id
    @Column(name = "idusuario", nullable = false)
    private Long idusuario;

    @Column(name = "nombrecompleto", length = 150, nullable = false)
    private String nombrecompleto;

    @Column(name = "correoelectronico", length = 150, nullable = false, unique = true)
    private String correoelectronico;

    @Column(name = "hashcontrasena", length = 255, nullable = false)
    private String hashcontrasena;

    @Column(name = "rol", length = 30, nullable = false)
    private String rol;

    @Column(name = "estaactivo", nullable = false)
    private Boolean estaactivo;

    @Column(name = "fechacreacion", nullable = false)
    private LocalDate fechacreacion;

    @Column(name = "fechamodificacion", nullable = false)
    private LocalDate fechamodificacion;

    public MUsuarios(Long idusuario, String nombrecompleto, String correoelectronico, String hashcontrasena, String rol, Boolean estaactivo, LocalDate fechacreacion, LocalDate fechamodificacion) {
        this.idusuario = idusuario;
        this.nombrecompleto = nombrecompleto;
        this.correoelectronico = correoelectronico;
        this.hashcontrasena = hashcontrasena;
        this.rol = rol;
        this.estaactivo = estaactivo;
        this.fechacreacion = fechacreacion;
        this.fechamodificacion = fechamodificacion;
    }

    public MUsuarios() {
    }

    //Get and Set

    public Long getIdusuario() {
        return idusuario;
    }

    public void setIdusuario(Long idusuario) {
        this.idusuario = idusuario;
    }

    public String getNombrecompleto() {
        return nombrecompleto;
    }

    public void setNombrecompleto(String nombrecompleto) {
        this.nombrecompleto = nombrecompleto;
    }

    public String getCorreoelectronico() {
        return correoelectronico;
    }

    public void setCorreoelectronico(String correoelectronico) {
        this.correoelectronico = correoelectronico;
    }

    public String getHashcontrasena() {
        return hashcontrasena;
    }

    public void setHashcontrasena(String hashcontrasena) {
        this.hashcontrasena = hashcontrasena;
    }

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }

    public Boolean getEstaactivo() {
        return estaactivo;
    }

    public void setEstaactivo(Boolean estaactivo) {
        this.estaactivo = estaactivo;
    }

    public LocalDate getFechacreacion() {
        return fechacreacion;
    }

    public void setFechacreacion(LocalDate fechacreacion) {
        this.fechacreacion = fechacreacion;
    }

    public LocalDate getFechamodificacion() {
        return fechamodificacion;
    }

    public void setFechamodificacion(LocalDate fechamodificacion) {
        this.fechamodificacion = fechamodificacion;
    }
}
