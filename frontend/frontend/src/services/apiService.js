const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

const NATURALEZA_CODES = {
    'Pública': 'PUBLICA',
    'Privada': 'PRIVADA',
    'Mixta': 'MIXTA',
    PUBLICA: 'PUBLICA',
    PRIVADA: 'PRIVADA',
    MIXTA: 'MIXTA'
}

const NATURALEZA_LABELS = {
    PUBLICA: 'Pública',
    PRIVADA: 'Privada',
    MIXTA: 'Mixta'
}

const normalizarInstitucion = (institucion) => {
    const naturalezaCodigo = NATURALEZA_CODES[institucion.naturaleza] || institucion.naturaleza

    return {
        ...institucion,
        naturaleza: NATURALEZA_LABELS[naturalezaCodigo] || institucion.naturaleza,
        naturalezaCodigo
    }
}

const normalizarSincronizacion = (payload) => {
    if (!payload) {
        return payload
    }

    return {
        ...payload,
        instituciones: (payload.instituciones || []).map(normalizarInstitucion)
    }
}

const prepararInstitucion = (datos) => ({
    ...datos,
    naturaleza: NATURALEZA_CODES[datos.naturaleza] || datos.naturaleza
})

const request = async (endpoint, options = {}) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {})
        },
        ...options
    })

    let payload = null
    try {
        payload = await response.json()
    } catch (_error) {
        payload = null
    }

    if (!response.ok) {
        const mensaje = payload?.mensaje || `Error HTTP ${response.status}`
        throw new Error(mensaje)
    }

    return endpoint === '/sincronizacion' ? normalizarSincronizacion(payload) : payload
}

export const apiService = {
    // Sincronización
    sincronizar: () => request('/sincronizacion'),
    
    // Health check
    healthCheck: () => request('/health'),

    // Instituciones
    crearInstitucion: (datos) => request('/instituciones', {
        method: 'POST',
        body: JSON.stringify(prepararInstitucion(datos))
    }),
    actualizarInstitucion: (id, datos) => request(`/instituciones/${id}`, {
        method: 'PUT',
        body: JSON.stringify(prepararInstitucion(datos))
    }),
    eliminarInstitucion: (id) => request(`/instituciones/${id}`, {
        method: 'DELETE'
    }),

    // Sedes
    crearSede: (datos) => request('/sedes', {
        method: 'POST',
        body: JSON.stringify(datos)
    }),
    actualizarSede: (id, datos) => request(`/sedes/${id}`, {
        method: 'PUT',
        body: JSON.stringify(datos)
    }),
    eliminarSede: (id) => request(`/sedes/${id}`, {
        method: 'DELETE'
    }),

    // Usuarios
    crearUsuario: (datos) => request('/usuarios', {
        method: 'POST',
        body: JSON.stringify(datos)
    }),
    actualizarUsuario: (id, datos) => request(`/usuarios/${id}`, {
        method: 'PUT',
        body: JSON.stringify(datos)
    }),
    eliminarUsuario: (id) => request(`/usuarios/${id}`, {
        method: 'DELETE'
    }),

    // Programas
    crearPrograma: (datos) => request('/programas', {
        method: 'POST',
        body: JSON.stringify(datos)
    }),
    actualizarPrograma: (id, datos) => request(`/programas/${id}`, {
        method: 'PUT',
        body: JSON.stringify(datos)
    }),
    eliminarPrograma: (id) => request(`/programas/${id}`, {
        method: 'DELETE'
    })
}

export default apiService
