package net.cesde.hubeducativocolombia.model;


import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "detallesoperacion")
public class MDetallesOperacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "iddetalle", nullable = false)
    private Integer iddetalle;

    /**
     * DECIMAL(12,2) en MySQL → BigDecimal en Java.
     * precision y scale deben declararse explícitamente para
     * evitar discrepancias si JPA genera o valida el esquema.
     * CHECK en DDL: costosemestre > 0.
     */
    @Column(name = "costosemestre", precision = 12, scale = 2, nullable = false)
    private BigDecimal costosemestre;

    /**
     * Refleja el CHECK del DDL: 'PRESENCIAL', 'VIRTUAL', 'HIBRIDO'.
     * @Enumerated(STRING) compatible con VARCHAR(20).
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "modalidad", length = 20, nullable = false)
    private Modalidad modalidad;

    /**
     * Refleja el CHECK del DDL: 'DIURNA', 'NOCTURNA', 'FINESDESEMANA', 'MIXTA'.
     * @Enumerated(STRING) compatible con VARCHAR(25).
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "jornada", length = 25, nullable = false)
    private Jornada jornada;

    /**
     * CHECK en DDL: estudiantesactivos >= 0.
     * DEFAULT 0 reflejado en la inicialización del atributo.
     */
    @Column(name = "estudiantesactivos", nullable = false)
    private Integer estudiantesactivos = 0;

    /**
     * DATETIME con ON UPDATE CURRENT_TIMESTAMP en MySQL.
     * updatable = false: MySQL gestiona la actualización automáticamente.
     * insertable = true: JPA puede establecer el valor inicial en el INSERT.
     */
    @Column(name = "fechaactualizacion", nullable = false, updatable = false)
    private LocalDateTime fechaactualizacion;

    // ─── Relaciones ────────────────────────────────────────────────

    /**
     * Relación 1:1 con MProgramasAcademicos.
     *
     * - @OneToOne: UNIQUE(idprograma) en el DDL garantiza cardinalidad 1:1.
     *   Un detalle pertenece a exactamente un programa; un programa
     *   tiene exactamente un detalle operativo.
     * - @JoinColumn: esta tabla es el lado propietario (owner) de la FK.
     *   La columna física "idprograma" vive en "detallesoperacion".
     * - fetch LAZY: no carga el programa completo en cada consulta de detalle.
     * - Sin cascade hacia MProgramasAcademicos: la existencia del programa
     *   es independiente del detalle (ON DELETE CASCADE va en dirección
     *   programa → detalle, no al revés).
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
