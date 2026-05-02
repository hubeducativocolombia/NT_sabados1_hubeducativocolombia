package net.cesde.hubeducativocolombia.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "instituciones")
public class MInstituciones {

    @Id
    @Column(name = "idinstitucion", nullable = false)
    private Integer idinstitucion;

    @Column(name = "nombreoficial", length = 200, nullable = false, unique = true)
    private String nombreoficial;

    @Column(name = "naturaleza", length = 20, nullable = false)
    private String naturaleza;

    @Column(name = "sitioweb", length = 255)
    private String sitioweb;

    @Column(name = "fecharegistro", nullable = false)
    private LocalDateTime fecharegistro;


    //Relaciones

    @OneToMany(mappedBy = "instituciones")
    @JsonManagedReference
    private List<MSedesIntituciones> sedes;

    @OneToMany(mappedBy = "instituciones")
    private List<MProgramasAcademicos> programas;

    //Constructores


    public MInstituciones(Integer idinstitucion, String nombreoficial, String naturaleza, String sitioweb, LocalDateTime fecharegistro) {
        this.idinstitucion = idinstitucion;
        this.nombreoficial = nombreoficial;
        this.naturaleza = naturaleza;
        this.sitioweb = sitioweb;
        this.fecharegistro = fecharegistro;
    }

    public MInstituciones() {
    }

    //Get and Set


    public Integer getIdinstitucion() {
        return idinstitucion;
    }

    public void setIdinstitucion(Integer idinstitucion) {
        this.idinstitucion = idinstitucion;
    }

    public String getNombreoficial() {
        return nombreoficial;
    }

    public void setNombreoficial(String nombreoficial) {
        this.nombreoficial = nombreoficial;
    }

    public String getNaturaleza() {
        return naturaleza;
    }

    public void setNaturaleza(String naturaleza) {
        this.naturaleza = naturaleza;
    }

    public String getSitioweb() {
        return sitioweb;
    }

    public void setSitioweb(String sitioweb) {
        this.sitioweb = sitioweb;
    }

    public LocalDateTime getFecharegistro() {
        return fecharegistro;
    }

    public void setFecharegistro(LocalDateTime fecharegistro) {
        this.fecharegistro = fecharegistro;
    }
}
