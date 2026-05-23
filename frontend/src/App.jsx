import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { useState, useEffect, lazy, Suspense } from 'react'
import './App.css'
import apiService from './services/apiService'

// Páginas
import Inicio from './pages/Inicio'
import Instituciones from './pages/Instituciones'
import Sedes from './pages/Sedes'
import Programas from './pages/Programas'
import Usuarios from './pages/Usuarios'
import Buscar from './pages/Buscar'
import logoHub from './img/IMAGEN HUBEDUCATIVOCOLOMBIA.jpeg'

const Dashboard = lazy(() => import('./pages/Dashboard'))

function App() {
  const breakpointMenu = 980
  const [menuAbierto, setMenuAbierto] = useState(false)
  const [sesionIniciada, setSesionIniciada] = useState(() => localStorage.getItem('hubSesionIniciada') === 'true')
  const [mostrarModalAuth, setMostrarModalAuth] = useState(false)
  const [modoAuth, setModoAuth] = useState('login')
  const [authCargando, setAuthCargando] = useState(false)
  const [authError, setAuthError] = useState('')
  const [formularioAuth, setFormularioAuth] = useState({
    nombreCompleto: '',
    correoElectronico: '',
    rol: '',
    contrasena: '',
    confirmarContrasena: ''
  })

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > breakpointMenu) {
        setMenuAbierto(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [breakpointMenu])

  const abrirModalLogin = () => {
    setModoAuth('login')
    setAuthError('')
    setFormularioAuth({
      nombreCompleto: '',
      correoElectronico: '',
      rol: '',
      contrasena: '',
      confirmarContrasena: ''
    })
    setMostrarModalAuth(true)
    setMenuAbierto(false)
  }

  const cerrarModalAuth = () => {
    if (authCargando) {
      return
    }

    setMostrarModalAuth(false)
    setAuthError('')
  }

  const cambiarModoAuth = (nuevoModo) => {
    setModoAuth(nuevoModo)
    setAuthError('')
    setFormularioAuth((anterior) => ({
      ...anterior,
      nombreCompleto: nuevoModo === 'registro' ? anterior.nombreCompleto : '',
      rol: nuevoModo === 'registro' ? anterior.rol : '',
      contrasena: '',
      confirmarContrasena: ''
    }))
  }

  const manejarAutenticacion = async (e) => {
    e.preventDefault()

    const correoElectronico = formularioAuth.correoElectronico.trim().toLowerCase()
    const contrasena = formularioAuth.contrasena.trim()
    const confirmarContrasena = formularioAuth.confirmarContrasena.trim()
    const nombreCompleto = formularioAuth.nombreCompleto.trim()

    if (!correoElectronico || !contrasena) {
      setAuthError('Debes ingresar correo y contrasena')
      return
    }

    const ocupacion = formularioAuth.rol.trim().toUpperCase()

    if (modoAuth === 'registro') {
      if (!nombreCompleto) {
        setAuthError('Debes ingresar tu nombre completo')
        return
      }

      if (!ocupacion) {
        setAuthError('Debes seleccionar una ocupacion')
        return
      }

      if (contrasena.length < 6) {
        setAuthError('La contrasena debe tener al menos 6 caracteres')
        return
      }

      if (contrasena !== confirmarContrasena) {
        setAuthError('La confirmacion de contrasena no coincide')
        return
      }
    }

    try {
      setAuthCargando(true)
      setAuthError('')

      const sincronizacion = await apiService.sincronizar()
      const usuarios = sincronizacion.usuarios || []
      const usuarioEncontrado = usuarios.find(
        (usuario) => String(usuario.correoElectronico || '').trim().toLowerCase() === correoElectronico
      )

      if (modoAuth === 'login') {
        if (!usuarioEncontrado) {
          setAuthError('No encontramos este usuario. Registrate para continuar.')
          setModoAuth('registro')
          return
        }

        if (!usuarioEncontrado.estaActivo) {
          setAuthError('Tu usuario esta inactivo. Contacta al administrador.')
          return
        }

        if (String(usuarioEncontrado.hashContrasena || '') !== contrasena) {
          setAuthError('Contrasena incorrecta')
          return
        }

        setSesionIniciada(true)
        localStorage.setItem('hubSesionIniciada', 'true')
        localStorage.setItem('hubUsuarioSesion', JSON.stringify({
          idUsuario: usuarioEncontrado.idUsuario,
          nombreCompleto: usuarioEncontrado.nombreCompleto,
          correoElectronico: usuarioEncontrado.correoElectronico,
          rol: usuarioEncontrado.rol
        }))
        setMostrarModalAuth(false)
        return
      }

      const nuevoUsuario = await apiService.registrarUsuario({
        nombreCompleto,
        correoElectronico,
        hashContrasena: contrasena,
        rol: 'USER',
        ocupacion
      })

      setSesionIniciada(true)
      localStorage.setItem('hubSesionIniciada', 'true')
      localStorage.setItem('hubUsuarioSesion', JSON.stringify({
        idUsuario: nuevoUsuario.idUsuario,
        nombreCompleto: nuevoUsuario.nombreCompleto,
        correoElectronico: nuevoUsuario.correoElectronico,
        rol: nuevoUsuario.rol
      }))
      setMostrarModalAuth(false)
    } catch (error) {
      setAuthError(error.message || 'No fue posible completar la autenticacion')
    } finally {
      setAuthCargando(false)
    }
  }

  const cerrarSesion = () => {
    setSesionIniciada(false)
    localStorage.removeItem('hubSesionIniciada')
    localStorage.removeItem('hubUsuarioSesion')
    setMenuAbierto(false)
    window.location.assign('/')
  }

  const rolSesion = (() => {
    try {
      const usuarioSesion = JSON.parse(localStorage.getItem('hubUsuarioSesion') || '{}')
      return String(usuarioSesion?.rol || '').trim().toUpperCase()
    } catch (_error) {
      return ''
    }
  })()

  const correoSesion = (() => {
    try {
      const usuarioSesion = JSON.parse(localStorage.getItem('hubUsuarioSesion') || '{}')
      return String(usuarioSesion?.correoElectronico || '').trim().toLowerCase()
    } catch (_error) {
      return ''
    }
  })()

  const esMaster = rolSesion === 'MASTER' || correoSesion === 'nana.ortega71@gmail.com'
  const puedeAdministrarUsuarios = rolSesion === 'ADMIN' || esMaster

  useEffect(() => {
    document.body.classList.remove('sinScrollPublico')
  }, [])

  return (
    <Router>
      <div className="app">
        <header className="encabezadoPrincipal">
          <div className="contenedorEncabezado">
            <h1 className="logoTitulo">
              <span className="logoIcono"><img src={logoHub} alt="Logo Hub Educativo Colombia" className="logoImagen" /></span>
              Hub Educativo Colombia
            </h1>
            <button 
              className="botonMenu" 
              id="botonMenu"
              onClick={() => setMenuAbierto(!menuAbierto)}
              aria-label="Abrir menú de navegación"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
            <nav 
              className={`navegacionPrincipal ${menuAbierto ? 'abierto' : ''}`}
              id="navegacionPrincipal"
            >
              <Link 
                to="/" 
                className="enlaceNav enlaceNavInicio" 
                onClick={() => setMenuAbierto(false)}
              >
                Inicio
              </Link>

              {!sesionIniciada ? (
                <div className="grupoAccionesPublicas">
                  <Link 
                    to="/buscar?tipo=instituciones" 
                    className="botonHeader botonHeaderSecundario"
                    onClick={() => setMenuAbierto(false)}
                  >
                    Buscar universidades
                  </Link>
                  <Link 
                    to="/buscar?tipo=sedes" 
                    className="botonHeader botonHeaderSecundario"
                    onClick={() => setMenuAbierto(false)}
                  >
                    Buscar sedes
                  </Link>
                  <Link 
                    to="/buscar?tipo=programas" 
                    className="botonHeader botonHeaderSecundario"
                    onClick={() => setMenuAbierto(false)}
                  >
                    Buscar programas
                  </Link>
                  <Link
                    to="/dashboard"
                    className="botonHeader botonHeaderSecundario"
                    onClick={() => setMenuAbierto(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    type="button"
                    className="botonHeader botonHeaderPrimario"
                    onClick={abrirModalLogin}
                  >
                    Iniciar sesion
                  </button>
                </div>
              ) : (
                <>
                  <Link 
                    to="/instituciones" 
                    className="enlaceNav"
                    onClick={() => setMenuAbierto(false)}
                  >
                    Instituciones
                  </Link>
                  <Link 
                    to="/programas" 
                    className="enlaceNav"
                    onClick={() => setMenuAbierto(false)}
                  >
                    Programas
                  </Link>
                  <Link
                    to="/sedes"
                    className="enlaceNav"
                    onClick={() => setMenuAbierto(false)}
                  >
                    Sedes
                  </Link>
                  {puedeAdministrarUsuarios && (
                    <Link 
                      to="/usuarios" 
                      className="enlaceNav"
                      onClick={() => setMenuAbierto(false)}
                    >
                      Usuarios
                    </Link>
                  )}
                  <Link 
                    to="/buscar" 
                    className="enlaceNav"
                    onClick={() => setMenuAbierto(false)}
                  >
                    Buscar
                  </Link>
                  <Link
                    to="/dashboard"
                    className="enlaceNav"
                    onClick={() => setMenuAbierto(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    type="button"
                    className="botonHeader botonHeaderSalir"
                    onClick={cerrarSesion}
                  >
                    Cerrar sesion
                  </button>
                </>
              )}
            </nav>
          </div>
        </header>

        <main className="contenidoPrincipal">
          <Suspense fallback={<div className="dashboardEstado">Cargando dashboard...</div>}>
            <Routes>
              <Route path="/" element={<Inicio sesionIniciada={sesionIniciada} onIniciarSesion={abrirModalLogin} />} />
              <Route path="/instituciones" element={sesionIniciada ? <Instituciones /> : <Inicio sesionIniciada={sesionIniciada} onIniciarSesion={abrirModalLogin} />} />
              <Route path="/sedes" element={sesionIniciada ? <Sedes /> : <Inicio sesionIniciada={sesionIniciada} onIniciarSesion={abrirModalLogin} />} />
              <Route path="/programas" element={sesionIniciada ? <Programas /> : <Inicio sesionIniciada={sesionIniciada} onIniciarSesion={abrirModalLogin} />} />
              <Route path="/usuarios" element={sesionIniciada && puedeAdministrarUsuarios ? <Usuarios /> : <Inicio sesionIniciada={sesionIniciada} onIniciarSesion={abrirModalLogin} />} />
              <Route path="/buscar" element={<Buscar />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </Suspense>
        </main>

        {mostrarModalAuth && (
          <div className="modalAuthOverlay" role="dialog" aria-modal="true" aria-label="Autenticacion de usuario">
            <div className="modalAuthContenido">
              <button
                type="button"
                className="modalAuthCerrar"
                onClick={cerrarModalAuth}
                aria-label="Cerrar autenticacion"
              >
                x
              </button>

              <h2>{modoAuth === 'login' ? 'Iniciar sesion' : 'Registrarse'}</h2>
              <p className="modalAuthSubtitulo">
                {modoAuth === 'login'
                  ? 'Ingresa con tu correo y contrasena para acceder a toda la plataforma.'
                  : 'Crea tu cuenta si aun no estas registrado.'}
              </p>

              {authError && <div className="modalAuthError">{authError}</div>}

              <form className="modalAuthFormulario" onSubmit={manejarAutenticacion}>
                {modoAuth === 'registro' && (
                  <>
                    <div className="modalAuthGrupo">
                      <label htmlFor="authNombre">Nombre completo</label>
                      <input
                        id="authNombre"
                        type="text"
                        value={formularioAuth.nombreCompleto}
                        onChange={(event) => setFormularioAuth({ ...formularioAuth, nombreCompleto: event.target.value })}
                        required
                        placeholder="Ej: Laura Gonzalez"
                      />
                    </div>
                    <div className="modalAuthGrupo">
                      <label htmlFor="authRol">Ocupación</label>
                      <select
                        id="authRol"
                        value={formularioAuth.rol}
                        onChange={(event) => setFormularioAuth({ ...formularioAuth, rol: event.target.value })}
                        required
                      >
                        <option value="">Selecciona tu ocupación</option>
                        <option value="ESTUDIANTE">Estudiante</option>
                        <option value="UNIVERSITARIO">Universitario</option>
                        <option value="EMPLEADO">Empleado</option>
                        <option value="DOCENTE">Docente</option>
                        <option value="INVESTIGADOR">Investigador</option>
                        <option value="DESEMPLEADO">Desempleado</option>
                        <option value="OTRO">Otro</option>
                      </select>
                    </div>
                  </>
                )}

                <div className="modalAuthGrupo">
                  <label htmlFor="authCorreo">Correo electronico</label>
                  <input
                    id="authCorreo"
                    type="email"
                    value={formularioAuth.correoElectronico}
                    onChange={(event) => setFormularioAuth({ ...formularioAuth, correoElectronico: event.target.value })}
                    required
                    placeholder="correo@ejemplo.com"
                  />
                </div>

                <div className="modalAuthGrupo">
                  <label htmlFor="authContrasena">Contrasena</label>
                  <input
                    id="authContrasena"
                    type="password"
                    value={formularioAuth.contrasena}
                    onChange={(event) => setFormularioAuth({ ...formularioAuth, contrasena: event.target.value })}
                    required
                    placeholder="Minimo 6 caracteres"
                  />
                </div>

                {modoAuth === 'registro' && (
                  <div className="modalAuthGrupo">
                    <label htmlFor="authConfirmarContrasena">Confirmar contrasena</label>
                    <input
                      id="authConfirmarContrasena"
                      type="password"
                      value={formularioAuth.confirmarContrasena}
                      onChange={(event) => setFormularioAuth({ ...formularioAuth, confirmarContrasena: event.target.value })}
                      required
                      placeholder="Repite tu contrasena"
                    />
                  </div>
                )}

                <button type="submit" className="botonAuthPrincipal" disabled={authCargando}>
                  {authCargando
                    ? 'Procesando...'
                    : modoAuth === 'login'
                      ? 'Entrar'
                      : 'Crear cuenta'}
                </button>
              </form>

              <p className="modalAuthCambioModo">
                {modoAuth === 'login' ? 'No estas registrado?' : 'Ya estas registrado?'}
                <button
                  type="button"
                  className="modalAuthEnlace"
                  onClick={() => cambiarModoAuth(modoAuth === 'login' ? 'registro' : 'login')}
                >
                  {modoAuth === 'login' ? ' Registrate aqui' : ' Inicia sesion aqui'}
                </button>
              </p>
            </div>
          </div>
        )}

        <footer className="piePagina">
          <p>&copy; 2026 Hub Educativo Colombia. Todos los derechos reservados.</p>
        </footer>
      </div>
    </Router>
  )
}

export default App
