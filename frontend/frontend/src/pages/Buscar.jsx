import { useState, useEffect } from 'react'
import apiService from '../services/apiService'
import './Buscar.css'

export default function Buscar() {
    const [datos, setDatos] = useState(null)
    const [termino, setTermino] = useState('')
    const [tipo, setTipo] = useState('todas')
    const [resultados, setResultados] = useState([])
    const [cargando, setCargando] = useState(false)

    useEffect(() => {
        cargarDatos()
    }, [])

    const cargarDatos = async () => {
        try {
            const respuesta = await apiService.sincronizar()
            setDatos(respuesta)
        } catch (err) {
            console.error('Error:', err)
        }
    }

    const buscar = () => {
        if (!datos || !termino.trim()) {
            setResultados([])
            return
        }

        const termino_lower = termino.toLowerCase()
        let nuevosResultados = []

        if (tipo === 'instituciones' || tipo === 'todas') {
            nuevosResultados = [
                ...nuevosResultados,
                ...datos.instituciones
                    .filter(i => i.nombreOficial.toLowerCase().includes(termino_lower))
                    .map(i => ({ tipo: 'institución', datos: i }))
            ]
        }

        if (tipo === 'programas' || tipo === 'todas') {
            nuevosResultados = [
                ...nuevosResultados,
                ...datos.programasAcademicos
                    .filter(p => p.nombrePrograma.toLowerCase().includes(termino_lower))
                    .map(p => ({ tipo: 'programa', datos: p }))
            ]
        }

        if (tipo === 'usuarios' || tipo === 'todas') {
            nuevosResultados = [
                ...nuevosResultados,
                ...datos.usuarios
                    .filter(u => u.nombreCompleto.toLowerCase().includes(termino_lower))
                    .map(u => ({ tipo: 'usuario', datos: u }))
            ]
        }

        if (tipo === 'sedes' || tipo === 'todas') {
            nuevosResultados = [
                ...nuevosResultados,
                ...(datos.sedesInstitucion || [])
                    .filter((s) => s.ciudad.toLowerCase().includes(termino_lower))
                    .map((s) => ({ tipo: 'sede', datos: s }))
            ]
        }

        setResultados(nuevosResultados)
    }

    const manejarBuscar = (e) => {
        e.preventDefault()
        setCargando(true)
        setTimeout(() => {
            buscar()
            setCargando(false)
        }, 300)
    }

    return (
        <div className="seccionBusqueda">
            <h1 className="tituloSeccion">Búsqueda Avanzada</h1>

            <div className="contenedorBusqueda">
                <form onSubmit={manejarBuscar} className="formularioBusqueda">
                    <div className="campoBusqueda">
                        <input
                            type="text"
                            placeholder="Buscar instituciones, sedes, programas o usuarios..."
                            value={termino}
                            onChange={(e) => setTermino(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && buscar()}
                        />
                        <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
                            <option value="todas">Todas las categorías</option>
                            <option value="instituciones">Instituciones</option>
                            <option value="sedes">Sedes</option>
                            <option value="programas">Programas</option>
                            <option value="usuarios">Usuarios</option>
                        </select>
                        <button type="submit" className="boton botonPrimario">
                            🔍 Buscar
                        </button>
                    </div>
                </form>
            </div>

            {cargando && (
                <div className="mensajeVacio">
                    <div className="iconoVacio">⏳</div>
                    <p>Buscando...</p>
                </div>
            )}

            {!cargando && resultados.length === 0 && termino && (
                <div className="mensajeVacio">
                    <div className="iconoVacio">🔍</div>
                    <p>No se encontraron resultados para "{termino}"</p>
                </div>
            )}

            {!cargando && resultados.length > 0 && (
                <div className="seccionResultados">
                    <h2>Resultados ({resultados.length})</h2>
                    <div className="contenedorResultados">
                        {resultados.map((result, idx) => (
                            <div key={idx} className={`resultadoBusqueda resultado${result.tipo.charAt(0).toUpperCase() + result.tipo.slice(1)}`}>
                                {result.tipo === 'institución' && (
                                    <>
                                        <h3>🏢 {result.datos.nombreOficial}</h3>
                                        <p><strong>Naturaleza:</strong> {result.datos.naturaleza}</p>
                                        {result.datos.sitioWeb && <p><strong>Sitio:</strong> {result.datos.sitioWeb}</p>}
                                    </>
                                )}
                                {result.tipo === 'programa' && (
                                    <>
                                        <h3>📚 {result.datos.nombrePrograma}</h3>
                                        <p><strong>Nivel:</strong> {result.datos.nivelFormacion}</p>
                                        <p><strong>Semestres:</strong> {result.datos.totalSemestres}</p>
                                    </>
                                )}
                                {result.tipo === 'usuario' && (
                                    <>
                                        <h3>👤 {result.datos.nombreCompleto}</h3>
                                        <p><strong>Email:</strong> {result.datos.correoElectronico}</p>
                                        <p><strong>Rol:</strong> {result.datos.rol}</p>
                                    </>
                                )}
                                {result.tipo === 'sede' && (
                                    <>
                                        <h3>🏛️ {result.datos.nombreSede}</h3>
                                        <p><strong>Ciudad:</strong> {result.datos.ciudad}</p>
                                        <p><strong>Dirección:</strong> {result.datos.direccionFisica}</p>
                                        <p><strong>Institución ID:</strong> {result.datos.idInstitucion}</p>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
