import { useEffect, useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  ComposedChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import apiService from '../services/apiService'
import './Dashboard.css'

const COLORES = ['#00509d', '#f77f00', '#d62828', '#6a4c93', '#2a9d8f', '#e9c46a', '#264653', '#e76f51']

const TODOS = '__TODOS__'

const agrupar = (lista, clave) =>
  Object.entries(
    lista.reduce((acc, item) => {
      const k = item[clave] || 'Sin datos'
      acc[k] = (acc[k] || 0) + 1
      return acc
    }, {})
  )
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)

const opcionesUnicas = (lista, clave) =>
  [...new Set(lista.map((x) => x[clave]).filter(Boolean))].sort()

const construirCascada = (datos) => {
  let acumulado = 0
  return datos.map((item) => {
    const inicio = acumulado
    acumulado += item.value
    return {
      name: item.name,
      inicio,
      cambio: item.value,
      total: acumulado,
    }
  })
}

const construirBurbujas = (datos) =>
  datos.map((item, index) => ({
    name: item.name,
    x: index + 1,
    y: item.value,
    z: Math.max(80, item.value * 14),
  }))

function GraficaBarras({ datos, dataKey = 'value', nameKey = 'name', color, etiquetaY }) {
  if (!datos.length) return <p className="sinDatos">Sin datos para los filtros seleccionados.</p>
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={datos} margin={{ top: 8, right: 12, left: 0, bottom: 40 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={nameKey} tick={{ fontSize: 11 }} angle={-30} textAnchor="end" interval={0} />
        <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
        <Tooltip />
        <Bar dataKey={dataKey} name={etiquetaY} fill={color} radius={[6, 6, 0, 0]}>
          {datos.map((_, i) => (
            <Cell key={i} fill={COLORES[i % COLORES.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

function GraficaPie({ datos, dataKey = 'value', nameKey = 'name' }) {
  if (!datos.length) return <p className="sinDatos">Sin datos para los filtros seleccionados.</p>
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={datos}
          dataKey={dataKey}
          nameKey={nameKey}
          cx="50%"
          cy="50%"
          outerRadius="70%"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          labelLine={false}
        >
          {datos.map((_, i) => (
            <Cell key={i} fill={COLORES[i % COLORES.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(v) => v.toLocaleString('es-CO')} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}

function GraficaCascada({ datos }) {
  if (!datos.length) return <p className="sinDatos">Sin datos para los filtros seleccionados.</p>
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={datos} margin={{ top: 8, right: 12, left: 0, bottom: 40 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-30} textAnchor="end" interval={0} />
        <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
        <Tooltip formatter={(valor) => Number(valor).toLocaleString('es-CO')} />
        <Legend />
        <Bar dataKey="inicio" stackId="cascada" fill="transparent" name="Base" />
        <Bar dataKey="cambio" stackId="cascada" fill="#00509d" name="Incremento" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

function GraficaBurbuja({ datos }) {
  if (!datos.length) return <p className="sinDatos">Sin datos para los filtros seleccionados.</p>
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart margin={{ top: 10, right: 16, left: 0, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="x" name="Nivel" tick={false} />
        <YAxis dataKey="y" name="Programas" allowDecimals={false} tick={{ fontSize: 11 }} />
        <Tooltip
          cursor={{ strokeDasharray: '3 3' }}
          formatter={(valor, key) => {
            if (key === 'Programas') return Number(valor).toLocaleString('es-CO')
            return valor
          }}
          labelFormatter={(_, payload) => payload?.[0]?.payload?.name || ''}
        />
        <Scatter name="Programas" data={datos} fill="#f77f00" />
      </ScatterChart>
    </ResponsiveContainer>
  )
}

function GraficaAnillos({ datos, dataKey = 'value', nameKey = 'name' }) {
  if (!datos.length) return <p className="sinDatos">Sin datos para los filtros seleccionados.</p>
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={datos}
          dataKey={dataKey}
          nameKey={nameKey}
          cx="50%"
          cy="50%"
          innerRadius="45%"
          outerRadius="70%"
          paddingAngle={3}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {datos.map((_, i) => (
            <Cell key={i} fill={COLORES[i % COLORES.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(v) => Number(v).toLocaleString('es-CO')} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}

function GraficaCombinada({ datos }) {
  if (!datos.length) return <p className="sinDatos">Sin datos para los filtros seleccionados.</p>
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={datos} margin={{ top: 8, right: 12, left: 0, bottom: 40 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-30} textAnchor="end" interval={0} />
        <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
        <Tooltip formatter={(v) => Number(v).toLocaleString('es-CO')} />
        <Legend />
        <Bar dataKey="value" name="Sedes" fill="#2a9d8f" radius={[6, 6, 0, 0]} />
        <Line type="monotone" dataKey="value" name="Tendencia" stroke="#d62828" strokeWidth={2.5} dot={{ r: 3 }} />
      </ComposedChart>
    </ResponsiveContainer>
  )
}

function TarjetaKpi({ icono, titulo, valor, subtitulo, acento }) {
  return (
    <article className="kpiCard" style={{ borderTop: `4px solid ${acento}` }}>
      <span className="kpiIcono">{icono}</span>
      <h3>{titulo}</h3>
      <strong style={{ color: acento }}>{valor}</strong>
      <p>{subtitulo}</p>
    </article>
  )
}

function SelectFiltro({ label, valor, onChange, opciones }) {
  return (
    <label className="filtroGrupo">
      <span className="filtroLabel">{label}</span>
      <select className="filtroSelect" value={valor} onChange={(e) => onChange(e.target.value)}>
        <option value={TODOS}>Todos</option>
        {opciones.map((op) => (
          <option key={op} value={op}>{op}</option>
        ))}
      </select>
    </label>
  )
}

function Dashboard() {
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [datos, setDatos] = useState(null)

  // Filtros
  const [filtrNaturaleza, setFiltrNaturaleza] = useState(TODOS)
  const [filtrNivel, setFiltrNivel] = useState(TODOS)
  const [filtrEstadoUsuario, setFiltrEstadoUsuario] = useState(TODOS)
  const [filtrCiudad, setFiltrCiudad] = useState(TODOS)

  useEffect(() => {
    const cargar = async () => {
      try {
        setCargando(true)
        setError('')
        const sinc = await apiService.sincronizar()
        setDatos(sinc)
      } catch (err) {
        setError(err.message || 'No fue posible cargar los datos del dashboard')
      } finally {
        setCargando(false)
      }
    }
    cargar()
  }, [])

  // Opciones para los selects (dinámicas, desde datos sin filtrar)
  const opciones = useMemo(() => {
    if (!datos) return { naturalezas: [], niveles: [], ciudades: [] }
    return {
      naturalezas: opcionesUnicas(datos.instituciones || [], 'naturaleza'),
      niveles: opcionesUnicas(datos.programasAcademicos || [], 'nivelFormacion'),
      ciudades: opcionesUnicas(datos.sedesInstitucion || [], 'ciudad'),
    }
  }, [datos])

  const series = useMemo(() => {
    if (!datos) return null

    const todasInst = datos.instituciones || []
    const todosUsuarios = datos.usuarios || []
    const todosProgramas = datos.programasAcademicos || []
    const todasSedes = datos.sedesInstitucion || []

    // Instituciones filtradas por naturaleza
    const instFiltradas = filtrNaturaleza === TODOS
      ? todasInst
      : todasInst.filter((i) => i.naturaleza === filtrNaturaleza)

    const idsInstFiltradas = new Set(instFiltradas.map((i) => i.idInstitucion))

    // Programas filtrados por institución (naturaleza) y nivel
    const progFiltrados = todosProgramas.filter((p) => {
      const pasaNaturaleza = filtrNaturaleza === TODOS || idsInstFiltradas.has(p.idInstitucion)
      const pasaNivel = filtrNivel === TODOS || p.nivelFormacion === filtrNivel
      return pasaNaturaleza && pasaNivel
    })

    // Usuarios filtrados por estado
    const usuariosFiltrados = filtrEstadoUsuario === TODOS
      ? todosUsuarios
      : todosUsuarios.filter((u) =>
          filtrEstadoUsuario === 'Activos' ? u.estaActivo : !u.estaActivo
        )

    // Sedes filtradas por ciudad e institución (naturaleza)
    const sedesFiltradas = todasSedes.filter((s) => {
      const pasaCiudad = filtrCiudad === TODOS || s.ciudad === filtrCiudad
      const pasaNaturaleza = filtrNaturaleza === TODOS || idsInstFiltradas.has(s.idInstitucion)
      return pasaCiudad && pasaNaturaleza
    })

    // 1. Instituciones por naturaleza (respeta filtro de naturaleza)
    const instPorNaturaleza = agrupar(instFiltradas, 'naturaleza')

    // 2. Usuarios por ocupación
    const usuariosPorOcupacion = agrupar(usuariosFiltrados, 'ocupacion')

    // 3. Tasa de usuarios activos
    const totalUsuarios = usuariosFiltrados.length
    const activos = usuariosFiltrados.filter((u) => u.estaActivo).length
    const tasaActivos = totalUsuarios > 0 ? Math.round((activos / totalUsuarios) * 100) : 0

    // 4. Programas por institución (top 10)
    const mapaInst = Object.fromEntries(todasInst.map((i) => [i.idInstitucion, i.nombreOficial]))
    const conteoProgInst = progFiltrados.reduce((acc, p) => {
      const nombre = mapaInst[p.idInstitucion] || `Inst. ${p.idInstitucion}`
      acc[nombre] = (acc[nombre] || 0) + 1
      return acc
    }, {})
    const programasPorInstitucion = Object.entries(conteoProgInst)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10)

    // 5. Programas por nivel
    const programasPorNivel = agrupar(progFiltrados, 'nivelFormacion')

    // 6. Sedes por ciudad (top 10)
    const sedesPorCiudad = agrupar(sedesFiltradas, 'ciudad').slice(0, 10)

    const programasPorInstitucionCascada = construirCascada(programasPorInstitucion)
    const programasPorNivelBurbuja = construirBurbujas(programasPorNivel)

    return {
      instPorNaturaleza,
      usuariosPorOcupacion,
      tasaActivos, activos, totalUsuarios,
      programasPorInstitucion,
      programasPorInstitucionCascada,
      programasPorNivel,
      programasPorNivelBurbuja,
      sedesPorCiudad,
      totalInstituciones: instFiltradas.length,
      totalProgramas: progFiltrados.length,
      totalSedes: sedesFiltradas.length,
    }
  }, [datos, filtrNaturaleza, filtrNivel, filtrEstadoUsuario, filtrCiudad])

  const hayFiltrosActivos =
    filtrNaturaleza !== TODOS || filtrNivel !== TODOS ||
    filtrEstadoUsuario !== TODOS || filtrCiudad !== TODOS

  const filtroActivo = useMemo(() => {
    if (filtrNaturaleza !== TODOS) return 'naturaleza'
    if (filtrNivel !== TODOS) return 'nivel'
    if (filtrEstadoUsuario !== TODOS) return 'estado'
    if (filtrCiudad !== TODOS) return 'ciudad'
    return null
  }, [filtrNaturaleza, filtrNivel, filtrEstadoUsuario, filtrCiudad])

  const mostrarTodasLasGraficas = !filtroActivo

  const limpiarFiltros = () => {
    setFiltrNaturaleza(TODOS)
    setFiltrNivel(TODOS)
    setFiltrEstadoUsuario(TODOS)
    setFiltrCiudad(TODOS)
  }

  return (
    <section className="dashboardAnalitico">
      <header className="dashboardHero">
        <p className="dashboardEyebrow"></p>
        <h2>Dashboard de Analítica Académica</h2>
      </header>

      {cargando && <div className="dashboardEstado">Cargando datos...</div>}
      {!cargando && error && <div className="dashboardError" role="alert">{error}</div>}

      {!cargando && !error && series && (
        <>
          {/* Barra de filtros */}
          <div className="filtrosBar">
            <div className="filtrosGrupos">
              <SelectFiltro
                label="Naturaleza institución"
                valor={filtrNaturaleza}
                onChange={setFiltrNaturaleza}
                opciones={opciones.naturalezas}
              />
              <SelectFiltro
                label="Nivel de formación"
                valor={filtrNivel}
                onChange={setFiltrNivel}
                opciones={opciones.niveles}
              />
              <SelectFiltro
                label="Estado de usuarios"
                valor={filtrEstadoUsuario}
                onChange={setFiltrEstadoUsuario}
                opciones={['Activos', 'Inactivos']}
              />
              <SelectFiltro
                label="Ciudad de sede"
                valor={filtrCiudad}
                onChange={setFiltrCiudad}
                opciones={opciones.ciudades}
              />
            </div>
            {hayFiltrosActivos && (
              <button type="button" className="filtrosLimpiar" onClick={limpiarFiltros}>
                Limpiar filtros
              </button>
            )}
          </div>

          {/* KPIs */}
          <div className="kpiGrid">
            <TarjetaKpi icono="" titulo="Instituciones" valor={series.totalInstituciones}
              subtitulo="Según filtros aplicados" acento="#00509d" />
            <TarjetaKpi icono="" titulo="Programas académicos" valor={series.totalProgramas}
              subtitulo="Según filtros aplicados" acento="#f77f00" />
            <TarjetaKpi icono="" titulo="Sedes" valor={series.totalSedes}
              subtitulo="Según filtros aplicados" acento="#2a9d8f" />
            <TarjetaKpi icono="" titulo="Tasa usuarios activos" valor={`${series.tasaActivos}%`}
              subtitulo={`${series.activos} activos de ${series.totalUsuarios}`} acento="#d62828" />
          </div>

          {/* 6 indicadores */}
          <div className="graficasGrid">
            {(mostrarTodasLasGraficas || filtroActivo === 'naturaleza') && (
              <article className="graficaCard">
                <h4 className="graficaTitulo">Distribución de Instituciones por Naturaleza</h4>
                <div className="chartArea">
                  <GraficaPie datos={series.instPorNaturaleza} />
                </div>
                <p className="graficaConclu">
                  Composición del sistema educativo entre instituciones públicas, privadas y mixtas según el filtro activo.
                </p>
              </article>
            )}

            {mostrarTodasLasGraficas && (
              <article className="graficaCard">
                <h4 className="graficaTitulo">Usuarios por Ocupación</h4>
                <div className="chartArea">
                  <GraficaBarras datos={series.usuariosPorOcupacion} color="#6a4c93" etiquetaY="Usuarios" />
                </div>
                <p className="graficaConclu">
                  Perfil ocupacional de los usuarios filtrados por estado (activos / inactivos / todos).
                </p>
              </article>
            )}

            {(mostrarTodasLasGraficas || filtroActivo === 'estado') && (
              <article className="graficaCard">
                <h4 className="graficaTitulo">Tasa de Usuarios Activos</h4>
                <div className="chartArea">
                  <GraficaAnillos
                    datos={[
                      { name: 'Activos', value: series.activos },
                      { name: 'Inactivos', value: series.totalUsuarios - series.activos }
                    ]}
                  />
                </div>
                <p className="graficaConclu">
                  Proporción de usuarios habilitados frente al total del segmento seleccionado.
                </p>
              </article>
            )}

            {mostrarTodasLasGraficas && (
              <article className="graficaCard">
                <h4 className="graficaTitulo">Programas Académicos por Institución (Cascada)</h4>
                <div className="chartArea">
                  <GraficaCascada datos={series.programasPorInstitucionCascada} />
                </div>
                <p className="graficaConclu">
                  Acumulado progresivo de programas por institución para visualizar el aporte incremental de cada una.
                </p>
              </article>
            )}

            {(mostrarTodasLasGraficas || filtroActivo === 'nivel') && (
              <article className="graficaCard">
                <h4 className="graficaTitulo">Programas por Nivel de Formación (Burbuja)</h4>
                <div className="chartArea">
                  <GraficaBurbuja datos={series.programasPorNivelBurbuja} />
                </div>
                <p className="graficaConclu">
                  Cada burbuja representa un nivel; altura y tamaño indican volumen de programas en esa categoría.
                </p>
              </article>
            )}

            {(mostrarTodasLasGraficas || filtroActivo === 'ciudad') && (
              <article className="graficaCard">
                <h4 className="graficaTitulo">Cobertura Geográfica de Sedes (Combinada)</h4>
                <div className="chartArea">
                  <GraficaCombinada datos={series.sedesPorCiudad} />
                </div>
                <p className="graficaConclu">
                  Comparación entre volumen de sedes por ciudad y su comportamiento de tendencia en una sola vista.
                </p>
              </article>
            )}
          </div>
        </>
      )}
    </section>
  )
}

export default Dashboard
