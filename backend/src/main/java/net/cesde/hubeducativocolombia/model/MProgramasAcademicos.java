package net.cesde.hubeducativocolombia.model;


import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.util.List;

@Entity
@Table (name = "programasacademicos")
public class MProgramasAcademicos {

    @Id
    @Column(name = "idprograma", nullable = false)
    private Integer idprograma;

    @Column(name = "idinstitucion", nullable = false)
    private Integer idinstitucion;

    @Column(name = "codigosnies", length = 20, nullable = false, unique = true)
    private String codigosnies;

    @Column(name = "nombreprograma", length = 200, nullable = false)
    private String nombreprograma;

    @Column(name = "nivelformacion", length = 30, nullable = false)
    private String nivelformacion;

    @Column(name = "totalsemestres", nullable = false)
    private Integer totalsemestres;

    @Column(name = "estaactivo", nullable = false)
    private Boolean estaactivo;


    //Relaciones

    @ManyToOne
    @JoinColumn(name = "pkidinstitucion", referencedColumnName = "idinstitucion")
    @JsonBackReference
    private MInstituciones instituciones;

    @OneToMany (mappedBy = "programasacademicos")
    @JsonManagedReference
    private List<MDetallesOperacion> detallesoperaciones;

    @OneToMany (mappedBy = "programasacademicos")
    private List<MCalidadBeneficios> calidadbeneficioslist;


    //Constructores

    public MProgramasAcademicos(Integer idprograma, Integer idinstitucion, String codigosnies, String nombreprograma, String nivelformacion, Integer totalsemestres, Boolean estaactivo) {
        this.idprograma = idprograma;
        this.idinstitucion = idinstitucion;
        this.codigosnies = codigosnies;
        this.nombreprograma = nombreprograma;
        this.nivelformacion = nivelformacion;
        this.totalsemestres = totalsemestres;
        this.estaactivo = estaactivo;
    }

    public MProgramasAcademicos() {
    }

    //Get and Set


    public Integer getIdprograma() {
        return idprograma;
    }

    public void setIdprograma(Integer idprograma) {
        this.idprograma = idprograma;
    }

    public Integer getIdinstitucion() {
        return idinstitucion;
    }

    public void setIdinstitucion(Integer idinstitucion) {
        this.idinstitucion = idinstitucion;
    }

    public String getCodigosnies() {
        return codigosnies;
    }

    public void setCodigosnies(String codigosnies) {
        this.codigosnies = codigosnies;
    }

    public String getNombreprograma() {
        return nombreprograma;
    }

    public void setNombreprograma(String nombreprograma) {
        this.nombreprograma = nombreprograma;
    }

    public String getNivelformacion() {
        return nivelformacion;
    }

    public void setNivelformacion(String nivelformacion) {
        this.nivelformacion = nivelformacion;
    }

    public Integer getTotalsemestres() {
        return totalsemestres;
    }

    public void setTotalsemestres(Integer totalsemestres) {
        this.totalsemestres = totalsemestres;
    }

    public Boolean getEstaactivo() {
        return estaactivo;
    }

    public void setEstaactivo(Boolean estaactivo) {
        this.estaactivo = estaactivo;
    }
}
