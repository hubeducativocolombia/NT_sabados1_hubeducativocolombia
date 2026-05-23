// Importación de utilidades de React Testing Library para renderizar, consultar y simular eventos del componente.
import { render, screen, waitFor, fireEvent } from '@testing-library/react'

// Importación del enrutador de memoria para probar los enlaces internos creados con Link.
import { MemoryRouter } from 'react-router-dom'

// Importación de matchers extendidos de Jest para validar elementos HTML de forma expresiva.
import '@testing-library/jest-dom'

// Importación del componente Inicio que se va a probar.
import Inicio from './Inicio'

// Importación del servicio API que se reemplaza por un mock controlado en cada prueba.
import apiService from '../services/apiService'

// Mock de Jest para controlar la respuesta de apiService.sincronizar sin conectarse al backend real.
jest.mock('../services/apiService')

// Mock del componente Banner para evitar dependencias de imágenes y probar solamente el comportamiento de Inicio.
jest.mock('./Banner', () => {
    // Función mock que representa el carrusel público dentro de Inicio.
    return function BannerMock() {
        return <div data-testid="banner-mock">Banner principal de prueba</div>
    }
})

// Función auxiliar para imprimir en consola los resultados relevantes de cada prueba.
const registrarResultado = (nombrePrueba, detalle) => {
    console.log(`[Inicio.test] ${nombrePrueba}: ${detalle}`)
}

// Función auxiliar para renderizar Inicio dentro de MemoryRouter cuando el componente usa enlaces de React Router.
const renderizarInicio = (props = {}) => {
    return render(
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Inicio {...props} />
        </MemoryRouter>
    )
}

