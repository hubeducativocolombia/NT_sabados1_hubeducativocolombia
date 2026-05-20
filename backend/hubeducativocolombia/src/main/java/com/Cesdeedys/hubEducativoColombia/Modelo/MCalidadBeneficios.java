package com.Cesdeedys.hubEducativoColombia.Modelo;


import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
@Table (name = "calidadbeneficios")
public class MCalidadBeneficios {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idbeneficio", nullable = false)
    private Integer idbeneficio;

    @Column(name = "acreditacionaltacalidad", nullable = false)
    private Boolean acreditacionaltacalidad;

    @Column(name = "ofrecebecas", nullable = false)
    private Boolean ofrecebecas;

    @Column(name = "dobletitulacion", nullable = false)
    private Boolean dobletitulacion;

    @Column(name = "requieresegundoidioma", nullable = false)
    private Boolean requieresegundoidioma;


    //Relaciones

    @ManyToOne
    @JoinColumn(name = "idprograma", referencedColumnName = "idprograma")
    @JsonBackReference
    private MProgramasAcademicos programasacademicos;

    //Constructores

    public MCalidadBeneficios(Integer idbeneficio, Boolean acreditacionaltacalidad, Boolean ofrecebecas, Boolean dobletitulacion, Boolean requieresegundoidioma) {
        this.idbeneficio = idbeneficio;
        this.acreditacionaltacalidad = acreditacionaltacalidad;
        this.ofrecebecas = ofrecebecas;
        this.dobletitulacion = dobletitulacion;
        this.requieresegundoidioma = requieresegundoidioma;
    }

    public MCalidadBeneficios() {
    }

    //Get and set


    public Integer getIdbeneficio() {
        return idbeneficio;
    }

    public void setIdbeneficio(Integer idbeneficio) {
        this.idbeneficio = idbeneficio;
    }

    public Boolean getAcreditacionaltacalidad() {
        return acreditacionaltacalidad;
    }

    public void setAcreditacionaltacalidad(Boolean acreditacionaltacalidad) {
        this.acreditacionaltacalidad = acreditacionaltacalidad;
    }

    public Boolean getOfrecebecas() {
        return ofrecebecas;
    }

    public void setOfrecebecas(Boolean ofrecebecas) {
        this.ofrecebecas = ofrecebecas;
    }

    public Boolean getDobletitulacion() {
        return dobletitulacion;
    }

    public void setDobletitulacion(Boolean dobletitulacion) {
        this.dobletitulacion = dobletitulacion;
    }

    public Boolean getRequieresegundoidioma() {
        return requieresegundoidioma;
    }

    public void setRequieresegundoidioma(Boolean requieresegundoidioma) {
        this.requieresegundoidioma = requieresegundoidioma;
    }
}
