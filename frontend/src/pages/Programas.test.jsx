/**
 * @file Programas.test.jsx
 * @description Suite de pruebas unitarias e integración del componente Programas.jsx
 * Cubre renderizado, carga de datos, permisos, modales, validaciones y eliminación.
 * Herramientas: React Testing Library, Jest, @testing-library/user-event
 */

// ─── IMPORTACIONES ────────────────────────────────────────────────────────────
// render    → monta el componente en un DOM simulado (jsdom)
// screen    → consultas al DOM: getBy*, findBy*, queryBy*
// waitFor   → espera asíncrona hasta que una condición se cumpla
import { render, screen, waitFor, fireEvent } from '@testing-library/react'

// userEvent → simula interacciones reales del usuario (click, type, clear, etc.)
// Más fiel al comportamiento del navegador que fireEvent
import userEvent from '@testing-library/user-event'

// Importamos las funciones mock del servicio para configurar sus respuestas en cada test.
// Jest resuelve estos imports desde src/services/__mocks__/apiService.js
// gracias a la llamada jest.mock() más abajo.
import { sincronizar, crearPrograma, actualizarPrograma, eliminarPrograma }
  from '../services/apiService'

// Componente bajo prueba: el que vamos a renderizar y evaluar
import Programas from './Programas'

// Activa el mock manual ubicado en src/services/__mocks__/apiService.js.
// Todos los métodos del servicio quedan como jest.fn() controlables por prueba.
jest.mock('../services/apiService')

// ─── DATOS DE PRUEBA (FIXTURES) ───────────────────────────────────────────────

/** Lista de instituciones educativas simuladas */
const INSTITUCIONES_MOCK = [
  { idInstitucion: 1, nombreOficial: 'Universidad Nacional de Colombia' },
  { idInstitucion: 2, nombreOficial: 'Universidad de Antioquia' }
]

/** Programas académicos base sin enriquecimiento de detalles ni calidad */
const PROGRAMAS_MOCK = [
  {
    idPrograma: 1,
    idInstitucion: 1,
    nombrePrograma: 'Ingeniería de Sistemas',
    nivelFormacion: 'PREGRADO',
    totalSemestres: 8,
    codigoSnies: '53420'
  },
  {
    idPrograma: 2,
    idInstitucion: 2,
    nombrePrograma: 'Maestría en Educación',
    nivelFormacion: 'MAESTRIA',
    totalSemestres: 4,
    codigoSnies: '10234'
  }
]

/**
 * Detalles operativos que cargarDatos() fusiona con cada programa.
 * Corresponden al endpoint /sincronizacion → detallesOperacion
 */
const DETALLES_MOCK = [
  {
    idPrograma: 1,
    costoSemestre: 4500000,
    modalidad: 'PRESENCIAL',
    jornada: 'DIURNA',
    estudiantesActivos: 200
  },
  {
    idPrograma: 2,
    costoSemestre: 3200000,
    modalidad: 'VIRTUAL',
    jornada: 'NOCTURNA',
    estudiantesActivos: 80
  }
]

/**
 * Datos de calidad y beneficios que cargarDatos() también fusiona.
 * Corresponden al endpoint /sincronizacion → calidadBeneficios
 */
const CALIDAD_MOCK = [
  {
    idPrograma: 1,
    acreditacionAltaCalidad: true,
    ofreceBecas: false,
    dobleTitulacion: false,
    requiereSegundoIdioma: false
  },
  {
    idPrograma: 2,
    acreditacionAltaCalidad: false,
    ofreceBecas: true,
    dobleTitulacion: true,
    requiereSegundoIdioma: true
  }
]

/**
 * Respuesta completa que simula apiService.sincronizar().
 * Contiene todos los arrays que el componente espera recibir.
 */
const RESPUESTA_SINCRONIZAR = {
  programasAcademicos: PROGRAMAS_MOCK,
  detallesOperacion:   DETALLES_MOCK,
  calidadBeneficios:   CALIDAD_MOCK,
  instituciones:       INSTITUCIONES_MOCK,
  usuarios:            []
}

// ─── HELPERS DE SESIÓN ────────────────────────────────────────────────────────

/**
 * Simula un usuario autenticado guardando su sesión en localStorage.
 *
 * IMPORTANTE: debe llamarse ANTES de render(<Programas />).
 * El componente lee localStorage en un IIFE sincrónico al inicio de su cuerpo
 * (línea 6 de Programas.jsx), por lo que el dato debe existir antes de montar.
 *
 * @param {string} rol    - Rol del usuario ('ADMIN', 'MASTER', etc.)
 * @param {string} correo - Correo electrónico del usuario
 */
