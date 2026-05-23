// Importaciones de React Testing Library y los matchers extendidos de Jest
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'

// Importación del componente que se va a probar
import Usuarios from './Usuarios'

// Mock del servicio API para interceptar llamadas externas durante la prueba
import apiService from '../services/apiService'
jest.mock('../services/apiService')

// Suite de pruebas del componente Usuarios
describe('Componente Usuarios', () => {
    // Datos de ejemplo que simulan la respuesta de la API
    const datosMock = {
        usuarios: [
            {
                idUsuario: 1,
                nombreCompleto: 'Juan Pérez',
                correoElectronico: 'juan.perez@ejemplo.com',
                rol: 'USER',
                estaActivo: true,
                fechaCreacion: '2026-05-22T10:00:00.000Z'
            }
        ]
    }

    // Se ejecuta antes de cada prueba para limpiar mocks y localStorage
    beforeEach(() => {
        localStorage.clear()
        jest.clearAllMocks()
        window.confirm = jest.fn().mockReturnValue(true)
        jest.spyOn(console, 'error').mockImplementation(() => {})
    })

    afterEach(() => {
        console.error.mockRestore?.()
    })

    // Prueba de renderizado correcto cuando los datos se cargan con éxito
    test('Renderiza la lista de usuarios desde la API', async () => {
        apiService.sincronizar.mockResolvedValue(datosMock)

        render(<Usuarios />)

        expect(screen.getByText('Cargando...')).toBeInTheDocument()

        await waitFor(() => {
            expect(screen.getByText('Juan Pérez')).toBeInTheDocument()
        })

        expect(screen.getByText('juan.perez@ejemplo.com')).toBeInTheDocument()
        expect(screen.getByText('Usuario')).toBeInTheDocument()
        expect(screen.getByText('Activo')).toBeInTheDocument()
    })

    // Prueba de manejo de error cuando la llamada a sincronizar falla
    test('Muestra mensaje de error si la carga de usuarios falla', async () => {
        apiService.sincronizar.mockRejectedValue(new Error('falla del servidor'))

        render(<Usuarios />)

        await waitFor(() => {
            expect(screen.getByText('Error al cargar usuarios')).toBeInTheDocument()
        })
    })

    // Prueba de visibilidad del botón Crear Usuario para un administrador
    test('Muestra el botón de crear usuario para un administrador', async () => {
        apiService.sincronizar.mockResolvedValue(datosMock)
        localStorage.setItem('hubUsuarioSesion', JSON.stringify({ rol: 'ADMIN', correoElectronico: 'admin@ejemplo.com' }))

        render(<Usuarios />)

        await waitFor(() => {
            expect(screen.getByText('+ Crear Usuario')).toBeInTheDocument()
        })
    })

    // Prueba de ocultar el botón Crear Usuario para un usuario sin permisos
    test('No muestra el botón de crear usuario si no tiene permisos', async () => {
        apiService.sincronizar.mockResolvedValue({ usuarios: [] })
        localStorage.setItem('hubUsuarioSesion', JSON.stringify({ rol: 'USER', correoElectronico: 'usuario@ejemplo.com' }))

        render(<Usuarios />)

        await waitFor(() => {
            expect(screen.queryByText('+ Crear Usuario')).not.toBeInTheDocument()
        })
    })

    // Prueba de apertura del modal de edición y verificación de los campos del usuario
    test('Abre el modal de editar usuario con datos prellenados', async () => {
        apiService.sincronizar.mockResolvedValue(datosMock)
        localStorage.setItem('hubUsuarioSesion', JSON.stringify({ rol: 'ADMIN', correoElectronico: 'admin@ejemplo.com' }))

        render(<Usuarios />)

        await waitFor(() => {
            expect(screen.getByText('Juan Pérez')).toBeInTheDocument()
        })

        const botonEditar = screen.getByRole('button', { name: /Editar/i })
        fireEvent.click(botonEditar)

        await waitFor(() => {
            expect(screen.getByText('Editar Usuario')).toBeInTheDocument()
        })

        expect(screen.getByLabelText('Nombre Completo *')).toHaveValue('Juan Pérez')
        expect(screen.getByLabelText('Correo Electrónico *')).toHaveValue('juan.perez@ejemplo.com')
        expect(screen.getByLabelText('Rol *')).toHaveValue('USER')
    })
})
