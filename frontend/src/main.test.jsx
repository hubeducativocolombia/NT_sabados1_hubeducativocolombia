// Importación de React para poder inspeccionar el árbol renderizado por main.jsx.
import React from 'react'

// Importación de matchers extendidos de Jest para validar elementos del DOM con expresiones claras.
import '@testing-library/jest-dom'

// Función mock que simula el método render devuelto por ReactDOM.createRoot.
const mockRender = jest.fn()

// Función mock que simula ReactDOM.createRoot y devuelve un objeto con render controlado.
const mockCreateRoot = jest.fn(() => ({
    render: mockRender
}))

// Mock de ReactDOM Client para evitar montar la aplicación real durante las pruebas.
jest.mock('react-dom/client', () => ({
    createRoot: mockCreateRoot
}))

// Mock del componente App para comprobar que main.jsx intenta renderizar la aplicación principal.
jest.mock('./App.jsx', () => {
    // Función mock que reemplaza el componente App real dentro de este test.
    const AppMock = () => <div data-testid="app-mock">Aplicación principal simulada</div>

    return {
        __esModule: true,
        default: AppMock
    }
})

// Función auxiliar para imprimir en consola los resultados relevantes de cada prueba.
const registrarResultado = (nombrePrueba, detalle) => {
    console.log(`[main.test] ${nombrePrueba}: ${detalle}`)
}

// Función auxiliar para crear el nodo raíz que main.jsx necesita para iniciar React.
const prepararNodoRoot = () => {
    document.body.innerHTML = '<div id="root"></div>'
    return document.getElementById('root')
}

// Función auxiliar para importar main.jsx de forma aislada y ejecutar su lógica de montaje.
const ejecutarMain = () => {
    jest.isolateModules(() => {
        require('./main.jsx')
    })
}

// Función auxiliar para obtener el elemento React.StrictMode enviado a render.
const obtenerElementoRenderizado = () => {
    return mockRender.mock.calls[0][0]
}

// Suite principal que agrupa las pruebas del punto de entrada main.jsx.
describe('Punto de entrada main.jsx', () => {
    // Función que se ejecuta antes de cada prueba para limpiar mocks y preparar el DOM inicial.
    beforeEach(() => {
        jest.clearAllMocks()
        prepararNodoRoot()
    })

    // Prueba que valida que main.jsx cree la raíz de React usando el elemento con id root.
    test('Crea la raíz de React usando el nodo root del documento', () => {
        const nodoRoot = document.getElementById('root')

        ejecutarMain()

        expect(mockCreateRoot).toHaveBeenCalledTimes(1)
        expect(mockCreateRoot).toHaveBeenCalledWith(nodoRoot)
        registrarResultado('Creación de raíz', 'ReactDOM.createRoot recibió el nodo #root correctamente')
    })

    // Prueba que valida que main.jsx renderice la aplicación dentro de React.StrictMode.
    test('Renderiza App dentro de React.StrictMode', () => {
        ejecutarMain()

        const elementoRenderizado = obtenerElementoRenderizado()

        expect(mockRender).toHaveBeenCalledTimes(1)
        expect(elementoRenderizado.type).toBe(React.StrictMode)
        expect(elementoRenderizado.props.children.type.name).toBe('AppMock')
        registrarResultado('Render principal', 'App fue enviada a render dentro de React.StrictMode')
    })
})