const configurarSesion = (rol, correo = '') => {
  localStorage.setItem('hubUsuarioSesion', JSON.stringify({
    rol,
    correoElectronico: correo
  }))
}

/**
 * Elimina la sesión del localStorage simulando un usuario no autenticado.
 * Se usa en afterEach para garantizar aislamiento entre tests.
 */
const limpiarSesion = () => {
  localStorage.removeItem('hubUsuarioSesion')
}

// ─── CONFIGURACIÓN GLOBAL ─────────────────────────────────────────────────────

/**
 * Antes de cada test:
 * 1. Limpia los registros de todas las funciones mock (calls, results, etc.)
 * 2. Elimina cualquier sesión en localStorage
 * 3. Configura la respuesta por defecto de sincronizar() con datos válidos
 */
beforeEach(() => {
  jest.clearAllMocks()
  limpiarSesion()
  sincronizar.mockResolvedValue(RESPUESTA_SINCRONIZAR)
})

/** Después de cada test: garantiza que la sesión queda limpia */
afterEach(() => {
  limpiarSesion()
})

/** Banner de inicio visible en la consola al comenzar la suite */
beforeAll(() => {
  console.log('\n╔══════════════════════════════════════════════════╗')
  console.log('║  SUITE DE TESTS — Programas.jsx                  ║')
  console.log('║  React Testing Library + Jest                    ║')
  console.log('╚══════════════════════════════════════════════════╝')
})

/** Banner de cierre al terminar todos los tests */
afterAll(() => {
  console.log('\n╔══════════════════════════════════════════════════╗')
  console.log('║  FIN DE SUITE DE TESTS — Programas.jsx           ║')
  console.log('╚══════════════════════════════════════════════════╝\n')
})

