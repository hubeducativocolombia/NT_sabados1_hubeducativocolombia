import { useEffect, useState } from 'react'
import apiService from '../services/apiService'
import './Sedes.css'

export default function Sedes() {
    const [sedes, setSedes] = useState([])
    const [instituciones, setInstituciones] = useState([])
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState(null)
    const [mostrarModal, setMostrarModal] = useState(false)
    const [modoEdicion, setModoEdicion] = useState(false)
    const [sedeEditando, setSedeEditando] = useState(null)
    const [formulario, setFormulario] = useState({
        idInstitucion: '',
        nombreSede: '',
        ciudad: '',
        direccionFisica: '',
        esSedePrincipal: false
    })

    useEffect(() => {
        cargarDatos()
    }, [])

    const cargarDatos = async () => {
        try {
            setCargando(true)
            setError(null)
            const datos = await apiService.sincronizar()
            setSedes(datos.sedesInstitucion || [])
            setInstituciones(datos.instituciones || [])
        } catch (err) {
            console.error('Error:', err)
            setError('Error al cargar sedes')
        } finally {
            setCargando(false)
        }
    }

    const abrirModalCrear = () => {
        setModoEdicion(false)
        setSedeEditando(null)
        setFormulario({
            idInstitucion: '',
            nombreSede: '',
            ciudad: '',
            direccionFisica: '',
            esSedePrincipal: false
        })
        setMostrarModal(true)
    }

    const abrirModalEditar = (sede) => {
        setModoEdicion(true)
        setSedeEditando(sede)
        setFormulario({
            idInstitucion: sede.idInstitucion,
            nombreSede: sede.nombreSede,
            ciudad: sede.ciudad,
            direccionFisica: sede.direccionFisica,
            esSedePrincipal: sede.esSedePrincipal
        })
        setMostrarModal(true)
    }

    const manejarSubmit = async (e) => {
        e.preventDefault()
        setError(null)

        try {
            const datosEnviar = {
                ...formulario,
                idInstitucion: Number(formulario.idInstitucion),
                nombreSede: formulario.nombreSede.trim(),
                ciudad: formulario.ciudad.trim(),
                direccionFisica: formulario.direccionFisica.trim()
            }

            if (modoEdicion) {
                await apiService.actualizarSede(sedeEditando.idSede, datosEnviar)
            } else {
                await apiService.crearSede(datosEnviar)
            }

            setMostrarModal(false)
            cargarDatos()
        } catch (err) {
            setError(`Error: ${err.message}`)
        }
    }

    const eliminarSede = async (idSede) => {
        if (confirm('¿Estás seguro de que deseas eliminar esta sede?')) {
            try {
                await apiService.eliminarSede(idSede)
                cargarDatos()
            } catch (err) {
                setError(`Error al eliminar: ${err.message}`)
            }
        }
    }

    const obtenerNombreInstitucion = (idInstitucion) => {
        const institucion = instituciones.find((inst) => inst.idInstitucion === idInstitucion)
        return institucion?.nombreOficial || `ID: ${idInstitucion}`
    }

    if (cargando) return <div className="mensajeVacio"><div className="iconoVacio">⏳</div><p>Cargando...</p></div>

    return (
        <div className="seccionSedes">
            <div className="encabezadoSeccion">
                <h1 className="tituloSeccion">Sedes Institucionales</h1>
                <button className="boton botonPrimario" onClick={abrirModalCrear}>
                    + Crear Sede
                </button>
            </div>

            {error && <div className="mensajeError">{error}</div>}

            {sedes.length === 0 ? (
                <div className="mensajeVacio">
                    <div className="iconoVacio">🏛️</div>
                    <p>No hay sedes registradas</p>
                </div>
            ) : (
                <div className="contenedorTarjetas">
                    {sedes.map((sede) => (
                        <div key={sede.idSede} className="tarjeta">
                            <h3>{sede.nombreSede}</h3>
                            <p><strong>Institución:</strong> {obtenerNombreInstitucion(sede.idInstitucion)}</p>
                            <p><strong>Ciudad:</strong> {sede.ciudad}</p>
                            <p><strong>Dirección:</strong> {sede.direccionFisica}</p>
                            <p>
                                <strong>Tipo:</strong>{' '}
                                <span className={sede.esSedePrincipal ? 'etiquetaPrincipal' : 'etiquetaSecundaria'}>
                                    {sede.esSedePrincipal ? 'Principal' : 'Secundaria'}
                                </span>
                            </p>
                            <div className="accionesTarjeta">
                                <button className="boton botonPequeno botonAdvertencia" onClick={() => abrirModalEditar(sede)}>
                                    Editar
                                </button>
                                <button className="boton botonPequeno botonError" onClick={() => eliminarSede(sede.idSede)}>
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
                        <h2>{modoEdicion ? 'Editar Sede' : 'Crear Nueva Sede'}</h2>
                        <form className="formulario" onSubmit={manejarSubmit}>
                            <div className="grupoFormulario">
                                <label htmlFor="idInstitucion">Institución *</label>
                                <select
                                    id="idInstitucion"
                                    value={formulario.idInstitucion}
                                    onChange={(e) => setFormulario({ ...formulario, idInstitucion: Number(e.target.value) })}
                                    required
                                >
                                    <option value="">Selecciona una institución</option>
                                    {instituciones.map((inst) => (
                                        <option key={inst.idInstitucion} value={inst.idInstitucion}>
                                            {inst.nombreOficial}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grupoFormulario">
                                <label htmlFor="nombreSede">Nombre de la Sede *</label>
                                <input
                                    id="nombreSede"
                                    type="text"
                                    value={formulario.nombreSede}
                                    onChange={(e) => setFormulario({ ...formulario, nombreSede: e.target.value })}
                                    required
                                    placeholder="Ej: Sede Centro"
                                />
                            </div>

                            <div className="grupoFormulario">
                                <label htmlFor="ciudad">Ciudad *</label>
                                <input
                                    id="ciudad"
                                    type="text"
                                    value={formulario.ciudad}
                                    onChange={(e) => setFormulario({ ...formulario, ciudad: e.target.value })}
                                    required
                                    placeholder="Ej: Medellín"
                                />
                            </div>

                            <div className="grupoFormulario">
                                <label htmlFor="direccionFisica">Dirección Física *</label>
                                <input
                                    id="direccionFisica"
                                    type="text"
                                    value={formulario.direccionFisica}
                                    onChange={(e) => setFormulario({ ...formulario, direccionFisica: e.target.value })}
                                    required
                                    placeholder="Ej: Calle 10 # 20-30"
                                />
                            </div>

                            <div className="grupoFormulario checkboxes">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={formulario.esSedePrincipal}
                                        onChange={(e) => setFormulario({ ...formulario, esSedePrincipal: e.target.checked })}
                                    />
                                    Es sede principal
                                </label>
                            </div>

                            <div className="botonesFormulario">
                                <button type="button" className="boton botonOutline" onClick={() => setMostrarModal(false)}>
                                    Cancelar
                                </button>
                                <button type="submit" className="boton botonPrimario">
                                    {modoEdicion ? 'Actualizar Sede' : 'Crear Sede'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
