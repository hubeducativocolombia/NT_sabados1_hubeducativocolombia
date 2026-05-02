/* =========================================================================
   PROYECTO  : Hub Educativo Colombia - SPA
   ARCHIVO   : peticiones.js
   DESCRIPCIÓN: Cliente HTTP para conectar el frontend con la API backend.
   ========================================================================= */

const ApiHub = (() => {
    const BASE_URL = 'http://localhost:3000/api';

    const request = async (endpoint, opciones = {}) => {
        const respuesta = await fetch(`${BASE_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...(opciones.headers || {})
            },
            ...opciones
        });

        let payload = null;
        try {
            payload = await respuesta.json();
        } catch (_error) {
            payload = null;
        }

        if (!respuesta.ok) {
            const mensaje = payload?.mensaje || `Error HTTP ${respuesta.status}`;
            throw new Error(mensaje);
        }

        return payload;
    };

    return {
        sincronizar: () => request('/sincronizacion'),

        crearInstitucion: (datos) => request('/instituciones', {
            method: 'POST',
            body: JSON.stringify(datos)
        }),
        actualizarInstitucion: (id, datos) => request(`/instituciones/${id}`, {
            method: 'PUT',
            body: JSON.stringify(datos)
        }),
        eliminarInstitucion: (id) => request(`/instituciones/${id}`, { method: 'DELETE' }),

        crearSede: (datos) => request('/sedes', {
            method: 'POST',
            body: JSON.stringify(datos)
        }),

        crearUsuario: (datos) => request('/usuarios', {
            method: 'POST',
            body: JSON.stringify(datos)
        }),
        actualizarUsuario: (id, datos) => request(`/usuarios/${id}`, {
            method: 'PUT',
            body: JSON.stringify(datos)
        }),
        eliminarUsuario: (id) => request(`/usuarios/${id}`, { method: 'DELETE' }),

        crearPrograma: (datos) => request('/programas', {
            method: 'POST',
            body: JSON.stringify(datos)
        }),
        actualizarPrograma: (id, datos) => request(`/programas/${id}`, {
            method: 'PUT',
            body: JSON.stringify(datos)
        }),
        eliminarPrograma: (id) => request(`/programas/${id}`, { method: 'DELETE' })
    };
})();