// ─────────────────────────────────────────────────────────────────────────────
// BLOQUE 1: RENDERIZADO INICIAL
// Verifica el comportamiento visual inmediato al montar el componente:
// estado de carga, lista vacía y renderizado de tarjetas.
// ─────────────────────────────────────────────────────────────────────────────
describe('1. Renderizado inicial', () => {
  beforeAll(() => console.log('\n▶ BLOQUE 1: Renderizado inicial'))
  afterAll(()  => console.log('✔ BLOQUE 1: completado'))

  /**
   * Test 1.1
   * Mientras sincronizar() no resuelve, el componente debe mostrar "Cargando...".
   * Se usa una promesa que nunca resuelve para mantener cargando=true.
   */
  test('1.1 Muestra "Cargando..." mientras se resuelve la llamada a la API', () => {
    sincronizar.mockReturnValue(new Promise(() => {})) // promesa suspendida
    render(<Programas />)
    const mensajeCarga = screen.getByText(/cargando/i)
    expect(mensajeCarga).toBeInTheDocument()
    console.log('[PASS] 1.1 Mensaje de carga visible:', mensajeCarga.textContent)
  })

  /**
   * Test 1.2
   * Una vez que los datos llegan, el encabezado principal debe ser visible.
   * findByText espera de forma asíncrona hasta que el elemento aparezca.
   */
  test('1.2 Muestra el título "Programas Académicos" tras cargar datos', async () => {
    render(<Programas />)
    const titulo = await screen.findByText('Programas Académicos')
    expect(titulo).toBeInTheDocument()
    console.log('[PASS] 1.2 Título encontrado:', titulo.textContent)
  })

  /**
   * Test 1.3
   * Cuando el array de programasAcademicos está vacío, debe aparecer
   * el mensaje de estado vacío en lugar de tarjetas.
   */
  test('1.3 Muestra "No hay programas registrados" cuando la lista está vacía', async () => {
    sincronizar.mockResolvedValue({ ...RESPUESTA_SINCRONIZAR, programasAcademicos: [] })
    render(<Programas />)
    const mensajeVacio = await screen.findByText(/no hay programas registrados/i)
    expect(mensajeVacio).toBeInTheDocument()
    console.log('[PASS] 1.3 Mensaje vacío:', mensajeVacio.textContent)
  })

  /**
   * Test 1.4
   * Con datos en la respuesta, cada programa debe aparecer como tarjeta.
   * Verificamos los nombres de ambos programas mock.
   */
  test('1.4 Renderiza una tarjeta por cada programa cargado', async () => {
    render(<Programas />)
    const tarjeta1 = await screen.findByText('Ingeniería de Sistemas')
    const tarjeta2 = screen.getByText('Maestría en Educación')
    expect(tarjeta1).toBeInTheDocument()
    expect(tarjeta2).toBeInTheDocument()
    console.log('[PASS] 1.4 Tarjetas renderizadas:', tarjeta1.textContent, '|', tarjeta2.textContent)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// BLOQUE 2: CARGA DE DATOS (cargarDatos)
// Verifica la función asíncrona cargarDatos(): que llama al servicio,
// maneja errores y enriquece los programas con datos de detalles e institución.
// ─────────────────────────────────────────────────────────────────────────────
describe('2. Carga de datos (cargarDatos)', () => {
  beforeAll(() => console.log('\n▶ BLOQUE 2: Carga de datos'))
  afterAll(()  => console.log('✔ BLOQUE 2: completado'))

  /**
   * Test 2.1
   * Al montar, el useEffect llama cargarDatos() una sola vez,
   * que internamente llama apiService.sincronizar().
   */
  test('2.1 Llama a apiService.sincronizar() exactamente una vez al montar', async () => {
    render(<Programas />)
    await screen.findByText('Programas Académicos')
    expect(sincronizar).toHaveBeenCalledTimes(1)
    console.log('[PASS] 2.1 sincronizar() llamado:', sincronizar.mock.calls.length, 'vez(ces)')
  })

  /**
   * Test 2.2
   * Si sincronizar() rechaza la promesa, el componente captura el error
   * y muestra el mensaje "Error al cargar datos".
   */
  test('2.2 Muestra mensaje de error cuando la API falla', async () => {
    sincronizar.mockRejectedValue(new Error('Error de red'))
    render(<Programas />)
    const mensajeError = await screen.findByText(/error al cargar datos/i)
    expect(mensajeError).toBeInTheDocument()
    console.log('[PASS] 2.2 Error de carga mostrado:', mensajeError.textContent)
  })

  /**
   * Test 2.3
   * cargarDatos() fusiona cada programa con su institución correspondiente
   * usando idInstitucion. El nombre oficial debe aparecer en pantalla.
   */
  test('2.3 Muestra el nombre de la institución asociada al programa', async () => {
    render(<Programas />)
    const nombreInst = await screen.findByText('Universidad Nacional de Colombia')
    expect(nombreInst).toBeInTheDocument()
    console.log('[PASS] 2.3 Institución enriquecida:', nombreInst.textContent)
  })

  /**
   * Test 2.4
   * cargarDatos() extrae costoSemestre de detallesOperacion y lo muestra
   * en cada tarjeta. Se usa regex flexible porque toLocaleString() varía
   * según el entorno (jsdom puede omitir separadores de miles).
   */
  test('2.4 Enriquece los programas con costo de detallesOperacion', async () => {
    render(<Programas />)
    await screen.findByText('Ingeniería de Sistemas')
    // El costo 4500000 del primer programa puede mostrarse con o sin separadores
    const elementosCosto = screen.getAllByText(/\$/)
    const hayPrecio = elementosCosto.some(
      el => /4[.,\s]?500[.,\s]?000|4500000/.test(el.textContent)
    )
    expect(hayPrecio).toBe(true)
    console.log('[PASS] 2.4 Costo del semestre enriquecido presente en pantalla')
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// BLOQUE 3: CONTROL DE ACCESO Y PERMISOS
// El componente deriva permisos de localStorage al inicio.
// Verifica que los botones de gestión aparecen o se ocultan según el rol/email.
// ─────────────────────────────────────────────────────────────────────────────
describe('3. Control de acceso y permisos', () => {
  beforeAll(() => console.log('\n▶ BLOQUE 3: Permisos y roles'))
  afterAll(()  => console.log('✔ BLOQUE 3: completado'))

  /**
   * Test 3.1
   * Sin sesión en localStorage, puedeGestionarProgramas=false.
   * El botón "Crear Programa" no debe existir en el DOM.
   */
  test('3.1 Sin sesión: no muestra botón "Crear Programa"', async () => {
    render(<Programas />)
    await screen.findByText('Programas Académicos')
    expect(screen.queryByText('+ Crear Programa')).not.toBeInTheDocument()
    console.log('[PASS] 3.1 Sin sesión: botón "Crear Programa" oculto ✓')
  })

  /**
   * Test 3.2
   * Sin sesión, tampoco deben mostrarse botones de edición ni eliminación
   * en ninguna de las tarjetas de programas.
   */
  test('3.2 Sin sesión: no muestra botones Editar ni Eliminar', async () => {
    render(<Programas />)
    await screen.findByText('Ingeniería de Sistemas')
    expect(screen.queryByText('Editar')).not.toBeInTheDocument()
    expect(screen.queryByText('Eliminar')).not.toBeInTheDocument()
    console.log('[PASS] 3.2 Sin sesión: acciones de gestión ocultas ✓')
  })

  /**
   * Test 3.3
   * Con rol ADMIN: puedeGestionarProgramas=true.
   * Deben aparecer el botón Crear y botones Editar en cada tarjeta.
   */
  test('3.3 Con rol ADMIN: muestra botón "Crear Programa" y botones Editar', async () => {
    configurarSesion('ADMIN', 'admin@test.com')
    render(<Programas />)
    const botonCrear = await screen.findByText('+ Crear Programa')
    expect(botonCrear).toBeInTheDocument()
    const botonesEditar = screen.getAllByText('Editar')
    expect(botonesEditar.length).toBeGreaterThan(0)
    console.log('[PASS] 3.3 ADMIN: Crear visible, Editar visibles:', botonesEditar.length)
  })

  /**
   * Test 3.4
   * Con rol ADMIN: puedeEliminarProgramas=false (solo MASTER puede eliminar).
   * Los botones Eliminar no deben existir en el DOM.
   */
  test('3.4 Con rol ADMIN: NO puede eliminar (solo MASTER puede)', async () => {
    configurarSesion('ADMIN', 'admin@test.com')
    render(<Programas />)
    await screen.findByText('Ingeniería de Sistemas')
    expect(screen.queryByText('Eliminar')).not.toBeInTheDocument()
    console.log('[PASS] 3.4 ADMIN: botones Eliminar ocultos (correcto) ✓')
  })

  /**
   * Test 3.5
   * Con rol MASTER: puedeEliminarProgramas=true.
   * Deben aparecer los botones Eliminar en cada tarjeta.
   */
  test('3.5 Con rol MASTER + email admin especial: muestra botones Editar y Eliminar', async () => {
    // samu@gmail.com → esAdministradorEspecial=true → puedeGestionarProgramas=true
    // MASTER rol → puedeEliminarProgramas=true
    // Ambos permisos activos → se renderizan los botones de la tarjeta
    configurarSesion('MASTER', 'samu@gmail.com')
    render(<Programas />)
    const botonesEliminar = await screen.findAllByText('Eliminar')
    expect(botonesEliminar.length).toBeGreaterThan(0)
    console.log('[PASS] 3.5 Admin especial + MASTER: botones Eliminar visibles:', botonesEliminar.length)
  })

  /**
   * Test 3.6
   * El correo 'nana.ortega71@gmail.com' equivale a esMaster=true
   * sin importar el rol guardado. Puede tanto gestionar como eliminar.
   */
  test('3.6 Con email master (nana.ortega71@gmail.com): puede gestionar y eliminar', async () => {
    configurarSesion('', 'nana.ortega71@gmail.com')
    render(<Programas />)
    const botonCrear = await screen.findByText('+ Crear Programa')
    const botonesEliminar = screen.getAllByText('Eliminar')
    expect(botonCrear).toBeInTheDocument()
    expect(botonesEliminar.length).toBeGreaterThan(0)
    console.log('[PASS] 3.6 Email master: gestión y eliminación habilitadas ✓')
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// BLOQUE 4: MODAL DE CREACIÓN
// Verifica la apertura y cierre del modal al crear un nuevo programa.
// Todos los tests de este bloque requieren sesión ADMIN.
// ─────────────────────────────────────────────────────────────────────────────
describe('4. Modal de creación', () => {
  beforeAll(() => console.log('\n▶ BLOQUE 4: Modal de creación'))
  afterAll(()  => console.log('✔ BLOQUE 4: completado'))

  /** Todos los tests de este bloque requieren sesión ADMIN para ver el botón */
  beforeEach(() => configurarSesion('ADMIN', 'admin@test.com'))

  /**
   * Test 4.1
   * Al hacer clic en "+ Crear Programa", mostrarModal pasa a true
   * y el título del modal "Crear Nuevo Programa" aparece en pantalla.
   */
  test('4.1 Abre el modal al hacer clic en "+ Crear Programa"', async () => {
    const usuario = userEvent.setup()
    render(<Programas />)
    await usuario.click(await screen.findByText('+ Crear Programa'))
    const tituloModal = screen.getByText('Crear Nuevo Programa')
    expect(tituloModal).toBeInTheDocument()
    console.log('[PASS] 4.1 Modal de creación abierto:', tituloModal.textContent)
  })

  /**
   * Test 4.2
   * El botón × llama a setMostrarModal(false), ocultando el modal.
   * Verificamos que el título del modal ya no está en el DOM.
   */
  test('4.2 Cierra el modal al hacer clic en el botón ×', async () => {
    const usuario = userEvent.setup()
    render(<Programas />)
    await usuario.click(await screen.findByText('+ Crear Programa'))
    await usuario.click(screen.getByText('×'))
    expect(screen.queryByText('Crear Nuevo Programa')).not.toBeInTheDocument()
    console.log('[PASS] 4.2 Modal cerrado correctamente con ×')
  })

  /**
   * Test 4.3
   * El botón "Cancelar" también llama a setMostrarModal(false).
   */
  test('4.3 Cierra el modal al hacer clic en Cancelar', async () => {
    const usuario = userEvent.setup()
    render(<Programas />)
    await usuario.click(await screen.findByText('+ Crear Programa'))
    await usuario.click(screen.getByText('Cancelar'))
    expect(screen.queryByText('Crear Nuevo Programa')).not.toBeInTheDocument()
    console.log('[PASS] 4.3 Modal cerrado correctamente con Cancelar')
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// BLOQUE 5: MODAL DE EDICIÓN
// Verifica que abrirModalEdicion() carga los datos del programa en el formulario
// y que el modal muestra el título correcto para el modo edición.
// ─────────────────────────────────────────────────────────────────────────────
describe('5. Modal de edición', () => {
  beforeAll(() => console.log('\n▶ BLOQUE 5: Modal de edición'))
  afterAll(()  => console.log('✔ BLOQUE 5: completado'))

  /** Sesión ADMIN para ver botones Editar en las tarjetas */
  beforeEach(() => configurarSesion('ADMIN', 'admin@test.com'))

  /**
   * Test 5.1
   * Al hacer clic en "Editar", modoEdicion pasa a true y el modal
   * muestra "Editar Programa" como título en lugar de "Crear Nuevo Programa".
   */
  test('5.1 Muestra título "Editar Programa" al hacer clic en Editar', async () => {
    const usuario = userEvent.setup()
    render(<Programas />)
    const botonesEditar = await screen.findAllByText('Editar')
    await usuario.click(botonesEditar[0]) // clic en el primero: Ingeniería de Sistemas
    const tituloModal = screen.getByText('Editar Programa')
    expect(tituloModal).toBeInTheDocument()
    console.log('[PASS] 5.1 Modal de edición abierto:', tituloModal.textContent)
  })

  /**
   * Test 5.2
   * abrirModalEdicion() carga el nombre del programa en el estado formulario.
   * El input con label "Nombre del Programa" debe tener el valor del programa.
   */
  test('5.2 Pre-rellena el campo "Nombre del Programa" con el valor del programa', async () => {
    const usuario = userEvent.setup()
    render(<Programas />)
    const botonesEditar = await screen.findAllByText('Editar')
    await usuario.click(botonesEditar[0])
    const inputNombre = screen.getByLabelText(/nombre del programa/i)
    expect(inputNombre.value).toBe('Ingeniería de Sistemas')
    console.log('[PASS] 5.2 Nombre pre-rellenado:', inputNombre.value)
  })

  /**
   * Test 5.3
   * Igual que 5.2 pero para el campo Código SNIES.
   * El código '53420' del programa 1 debe estar cargado en el input.
   */
  test('5.3 Pre-rellena el campo "Código SNIES" con el valor del programa', async () => {
    const usuario = userEvent.setup()
    render(<Programas />)
    const botonesEditar = await screen.findAllByText('Editar')
    await usuario.click(botonesEditar[0])
    const inputSnies = screen.getByLabelText(/código snies/i)
    expect(inputSnies.value).toBe('53420')
    console.log('[PASS] 5.3 Código SNIES pre-rellenado:', inputSnies.value)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// BLOQUE 6: VALIDACIONES DEL FORMULARIO (manejarSubmit)
// Verifica las validaciones custom en manejarSubmit() y las llamadas
// correctas a la API tanto en modo creación como en modo edición.
// ─────────────────────────────────────────────────────────────────────────────
describe('6. Validaciones del formulario (manejarSubmit)', () => {
  beforeAll(() => console.log('\n▶ BLOQUE 6: Validaciones del formulario'))
  afterAll(()  => console.log('✔ BLOQUE 6: completado'))

  /** Sesión ADMIN para acceder al formulario de creación y edición */
  beforeEach(() => configurarSesion('ADMIN', 'admin@test.com'))

  /**
   * Test 6.1
   * Primera validación de manejarSubmit():
   * si codigoSnies.length < 4, muestra el mensaje de error correspondiente
   * y NO llama a crearPrograma().
   */
  test('6.1 Muestra error si el código SNIES tiene menos de 4 caracteres', async () => {
    const usuario = userEvent.setup()
    render(<Programas />)
    await usuario.click(await screen.findByText('+ Crear Programa'))
    // SNIES inválido (2 chars). fireEvent.submit() omite la validación HTML5 nativa
    // (minLength, required) y dispara directamente el handler manejarSubmit() de React.
    await usuario.type(screen.getByLabelText(/código snies/i), 'AB')
    fireEvent.submit(screen.getByRole('button', { name: /^crear programa$/i }).closest('form'))
    const mensajeError = await screen.findByText(/código SNIES es obligatorio/i)
    expect(mensajeError).toBeInTheDocument()
    console.log('[PASS] 6.1 Error SNIES corto:', mensajeError.textContent)
  })

  /**
   * Test 6.2
   * Segunda validación de manejarSubmit():
   * si costoSemestre <= 0, muestra el mensaje de costo inválido.
   * El SNIES es válido (5 chars) para que supere la primera validación.
   */
  test('6.2 Muestra error si el costo por semestre es 0 o negativo', async () => {
    const usuario = userEvent.setup()
    render(<Programas />)
    await usuario.click(await screen.findByText('+ Crear Programa'))
    // SNIES válido (pasa la primera validación) y costo=0 (falla la segunda).
    // fireEvent.submit() omite la validación HTML5 nativa del input type=number min="1".
    await usuario.type(screen.getByLabelText(/código snies/i), '53420')
    await usuario.type(screen.getByLabelText(/costo por semestre/i), '0')
    fireEvent.submit(screen.getByRole('button', { name: /^crear programa$/i }).closest('form'))
    const mensajeError = await screen.findByText(/costo por semestre debe ser mayor a 0/i)
    expect(mensajeError).toBeInTheDocument()
    console.log('[PASS] 6.2 Error costo inválido:', mensajeError.textContent)
  })

  /**
   * Test 6.3
   * Con datos válidos en modo creación (modoEdicion=false),
   * manejarSubmit() debe llamar a apiService.crearPrograma() exactamente una vez.
   */
  test('6.3 Llama a crearPrograma() con datos válidos en modo creación', async () => {
    crearPrograma.mockResolvedValue({ idPrograma: 99 })
    const usuario = userEvent.setup()
    render(<Programas />)
    await usuario.click(await screen.findByText('+ Crear Programa'))
    // fireEvent.submit() omite la validación HTML5 del select idInstitucion required=""
    // que empieza vacío y que en jsdom bloquearía el onSubmit de React.
    await usuario.type(screen.getByLabelText(/nombre del programa/i), 'Derecho')
    await usuario.type(screen.getByLabelText(/código snies/i), '99999')
    await usuario.type(screen.getByLabelText(/costo por semestre/i), '3000000')
    fireEvent.submit(screen.getByRole('button', { name: /^crear programa$/i }).closest('form'))
    await waitFor(() => expect(crearPrograma).toHaveBeenCalledTimes(1))
    console.log('[PASS] 6.3 crearPrograma() llamado con:', JSON.stringify(crearPrograma.mock.calls[0][0]).slice(0, 80))
  })

  /**
   * Test 6.4
   * Con datos válidos en modo edición (modoEdicion=true),
   * manejarSubmit() llama a apiService.actualizarPrograma(id, datos).
   * El programa 1 (Ingeniería de Sistemas) ya tiene SNIES y costo válidos.
   */
  test('6.4 Llama a actualizarPrograma() con el ID correcto en modo edición', async () => {
    actualizarPrograma.mockResolvedValue({})
    const usuario = userEvent.setup()
    render(<Programas />)
    const botonesEditar = await screen.findAllByText('Editar')
    await usuario.click(botonesEditar[0]) // abre edición del programa 1 (id=1)
    await usuario.click(screen.getByRole('button', { name: /actualizar programa/i }))
    await waitFor(() => {
      expect(actualizarPrograma).toHaveBeenCalledTimes(1)
      expect(actualizarPrograma).toHaveBeenCalledWith(1, expect.any(Object))
    })
    console.log('[PASS] 6.4 actualizarPrograma() llamado con ID:', actualizarPrograma.mock.calls[0][0])
  })

  /**
   * Test 6.5
   * Si crearPrograma() rechaza la promesa, el catch de manejarSubmit()
   * guarda el mensaje en el estado error y lo muestra en pantalla.
   */
  test('6.5 Muestra el mensaje de error si la API de creación falla', async () => {
    crearPrograma.mockRejectedValue(new Error('Servidor no disponible'))
    const usuario = userEvent.setup()
    render(<Programas />)
    await usuario.click(await screen.findByText('+ Crear Programa'))
    await usuario.type(screen.getByLabelText(/nombre del programa/i), 'Medicina')
    await usuario.type(screen.getByLabelText(/código snies/i), '11111')
    await usuario.type(screen.getByLabelText(/costo por semestre/i), '8000000')
    fireEvent.submit(screen.getByRole('button', { name: /^crear programa$/i }).closest('form'))
    const mensajeError = await screen.findByText(/servidor no disponible/i)
    expect(mensajeError).toBeInTheDocument()
    console.log('[PASS] 6.5 Error de API de creación mostrado:', mensajeError.textContent)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// BLOQUE 7: ELIMINACIÓN DE PROGRAMAS (eliminarPrograma)
// Verifica el flujo completo de eliminación: confirmación del usuario,
// llamada a la API, y manejo del error si la API falla.
// ─────────────────────────────────────────────────────────────────────────────
describe('7. Eliminación de programas (eliminarPrograma)', () => {
  beforeAll(() => console.log('\n▶ BLOQUE 7: Eliminación de programas'))
  afterAll(()  => console.log('✔ BLOQUE 7: completado'))

  /**
   * Antes de cada test:
   * - Sesión MASTER + email samu@gmail.com (esAdministradorEspecial=true)
   *   → puedeGestionarProgramas=true (necesario para que el div de acciones se renderice)
   *   → puedeEliminarProgramas=true (el botón Eliminar aparece dentro de ese div)
   * - Se reemplaza window.confirm con un jest.fn() para controlar la respuesta
   *   sin mostrar diálogos reales en jsdom
   */
  beforeEach(() => {
    configurarSesion('MASTER', 'samu@gmail.com')
    window.confirm = jest.fn()
  })

  /**
   * Test 7.1
   * Cuando window.confirm retorna true (usuario confirma),
   * se debe llamar a apiService.eliminarPrograma() con el id del programa.
   */
  test('7.1 Llama a eliminarPrograma() con el ID correcto al confirmar', async () => {
    window.confirm.mockReturnValue(true) // el usuario pulsa "Aceptar"
    eliminarPrograma.mockResolvedValue({})
    const usuario = userEvent.setup()
    render(<Programas />)
    const botonesEliminar = await screen.findAllByText('Eliminar')
    await usuario.click(botonesEliminar[0]) // eliminar el primer programa (id=1)
    await waitFor(() => {
      expect(eliminarPrograma).toHaveBeenCalledTimes(1)
      expect(eliminarPrograma).toHaveBeenCalledWith(1)
    })
    console.log('[PASS] 7.1 eliminarPrograma() llamado con ID:', eliminarPrograma.mock.calls[0][0])
  })

  /**
   * Test 7.2
   * Cuando window.confirm retorna false (usuario cancela),
   * NO se debe llamar a apiService.eliminarPrograma().
   */
  test('7.2 No elimina si el usuario cancela la confirmación', async () => {
    window.confirm.mockReturnValue(false) // el usuario pulsa "Cancelar"
    const usuario = userEvent.setup()
    render(<Programas />)
    const botonesEliminar = await screen.findAllByText('Eliminar')
    await usuario.click(botonesEliminar[0])
    expect(eliminarPrograma).not.toHaveBeenCalled()
    console.log('[PASS] 7.2 Eliminación cancelada: eliminarPrograma() NO fue llamado ✓')
  })

  /**
   * Test 7.3
   * Si eliminarPrograma() rechaza la promesa, el catch actualiza el estado
   * de error y el mensaje debe aparecer en pantalla.
   */
  test('7.3 Muestra error si la API de eliminación falla', async () => {
    window.confirm.mockReturnValue(true)
    eliminarPrograma.mockRejectedValue(new Error('No se puede eliminar'))
    const usuario = userEvent.setup()
    render(<Programas />)
    const botonesEliminar = await screen.findAllByText('Eliminar')
    await usuario.click(botonesEliminar[0])
    const mensajeError = await screen.findByText(/no se puede eliminar/i)
    expect(mensajeError).toBeInTheDocument()
    console.log('[PASS] 7.3 Error de eliminación mostrado:', mensajeError.textContent)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// BLOQUE 8: FUNCIÓN obtenerNombreInstitucion
// Verifica que la función retorna el nombre oficial cuando la institución
// existe en el array, y el texto "ID: X" como fallback cuando no la encuentra.
// ─────────────────────────────────────────────────────────────────────────────
describe('8. Función obtenerNombreInstitucion', () => {
  beforeAll(() => console.log('\n▶ BLOQUE 8: obtenerNombreInstitucion'))
  afterAll(()  => console.log('✔ BLOQUE 8: completado'))

  /**
   * Test 8.1
   * El programa 1 tiene idInstitucion=1, que coincide con
   * INSTITUCIONES_MOCK[0].nombreOficial. Debe aparecer en la tarjeta.
   */
  test('8.1 Muestra el nombre oficial cuando la institución existe', async () => {
    render(<Programas />)
    const nombreInst = await screen.findByText('Universidad Nacional de Colombia')
    expect(nombreInst).toBeInTheDocument()
    console.log('[PASS] 8.1 Nombre oficial de institución:', nombreInst.textContent)
  })

  /**
   * Test 8.2
   * Si idInstitucion no coincide con ninguna institución del array,
   * obtenerNombreInstitucion() retorna "ID: {idInst}" como texto de reserva.
   */
  test('8.2 Muestra "ID: 999" como fallback cuando la institución no existe', async () => {
    sincronizar.mockResolvedValue({
      ...RESPUESTA_SINCRONIZAR,
      programasAcademicos: [{
        idPrograma: 99,
        idInstitucion: 999, // no existe en INSTITUCIONES_MOCK
        nombrePrograma: 'Programa Huérfano',
        nivelFormacion: 'PREGRADO',
        totalSemestres: 4,
        codigoSnies: '00001'
      }]
    })
    render(<Programas />)
    const fallbackInst = await screen.findByText('ID: 999')
    expect(fallbackInst).toBeInTheDocument()
    console.log('[PASS] 8.2 Fallback de institución no encontrada:', fallbackInst.textContent)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// BLOQUE 9: MAPAS DE ETIQUETAS (nivelLabels, modalidadLabels, jornadaLabels)
// Los tres objetos del componente traducen códigos a etiquetas legibles.
// Verifica que cada código del mock se renderiza con su etiqueta correcta.
// ─────────────────────────────────────────────────────────────────────────────
describe('9. Mapas de etiquetas (nivelLabels, modalidadLabels, jornadaLabels)', () => {
  beforeAll(() => console.log('\n▶ BLOQUE 9: Mapas de etiquetas'))
  afterAll(()  => console.log('✔ BLOQUE 9: completado'))

  /**
   * Test 9.1 — nivelLabels
   * El programa 1 tiene nivelFormacion='PREGRADO' → debe mostrar 'Pregrado'
   */
  test('9.1 PREGRADO → muestra etiqueta "Pregrado"', async () => {
    render(<Programas />)
    const etiqueta = await screen.findByText('Pregrado')
    expect(etiqueta).toBeInTheDocument()
    console.log('[PASS] 9.1 nivelLabels["PREGRADO"]:', etiqueta.textContent)
  })

  /**
   * Test 9.2 — nivelLabels
   * El programa 2 tiene nivelFormacion='MAESTRIA' → debe mostrar 'Maestría'
   */
  test('9.2 MAESTRIA → muestra etiqueta "Maestría"', async () => {
    render(<Programas />)
    const etiqueta = await screen.findByText('Maestría')
    expect(etiqueta).toBeInTheDocument()
    console.log('[PASS] 9.2 nivelLabels["MAESTRIA"]:', etiqueta.textContent)
  })

  /**
   * Test 9.3 — modalidadLabels
   * El programa 1 tiene modalidad='PRESENCIAL' → debe mostrar 'Presencial'
   */
  test('9.3 PRESENCIAL → muestra etiqueta "Presencial"', async () => {
    render(<Programas />)
    const etiqueta = await screen.findByText('Presencial')
    expect(etiqueta).toBeInTheDocument()
    console.log('[PASS] 9.3 modalidadLabels["PRESENCIAL"]:', etiqueta.textContent)
  })

  /**
   * Test 9.4 — modalidadLabels
   * El programa 2 tiene modalidad='VIRTUAL' → debe mostrar 'Virtual'
   */
  test('9.4 VIRTUAL → muestra etiqueta "Virtual"', async () => {
    render(<Programas />)
    const etiqueta = await screen.findByText('Virtual')
    expect(etiqueta).toBeInTheDocument()
    console.log('[PASS] 9.4 modalidadLabels["VIRTUAL"]:', etiqueta.textContent)
  })

  /**
   * Test 9.5 — jornadaLabels
   * El programa 1 tiene jornada='DIURNA' → debe mostrar 'Diurna'
   */
  test('9.5 DIURNA → muestra etiqueta "Diurna"', async () => {
    render(<Programas />)
    const etiqueta = await screen.findByText('Diurna')
    expect(etiqueta).toBeInTheDocument()
    console.log('[PASS] 9.5 jornadaLabels["DIURNA"]:', etiqueta.textContent)
  })

  /**
   * Test 9.6 — jornadaLabels
   * El programa 2 tiene jornada='NOCTURNA' → debe mostrar 'Nocturna'
   */
  test('9.6 NOCTURNA → muestra etiqueta "Nocturna"', async () => {
    render(<Programas />)
    const etiqueta = await screen.findByText('Nocturna')
    expect(etiqueta).toBeInTheDocument()
    console.log('[PASS] 9.6 jornadaLabels["NOCTURNA"]:', etiqueta.textContent)
  })
})
