import { useState, useEffect } from 'react'
import apiService from '../services/apiService'
import './Instituciones.css'

export default function Instituciones() {
    const usuarioSesion = (() => {
        try {
            return JSON.parse(localStorage.getItem('hubUsuarioSesion') || '{}')
        } catch (_error) {
            return {}
        }
    })()
    const rolSesion = String(usuarioSesion?.rol || '').trim().toUpperCase()
    const correoSesion = String(usuarioSesion?.correoElectronico || '').trim().toLowerCase()
    const esMaster = correoSesion === 'nana.ortega71@gmail.com'
    const esAdministradorEspecial = correoSesion === 'samu@gmail.com'
    const puedeGestionarInstituciones = rolSesion === 'ADMIN' || esMaster || esAdministradorEspecial
    const puedeEliminarInstituciones = rolSesion === 'MASTER' || esMaster

    const clasesNaturaleza = {
        PUBLICA: 'etiquetaPublica',
        PRIVADA: 'etiquetaPrivada',
        MIXTA: 'etiquetaMixta'
    }

    const [instituciones, setInstituciones] = useState([])
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState(null)
    const [mostrarModal, setMostrarModal] = useState(false)
    const [modoEdicion, setModoEdicion] = useState(false)
    const [institucionEditando, setInstitucionEditando] = useState(null)
    const [formulario, setFormulario] = useState({
        nombreOficial: '',
        naturaleza: 'PUBLICA',
        sitioWeb: ''
    })

    useEffect(() => {
        cargarInstituciones()
    }, [])

    const cargarInstituciones = async () => {
        try {
            setCargando(true)
            setError(null)
            const datos = await apiService.sincronizar()
            setInstituciones(datos.instituciones || [])
        } catch (err) {
            console.error('Error:', err)
            setError('Error al cargar instituciones')
        } finally {
            setCargando(false)
        }
    }

    const abrirModalCrear = () => {
        if (!puedeGestionarInstituciones) {
            return
        }

        setError(null)
        setModoEdicion(false)
        setInstitucionEditando(null)
        setFormulario({ nombreOficial: '', naturaleza: 'PUBLICA', sitioWeb: '' })
        setMostrarModal(true)
    }

    const abrirModalEdicion = (institucion) => {
        if (!puedeGestionarInstituciones) {
            return
        }

        setError(null)
        setModoEdicion(true)
        setInstitucionEditando(institucion)
        setFormulario({
            nombreOficial: institucion.nombreOficial || '',
            naturaleza: institucion.naturalezaCodigo || institucion.naturaleza || 'PUBLICA',
            sitioWeb: institucion.sitioWeb || ''
        })
        setMostrarModal(true)
    }

    const manejarSubmit = async (e) => {
        e.preventDefault()

        if (!puedeGestionarInstituciones) {
            return
        }

        try {
            if (modoEdicion && institucionEditando) {
                await apiService.actualizarInstitucion(institucionEditando.idInstitucion, formulario)
            } else {
                await apiService.crearInstitucion(formulario)
            }
            setFormulario({ nombreOficial: '', naturaleza: 'PUBLICA', sitioWeb: '' })
            setMostrarModal(false)
            setModoEdicion(false)
            setInstitucionEditando(null)
            cargarInstituciones()
        } catch (err) {
            setError(`Error al ${modoEdicion ? 'actualizar' : 'crear'} institución: ` + err.message)
        }
    }

    const eliminarInstitucion = async (id) => {
        if (!puedeEliminarInstituciones) {
            return
        }

        if (confirm('¿Estás seguro de que deseas eliminar esta institución?')) {
            try {
                await apiService.eliminarInstitucion(id)
                cargarInstituciones()
            } catch (err) {
                setError('Error al eliminar: ' + err.message)
            }
        }
    }

    if (cargando) return <div className="mensajeVacio"><div className="iconoVacio">⏳</div><p>Cargando...</p></div>

    return (
        <div className="seccionInstituciones">
            <div className="encabezadoSeccion">
                <h1 className="tituloSeccion">Instituciones Educativas</h1>
                {puedeGestionarInstituciones && (
                    <button className="boton botonPrimario" onClick={abrirModalCrear}>
                        + Crear Institución
                    </button>
                )}
            </div>

            {error && <div className="mensajeError">{error}</div>}

            {instituciones.length === 0 ? (
                <div className="mensajeVacio">
                    <div className="iconoVacio"></div>
                    <p>No hay instituciones registradas</p>
                </div>
            ) : (
                <div className="contenedorTarjetas">
                    {instituciones.map(inst => (
                        <div key={inst.idInstitucion} className="tarjeta">
                            <h3>{inst.nombreOficial}</h3>
                            <p><strong>Naturaleza:</strong> <span className={clasesNaturaleza[inst.naturalezaCodigo] || 'etiquetaPublica'}>{inst.naturaleza}</span></p>
                            {inst.sitioWeb && (
                                <p><strong>Sitio web:</strong> <a href={inst.sitioWeb} target="_blank" rel="noopener noreferrer">{inst.sitioWeb}</a></p>
                            )}
                            <p><strong>Fecha de registro:</strong> {new Date(inst.fechaRegistro).toLocaleDateString()}</p>
                            {puedeGestionarInstituciones && (
                                <div className="accionesTarjeta">
                                    <button className="boton botonPequeno botonAdvertencia" onClick={() => abrirModalEdicion(inst)}>
                                        Editar
                                    </button>
                                    {puedeEliminarInstituciones && (
                                        <button 
                                            className="boton botonPequeno botonError"
                                            onClick={() => eliminarInstitucion(inst.idInstitucion)}
                                        >
                                            Eliminar
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {mostrarModal && (
                <div className="fondoModal visible">
                    <div className="contenidoModal">
                        <button
                            className="botonCerrarModal"
                            onClick={() => {
                                setMostrarModal(false)
                                setModoEdicion(false)
                                setInstitucionEditando(null)
                            }}
                        >
                            ×
                        </button>
                        <h2>{modoEdicion ? 'Editar Institución' : 'Crear Nueva Institución'}</h2>
                        <form className="formulario" onSubmit={manejarSubmit}>
                            <div className="grupoFormulario">
                                <label htmlFor="nombreOficial">Nombre Oficial *</label>
                                <input
                                    id="nombreOficial"
                                    type="text"
                                    value={formulario.nombreOficial}
                                    onChange={(e) => setFormulario({ ...formulario, nombreOficial: e.target.value })}
                                    required
                                    placeholder="Ej: Universidad Nacional de Colombia"
                                />
                            </div>
                            <div className="grupoFormulario">
                                <label htmlFor="naturaleza">Naturaleza *</label>
                                <select
                                    id="naturaleza"
                                    value={formulario.naturaleza}
                                    onChange={(e) => setFormulario({ ...formulario, naturaleza: e.target.value })}
                                >
                                    <option value="PUBLICA">Pública</option>
                                    <option value="PRIVADA">Privada</option>
                                    <option value="MIXTA">Mixta</option>
                                </select>
                            </div>
                            <div className="grupoFormulario">
                                <label htmlFor="sitioWeb">Sitio Web</label>
                                <input
                                    id="sitioWeb"
                                    type="url"
                                    value={formulario.sitioWeb}
                                    onChange={(e) => setFormulario({ ...formulario, sitioWeb: e.target.value })}
                                    placeholder="https://www.ejemplo.edu.co"
                                />
                            </div>
                            <div className="botonesFormulario">
                                <button
                                    type="button"
                                    className="boton botonOutline"
                                    onClick={() => {
                                        setMostrarModal(false)
                                        setModoEdicion(false)
                                        setInstitucionEditando(null)
                                    }}
                                >
                                    Cancelar
                                </button>
                                <button type="submit" className="boton botonPrimario">
                                    {modoEdicion ? 'Guardar Cambios' : 'Crear Institución'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
