/* =========================================================================
   PROYECTO  : Hub Educativo Colombia - SPA
   ARCHIVO   : enrutador.js
   DESCRIPCIÓN: Sistema de enrutamiento basado en hash (#) para la SPA.
                Escucha cambios en el hash de la URL y renderiza la vista
                correspondiente sin recargar la página.
                Ejemplo: #/instituciones → renderiza la vista de instituciones.
   AUTORES   : Diana Zapata, Yuliana Chica, Samuel Zapata, Edwin Rios
   FECHA     : Marzo 2026
   ========================================================================= */

/**
 * Módulo Enrutador
 * Gestiona la navegación de la SPA usando el hash de la URL.
 * Patrón: Hash-based routing (sin necesidad de servidor).
 */
const Enrutador = (() => {

    /**
     * Mapa de rutas.
     * Asocia cada ruta hash con la función de vista que genera su HTML.
     * La clave es el path del hash (sin el #).
     * El valor es la función del módulo Vistas que retorna el HTML.
     */
    const rutas = {
        '/':              Vistas.inicio,
        '/instituciones': Vistas.instituciones,
        '/programas':     Vistas.programas,
        '/usuarios':      Vistas.usuarios,
        '/buscar':        Vistas.buscar
    };

    /**
     * Obtiene la ruta actual desde el hash de la URL.
     * Si no hay hash o está vacío, retorna la ruta raíz '/'.
     * Ejemplo: "http://localhost/#/instituciones" → "/instituciones"
     * @returns {string} Ruta actual normalizada
     */
    const obtenerRutaActual = () => {
        const hash = window.location.hash;
        // Si no hay hash, retorna la ruta de inicio
        if (!hash || hash === '#' || hash === '#/') return '/';
        // Elimina el # inicial para obtener solo la ruta
        return hash.slice(1);
    };

    /**
     * Renderiza la vista correspondiente a la ruta actual.
     * 1. Obtiene la ruta del hash
     * 2. Busca la función de vista asociada
     * 3. Ejecuta la función y obtiene el HTML
     * 4. Inyecta el HTML en el contenedor principal
     * 5. Actualiza la navegación activa
     */
    const renderizar = () => {
        const ruta = obtenerRutaActual();
        const contenedor = document.getElementById('contenidoPrincipal');

        // Buscar la función de vista. Si no existe, mostrar la vista de inicio
        const funcionVista = rutas[ruta] || rutas['/'];

        // Inyectar el HTML generado por la vista en el contenedor
        contenedor.innerHTML = funcionVista();

        // Actualizar el enlace activo en la navegación
        _actualizarNavegacionActiva(ruta);

        // Hacer scroll al inicio de la página al cambiar de vista
        window.scrollTo(0, 0);
    };

    /**
     * Actualiza la clase 'activo' en los enlaces de navegación.
     * Resalta el enlace de la sección actual.
     * @param {string} rutaActual - Ruta activa actualmente
     */
    const _actualizarNavegacionActiva = (rutaActual) => {
        // Obtener todos los enlaces de navegación
        const enlaces = document.querySelectorAll('.enlaceNav');
        enlaces.forEach(enlace => {
            const rutaEnlace = enlace.getAttribute('data-ruta');
            if (rutaEnlace === rutaActual) {
                enlace.classList.add('activo');
            } else {
                enlace.classList.remove('activo');
            }
        });
    };

    /**
     * Navega programáticamente a una ruta.
     * Cambia el hash de la URL, lo que dispara el evento hashchange.
     * @param {string} ruta - Ruta destino (ej: '/instituciones')
     */
    const navegar = (ruta) => {
        window.location.hash = `#${ruta}`;
    };

    /**
     * Inicializa el enrutador.
     * - Escucha el evento hashchange para detectar cambios de ruta.
     * - Renderiza la vista inicial al cargar la página.
     */
    const inicializar = () => {
        // Escuchar cambios en el hash (cuando el usuario navega)
        window.addEventListener('hashchange', renderizar);

        // Renderizar la vista inicial al cargar la página
        renderizar();
    };

    // API pública del módulo
    return {
        inicializar,
        renderizar,
        navegar
    };
})();
