import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import apiService from '../services/apiService'
import './Inicio.css'

export default function Inicio() {
    const [datos, setDatos] = useState(null)
    const [error, setError] = useState(null)
    const [cargando, setCargando] = useState(true)

    useEffect(() => {
        cargarDatos()
    }, [])

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
            <p className="subtituloInicio">Plataforma educativa para consultar instituciones y programas académicos</p>

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
