package net.cesde.hubeducativocolombia.model;


import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
@Table(name = "sedesinstituciones")
public class MSedesIntituciones {

    @Id
    @Column(name = "idsede", nullable = false)
    private Integer idsede;

    @Column(name = "idinstitucion", nullable = false)
    private Integer idinstitucion;

    @Column(name = "nombresede", length = 150, nullable = false)
    private String nombresede;

    @Column(name = "ciudad", length = 100, nullable = false)
    private String ciudad;

    @Column(name = "direccionfisica", length = 255, nullable = false)
    private String direccionfisica;

    @Column(name = "essedepprincipal", nullable = false)
    private Boolean essedeprincipal;

    //Relaciones

    @ManyToOne
    @JoinColumn(name = "pkidinstitucion", referencedColumnName = "idinstitucion")
    @JsonBackReference
    private MInstituciones instituciones; //maybe es minsituciones pero no lo se - posible futuro error

    //Constructores

    public MSedesIntituciones(Integer idsede, Integer idinstitucion, String nombresede, String ciudad, String direccionfisica, Boolean essedeprincipal) {
        this.idsede = idsede;
        this.idinstitucion = idinstitucion;
        this.nombresede = nombresede;
        this.ciudad = ciudad;
        this.direccionfisica = direccionfisica;
        this.essedeprincipal = essedeprincipal;
    }

    public MSedesIntituciones() {
    }

    //Get and Set


    public Integer getIdsede() {
        return idsede;
    }

    public void setIdsede(Integer idsede) {
        this.idsede = idsede;
    }

    public Integer getIdinstitucion() {
        return idinstitucion;
    }

    public void setIdinstitucion(Integer idinstitucion) {
        this.idinstitucion = idinstitucion;
    }

    public String getNombresede() {
        return nombresede;
    }

    public void setNombresede(String nombresede) {
        this.nombresede = nombresede;
    }

    public String getCiudad() {
        return ciudad;
    }

    public void setCiudad(String ciudad) {
        this.ciudad = ciudad;
    }

    public String getDireccionfisica() {
        return direccionfisica;
    }

    public void setDireccionfisica(String direccionfisica) {
        this.direccionfisica = direccionfisica;
    }

    public Boolean getEssedeprincipal() {
        return essedeprincipal;
    }

    public void setEssedeprincipal(Boolean essedeprincipal) {
        this.essedeprincipal = essedeprincipal;
    }
}
