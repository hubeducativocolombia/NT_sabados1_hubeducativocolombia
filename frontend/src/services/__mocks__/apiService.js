import { jest } from '@jest/globals'

const sincronizar = jest.fn()
const healthCheck = jest.fn()
const crearInstitucion = jest.fn()
const actualizarInstitucion = jest.fn()
const eliminarInstitucion = jest.fn()
const crearSede = jest.fn()
const actualizarSede = jest.fn()
const eliminarSede = jest.fn()
const registrarUsuario = jest.fn()
const crearUsuario = jest.fn()
const actualizarUsuario = jest.fn()
const eliminarUsuario = jest.fn()
const crearPrograma = jest.fn()
const actualizarPrograma = jest.fn()
const eliminarPrograma = jest.fn()

const apiService = {
  sincronizar,
  healthCheck,
  crearInstitucion,
  actualizarInstitucion,
  eliminarInstitucion,
  crearSede,
  actualizarSede,
  eliminarSede,
  registrarUsuario,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
  crearPrograma,
  actualizarPrograma,
  eliminarPrograma
}

export {
  sincronizar,
  healthCheck,
  crearInstitucion,
  actualizarInstitucion,
  eliminarInstitucion,
  crearSede,
  actualizarSede,
  eliminarSede,
  registrarUsuario,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
  crearPrograma,
  actualizarPrograma,
  eliminarPrograma
}

export default apiService
