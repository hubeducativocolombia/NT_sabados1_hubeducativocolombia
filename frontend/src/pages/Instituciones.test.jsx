// Importación de utilidades de React Testing Library para renderizar, consultar y simular eventos del componente.
import { render, screen, waitFor, fireEvent } from '@testing-library/react'

// Importación de matchers extendidos de Jest para validar el DOM con expresiones legibles.
import '@testing-library/jest-dom'

// Importación del componente Instituciones que será probado en esta suite.
import Instituciones from './Instituciones'

// Importación del servicio de API que será reemplazado por un mock durante las pruebas.
import apiService from '../services/apiService'

// Mock de Jest para evitar llamadas reales a la API y controlar respuestas desde cada caso de prueba.
jest.mock('../services/apiService')

// Función auxiliar para imprimir en consola los resultados relevantes de cada prueba.
const registrarResultado = (nombrePrueba, detalle) => {
    console.log(`[Instituciones.test] ${nombrePrueba}: ${detalle}`)
}

// Suite principal que agrupa las pruebas unitarias del componente Instituciones.
describe('Componente Instituciones', () => {
    // Datos simulados que representan una respuesta exitosa del endpoint de sincronización.
    const datosMock = {
        instituciones: [
            {
                idInstitucion: 1,
                nombreOficial: 'Universidad Nacional de Colombia',
                naturaleza: 'Pública',
                naturalezaCodigo: 'PUBLICA',
                sitioWeb: 'https://unal.edu.co',
                fechaRegistro: '2026-05-22T10:00:00.000Z'
            }
        ]
    }

    // Función que configura una sesión de usuario en localStorage para probar permisos.
    const configurarSesion = (rol, correoElectronico = 'admin@ejemplo.com') => {
        localStorage.setItem('hubUsuarioSesion', JSON.stringify({ rol, correoElectronico }))
    }

    // Función que se ejecuta antes de cada prueba para limpiar estado compartido y mocks.
    beforeEach(() => {
        localStorage.clear()
        jest.clearAllMocks()
        window.confirm = jest.fn().mockReturnValue(true)
        jest.spyOn(console, 'error').mockImplementation(() => {})
    })

    // Función que se ejecuta después de cada prueba para restaurar el comportamiento normal de console.error.
    afterEach(() => {
        console.error.mockRestore?.()
    })

    // Prueba que valida la carga y renderización correcta de instituciones desde la API mockeada.
    test('Renderiza la lista de instituciones cuando la carga es exitosa', async () => {
        apiService.sincronizar.mockResolvedValue(datosMock)

        render(<Instituciones />)

        expect(screen.getByText('Cargando...')).toBeInTheDocument()

        await waitFor(() => {
            expect(screen.getByText('Universidad Nacional de Colombia')).toBeInTheDocument()
        })

        expect(screen.getByText('Pública')).toBeInTheDocument()
        expect(screen.getByRole('link', { name: 'https://unal.edu.co' })).toHaveAttribute('href', 'https://unal.edu.co')
        registrarResultado('Carga exitosa', 'La institución, naturaleza y sitio web fueron renderizados correctamente')
    })

    // Prueba que valida el mensaje de error cuando falla la sincronización con la API.
    test('Muestra mensaje de error si falla la carga de instituciones', async () => {
        apiService.sincronizar.mockRejectedValue(new Error('falla del servidor'))

        render(<Instituciones />)

        await waitFor(() => {
            expect(screen.getByText('Error al cargar instituciones')).toBeInTheDocument()
        })

        registrarResultado('Carga fallida', 'El mensaje de error fue visible para el usuario')
    })

    // Prueba que valida la visualización del botón de creación cuando el usuario tiene rol administrador.
    test('Muestra el botón de crear institución para un administrador', async () => {
        apiService.sincronizar.mockResolvedValue(datosMock)
        configurarSesion('ADMIN')

        render(<Instituciones />)

        await waitFor(() => {
            expect(screen.getByText('+ Crear Institución')).toBeInTheDocument()
        })

        registrarResultado('Permiso de creación', 'El botón de crear institución se mostró para ADMIN')
    })

    // Prueba que valida que el botón de creación no aparezca para usuarios sin permisos.
    test('No muestra el botón de crear institución si no tiene permisos', async () => {
        apiService.sincronizar.mockResolvedValue({ instituciones: [] })
        configurarSesion('USER', 'usuario@ejemplo.com')

        render(<Instituciones />)

        await waitFor(() => {
            expect(screen.queryByText('+ Crear Institución')).not.toBeInTheDocument()
        })

        registrarResultado('Sin permiso de creación', 'El botón de crear institución permaneció oculto')
    })

    // Prueba que valida la apertura del modal de edición y los campos prellenados de la institución.
    test('Abre el modal de editar institución con datos prellenados', async () => {
        apiService.sincronizar.mockResolvedValue(datosMock)
        configurarSesion('ADMIN')

        render(<Instituciones />)

        await waitFor(() => {
            expect(screen.getByText('Universidad Nacional de Colombia')).toBeInTheDocument()
        })

        fireEvent.click(screen.getByRole('button', { name: /Editar/i }))

        await waitFor(() => {
            expect(screen.getByText('Editar Institución')).toBeInTheDocument()
        })

        expect(screen.getByLabelText('Nombre Oficial *')).toHaveValue('Universidad Nacional de Colombia')
        expect(screen.getByLabelText('Naturaleza *')).toHaveValue('PUBLICA')
        expect(screen.getByLabelText('Sitio Web')).toHaveValue('https://unal.edu.co')
        registrarResultado('Modal de edición', 'Los campos del formulario fueron cargados con los datos existentes')
    })

    // Prueba que valida el envío del formulario para crear una nueva institución.
    test('Crea una institución desde el formulario del modal', async () => {
        apiService.sincronizar
            .mockResolvedValueOnce({ instituciones: [] })
            .mockResolvedValueOnce(datosMock)
        apiService.crearInstitucion.mockResolvedValue({})
        configurarSesion('ADMIN')

        render(<Instituciones />)

        await waitFor(() => {
            expect(screen.getByText('+ Crear Institución')).toBeInTheDocument()
        })

        fireEvent.click(screen.getByText('+ Crear Institución'))
        fireEvent.change(screen.getByLabelText('Nombre Oficial *'), {
            target: { value: 'Instituto Tecnológico de Antioquia' }
        })
        fireEvent.change(screen.getByLabelText('Naturaleza *'), {
            target: { value: 'PRIVADA' }
        })
        fireEvent.change(screen.getByLabelText('Sitio Web'), {
            target: { value: 'https://ita.edu.co' }
        })
        fireEvent.click(screen.getByRole('button', { name: /^Crear Institución$/i }))

        await waitFor(() => {
            expect(apiService.crearInstitucion).toHaveBeenCalledWith({
                nombreOficial: 'Instituto Tecnológico de Antioquia',
                naturaleza: 'PRIVADA',
                sitioWeb: 'https://ita.edu.co'
            })
        })

        registrarResultado('Creación', 'apiService.crearInstitucion recibió los datos diligenciados')
    })

    // Prueba que valida la eliminación de una institución cuando el usuario tiene permisos de master.
    test('Elimina una institución cuando el usuario master confirma la acción', async () => {
        apiService.sincronizar
            .mockResolvedValueOnce(datosMock)
            .mockResolvedValueOnce({ instituciones: [] })
        apiService.eliminarInstitucion.mockResolvedValue({})
        configurarSesion('MASTER', 'nana.ortega71@gmail.com')

        render(<Instituciones />)

        await waitFor(() => {
            expect(screen.getByText('Universidad Nacional de Colombia')).toBeInTheDocument()
        })

        fireEvent.click(screen.getByRole('button', { name: /Eliminar/i }))

        await waitFor(() => {
            expect(apiService.eliminarInstitucion).toHaveBeenCalledWith(1)
        })

        expect(window.confirm).toHaveBeenCalledWith('¿Estás seguro de que deseas eliminar esta institución?')
        registrarResultado('Eliminación', 'La confirmación se ejecutó y la API recibió el id de la institución')
    })
})
