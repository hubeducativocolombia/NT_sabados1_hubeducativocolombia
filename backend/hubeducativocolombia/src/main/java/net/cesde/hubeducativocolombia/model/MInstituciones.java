package net.cesde.hubeducativocolombia.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "instituciones")
public class MInstituciones {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idinstitucion", nullable = false)
    private Integer idinstitucion;

    @Column(name = "nombreoficial", length = 200, nullable = false, unique = true)
    private String nombreoficial;

    /**
     * Refleja el CHECK del DDL: solo admite 'PUBLICA', 'PRIVADA', 'MIXTA'.
     * Usando @Enumerated(STRING) se persiste el nombre del enum como texto,
     * compatible con VARCHAR(20) en MySQL.
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "naturaleza", length = 20, nullable = false)
    private String naturaleza;

    @Column(name = "sitioweb", length = 255)
    private String sitioweb;

    /**
     * DATETIME en MySQL → LocalDateTime en Java.
     * LocalDate solo mapea DATE (sin hora), lo que causa pérdida de datos.
     */
    @Column(name = "fecharegistro", nullable = false, updatable = false)
    private LocalDate fecharegistro;

    // ─── Relaciones ────────────────────────────────────────────────

    /**
     * Relación 1:N con MSedesInstituciones.
     *
     * - mappedBy: nombre exacto del atributo @ManyToOne en MSedesInstituciones.
     * - cascade: propaga operaciones persist/merge a las sedes hijas.
     * - fetch LAZY: evita cargar todas las sedes en cada consulta de institución.
     * - @JsonManagedReference: lado "padre" en la serialización JSON bidireccional.
     */
    @OneToMany(
        mappedBy = "institucion",
        cascade = CascadeType.ALL,
        fetch = FetchType.LAZY,
        orphanRemoval = true
    )
    @JsonManagedReference
    private List<MSedesInstituciones> sedes = new ArrayList<>();

    /**
     * Relación 1:N con MProgramasAcademicos.
     *
     * - mappedBy: nombre exacto del atributo @ManyToOne en MProgramasAcademicos.
     * - @JsonManagedReference: necesario si MProgramasAcademicos usa @JsonBackReference.
     */
    @OneToMany(
        mappedBy = "institucion",
        cascade = CascadeType.ALL,
        fetch = FetchType.LAZY,
        orphanRemoval = true
    )
    @JsonManagedReference
    private List<MProgramasAcademicos> programas = new ArrayList<>();

    //Constructores


    public MInstituciones(Integer idinstitucion, String nombreoficial, String naturaleza, String sitioweb, LocalDate fecharegistro) {
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

    public LocalDate getFecharegistro() {
        return fecharegistro;
    }

    public void setFecharegistro(LocalDate fecharegistro) {
        this.fecharegistro = fecharegistro;
    }
}
