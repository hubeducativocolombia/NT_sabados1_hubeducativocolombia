package net.cesde.hubeducativocolombia.model;


import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "programasacademicos")
public class MProgramasAcademicos {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idprograma", nullable = false)
    private Integer idprograma;

    @Column(name = "idinstitucion", nullable = false)
    private Integer idinstitucion;

    @Column(name = "codigosnies", length = 20, nullable = false, unique = true)
    private String codigosnies;

    @Column(name = "nombreprograma", length = 200, nullable = false)
    private String nombreprograma;

    /**
     * Refleja el CHECK del DDL mediante enum Java.
     * @Enumerated(STRING) persiste el nombre como texto,
     * compatible con VARCHAR(30) en MySQL.
     */
    //@Enumerated(EnumType.STRING)
    @Column(name = "nivelformacion", length = 30, nullable = false)
    private String nivelformacion;

    /**
     * TINYINT en MySQL → Byte en Java.
     * Rango válido por CHECK del DDL: BETWEEN 1 AND 20.
     */
    @Column(name = "totalsemestres", nullable = false)
    private Integer totalsemestres;

    @Column(name = "estaactivo", nullable = false)
    private Boolean estaactivo = true;

    // ─── Relaciones ────────────────────────────────────────────────

    /**
     * Relación N:1 con MInstituciones.
     *
     * - @ManyToOne: muchos programas pertenecen a una institución.
     * - @JoinColumn: columna FK real en esta tabla es "idinstitucion".
     * - fetch LAZY: no carga la institución completa en cada consulta.
     * - Sin cascade: el DDL define ON DELETE RESTRICT —
     *   JPA no debe propagar eliminaciones hacia MInstituciones.
     * - @JsonBackReference: lado "hijo" en serialización JSON bidireccional.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
        name = "pkidinstitucion",
        referencedColumnName = "idinstitucion",
        nullable = false
    )
    @JsonBackReference
    private MInstituciones institucion;

    /**
     * Relación 1:N con MDetallesOperacion.
     *
     * - mappedBy: nombre exacto del atributo @ManyToOne
     *   declarado en MDetallesOperacion.
     * - cascade ALL + orphanRemoval: un detalle de operación
     *   no existe fuera del contexto de su programa.
     * - @JsonManagedReference: lado "padre" en serialización JSON.
     */
    @OneToMany(
        mappedBy = "programa",
        cascade = CascadeType.ALL,
        fetch = FetchType.LAZY,
        orphanRemoval = true
    )
    @JsonManagedReference
    private List<MDetallesOperacion> detallesoperaciones = new ArrayList<>();

    /**
     * Relación 1:N con MCalidadBeneficios.
     *
     * - mappedBy: nombre exacto del atributo @ManyToOne
     *   declarado en MCalidadBeneficios.
     * - @JsonManagedReference: requerido si MCalidadBeneficios
     *   usa @JsonBackReference para evitar recursión infinita.
     */
    @OneToMany(
        mappedBy = "programa",
        cascade = CascadeType.ALL,
        fetch = FetchType.LAZY,
        orphanRemoval = true
    )
    @JsonManagedReference
    private List<MCalidadBeneficios> calidadbeneficioslist = new ArrayList<>();

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
