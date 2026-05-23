// Importación de utilidades de React Testing Library para renderizar, consultar y simular interacción del usuario.
import { render, screen, fireEvent, waitFor } from '@testing-library/react'

// Importación de matchers extendidos de Jest para validar el DOM con expectativas legibles.
import '@testing-library/jest-dom'

// Importación del componente principal App que será probado en esta suite.
import App from './App'

// Importación del servicio de API que será reemplazado por mocks controlados.
import apiService from './services/apiService'

// Mock de Jest para evitar llamadas reales al backend durante las pruebas.
jest.mock('./services/apiService')

// Mock de la imagen del logo para evitar que Jest intente procesar archivos JPEG reales.
jest.mock('./img/IMAGEN HUBEDUCATIVOCOLOMBIA.jpeg', () => 'logo-hub-test.jpeg')

// Mock de la página Inicio para probar las props que App le entrega sin renderizar su implementación completa.
jest.mock('./pages/Inicio', () => {
    // Función mock que representa la página Inicio y expone si la sesión está iniciada.
    return function InicioMock({ sesionIniciada, onIniciarSesion }) {
        return (
            <section data-testid="pagina-inicio">
                <p>Inicio mock - sesión: {sesionIniciada ? 'activa' : 'inactiva'}</p>
                <button type="button" onClick={onIniciarSesion}>
                    Abrir login desde Inicio
                </button>
            </section>
        )
    }
})

// Mock de la página Instituciones para validar rutas protegidas sin cargar su lógica interna.
jest.mock('./pages/Instituciones', () => {
    // Función mock que representa la página Instituciones.
    return function InstitucionesMock() {
        return <section data-testid="pagina-instituciones">Página Instituciones mock</section>
    }
})

// Mock de la página Sedes para validar navegación privada sin probar el componente real.
jest.mock('./pages/Sedes', () => {
    // Función mock que representa la página Sedes.
    return function SedesMock() {
        return <section data-testid="pagina-sedes">Página Sedes mock</section>
    }
})

// Mock de la página Programas para validar navegación privada sin probar el componente real.
jest.mock('./pages/Programas', () => {
    // Función mock que representa la página Programas.
    return function ProgramasMock() {
        return <section data-testid="pagina-programas">Página Programas mock</section>
    }
})

// Mock de la página Usuarios para validar permisos de administrador sin probar su implementación interna.
jest.mock('./pages/Usuarios', () => {
    // Función mock que representa la página Usuarios.
    return function UsuariosMock() {
        return <section data-testid="pagina-usuarios">Página Usuarios mock</section>
    }
})

// Mock de la página Buscar para validar rutas públicas de búsqueda.
jest.mock('./pages/Buscar', () => {
    // Función mock que representa la página Buscar.
    return function BuscarMock() {
        return <section data-testid="pagina-buscar">Página Buscar mock</section>
    }
})

// Función auxiliar para imprimir en consola los resultados relevantes de cada prueba.
const registrarResultado = (nombrePrueba, detalle) => {
    console.log(`[App.test] ${nombrePrueba}: ${detalle}`)
}

// Función auxiliar para renderizar App y centralizar cualquier preparación futura del test.
const renderizarApp = () => {
    return render(<App />)
}

// Función auxiliar para crear una sesión simulada en localStorage.
const configurarSesion = ({ rol = 'ADMIN', correoElectronico = 'admin@ejemplo.com', nombreCompleto = 'Ana Admin' } = {}) => {
    localStorage.setItem('hubSesionIniciada', 'true')
    localStorage.setItem('hubUsuarioSesion', JSON.stringify({
        idUsuario: 1,
        nombreCompleto,
        correoElectronico,
        rol
    }))
}

// Función auxiliar para abrir el modal de autenticación desde el botón del encabezado.
const abrirModalLogin = () => {
    fireEvent.click(screen.getByRole('button', { name: 'Iniciar sesion' }))
}

// Función auxiliar para diligenciar los campos básicos del formulario de inicio de sesión.
const diligenciarLogin = ({ correo = 'admin@ejemplo.com', contrasena = 'secreto123' } = {}) => {
    fireEvent.change(screen.getByLabelText('Correo electronico'), {
        target: { value: correo }
    })
    fireEvent.change(screen.getByLabelText('Contrasena'), {
        target: { value: contrasena }
    })
}

