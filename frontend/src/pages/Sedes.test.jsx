// Importaciones necesarias de React Testing Library y de Jest para probar el componente Sedes
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'

// Importación del componente que vamos a testear
import Sedes from './Sedes'

// Mock del servicio de API para controlar las respuestas en los tests
import apiService from '../services/apiService'
jest.mock('../services/apiService')

// Descripción general de la suite de pruebas del componente Sedes
describe('Componente Sedes', () => {
    // Datos de ejemplo para sedes e instituciones usados en múltiples pruebas
    const datosMock = {
        sedesInstitucion: [
            {
                idSede: 1,
                idInstitucion: 10,
                nombreSede: 'Sede Centro',
                ciudad: 'Medellín',
                direccionFisica: 'Calle 10 # 20-30',
                esSedePrincipal: true
            }
        ],
        instituciones: [
            {
                idInstitucion: 10,
                nombreOficial: 'Institución Ejemplo'
            }
        ]
    }

    // Antes de cada prueba, limpiamos el DOM y configuramos localStorage
    beforeEach(() => {
        localStorage.clear()
        jest.clearAllMocks()
        window.confirm = jest.fn().mockReturnValue(true)
        jest.spyOn(console, 'error').mockImplementation(() => {})
    })

    afterEach(() => {
        console.error.mockRestore?.()
    })

    // Prueba de carga exitosa de datos y renderizado de la lista de sedes
    test('Renderiza lista de sedes cuando la carga es exitosa', async () => {
        apiService.sincronizar.mockResolvedValue(datosMock)

        render(<Sedes />)

        // Se espera que inicialmente aparezca el indicador de carga
        expect(screen.getByText('Cargando...')).toBeInTheDocument()

        // Esperamos a que la llamada asíncrona termine y se muestre la sede
        await waitFor(() => {
            expect(screen.getByText('Sede Centro')).toBeInTheDocument()
        })

        // Verificamos que el nombre de la institución se muestre correctamente
        expect(screen.getByText('Institución Ejemplo')).toBeInTheDocument()
    })

    // Prueba de control de error cuando falla la llamada a la API
    test('Muestra mensaje de error si falla la carga de sedes', async () => {
        apiService.sincronizar.mockRejectedValue(new Error('falla del servidor'))

        render(<Sedes />)

        await waitFor(() => {
            expect(screen.getByText('Error al cargar sedes')).toBeInTheDocument()
        })
    })

    // Prueba de comportamiento condicional del botón de crear sede con permisos de administrador
    test('Muestra botón para crear sede si el usuario puede gestionar sedes', async () => {
        apiService.sincronizar.mockResolvedValue(datosMock)
        localStorage.setItem('hubUsuarioSesion', JSON.stringify({ rol: 'ADMIN', correoElectronico: 'admin@ejemplo.com' }))

        render(<Sedes />)

        await waitFor(() => {
            expect(screen.getByText('+ Crear Sede')).toBeInTheDocument()
        })
    })

    // Prueba de no mostrar el botón de crear sede cuando el usuario no tiene permisos
    test('No muestra botón para crear sede si el usuario no puede gestionar sedes', async () => {
        apiService.sincronizar.mockResolvedValue({ sedesInstitucion: [], instituciones: [] })
        localStorage.setItem('hubUsuarioSesion', JSON.stringify({ rol: 'USER', correoElectronico: 'usuario@ejemplo.com' }))

        render(<Sedes />)

        await waitFor(() => {
            expect(screen.queryByText('+ Crear Sede')).not.toBeInTheDocument()
        })
    })

    // Prueba de apertura del modal de edición y verificación de los campos prellenados
    test('Abre modal de editar sede con los datos cargados', async () => {
        apiService.sincronizar.mockResolvedValue(datosMock)
        localStorage.setItem('hubUsuarioSesion', JSON.stringify({ rol: 'ADMIN', correoElectronico: 'admin@ejemplo.com' }))

        render(<Sedes />)

        await waitFor(() => {
            expect(screen.getByText('Sede Centro')).toBeInTheDocument()
        })

        const botonEditar = screen.getByRole('button', { name: /Editar/i })
        fireEvent.click(botonEditar)

        await waitFor(() => {
            expect(screen.getByText('Editar Sede')).toBeInTheDocument()
        })

        expect(screen.getByLabelText('Nombre de la Sede *')).toHaveValue('Sede Centro')
        expect(screen.getByLabelText('Ciudad *')).toHaveValue('Medellín')
        expect(screen.getByLabelText('Dirección Física *')).toHaveValue('Calle 10 # 20-30')
    })
})
