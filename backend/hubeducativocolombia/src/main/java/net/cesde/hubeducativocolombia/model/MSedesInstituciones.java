package net.cesde.hubeducativocolombia.model;


import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
@Table(name = "sedesinstituciones")
public class MSedesInstituciones {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idsede", nullable = false)
    private Integer idsede;

    @Column(name = "nombresede", length = 150, nullable = false)
    private String nombresede;

    @Column(name = "ciudad", length = 100, nullable = false)
    private String ciudad;

    @Column(name = "direccionfisica", length = 255, nullable = false)
    private String direccionfisica;

    @Column(name = "essedeprincipal", nullable = false)
    private Boolean essedeprincipal = false;

    // ─── Relaciones ────────────────────────────────────────────────
    /**
     * Relación N:1 con MInstituciones.
     *
     * - @ManyToOne: muchas sedes pertenecen a una institución.
     * - @JoinColumn: columna FK real en esta tabla es "idinstitucion".
     * - referencedColumnName: PK destino en la tabla "instituciones".
     * - @JsonBackReference: evita recursión infinita en serialización JSON
     *   (la institución es el lado "padre" / forward reference).
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
        name = "idinstitucion",
        referencedColumnName = "idinstitucion",
        nullable = false
    )
    @JsonBackReference
    private MInstituciones institucion;
    //private MInstituciones instituciones; //maybe es minsituciones pero no lo se - posible futuro error

    //Constructores

    public MSedesInstituciones(Integer idsede, Integer idinstitucion, String nombresede, String ciudad, String direccionfisica, Boolean essedeprincipal) {
        this.idsede = idsede;
        this.idinstitucion = idinstitucion;
        this.nombresede = nombresede;
        this.ciudad = ciudad;
        this.direccionfisica = direccionfisica;
        this.essedeprincipal = essedeprincipal;
    }

    public MSedesInstituciones() {
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