// Suite principal que agrupa los tests del componente Inicio.
describe('Componente Inicio', () => {
    // Datos simulados que representan la respuesta del backend para la vista privada de inicio.
    const datosMock = {
        instituciones: [
            { idInstitucion: 1, nombreOficial: 'Universidad Nacional' },
            { idInstitucion: 2, nombreOficial: 'Universidad de Antioquia' }
        ],
        sedesInstitucion: [
            { idSede: 1, nombreSede: 'Sede Centro' },
            { idSede: 2, nombreSede: 'Sede Norte' },
            { idSede: 3, nombreSede: 'Sede Sur' }
        ],
        programasAcademicos: [
            { idPrograma: 1, nombrePrograma: 'Ingeniería de Software' },
            { idPrograma: 2, nombrePrograma: 'Analítica de Datos' },
            { idPrograma: 3, nombrePrograma: 'Ciberseguridad' },
            { idPrograma: 4, nombrePrograma: 'Diseño Digital' }
        ],
        usuarios: [
            { idUsuario: 1, nombreCompleto: 'Usuario Uno' },
            { idUsuario: 2, nombreCompleto: 'Usuario Dos' },
            { idUsuario: 3, nombreCompleto: 'Usuario Tres' },
            { idUsuario: 4, nombreCompleto: 'Usuario Cuatro' },
            { idUsuario: 5, nombreCompleto: 'Usuario Cinco' }
        ]
    }

    // Función auxiliar para guardar una sesión simulada en localStorage.
    const configurarSesion = ({ rol = 'ADMIN', nombreCompleto = 'Ana Administradora', correoElectronico = 'admin@ejemplo.com' } = {}) => {
        localStorage.setItem('hubUsuarioSesion', JSON.stringify({ rol, nombreCompleto, correoElectronico }))
    }

    // Función que se ejecuta antes de cada prueba para limpiar estado, mocks y almacenamiento local.
    beforeEach(() => {
        localStorage.clear()
        jest.clearAllMocks()
        jest.spyOn(console, 'error').mockImplementation(() => {})
    })

    // Función que se ejecuta después de cada prueba para restaurar console.error.
    afterEach(() => {
        console.error.mockRestore?.()
    })

    // Prueba que valida la vista pública cuando el usuario no ha iniciado sesión.
    test('Renderiza la vista pública cuando no hay sesión iniciada', () => {
        renderizarInicio({ sesionIniciada: false, onIniciarSesion: jest.fn() })

        expect(screen.getByTestId('banner-mock')).toBeInTheDocument()
        expect(screen.getByText('Plataforma educativa nacional')).toBeInTheDocument()
        expect(screen.getByText('Las mejores universidades de Colombia')).toBeInTheDocument()
        expect(screen.getByText('Carreras de mas auge en Colombia')).toBeInTheDocument()
        expect(screen.getByText('Carreras para el futuro en Colombia')).toBeInTheDocument()
        expect(apiService.sincronizar).not.toHaveBeenCalled()
        registrarResultado('Vista pública', 'Se renderizó contenido informativo sin llamar a la API')
    })

    // Prueba que valida el estado de carga mientras se obtiene información privada desde la API.
    test('Muestra estado de carga cuando la sesión está iniciada', () => {
        apiService.sincronizar.mockReturnValue(new Promise(() => {}))
        configurarSesion()

        renderizarInicio({ sesionIniciada: true, onIniciarSesion: jest.fn() })

        expect(screen.getByText('Cargando datos...')).toBeInTheDocument()
        expect(apiService.sincronizar).toHaveBeenCalledTimes(1)
        registrarResultado('Estado de carga', 'El mensaje de carga apareció mientras la promesa seguía pendiente')
    })

    // Prueba que valida estadísticas y accesos rápidos para un usuario administrador.
    test('Renderiza estadísticas y acceso a usuarios para un administrador', async () => {
        apiService.sincronizar.mockResolvedValue(datosMock)
        configurarSesion()

        renderizarInicio({ sesionIniciada: true, onIniciarSesion: jest.fn() })

        await waitFor(() => {
            expect(screen.getByText('Bienvenido, Ana Administradora a Hub Educativo Colombia')).toBeInTheDocument()
        })

        expect(screen.getByText('2')).toBeInTheDocument()
        expect(screen.getByText('3')).toBeInTheDocument()
        expect(screen.getByText('4')).toBeInTheDocument()
        expect(screen.getByText('5')).toBeInTheDocument()
        expect(screen.getByRole('link', { name: /Usuarios Administra los usuarios del sistema/i })).toHaveAttribute('href', '/usuarios')
        registrarResultado('Vista administrador', 'Estadísticas y enlace de usuarios fueron renderizados correctamente')
    })

    // Prueba que valida que un usuario básico no vea el acceso ni la estadística de usuarios.
    test('Oculta usuarios y muestra textos de consulta para un usuario básico', async () => {
        apiService.sincronizar.mockResolvedValue(datosMock)
        configurarSesion({
            rol: 'USER',
            nombreCompleto: 'Usuario Consulta',
            correoElectronico: 'usuario@ejemplo.com'
        })

        renderizarInicio({ sesionIniciada: true, onIniciarSesion: jest.fn() })

        await waitFor(() => {
            expect(screen.getByText('Bienvenido, Usuario Consulta a Hub Educativo Colombia')).toBeInTheDocument()
        })

        expect(screen.queryByRole('link', { name: /Usuarios/i })).not.toBeInTheDocument()
        expect(screen.getByText('Consulta las instituciones educativas')).toBeInTheDocument()
        expect(screen.getByText('Consulta las sedes institucionales')).toBeInTheDocument()
        expect(screen.getByText('Consulta los programas académicos disponibles')).toBeInTheDocument()
        registrarResultado('Vista usuario básico', 'Usuarios quedó oculto y los textos se adaptaron a modo consulta')
    })

    // Prueba que valida el manejo de error y la acción de reintentar carga de datos.
    test('Muestra error y permite reintentar la carga de datos', async () => {
        apiService.sincronizar
            .mockRejectedValueOnce(new Error('backend apagado'))
            .mockResolvedValueOnce(datosMock)
        configurarSesion()

        renderizarInicio({ sesionIniciada: true, onIniciarSesion: jest.fn() })

        await waitFor(() => {
            expect(screen.getByText(/No se pudieron cargar los datos/i)).toBeInTheDocument()
        })

        fireEvent.click(screen.getByRole('button', { name: /Reintentar/i }))

        await waitFor(() => {
            expect(screen.getByText('Bienvenido, Ana Administradora a Hub Educativo Colombia')).toBeInTheDocument()
        })

        expect(apiService.sincronizar).toHaveBeenCalledTimes(2)
        registrarResultado('Reintento', 'El error apareció y luego la carga exitosa se completó tras hacer clic en Reintentar')
    })
})
