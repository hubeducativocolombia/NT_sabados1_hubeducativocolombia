// Importación de utilidades de React Testing Library para renderizar, consultar y simular eventos.
import { render, screen, waitFor, fireEvent } from '@testing-library/react'

// Importación de matchers extendidos de Jest para validar el DOM.
import '@testing-library/jest-dom'

// Importación del componente BrowserRouter para envolver el componente y habilitar el hook useSearchParams.
import { BrowserRouter } from 'react-router-dom'

// Importación del componente Buscar que será probado.
import Buscar from './Buscar'

// Importación del servicio de API que será reemplazado por un mock.
import apiService from '../services/apiService'

// Mock de Jest para evitar llamadas reales a la API y controlar sus respuestas.
jest.mock('../services/apiService')

// Función auxiliar para imprimir en consola los resultados de cada prueba.
const registrarResultado = (nombrePrueba, detalle) => {
    console.log(`[Buscar.test] ${nombrePrueba}: ${detalle}`)
}

// Suite principal que agrupa todas las pruebas para el componente Buscar.
describe('Componente Buscar', () => {
    // Datos simulados que representan una respuesta completa del endpoint de sincronización.
    const datosMock = {
        instituciones: [
            { idInstitucion: 1, nombreOficial: 'Universidad de Antioquia', naturaleza: 'Pública', sitioWeb: 'https://udea.edu.co' }
        ],
        sedesInstitucion: [
            { idSede: 10, idInstitucion: 1, nombreSede: 'Ciudad Universitaria', ciudad: 'Medellín', direccionFisica: 'Calle 67 # 53-108' }
        ],
        programasAcademicos: [
            { idPrograma: 100, idInstitucion: 1, nombrePrograma: 'Ingeniería de Sistemas', nivelFormacion: 'PREGRADO', totalSemestres: 10 }
        ],
        detallesOperacion: [
            { idPrograma: 100, costoSemestre: 5000000 }
        ]
    }

    // Función que se ejecuta antes de cada prueba para limpiar mocks y restaurar estados.
    beforeEach(() => {
        jest.clearAllMocks()
        // Mockea la implementación de console.error para evitar ruido en la consola de pruebas.
        jest.spyOn(console, 'error').mockImplementation(() => {})
        // Configura la respuesta por defecto del mock de la API.
        apiService.sincronizar.mockResolvedValue(datosMock)
    })

    // Función que se ejecuta después de cada prueba para restaurar el comportamiento original de console.error.
    afterEach(() => {
        console.error.mockRestore?.()
    })

    // Prueba que valida el renderizado inicial del componente y la carga de datos en segundo plano.
    test('Renderiza el formulario de búsqueda y carga los datos iniciales', async () => {
        render(<Buscar />, { wrapper: BrowserRouter })

        // Verifica que el título principal y los elementos del formulario estén presentes.
        expect(screen.getByText('Búsqueda Avanzada')).toBeInTheDocument()
        expect(screen.getByPlaceholderText('Buscar universidades, sedes o programas...')).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /Buscar/i })).toBeInTheDocument()

        // Verifica que la llamada a la API para cargar datos se haya realizado al montar el componente.
        await waitFor(() => {
            expect(apiService.sincronizar).toHaveBeenCalledTimes(1)
        })

        registrarResultado('Renderizado inicial', 'El componente se muestra correctamente y la API es llamada para obtener datos.')
    })

    // Prueba que simula una búsqueda exitosa en la categoría 'instituciones'.
    test('Realiza una búsqueda por instituciones y muestra los resultados', async () => {
        render(<Buscar />, { wrapper: BrowserRouter })

        // Simula la selección de la categoría 'Instituciones'.
        fireEvent.change(screen.getByRole('combobox'), { target: { value: 'instituciones' } })
        // Simula la escritura del término de búsqueda.
        fireEvent.change(screen.getByPlaceholderText('Buscar universidades, sedes o programas...'), {
            target: { value: 'Antioquia' }
        })
        // Simula el clic en el botón de búsqueda.
        fireEvent.click(screen.getByRole('button', { name: /Buscar/i }))

        // Espera a que los resultados aparezcan en el DOM.
        await waitFor(() => {
            expect(screen.getByText('Universidad de Antioquia')).toBeInTheDocument()
        })

        // Verifica que los datos relacionados (sedes y programas) también se muestren.
        expect(screen.getByText(/Sedes \(1\):/)).toBeInTheDocument()
        expect(screen.getByText(/Programas \(1\):/)).toBeInTheDocument()
        registrarResultado('Búsqueda de institución', 'Se encontraron y mostraron resultados para "Antioquia".')
    })

    // Prueba que simula una búsqueda exitosa en la categoría 'sedes'.
    test('Realiza una búsqueda por sedes y muestra los resultados', async () => {
        render(<Buscar />, { wrapper: BrowserRouter })

        fireEvent.change(screen.getByRole('combobox'), { target: { value: 'sedes' } })
        fireEvent.change(screen.getByPlaceholderText('Buscar universidades, sedes o programas...'), {
            target: { value: 'Medellín' }
        })
        fireEvent.click(screen.getByRole('button', { name: /Buscar/i }))

        await waitFor(() => {
            expect(screen.getByText('Ciudad Universitaria')).toBeInTheDocument()
        })

        expect(screen.getByText(/Universidad:.*Universidad de Antioquia/)).toBeInTheDocument()
        registrarResultado('Búsqueda de sede', 'Se encontraron y mostraron resultados para "Medellín".')
    })

    // Prueba que valida la aparición de un mensaje de advertencia si no se elige una categoría.
    test('Muestra un aviso si se intenta buscar con "Todas las categorías" seleccionado', async () => {
        render(<Buscar />, { wrapper: BrowserRouter })

        // Asegura que la categoría por defecto sea 'todas'.
        expect(screen.getByRole('combobox')).toHaveValue('todas')

        fireEvent.click(screen.getByRole('button', { name: /Buscar/i }))

        // Espera y verifica que el mensaje de advertencia sea visible.
        await waitFor(() => {
            expect(screen.getByText('Debe seleccionar una categoría específica para poder buscar.')).toBeInTheDocument()
        })

        registrarResultado('Validación de categoría', 'El aviso para seleccionar categoría se mostró correctamente.')
    })

    // Prueba que valida el mensaje que se muestra cuando una búsqueda no arroja resultados.
    test('Muestra un mensaje cuando no se encuentran resultados', async () => {
        render(<Buscar />, { wrapper: BrowserRouter })

        const terminoBusqueda = 'resultado inexistente'
        fireEvent.change(screen.getByRole('combobox'), { target: { value: 'instituciones' } })
        fireEvent.change(screen.getByPlaceholderText('Buscar universidades, sedes o programas...'), {
            target: { value: terminoBusqueda }
        })
        fireEvent.click(screen.getByRole('button', { name: /Buscar/i }))

        await waitFor(() => {
            expect(screen.getByText(`No se encontraron resultados para "${terminoBusqueda}"`)).toBeInTheDocument()
        })

        registrarResultado('Sin resultados', 'El mensaje de "no encontrados" se mostró adecuadamente.')
    })

    // Prueba que valida el estado de carga mientras se procesa la búsqueda.
    test('Muestra el indicador de "Buscando..." durante la búsqueda', async () => {
        render(<Buscar />, { wrapper: BrowserRouter })

        fireEvent.change(screen.getByRole('combobox'), { target: { value: 'programas' } })
        fireEvent.click(screen.getByRole('button', { name: /Buscar/i }))

        // El indicador de carga debe aparecer inmediatamente después del clic.
        expect(screen.getByText('Buscando...')).toBeInTheDocument()

        // Espera a que la búsqueda termine y el indicador desaparezca.
        await waitFor(() => {
            expect(screen.queryByText('Buscando...')).not.toBeInTheDocument()
        })

        registrarResultado('Estado de carga', 'El indicador "Buscando..." fue visible durante el proceso.')
    })
})