// Suite principal que agrupa las pruebas del componente App.
describe('Componente App', () => {
    // Datos simulados de usuario válido para probar autenticación exitosa.
    const usuarioAdminMock = {
        idUsuario: 10,
        nombreCompleto: 'Ana Admin',
        correoElectronico: 'admin@ejemplo.com',
        hashContrasena: 'secreto123',
        rol: 'ADMIN',
        estaActivo: true
    }

    // Función que se ejecuta antes de cada prueba para limpiar estado global y dejar la ruta inicial estable.
    beforeEach(() => {
        localStorage.clear()
        jest.clearAllMocks()
        jest.spyOn(console, 'warn').mockImplementation(() => {})
        window.history.pushState({}, '', '/')
        document.body.className = 'sinScrollPublico'
    })

    // Función que se ejecuta después de cada prueba para restaurar las advertencias de consola.
    afterEach(() => {
        console.warn.mockRestore?.()
    })

    // Prueba que valida el encabezado, enlaces públicos y página inicial cuando no hay sesión.
    test('Renderiza navegación pública cuando no existe sesión iniciada', () => {
        renderizarApp()

        expect(screen.getByText('Hub Educativo Colombia')).toBeInTheDocument()
        expect(screen.getByRole('link', { name: 'Buscar universidades' })).toHaveAttribute('href', '/buscar?tipo=instituciones')
        expect(screen.getByRole('link', { name: 'Buscar sedes' })).toHaveAttribute('href', '/buscar?tipo=sedes')
        expect(screen.getByRole('link', { name: 'Buscar programas' })).toHaveAttribute('href', '/buscar?tipo=programas')
        expect(screen.getByText('Inicio mock - sesión: inactiva')).toBeInTheDocument()
        expect(screen.getByText('© 2026 Hub Educativo Colombia. Todos los derechos reservados.')).toBeInTheDocument()
        registrarResultado('Vista pública', 'Se renderizó navegación pública y página Inicio sin sesión')
    })

    // Prueba que valida la apertura del modal y el cambio entre modo login y registro.
    test('Abre el modal de autenticación y cambia a modo registro', () => {
        renderizarApp()

        abrirModalLogin()

        expect(screen.getByRole('dialog', { name: 'Autenticacion de usuario' })).toBeInTheDocument()
        expect(screen.getByRole('heading', { name: 'Iniciar sesion' })).toBeInTheDocument()

        fireEvent.click(screen.getByRole('button', { name: /Registrate aqui/i }))

        expect(screen.getByRole('heading', { name: 'Registrarse' })).toBeInTheDocument()
        expect(screen.getByLabelText('Nombre completo')).toBeInTheDocument()
        expect(screen.getByLabelText('Ocupación')).toBeInTheDocument()
        registrarResultado('Modal de autenticación', 'El modal abrió y cambió correctamente a registro')
    })

    // Prueba que valida el inicio de sesión exitoso y la actualización de navegación privada para administrador.
    test('Inicia sesión correctamente y muestra navegación privada de administrador', async () => {
        apiService.sincronizar.mockResolvedValue({ usuarios: [usuarioAdminMock] })

        renderizarApp()
        abrirModalLogin()
        diligenciarLogin()
        fireEvent.click(screen.getByRole('button', { name: 'Entrar' }))

        await waitFor(() => {
            expect(screen.queryByRole('dialog', { name: 'Autenticacion de usuario' })).not.toBeInTheDocument()
        })

        expect(localStorage.getItem('hubSesionIniciada')).toBe('true')
        expect(screen.getByRole('link', { name: 'Instituciones' })).toBeInTheDocument()
        expect(screen.getByRole('link', { name: 'Programas' })).toBeInTheDocument()
        expect(screen.getByRole('link', { name: 'Sedes' })).toBeInTheDocument()
        expect(screen.getByRole('link', { name: 'Usuarios' })).toBeInTheDocument()
        expect(screen.getByText('Inicio mock - sesión: activa')).toBeInTheDocument()
        registrarResultado('Login exitoso', 'El usuario administrador inició sesión y vio navegación privada completa')
    })

    // Prueba que valida el mensaje de error cuando las credenciales no corresponden a un usuario existente.
    test('Muestra error y cambia a registro si el usuario no existe', async () => {
        apiService.sincronizar.mockResolvedValue({ usuarios: [] })

        renderizarApp()
        abrirModalLogin()
        diligenciarLogin({ correo: 'nuevo@ejemplo.com', contrasena: 'clave123' })
        fireEvent.click(screen.getByRole('button', { name: 'Entrar' }))

        await waitFor(() => {
            expect(screen.getByText('No encontramos este usuario. Registrate para continuar.')).toBeInTheDocument()
        })

        expect(screen.getByRole('heading', { name: 'Registrarse' })).toBeInTheDocument()
        registrarResultado('Usuario inexistente', 'App mostró el error y cambió automáticamente al modo registro')
    })

    // Prueba que valida que un usuario básico autenticado no tenga acceso visual al módulo Usuarios.
    test('Oculta el enlace Usuarios cuando la sesión pertenece a un usuario básico', () => {
        configurarSesion({
            rol: 'USER',
            correoElectronico: 'usuario@ejemplo.com',
            nombreCompleto: 'Usuario Básico'
        })

        renderizarApp()

        expect(screen.getByRole('link', { name: 'Instituciones' })).toBeInTheDocument()
        expect(screen.queryByRole('link', { name: 'Usuarios' })).not.toBeInTheDocument()
        expect(screen.getByText('Inicio mock - sesión: activa')).toBeInTheDocument()
        registrarResultado('Permisos usuario básico', 'El enlace Usuarios permaneció oculto para rol USER')
    })

    // Prueba que valida que una ruta protegida muestre Inicio cuando no hay sesión.
    test('Protege la ruta instituciones cuando no hay sesión iniciada', () => {
        window.history.pushState({}, '', '/instituciones')

        renderizarApp()

        expect(screen.getByTestId('pagina-inicio')).toBeInTheDocument()
        expect(screen.queryByTestId('pagina-instituciones')).not.toBeInTheDocument()
        registrarResultado('Ruta protegida', 'La ruta /instituciones redirigió al contenido de Inicio sin sesión')
    })

    // Prueba que valida que una ruta protegida renderice su página cuando la sesión existe.
    test('Permite acceder a instituciones cuando hay sesión iniciada', () => {
        window.history.pushState({}, '', '/instituciones')
        configurarSesion()

        renderizarApp()

        expect(screen.getByTestId('pagina-instituciones')).toBeInTheDocument()
        registrarResultado('Ruta privada', 'La ruta /instituciones mostró su página con sesión activa')
    })
})
