package net.cesde.hubeducativocolombia.model;


import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
@Table(name = "calidadbeneficios")
public class MCalidadBeneficios {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idbeneficio", nullable = false)
    private Integer idbeneficio;

    /**
     * TINYINT(1) en MySQL → Boolean en Java.
     * DEFAULT 0 en DDL → false en Java.
     * Acreditación de alta calidad otorgada por el MEN (Resolución o
     * Acreditación Institucional de Alta Calidad — Ley 1188 de 2008).
     */
    @Column(name = "acreditacionaltacalidad", nullable = false)
    private Boolean acreditacionaltacalidad = false;

    /**
     * DEFAULT 0 en DDL → false en Java.
     * Indica si el programa ofrece algún tipo de beca institucional
     * o convenio con entidades externas (ICETEX, Ser Pilo Paga, etc.).
     */
    @Column(name = "ofrecebecas", nullable = false)
    private Boolean ofrecebecas = false;

    /**
     * DEFAULT 0 en DDL → false en Java.
     * Indica si el programa tiene convenio de doble titulación
     * con una institución nacional o extranjera.
     */
    @Column(name = "dobletitulacion", nullable = false)
    private Boolean dobletitulacion = false;

    /**
     * DEFAULT 1 en DDL → true en Java.
     * Renombrado desde 'exigeIngles' para mayor generalidad:
     * puede aplicar a cualquier segundo idioma (inglés, francés,
     * portugués, etc.) según el programa.
     */
    @Column(name = "requieresegundoidioma", nullable = false)
    private Boolean requieresegundoidioma = true;

    // ─── Relaciones ────────────────────────────────────────────────

    /**
     * Relación 1:1 con MProgramasAcademicos.
     *
     * - @OneToOne: UNIQUE(idprograma) en el DDL garantiza cardinalidad 1:1.
     *   Un registro de calidad/beneficios pertenece a exactamente un programa;
     *   un programa tiene exactamente un registro de calidad/beneficios.
     * - @JoinColumn: esta tabla es el lado propietario (owner) de la FK.
     *   La columna física "idprograma" vive en "calidadbeneficios".
     * - fetch LAZY: no carga el programa completo en cada consulta de beneficio.
     * - Sin cascade hacia MProgramasAcademicos: la existencia del programa
     *   es independiente del registro de beneficios (ON DELETE CASCADE va
     *   en dirección programa → beneficio, no al revés).
     * - @JsonBackReference: lado "hijo" en serialización JSON bidireccional.
     */
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(
        name = "idprograma",
        referencedColumnName = "idprograma",
        nullable = false
    )
    @JsonBackReference
    private MProgramasAcademicos programa;

    //Constructores

    public MCalidadBeneficios(Integer idbeneficio, Integer idprograma, Boolean acreditacionaltacalidad, Boolean ofrecebecas, Boolean dobletitulacion, Boolean requieresegundoidioma) {
        this.idbeneficio = idbeneficio;
        this.idprograma = idprograma;
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

    public Integer getIdprograma() {
        return idprograma;
    }

    public void setIdprograma(Integer idprograma) {
        this.idprograma = idprograma;
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
