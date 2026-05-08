import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import apiService from '../services/apiService'
import './Inicio.css'

export default function Inicio({ sesionIniciada, onIniciarSesion }) {
    const [datos, setDatos] = useState(null)
    const [error, setError] = useState(null)
    const [cargando, setCargando] = useState(sesionIniciada)

    useEffect(() => {
        if (sesionIniciada) {
            cargarDatos()
        }
    }, [sesionIniciada])

    const cargarDatos = async () => {
        try {
            setCargando(true)
            setError(null)
            const respuesta = await apiService.sincronizar()
            setDatos(respuesta)
        } catch (err) {
            console.error('Error al cargar datos:', err)
            setError('No se pudieron cargar los datos. Inicia backend y frontend con "npm run dev" en la raíz del proyecto.')
        } finally {
            setCargando(false)
        }
    }

    if (!sesionIniciada) {
        return (
            <div className="seccionInicio seccionInicioPublica">
                <section className="heroInicio">
                    <p className="heroEtiqueta">Plataforma educativa nacional</p>

                    <div className="heroSabiasQue">
                        <span className="etiquetaSabias">SABIAS QUE?</span>
                        <h2>Colombia avanza hacia una educacion mas innovadora, flexible y conectada con el empleo real.</h2>
                        <p>
                            Miles de estudiantes estan eligiendo programas con enfoque tecnologico, habilidades digitales y formacion
                            por competencias para asegurar mejores oportunidades.
                        </p>
                    </div>

                    <div className="heroBotones">
                        <Link to="/buscar?tipo=instituciones" className="botonHero botonHeroClaro">Buscar universidades</Link>
                        <Link to="/buscar?tipo=sedes" className="botonHero botonHeroClaro">Buscar sedes</Link>
                        <Link to="/buscar?tipo=programas" className="botonHero botonHeroClaro">Buscar programas</Link>
                        <button type="button" className="botonHero botonHeroPrincipal" onClick={onIniciarSesion}>Iniciar sesion</button>
                    </div>
                </section>

                <section className="seccionResenas">
                    <article className="tarjetaResena">
                        <h3>Las mejores universidades de Colombia</h3>
                        <p>
                            Instituciones como Universidad Nacional, Universidad de los Andes, Universidad de Antioquia y Javeriana
                            lideran por calidad academica, investigacion y reconocimiento internacional.
                        </p>
                    </article>
                    <article className="tarjetaResena">
                        <h3>Carreras de mas auge en Colombia</h3>
                        <p>
                            Ingenieria de software, analisis de datos, ciberseguridad, mercadeo digital, administracion en salud y
                            logistica lideran la demanda laboral actual.
                        </p>
                    </article>
                    <article className="tarjetaResena">
                        <h3>Carreras para el futuro en Colombia</h3>
                        <p>
                            Inteligencia artificial, energias renovables, biotecnologia, diseno de experiencias digitales y gestion
                            sostenible se proyectan como profesiones clave para la proxima decada.
                        </p>
                    </article>
                </section>
            </div>
        )
    }

    if (cargando) {
        return (
            <div className="seccionInicio">
                <div className="iconoVacio">⏳</div>
                <p>Cargando datos...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="seccionInicio">
                <div className="mensajeError">{error}</div>
                <button className="boton botonPrimario" onClick={cargarDatos}>
                    Reintentar
                </button>
            </div>
        )
    }

    return (
        <div className="seccionInicio">
            <h1 className="tituloInicio">Bienvenido a Hub Educativo Colombia</h1>
            <p className="subtituloInicio">Plataforma educativa para consultar instituciones, sedes y programas académicos</p>

            {datos && (
                <>
                    <div className="contenedorEstadisticas">
                        <div className="tarjetaEstadistica">
                            <h3>Instituciones</h3>
                            <div className="valorEstadistica">{datos.instituciones?.length || 0}</div>
                        </div>
                        <div className="tarjetaEstadistica">
                            <h3>Sedes</h3>
                            <div className="valorEstadistica">{datos.sedesInstitucion?.length || 0}</div>
                        </div>
                        <div className="tarjetaEstadistica">
                            <h3>Programas Académicos</h3>
                            <div className="valorEstadistica">{datos.programasAcademicos?.length || 0}</div>
                        </div>
                        <div className="tarjetaEstadistica">
                            <h3>Usuarios</h3>
                            <div className="valorEstadistica">{datos.usuarios?.length || 0}</div>
                        </div>
                    </div>

                    <div className="contenedorAccesoRapido">
                        <Link to="/instituciones" className="tarjetaAccesoRapido">
                            <div className="iconoAcceso">🏢</div>
                            <h3>Instituciones</h3>
                            <p>Consulta y gestiona las instituciones educativas</p>
                        </Link>
                        <Link to="/sedes" className="tarjetaAccesoRapido">
                            <div className="iconoAcceso">🏛️</div>
                            <h3>Sedes</h3>
                            <p>Crea, edita y elimina las sedes institucionales</p>
                        </Link>
                        <Link to="/programas" className="tarjetaAccesoRapido">
                            <div className="iconoAcceso">📚</div>
                            <h3>Programas</h3>
                            <p>Explora los programas académicos disponibles</p>
                        </Link>
                        <Link to="/usuarios" className="tarjetaAccesoRapido">
                            <div className="iconoAcceso">👥</div>
                            <h3>Usuarios</h3>
                            <p>Administra los usuarios del sistema</p>
                        </Link>
                    </div>
                </>
            )}
        </div>
    )
}
