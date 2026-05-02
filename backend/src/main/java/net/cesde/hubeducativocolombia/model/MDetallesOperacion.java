package net.cesde.hubeducativocolombia.model;


import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table (name = "detallesoperacion")
public class MDetallesOperacion {

    @Id
    @Column(name = "iddetalle", nullable = false)
    private Integer iddetalle;

    @Column(name = "idprograma", nullable = false, unique = true)
    private Integer idprograma;

    @Column(name = "costosemestre", nullable = false)
    private BigDecimal costosemestre;

    @Column(name = "modalidad", length = 20, nullable = false)
    private String modalidad;

    @Column(name = "jornada", length = 25, nullable = false)
    private String jornada;

    @Column(name = "estudiantesactivos", nullable = false)
    private Integer estudiantesactivos;

    @Column(name = "fechaactualizacion", nullable = false)
    private LocalDateTime fechaactualizacion;


    //Relaciones

    @ManyToOne
    @JoinColumn(name = "pkidprograma", referencedColumnName = "idprograma")
    @JsonBackReference
    private MProgramasAcademicos programasacademicos;

    //Constructores

    public MDetallesOperacion(Integer iddetalle, Integer idprograma, BigDecimal costosemestre, String modalidad, String jornada, Integer estudiantesactivos, LocalDateTime fechaactualizacion) {
        this.iddetalle = iddetalle;
        this.idprograma = idprograma;
        this.costosemestre = costosemestre;
        this.modalidad = modalidad;
        this.jornada = jornada;
        this.estudiantesactivos = estudiantesactivos;
        this.fechaactualizacion = fechaactualizacion;
    }

    public MDetallesOperacion() {
    }

    //Get and Set


    public Integer getIddetalle() {
        return iddetalle;
    }

    public void setIddetalle(Integer iddetalle) {
        this.iddetalle = iddetalle;
    }

    public Integer getIdprograma() {
        return idprograma;
    }

    public void setIdprograma(Integer idprograma) {
        this.idprograma = idprograma;
    }

    public BigDecimal getCostosemestre() {
        return costosemestre;
    }

    public void setCostosemestre(BigDecimal costosemestre) {
        this.costosemestre = costosemestre;
    }

    public String getModalidad() {
        return modalidad;
    }

    public void setModalidad(String modalidad) {
        this.modalidad = modalidad;
    }

    public String getJornada() {
        return jornada;
    }

    public void setJornada(String jornada) {
        this.jornada = jornada;
    }

    public Integer getEstudiantesactivos() {
        return estudiantesactivos;
    }

    public void setEstudiantesactivos(Integer estudiantesactivos) {
        this.estudiantesactivos = estudiantesactivos;
    }

    public LocalDateTime getFechaactualizacion() {
        return fechaactualizacion;
    }

    public void setFechaactualizacion(LocalDateTime fechaactualizacion) {
        this.fechaactualizacion = fechaactualizacion;
    }
}
