// Importación de utilidades de React Testing Library para renderizar, consultar, simular eventos y envolver cambios de estado.
import { render, screen, fireEvent, act } from '@testing-library/react'

// Importación de matchers extendidos de Jest para validar atributos, clases y presencia en el DOM.
import '@testing-library/jest-dom'

// Mock de la primera imagen del carrusel para que Jest no procese archivos JPEG reales.
jest.mock('../img/BANNER-1.jpeg', () => 'banner-1-test.jpeg')

// Mock de la segunda imagen del carrusel para aislar la prueba del sistema de archivos de imágenes.
jest.mock('../img/BANNER-2.jpeg', () => 'banner-2-test.jpeg')

// Mock de la tercera imagen del carrusel para mantener el test enfocado en la lógica del componente.
jest.mock('../img/BANNER-3.jpeg', () => 'banner-3-test.jpeg')

// Importación del componente Banner que será probado en esta suite.
import Banner from './Banner'

// Función auxiliar para imprimir en consola los resultados relevantes de cada prueba.
const registrarResultado = (nombrePrueba, detalle) => {
    console.log(`[Banner.test] ${nombrePrueba}: ${detalle}`)
}

// Función auxiliar para obtener el contenedor article de una diapositiva a partir del texto de su título.
const obtenerDiapositivaPorTitulo = (titulo) => {
    return screen.getByText(titulo).closest('article')
}

// Función auxiliar para validar cuál diapositiva tiene la clase CSS activo.
const esperarDiapositivaActiva = (titulo) => {
    expect(obtenerDiapositivaPorTitulo(titulo)).toHaveClass('activo')
}

// Suite principal que agrupa las pruebas unitarias del componente Banner.
describe('Componente Banner', () => {
    // Textos institucionales esperados porque el componente selecciona ese tono para cualquier horario.
    const titulosInstitucionales = [
        'Informacion confiable para decisiones academicas',
        'Comparacion integral de programas y sedes',
        'Orientacion para proyectar tu perfil profesional'
    ]

    // Función que se ejecuta antes de cada prueba para usar temporizadores falsos y limpiar mocks.
    beforeEach(() => {
        jest.useFakeTimers()
        jest.clearAllMocks()
    })

    // Función que se ejecuta después de cada prueba para restaurar temporizadores reales.
    afterEach(() => {
        jest.useRealTimers()
    })

    // Prueba que valida que el carrusel renderice sus diapositivas, imágenes, controles e indicadores.
    test('Renderiza las diapositivas institucionales con controles e indicadores', () => {
        render(<Banner />)

        expect(screen.getByLabelText('Carrusel de fotografias destacadas')).toBeInTheDocument()
        expect(screen.getAllByRole('img', { hidden: true })).toHaveLength(3)
        expect(screen.getByRole('button', { name: 'Imagen anterior' })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Imagen siguiente' })).toBeInTheDocument()
        expect(screen.getByRole('tablist', { name: 'Seleccion de diapositivas' })).toBeInTheDocument()

        titulosInstitucionales.forEach((titulo) => {
            expect(screen.getByText(titulo)).toBeInTheDocument()
        })

        esperarDiapositivaActiva(titulosInstitucionales[0])
        registrarResultado('Render inicial', 'Se mostraron tres diapositivas institucionales con controles e indicadores')
    })

    // Prueba que valida la navegación hacia adelante y hacia atrás con los botones del carrusel.
    test('Cambia de diapositiva al usar los botones anterior y siguiente', () => {
        render(<Banner />)

        fireEvent.click(screen.getByRole('button', { name: 'Imagen siguiente' }))
        esperarDiapositivaActiva(titulosInstitucionales[1])

        fireEvent.click(screen.getByRole('button', { name: 'Imagen anterior' }))
        esperarDiapositivaActiva(titulosInstitucionales[0])

        registrarResultado('Navegación manual', 'Los botones siguiente y anterior cambiaron la diapositiva activa')
    })

    // Prueba que valida la selección directa de una diapositiva usando los indicadores inferiores.
    test('Activa una diapositiva específica al hacer clic en un indicador', () => {
        render(<Banner />)

        const indicadorTres = screen.getByRole('button', { name: 'Ir a diapositiva 3' })
        fireEvent.click(indicadorTres)

        esperarDiapositivaActiva(titulosInstitucionales[2])
        expect(indicadorTres).toHaveAttribute('aria-selected', 'true')
        registrarResultado('Indicadores', 'El tercer indicador activó la tercera diapositiva')
    })

    // Prueba que valida el avance automático del carrusel con el intervalo configurado en el componente.
    test('Avanza automáticamente después de cinco segundos', () => {
        render(<Banner />)

        esperarDiapositivaActiva(titulosInstitucionales[0])

        act(() => {
            jest.advanceTimersByTime(5000)
        })

        esperarDiapositivaActiva(titulosInstitucionales[1])
        registrarResultado('Avance automático', 'El temporizador movió el carrusel a la segunda diapositiva')
    })
})
