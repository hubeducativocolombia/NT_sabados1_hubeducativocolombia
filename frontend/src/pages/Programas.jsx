import { useState, useEffect } from 'react'
import apiService from '../services/apiService'
import './Programas.css'

export default function Programas() {
    const nivelLabels = {
        'PREGRADO': 'Pregrado',
        'ESPECIALIZACION': 'Especialización',
        'MAESTRIA': 'Maestría',
        'DOCTORADO': 'Doctorado',
        'DIPLOMADO': 'Diplomado',
        'CURSO': 'Curso',
        'TALLER': 'Taller'
    }
    const modalidadLabels = {
        'PRESENCIAL': 'Presencial',
        'VIRTUAL': 'Virtual',
        'HIBRIDO': 'Híbrido'
    }

    const jornadaLabels = {
        'DIURNA': 'Diurna',
        'NOCTURNA': 'Nocturna',
        'FINES_DE_SEMANA': 'Fines de Semana',
        'MIXTA': 'Mixta'
    }

    const [programas, setProgramas] = useState([])
    const [instituciones, setInstituciones] = useState([])
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState(null)
    const [mostrarModal, setMostrarModal] = useState(false)
    const [modoEdicion, setModoEdicion] = useState(false)
    const [formulario, setFormulario] = useState({
        idInstitucion: '',
        nombrePrograma: '',
        nivelFormacion: 'PREGRADO',
        totalSemestres: 8,
        costoSemestre: '',
        modalidad: 'PRESENCIAL',
        jornada: 'DIURNA',
        codigoSnies: '',
        estudiantesActivos: 0,
        acreditacionAltaCalidad: false,
        ofreceBecas: false,
        dobleTitulacion: false,
        requiereSegundoIdioma: false
    })
    const [programaEditando, setProgramaEditando] = useState(null)

    useEffect(() => {
        cargarDatos()
    }, [])

    const cargarDatos = async () => {
        try {
            setCargando(true)
            setError(null)
            const datos = await apiService.sincronizar()
            const detallesPorPrograma = new Map(
                (datos.detallesOperacion || []).map((detalle) => [detalle.idPrograma, detalle])
            )
            const calidadPorPrograma = new Map(
                (datos.calidadBeneficios || []).map((beneficio) => [beneficio.idPrograma, beneficio])
            )

            const programasCompletos = (datos.programasAcademicos || []).map((programa) => {
                const detalle = detallesPorPrograma.get(programa.idPrograma) || {}
                const calidad = calidadPorPrograma.get(programa.idPrograma) || {}

                return {
                    ...programa,
                    costoSemestre: detalle.costoSemestre ?? 1,
                    modalidad: detalle.modalidad ?? 'PRESENCIAL',
                    jornada: detalle.jornada ?? 'DIURNA',
                    estudiantesActivos: detalle.estudiantesActivos ?? 0,
                    acreditacionAltaCalidad: calidad.acreditacionAltaCalidad ?? false,
                    ofreceBecas: calidad.ofreceBecas ?? false,
                    dobleTitulacion: calidad.dobleTitulacion ?? false,
                    requiereSegundoIdioma: calidad.requiereSegundoIdioma ?? false
                }
            })

            setProgramas(programasCompletos)
            setInstituciones(datos.instituciones || [])
        } catch (err) {
            console.error('Error:', err)
            setError('Error al cargar datos')
        } finally {
            setCargando(false)
        }
    }

    const abrirModal = () => {
        setModoEdicion(false)
        setProgramaEditando(null)
        setFormulario({
            idInstitucion: '',
            nombrePrograma: '',
            nivelFormacion: 'PREGRADO',
            totalSemestres: 8,
            costoSemestre: '',
            modalidad: 'PRESENCIAL',
            jornada: 'DIURNA',
            codigoSnies: '',
            estudiantesActivos: 0,
            acreditacionAltaCalidad: false,
            ofreceBecas: false,
            dobleTitulacion: false,
            requiereSegundoIdioma: false
        })
        setMostrarModal(true)
    }

    const abrirModalEdicion = (programa) => {
        setModoEdicion(true)
        setProgramaEditando(programa)
        setFormulario({
            idInstitucion: programa.idInstitucion,
            nombrePrograma: programa.nombrePrograma,
            nivelFormacion: programa.nivelFormacion,
            totalSemestres: programa.totalSemestres,
            costoSemestre: String(programa.costoSemestre ?? ''),
            modalidad: programa.modalidad,
            jornada: programa.jornada,
            codigoSnies: programa.codigoSnies,
            estudiantesActivos: programa.estudiantesActivos,
            acreditacionAltaCalidad: programa.acreditacionAltaCalidad,
            ofreceBecas: programa.ofreceBecas,
            dobleTitulacion: programa.dobleTitulacion,
            requiereSegundoIdioma: programa.requiereSegundoIdioma
        })
        setMostrarModal(true)
    }

    const manejarSubmit = async (e) => {
        e.preventDefault()
        setError(null)

        const codigoSniesNormalizado = String(formulario.codigoSnies || '').trim()
        const costoSemestreNumerico = Number(formulario.costoSemestre)

        if (codigoSniesNormalizado.length < 4) {
            setError('El código SNIES es obligatorio y debe tener al menos 4 caracteres')
            return
        }

        if (!Number.isFinite(costoSemestreNumerico) || costoSemestreNumerico <= 0) {
            setError('El costo por semestre debe ser mayor a 0')
            return
        }

        const datosEnviar = {
            ...formulario,
            codigoSnies: codigoSniesNormalizado,
            costoSemestre: costoSemestreNumerico
        }

        try {
            if (modoEdicion) {
                await apiService.actualizarPrograma(programaEditando.idPrograma, datosEnviar)
            } else {
                await apiService.crearPrograma(datosEnviar)
            }
            setMostrarModal(false)
            cargarDatos()
        } catch (err) {
            setError('Error: ' + err.message)
        }
    }

    const eliminarPrograma = async (id) => {
        if (confirm('¿Estás seguro de que deseas eliminar este programa?')) {
            try {
                await apiService.eliminarPrograma(id)
                cargarDatos()
            } catch (err) {
                setError('Error al eliminar: ' + err.message)
            }
        }
    }

    const obtenerNombreInstitucion = (idInst) => {
        const inst = instituciones.find(i => i.idInstitucion === idInst)
        return inst?.nombreOficial || `ID: ${idInst}`
    }

    if (cargando) return <div className="mensajeVacio"><div className="iconoVacio">⏳</div><p>Cargando...</p></div>

    return (
        <div className="seccionProgramas">
            <div className="encabezadoSeccion">
                <h1 className="tituloSeccion">Programas Académicos</h1>
                <button className="boton botonPrimario" onClick={abrirModal}>
                    + Crear Programa
                </button>
            </div>

            {error && <div className="mensajeError">{error}</div>}

            {programas.length === 0 ? (
                <div className="mensajeVacio">
                    <div className="iconoVacio">📚</div>
                    <p>No hay programas registrados</p>
                </div>
            ) : (
                <div className="contenedorTarjetas">
                    {programas.map(prog => (
                        <div key={prog.idPrograma} className="tarjeta">
                            <h3>{prog.nombrePrograma}</h3>
                            <p><strong>Institución:</strong> {obtenerNombreInstitucion(prog.idInstitucion)}</p>
                            <p><strong>SNIES:</strong> {prog.codigoSnies || 'N/A'}</p>
                            <p><strong>Nivel:</strong> <span className="etiquetaNivel">{nivelLabels[prog.nivelFormacion] || prog.nivelFormacion}</span></p>
                            <p><strong>Semestres:</strong> {prog.totalSemestres}</p>
                            <p><strong>Modalidad:</strong> {modalidadLabels[prog.modalidad] || prog.modalidad}</p>
                            <p><strong>Jornada:</strong> {jornadaLabels[prog.jornada] || prog.jornada}</p>
                            <p><strong>Costo/Semestre:</strong> ${prog.costoSemestre?.toLocaleString()}</p>
                            <div className="accionesTarjeta">
                                <button className="boton botonPequeno botonAdvertencia" onClick={() => abrirModalEdicion(prog)}>
                                    Editar
                                </button>
                                <button 
                                    className="boton botonPequeno botonError"
                                    onClick={() => eliminarPrograma(prog.idPrograma)}
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {mostrarModal && (
                <div className="fondoModal visible">
                    <div className="contenidoModal">
                        <button className="botonCerrarModal" onClick={() => setMostrarModal(false)}>×</button>
                        <h2>{modoEdicion ? 'Editar Programa' : 'Crear Nuevo Programa'}</h2>
                        <form className="formulario" onSubmit={manejarSubmit}>
                            <div className="grupoFormulario">
                                <label htmlFor="nombrePrograma">Nombre del Programa *</label>
                                <input
                                    id="nombrePrograma"
                                    type="text"
                                    value={formulario.nombrePrograma}
                                    onChange={(e) => setFormulario({ ...formulario, nombrePrograma: e.target.value })}
                                    required
                                    placeholder="Ej: Ingeniería de Sistemas"
                                />
                            </div>
                            <div className="grupoFormulario">
                                <label htmlFor="idInstitucion">Institución *</label>
                                <select
                                    id="idInstitucion"
                                    value={formulario.idInstitucion}
                                    onChange={(e) => setFormulario({ ...formulario, idInstitucion: Number(e.target.value) })}
                                    required
                                >
                                    <option value="">Selecciona una institución</option>
                                    {instituciones.map(inst => (
                                        <option key={inst.idInstitucion} value={inst.idInstitucion}>
                                            {inst.nombreOficial}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="grupoFormulario">
                                <label htmlFor="codigoSnies">Código SNIES *</label>
                                <input
                                    id="codigoSnies"
                                    type="text"
                                    value={formulario.codigoSnies}
                                    onChange={(e) => setFormulario({ ...formulario, codigoSnies: e.target.value })}
                                    required
                                    minLength={4}
                                    maxLength={20}
                                    placeholder="Ej: 53420"
                                />
                            </div>
                            <div className="grupoFormulario">
                                <label htmlFor="nivelFormacion">Nivel de Formación *</label>
                                <select
                                    id="nivelFormacion"
                                    value={formulario.nivelFormacion}
                                    onChange={(e) => setFormulario({ ...formulario, nivelFormacion: e.target.value })}
                                    required
                                >
                                    <option value="PREGRADO">Pregrado</option>
                                    <option value="ESPECIALIZACION">Especialización</option>
                                    <option value="MAESTRIA">Maestría</option>
                                    <option value="DOCTORADO">Doctorado</option>
                                    <option value="DIPLOMADO">Diplomado</option>
                                    <option value="CURSO">Curso</option>
                                    <option value="TALLER">Taller</option>
                                </select>
                            </div>
                            <div className="grupoFormulario">
                                <label htmlFor="totalSemestres">Total de Semestres</label>
                                <input
                                    id="totalSemestres"
                                    type="number"
                                    value={formulario.totalSemestres}
                                    onChange={(e) => setFormulario({ ...formulario, totalSemestres: Number(e.target.value) })}
                                    min="1"
                                    max="20"
                                />
                            </div>
                            <div className="grupoFormulario">
                                <label htmlFor="costoSemestre">Costo por Semestre</label>
                                <input
                                    id="costoSemestre"
                                    type="number"
                                    value={formulario.costoSemestre}
                                    onChange={(e) => setFormulario({ ...formulario, costoSemestre: e.target.value })}
                                    min="1"
                                    required
                                    placeholder="Ej: 4500000"
                                />
                            </div>
                            <div className="grupoFormulario">
                                <label htmlFor="modalidad">Modalidad *</label>
                                <select
                                    id="modalidad"
                                    value={formulario.modalidad}
                                    onChange={(e) => setFormulario({ ...formulario, modalidad: e.target.value })}
                                    required
                                >
                                    <option value="PRESENCIAL">Presencial</option>
                                    <option value="VIRTUAL">Virtual</option>
                                    <option value="HIBRIDO">Híbrido</option>
                                </select>
                            </div>
                            <div className="grupoFormulario">
                                <label htmlFor="jornada">Jornada *</label>
                                <select
                                    id="jornada"
                                    value={formulario.jornada}
                                    onChange={(e) => setFormulario({ ...formulario, jornada: e.target.value })}
                                    required
                                >
                                    <option value="DIURNA">Diurna</option>
                                    <option value="NOCTURNA">Nocturna</option>
                                    <option value="FINES_DE_SEMANA">Fines de Semana</option>
                                    <option value="MIXTA">Mixta</option>
                                </select>
                            </div>
                            <div className="grupoFormulario">
                                <label htmlFor="estudiantesActivos">Estudiantes Activos</label>
                                <input
                                    id="estudiantesActivos"
                                    type="number"
                                    value={formulario.estudiantesActivos}
                                    onChange={(e) => setFormulario({ ...formulario, estudiantesActivos: Number(e.target.value) })}
                                    min="0"
                                />
                            </div>
                            <div className="grupoFormulario checkboxes">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={formulario.acreditacionAltaCalidad}
                                        onChange={(e) => setFormulario({ ...formulario, acreditacionAltaCalidad: e.target.checked })}
                                    />
                                    Acreditación de Alta Calidad
                                </label>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={formulario.ofreceBecas}
                                        onChange={(e) => setFormulario({ ...formulario, ofreceBecas: e.target.checked })}
                                    />
                                    Ofrece Becas
                                </label>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={formulario.dobleTitulacion}
                                        onChange={(e) => setFormulario({ ...formulario, dobleTitulacion: e.target.checked })}
                                    />
                                    Doble Titulación
                                </label>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={formulario.requiereSegundoIdioma}
                                        onChange={(e) => setFormulario({ ...formulario, requiereSegundoIdioma: e.target.checked })}
                                    />
                                    Requiere Segundo Idioma
                                </label>
                            </div>
                            <div className="botonesFormulario">
                                <button type="button" className="boton botonOutline" onClick={() => setMostrarModal(false)}>
                                    Cancelar
                                </button>
                                <button type="submit" className="boton botonPrimario">
                                    {modoEdicion ? 'Actualizar Programa' : 'Crear Programa'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
