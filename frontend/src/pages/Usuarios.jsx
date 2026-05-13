import { useState, useEffect } from 'react'
import apiService from '../services/apiService'
import './Usuarios.css'

export default function Usuarios() {
    const usuarioSesion = (() => {
        try {
            return JSON.parse(localStorage.getItem('hubUsuarioSesion') || '{}')
        } catch (_error) {
            return {}
        }
    })()
    const rolSesion = String(usuarioSesion?.rol || '').trim().toUpperCase()
    const correoSesion = String(usuarioSesion?.correoElectronico || '').trim().toLowerCase()
    const esMaster = rolSesion === 'MASTER' || correoSesion === 'nana.ortega71@gmail.com'
    const esAdministrador = rolSesion === 'ADMIN'
    const puedeGestionarUsuarios = esMaster || esAdministrador
    const puedeEliminarUsuarios = esMaster
    const opcionesRol = esMaster
        ? [
            { value: 'MASTER', label: 'Master' },
            { value: 'ADMIN', label: 'Administrador' },
            { value: 'USER', label: 'Usuario' }
        ]
        : [
            { value: 'ADMIN', label: 'Administrador' },
            { value: 'USER', label: 'Usuario' }
        ]

    const esAdministradorEspecial = (correo) => String(correo || '').trim().toLowerCase() === 'samu@gmail.com'

    const obtenerRolVisual = (rol, correo) => {
        if (esAdministradorEspecial(correo)) return 'ADMIN'
        return String(rol || '').trim().toUpperCase()
    }

    const obtenerEtiquetaRol = (rol, correo) => {
        const rolNormalizado = obtenerRolVisual(rol, correo)
        if (rolNormalizado === 'MASTER') return 'Master'
        if (rolNormalizado === 'ADMIN') return 'Administrador'
        if (rolNormalizado === 'USER') return 'Usuario'
        return rol || 'Usuario'
    }

    const obtenerColorRol = (rol, correo) => {
        const rolNormalizado = obtenerRolVisual(rol, correo)
        if (rolNormalizado === 'MASTER') return '#7c3aed'
        if (rolNormalizado === 'ADMIN') return '#ff6b6b'
        return '#95e1d3'
    }

    const [usuarios, setUsuarios] = useState([])
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState(null)
    const [mostrarModal, setMostrarModal] = useState(false)
    const [modoEdicion, setModoEdicion] = useState(false)
    const [formulario, setFormulario] = useState({
        nombreCompleto: '',
        correoElectronico: '',
            rol: 'USER',
        estaActivo: true,
        hashContrasena: ''
    })
    const [usuarioEditando, setUsuarioEditando] = useState(null)

    useEffect(() => {
        cargarUsuarios()
    }, [])

    const cargarUsuarios = async () => {
        try {
            setCargando(true)
            setError(null)
            const datos = await apiService.sincronizar()
            setUsuarios(datos.usuarios || [])
        } catch (err) {
            console.error('Error:', err)
            setError('Error al cargar usuarios')
        } finally {
            setCargando(false)
        }
    }

    const abrirModal = () => {
        if (!puedeGestionarUsuarios) {
            return
        }

        setModoEdicion(false)
        setUsuarioEditando(null)
        setFormulario({
            nombreCompleto: '',
            correoElectronico: '',
                    rol: 'USER',
            estaActivo: true,
            hashContrasena: ''
        })
        setMostrarModal(true)
    }

    const abrirModalEdicion = (usuario) => {
        if (!puedeGestionarUsuarios) {
            return
        }

        setModoEdicion(true)
        setUsuarioEditando(usuario)
        setFormulario({
            nombreCompleto: usuario.nombreCompleto,
            correoElectronico: usuario.correoElectronico,
            rol: esAdministradorEspecial(usuario.correoElectronico) ? 'ADMIN' : usuario.rol,
            estaActivo: usuario.estaActivo,
            hashContrasena: ''
        })
        setMostrarModal(true)
    }

    const manejarSubmit = async (e) => {
        e.preventDefault()

        if (!puedeGestionarUsuarios) {
            return
        }

        try {
            const datosEnviar = { ...formulario }
            if (!datosEnviar.hashContrasena) {
                delete datosEnviar.hashContrasena
            }
            
            if (modoEdicion) {
                await apiService.actualizarUsuario(usuarioEditando.idUsuario, datosEnviar)
            } else {
                await apiService.crearUsuario(datosEnviar)
            }
            setMostrarModal(false)
            cargarUsuarios()
        } catch (err) {
            setError('Error: ' + err.message)
        }
    }

    const eliminarUsuario = async (id) => {
        if (!puedeEliminarUsuarios) {
            return
        }

        if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
            try {
                await apiService.eliminarUsuario(id)
                cargarUsuarios()
            } catch (err) {
                setError('Error al eliminar: ' + err.message)
            }
        }
    }

    if (cargando) return <div className="mensajeVacio"><div className="iconoVacio">⏳</div><p>Cargando...</p></div>

    return (
        <div className="seccionUsuarios">
            <div className="encabezadoSeccion">
                <h1 className="tituloSeccion">Usuarios del Sistema</h1>
                {puedeGestionarUsuarios && (
                    <button className="boton botonPrimario" onClick={abrirModal}>
                        + Crear Usuario
                    </button>
                )}
            </div>

            {error && <div className="mensajeError">{error}</div>}

            {usuarios.length === 0 ? (
                <div className="mensajeVacio">
                    <div className="iconoVacio">👥</div>
                    <p>No hay usuarios registrados</p>
                </div>
            ) : (
                <div className="contenedorTabla">
                    <table className="tablaUsuarios">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Email</th>
                                <th>Rol</th>
                                <th>Estado</th>
                                <th>Fecha Creación</th>
                                {puedeGestionarUsuarios && <th>Acciones</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {usuarios.map(user => (
                                <tr key={user.idUsuario}>
                                    <td>{user.nombreCompleto}</td>
                                    <td>{user.correoElectronico}</td>
                                    <td>
                                        <span className="etiquetaRol" style={{
                                                    background: obtenerColorRol(user.rol, user.correoElectronico),
                                            color: '#fff',
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            fontSize: '0.85em'
                                        }}>
                                                    {obtenerEtiquetaRol(user.rol, user.correoElectronico)}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`etiqueta ${user.estaActivo ? 'etiquetaActivo' : 'etiquetaInactivo'}`}>
                                            {user.estaActivo ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>
                                    <td>{new Date(user.fechaCreacion).toLocaleDateString()}</td>
                                    {puedeGestionarUsuarios && (
                                        <td>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button 
                                                    className="boton botonPequeno botonAdvertencia"
                                                    onClick={() => abrirModalEdicion(user)}
                                                >
                                                    Editar
                                                </button>
                                                {puedeEliminarUsuarios && (
                                                    <button 
                                                        className="boton botonPequeno botonError"
                                                        onClick={() => eliminarUsuario(user.idUsuario)}
                                                    >
                                                        Eliminar
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {mostrarModal && (
                <div className="fondoModal visible">
                    <div className="contenidoModal">
                        <button className="botonCerrarModal" onClick={() => setMostrarModal(false)}>×</button>
                        <h2>{modoEdicion ? 'Editar Usuario' : 'Crear Nuevo Usuario'}</h2>
                        <form className="formulario" onSubmit={manejarSubmit}>
                            <div className="grupoFormulario">
                                <label htmlFor="nombreCompleto">Nombre Completo *</label>
                                <input
                                    id="nombreCompleto"
                                    type="text"
                                    value={formulario.nombreCompleto}
                                    onChange={(e) => setFormulario({ ...formulario, nombreCompleto: e.target.value })}
                                    required
                                    placeholder="Ej: Juan Pérez García"
                                />
                            </div>
                            <div className="grupoFormulario">
                                <label htmlFor="correoElectronico">Correo Electrónico *</label>
                                <input
                                    id="correoElectronico"
                                    type="email"
                                    value={formulario.correoElectronico}
                                    onChange={(e) => setFormulario({ ...formulario, correoElectronico: e.target.value })}
                                    required
                                    placeholder="correo@ejemplo.com"
                                />
                            </div>
                            <div className="grupoFormulario">
                                <label htmlFor="rol">Rol *</label>
                                <select
                                    id="rol"
                                    value={formulario.rol}
                                    onChange={(e) => setFormulario({ ...formulario, rol: e.target.value })}
                                    required
                                >
                                    {opcionesRol.map((opcion) => (
                                        <option key={opcion.value} value={opcion.value}>
                                            {opcion.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {!modoEdicion && (
                                <div className="grupoFormulario">
                                    <label htmlFor="hashContrasena">Contraseña</label>
                                    <input
                                        id="hashContrasena"
                                        type="password"
                                        value={formulario.hashContrasena}
                                        onChange={(e) => setFormulario({ ...formulario, hashContrasena: e.target.value })}
                                        placeholder="Dejar en blanco para usar contraseña por defecto"
                                    />
                                </div>
                            )}
                            <div className="grupoFormulario checkboxes">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={formulario.estaActivo}
                                        onChange={(e) => setFormulario({ ...formulario, estaActivo: e.target.checked })}
                                    />
                                    Usuario Activo
                                </label>
                            </div>
                            <div className="botonesFormulario">
                                <button type="button" className="boton botonOutline" onClick={() => setMostrarModal(false)}>
                                    Cancelar
                                </button>
                                <button type="submit" className="boton botonPrimario">
                                    {modoEdicion ? 'Actualizar Usuario' : 'Crear Usuario'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
