import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import apiService from '../services/apiService'
import './Buscar.css'

export default function Buscar() {
    const [searchParams] = useSearchParams()
    const [datos, setDatos] = useState(null)
    const [termino, setTermino] = useState('')
    const [tipo, setTipo] = useState('todas')
    const [resultados, setResultados] = useState([])
    const [cargando, setCargando] = useState(false)
    const [intentoBuscar, setIntentoBuscar] = useState(false)

    const debeElegirCategoria = tipo === 'todas'

    useEffect(() => {
        cargarDatos()
    }, [])

    useEffect(() => {
        const tipoUrl = searchParams.get('tipo')
        const categoriasValidas = ['todas', 'instituciones', 'sedes', 'programas']
        if (tipoUrl && categoriasValidas.includes(tipoUrl)) {
            setTipo(tipoUrl)
        }
    }, [searchParams])

    const cargarDatos = async () => {
        try {
            const respuesta = await apiService.sincronizar()
            setDatos(respuesta)
        } catch (err) {
            console.error('Error:', err)
        }
    }

    const buscar = () => {
        if (debeElegirCategoria) {
            setResultados([])
            return
        }

        if (!datos) {
            setResultados([])
            return
        }

        const termino_lower = termino.trim().toLowerCase()
        const instituciones = datos.instituciones || []
        const sedes = datos.sedesInstitucion || []
        const detallesPorPrograma = new Map(
            (datos.detallesOperacion || []).map((detalle) => [detalle.idPrograma, detalle])
        )
        const programas = (datos.programasAcademicos || []).map((programa) => {
            const detalle = detallesPorPrograma.get(programa.idPrograma) || {}
            return {
                ...programa,
                costoSemestre: detalle.costoSemestre ?? null
            }
        })
        let nuevosResultados = []

        if (tipo === 'instituciones') {
            const coincidentes = instituciones.filter(i =>
                !termino_lower || i.nombreOficial.toLowerCase().includes(termino_lower)
            )
            nuevosResultados = coincidentes.map(i => ({
                tipo: 'institución',
                datos: i,
                sedesRelacionadas: sedes.filter(s => s.idInstitucion === i.idInstitucion),
                programasRelacionados: programas.filter(p => p.idInstitucion === i.idInstitucion)
            }))
        } else if (tipo === 'sedes') {
            const coincidentes = sedes.filter(s =>
                !termino_lower ||
                s.nombreSede.toLowerCase().includes(termino_lower) ||
                s.ciudad.toLowerCase().includes(termino_lower) ||
                (s.direccionFisica || '').toLowerCase().includes(termino_lower)
            )
            nuevosResultados = coincidentes.map(s => ({
                tipo: 'sede',
                datos: s,
                institucionRelacionada: instituciones.find(i => i.idInstitucion === s.idInstitucion) || null,
                programasRelacionados: programas.filter(p => p.idInstitucion === s.idInstitucion)
            }))
        } else if (tipo === 'programas') {
            const coincidentes = programas.filter(p =>
                !termino_lower || p.nombrePrograma.toLowerCase().includes(termino_lower)
            )
            nuevosResultados = coincidentes.map(p => ({
                tipo: 'programa',
                datos: p,
                institucionRelacionada: instituciones.find(i => i.idInstitucion === p.idInstitucion) || null,
                sedesRelacionadas: sedes.filter(s => s.idInstitucion === p.idInstitucion)
            }))
        } else {
            // todas
            nuevosResultados = [
                ...instituciones
                    .filter(i => !termino_lower || i.nombreOficial.toLowerCase().includes(termino_lower))
                    .map(i => ({
                        tipo: 'institución', datos: i,
                        sedesRelacionadas: sedes.filter(s => s.idInstitucion === i.idInstitucion),
                        programasRelacionados: programas.filter(p => p.idInstitucion === i.idInstitucion)
                    })),
                ...sedes
                    .filter(s => !termino_lower ||
                        s.nombreSede.toLowerCase().includes(termino_lower) ||
                        s.ciudad.toLowerCase().includes(termino_lower))
                    .map(s => ({
                        tipo: 'sede', datos: s,
                        institucionRelacionada: instituciones.find(i => i.idInstitucion === s.idInstitucion) || null,
                        programasRelacionados: programas.filter(p => p.idInstitucion === s.idInstitucion)
                    })),
                ...programas
                    .filter(p => !termino_lower || p.nombrePrograma.toLowerCase().includes(termino_lower))
                    .map(p => ({
                        tipo: 'programa', datos: p,
                        institucionRelacionada: instituciones.find(i => i.idInstitucion === p.idInstitucion) || null,
                        sedesRelacionadas: sedes.filter(s => s.idInstitucion === p.idInstitucion)
                    }))
            ]
        }

        setResultados(nuevosResultados)
    }

    const manejarBuscar = (e) => {
        e.preventDefault()
        if (debeElegirCategoria) {
            setIntentoBuscar(true)
            setResultados([])
            return
        }
        setIntentoBuscar(false)
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
                            placeholder="Buscar universidades, sedes o programas..."
                            value={termino}
                            onChange={(e) => setTermino(e.target.value)}
                        />
                        <select value={tipo} onChange={(e) => { setTipo(e.target.value); setIntentoBuscar(false) }}>
                            <option value="todas">Todas las categorías</option>
                            <option value="instituciones">Instituciones</option>
                            <option value="sedes">Sedes</option>
                            <option value="programas">Programas</option>
                        </select>
                        <button type="submit" className="boton botonPrimario">
                            🔍 Buscar
                        </button>
                    </div>
                </form>
                {intentoBuscar && debeElegirCategoria && (
                    <p className="avisoCategoria">Debes seleccionar una categoría específica para poder buscar.</p>
                )}
            </div>

            {cargando && (
                <div className="mensajeVacio">
                    <div className="iconoVacio">⏳</div>
                    <p>Buscando...</p>
                </div>
            )}

            {!cargando && resultados.length === 0 && termino && !(intentoBuscar && debeElegirCategoria) && (
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

                                        {result.sedesRelacionadas && result.sedesRelacionadas.length > 0 && (
                                            <div className="relacionados">
                                                <p><strong>🏛️ Sedes ({result.sedesRelacionadas.length}):</strong></p>
                                                <ul>
                                                    {result.sedesRelacionadas.map(s => (
                                                        <li key={s.idSede}>{s.nombreSede} — {s.ciudad}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                        {result.programasRelacionados && result.programasRelacionados.length > 0 && (
                                            <div className="relacionados">
                                                <p><strong>📚 Programas ({result.programasRelacionados.length}):</strong></p>
                                                <ul>
                                                    {result.programasRelacionados.map(p => (
                                                        <li key={p.idPrograma}>{p.nombrePrograma} — {p.nivelFormacion}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </>
                                )}
                                {result.tipo === 'sede' && (
                                    <>
                                        <h3>🏛️ {result.datos.nombreSede}</h3>
                                        <p><strong>Ciudad:</strong> {result.datos.ciudad}</p>
                                        <p><strong>Dirección:</strong> {result.datos.direccionFisica}</p>
                                        {result.datos.esSedePrincipal && <p><strong>Sede principal</strong></p>}

                                        {result.institucionRelacionada && (
                                            <div className="relacionados">
                                                <p><strong>🏢 Universidad:</strong> {result.institucionRelacionada.nombreOficial}</p>
                                                {result.institucionRelacionada.sitioWeb && (
                                                    <p><strong>Sitio:</strong> {result.institucionRelacionada.sitioWeb}</p>
                                                )}
                                            </div>
                                        )}
                                        {result.programasRelacionados && result.programasRelacionados.length > 0 && (
                                            <div className="relacionados">
                                                <p><strong>📚 Programas ({result.programasRelacionados.length}):</strong></p>
                                                <ul>
                                                    {result.programasRelacionados.map(p => (
                                                        <li key={p.idPrograma}>{p.nombrePrograma} — {p.nivelFormacion}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </>
                                )}
                                {result.tipo === 'programa' && (
                                    <>
                                        <h3>📚 {result.datos.nombrePrograma}</h3>
                                        <p><strong>Nivel:</strong> {result.datos.nivelFormacion}</p>
                                        <p><strong>Semestres:</strong> {result.datos.totalSemestres}</p>
                                        {result.datos.costoSemestre !== null && result.datos.costoSemestre !== undefined && (
                                            <p><strong>Costo por semestre:</strong> ${Number(result.datos.costoSemestre).toLocaleString()}</p>
                                        )}

                                        {result.institucionRelacionada && (
                                            <div className="relacionados">
                                                <p><strong>🏢 Universidad:</strong> {result.institucionRelacionada.nombreOficial}</p>
                                                {result.institucionRelacionada.sitioWeb && (
                                                    <p><strong>Sitio:</strong> {result.institucionRelacionada.sitioWeb}</p>
                                                )}
                                            </div>
                                        )}
                                        {result.sedesRelacionadas && result.sedesRelacionadas.length > 0 && (
                                            <div className="relacionados">
                                                <p><strong>🏛️ Sedes ({result.sedesRelacionadas.length}):</strong></p>
                                                <ul>
                                                    {result.sedesRelacionadas.map(s => (
                                                        <li key={s.idSede}>{s.nombreSede} — {s.ciudad}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
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
