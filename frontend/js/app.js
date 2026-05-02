/* =========================================================================
   PROYECTO  : Hub Educativo Colombia - SPA
   ARCHIVO   : app.js
   DESCRIPCIÓN: Punto de entrada principal de la aplicación.
                Inicializa los datos, el enrutador y define el Controlador
                global que maneja las acciones del usuario (CRUD).
   AUTORES   : Diana Zapata, Yuliana Chica, Samuel Zapata, Edwin Rios
   FECHA     : Marzo 2026
   ========================================================================= */

/* =========================================================================
   CONTROLADOR GLOBAL
   Centraliza todas las acciones que el usuario puede realizar desde la
   interfaz: crear, editar, eliminar registros y gestionar el modal.
   Se expone como variable global porque los onclick del HTML lo referencian.
   ========================================================================= */
const Controlador = (() => {

    // =====================================================================
    // GESTIÓN DEL MODAL
    // =====================================================================

    /**
     * Abre el modal e inyecta el contenido HTML proporcionado.
     * @param {string} contenidoHtml - HTML a mostrar dentro del modal
     */
    const abrirModal = (contenidoHtml) => {
        const fondoModal = document.getElementById('fondoModal');
        const cuerpoModal = document.getElementById('cuerpoModal');
        cuerpoModal.innerHTML = contenidoHtml;
        fondoModal.classList.add('visible');
    };

    /**
     * Cierra el modal y limpia su contenido.
     */
    const cerrarModal = () => {
        const fondoModal = document.getElementById('fondoModal');
        fondoModal.classList.remove('visible');
        document.getElementById('cuerpoModal').innerHTML = '';
    };

    /**
     * Muestra una notificación tipo toast en la parte inferior.
     * Se oculta automáticamente después de 3 segundos.
     * @param {string} mensaje - Texto de la notificación
     * @param {string} tipo - Tipo: 'exito', 'error' o 'info'
     */
    const mostrarNotificacion = (mensaje, tipo = 'exito') => {
        // Eliminar notificación anterior si existe
        const anterior = document.querySelector('.notificacionToast');
        if (anterior) anterior.remove();

        // Crear elemento de notificación
        const toast = document.createElement('div');
        toast.className = `notificacionToast ${tipo}`;
        toast.textContent = mensaje;
        document.body.appendChild(toast);

        // Mostrar con animación (requiere un frame para que la transición funcione)
        requestAnimationFrame(() => toast.classList.add('visible'));

        // Ocultar después de 3 segundos
        setTimeout(() => {
            toast.classList.remove('visible');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    };

    /**
     * Muestra errores de validación dentro de un formulario.
     * @param {Array} errores - Lista de mensajes de error
     */
    const mostrarErroresFormulario = (errores) => {
        const contenedor = document.getElementById('erroresFormulario');
        if (!contenedor) return;
        contenedor.innerHTML = errores.map(e =>
            `<div class="mensajeError">${e}</div>`
        ).join('');
    };

    /**
     * Sincroniza localStorage con la base de datos a traves de la API.
     */
    const sincronizarConBackend = async () => {
        const datos = await ApiHub.sincronizar();
        Almacenamiento.hidratarDesdeApi(datos);
    };

    // =====================================================================
    // CRUD: INSTITUCIONES
    // =====================================================================

    /**
     * Abre el modal con el formulario para crear una nueva institución.
     */
    const nuevaInstitucion = () => {
        abrirModal(Vistas.formularioInstitucion());
    };

    /**
     * Abre el modal con el formulario para editar una institución existente.
     * @param {number} id - ID de la institución a editar
     */
    const editarInstitucion = (id) => {
        const institucion = ModeloInstituciones.obtenerPorId(id);
        if (institucion) {
            abrirModal(Vistas.formularioInstitucion(institucion));
        }
    };

    /**
     * Procesa el formulario de institución (crear o actualizar).
     * @param {Event} evento - Evento del formulario (submit)
     * @param {number|null} id - ID de la institución (null si es nueva)
     */
    const guardarInstitucion = async (evento, id) => {
        evento.preventDefault();

        // Recoger datos del formulario
        const datos = {
            nombreOficial: document.getElementById('nombreOficial').value,
            naturaleza: document.getElementById('naturaleza').value,
            sitioWeb: document.getElementById('sitioWeb').value || null
        };

        const validacion = ModeloInstituciones.validar(datos);
        if (!validacion.valido) {
            mostrarErroresFormulario(validacion.errores);
            return;
        }

        try {
            if (id) {
                await ApiHub.actualizarInstitucion(id, datos);
            } else {
                await ApiHub.crearInstitucion(datos);
            }

            await sincronizarConBackend();
            cerrarModal();
            Enrutador.renderizar();
            mostrarNotificacion(id ? 'Institución actualizada correctamente.' : 'Institución creada correctamente.');
        } catch (error) {
            mostrarNotificacion(error.message || 'No se pudo guardar la institución.', 'error');
        }
    };

    /**
     * Elimina una institución previa confirmación del usuario.
     * @param {number} id - ID de la institución a eliminar
     */
    const eliminarInstitucion = async (id) => {
        const institucion = ModeloInstituciones.obtenerPorId(id);
        if (!institucion) return;

        // Solicitar confirmación al usuario
        if (confirm(`¿Está seguro de eliminar "${institucion.nombreOficial}"?\nEsta acción no se puede deshacer.`)) {
            try {
                await ApiHub.eliminarInstitucion(id);
                await sincronizarConBackend();
                Enrutador.renderizar();
                mostrarNotificacion('Institución eliminada correctamente.');
            } catch (error) {
                mostrarNotificacion(error.message || 'No se pudo eliminar la institución.', 'error');
            }
        }
    };

    // =====================================================================
    // CRUD: SEDES
    // =====================================================================

    /**
     * Abre el modal con el formulario para agregar una sede.
     * @param {number} idInstitucion - ID de la institución padre
     */
    const agregarSede = (idInstitucion) => {
        abrirModal(Vistas.formularioSede(idInstitucion));
    };

    /**
     * Procesa el formulario de sede (crear).
     * @param {Event} evento - Evento del formulario
     * @param {number} idInstitucion - ID de la institución padre
     */
    const guardarSede = async (evento, idInstitucion) => {
        evento.preventDefault();

        const datos = {
            idInstitucion: idInstitucion,
            nombreSede: document.getElementById('nombreSede').value,
            ciudad: document.getElementById('ciudad').value,
            direccionFisica: document.getElementById('direccionFisica').value,
            esSedePrincipal: document.getElementById('esSedePrincipal').checked
        };

        const validacion = ModeloSedes.validar(datos);
        if (!validacion.valido) {
            mostrarErroresFormulario(validacion.errores);
            return;
        }

        try {
            await ApiHub.crearSede(datos);
            await sincronizarConBackend();
            cerrarModal();
            Enrutador.renderizar();
            mostrarNotificacion('Sede creada correctamente.');
        } catch (error) {
            mostrarNotificacion(error.message || 'No se pudo crear la sede.', 'error');
        }
    };

    // =====================================================================
    // CRUD: USUARIOS
    // =====================================================================

    /**
     * Abre el modal con el formulario para crear un nuevo usuario.
     */
    const nuevoUsuario = () => {
        abrirModal(Vistas.formularioUsuario());
    };

    /**
     * Abre el modal con el formulario para editar un usuario.
     * @param {number} id - ID del usuario a editar
     */
    const editarUsuario = (id) => {
        const usuario = ModeloUsuarios.obtenerPorId(id);
        if (usuario) {
            abrirModal(Vistas.formularioUsuario(usuario));
        }
    };

    /**
     * Procesa el formulario de usuario (crear o actualizar).
     * @param {Event} evento - Evento del formulario
     * @param {number|null} id - ID del usuario (null si es nuevo)
     */
    const guardarUsuario = async (evento, id) => {
        evento.preventDefault();

        const datos = {
            nombreCompleto: document.getElementById('nombreCompleto').value,
            correoElectronico: document.getElementById('correoElectronico').value,
            rol: document.getElementById('rol').value,
            estaActivo: document.getElementById('estaActivo').checked
        };

        const validacion = ModeloUsuarios.validar(datos, id || null);
        if (!validacion.valido) {
            mostrarErroresFormulario(validacion.errores);
            return;
        }

        try {
            if (id) {
                await ApiHub.actualizarUsuario(id, datos);
            } else {
                await ApiHub.crearUsuario(datos);
            }
            await sincronizarConBackend();
            cerrarModal();
            Enrutador.renderizar();
            mostrarNotificacion(id ? 'Usuario actualizado correctamente.' : 'Usuario creado correctamente.');
        } catch (error) {
            mostrarNotificacion(error.message || 'No se pudo guardar el usuario.', 'error');
        }
    };

    /**
     * Elimina un usuario previa confirmación.
     * @param {number} id - ID del usuario a eliminar
     */
    const eliminarUsuario = async (id) => {
        const usuario = ModeloUsuarios.obtenerPorId(id);
        if (!usuario) return;

        if (confirm(`¿Está seguro de eliminar al usuario "${usuario.nombreCompleto}"?`)) {
            try {
                await ApiHub.eliminarUsuario(id);
                await sincronizarConBackend();
                Enrutador.renderizar();
                mostrarNotificacion('Usuario eliminado correctamente.');
            } catch (error) {
                mostrarNotificacion(error.message || 'No se pudo eliminar el usuario.', 'error');
            }
        }
    };

    // =====================================================================
    // CRUD: PROGRAMAS ACADÉMICOS
    // =====================================================================

    /**
     * Abre el modal con el formulario para crear un nuevo programa.
     */
    const nuevoPrograma = () => {
        abrirModal(Vistas.formularioPrograma());
    };

    /**
     * Abre el modal con el formulario para editar un programa.
     * @param {number} id - ID del programa a editar
     */
    const editarPrograma = (id) => {
        const programa = ModeloProgramas.obtenerCompletoPorId(id);
        if (programa) {
            abrirModal(Vistas.formularioPrograma(programa));
        }
    };

    /**
     * Procesa el formulario de programa (crear o actualizar).
     * Recoge datos de las tres secciones del formulario:
     * datos del programa, detalles operativos y calidad/beneficios.
     * @param {Event} evento - Evento del formulario
     * @param {number|null} id - ID del programa (null si es nuevo)
     */
    const guardarPrograma = async (evento, id) => {
        evento.preventDefault();

        const datos = {
            // Datos del programa (tabla programas_academicos)
            idInstitucion: parseInt(document.getElementById('idInstitucion').value),
            codigoSnies: document.getElementById('codigoSnies').value,
            nombrePrograma: document.getElementById('nombrePrograma').value,
            nivelFormacion: document.getElementById('nivelFormacion').value,
            totalSemestres: document.getElementById('totalSemestres').value,
            // Datos operativos (tabla detalles_operacion)
            costoSemestre: document.getElementById('costoSemestre').value,
            modalidad: document.getElementById('modalidad').value,
            jornada: document.getElementById('jornada').value,
            estudiantesActivos: document.getElementById('estudiantesActivos').value,
            // Calidad y beneficios (tabla calidad_beneficios)
            acreditacionAltaCalidad: document.getElementById('acreditacionAltaCalidad').checked,
            ofreceBecas: document.getElementById('ofreceBecas').checked,
            dobleTitulacion: document.getElementById('dobleTitulacion').checked,
            requiereSegundoIdioma: document.getElementById('requiereSegundoIdioma').checked
        };

        const validacion = ModeloProgramas.validar(datos);
        if (!validacion.valido) {
            mostrarErroresFormulario(validacion.errores);
            return;
        }

        try {
            if (id) {
                await ApiHub.actualizarPrograma(id, datos);
            } else {
                await ApiHub.crearPrograma(datos);
            }
            await sincronizarConBackend();
            cerrarModal();
            Enrutador.renderizar();
            mostrarNotificacion(id ? 'Programa actualizado correctamente.' : 'Programa creado correctamente.');
        } catch (error) {
            mostrarNotificacion(error.message || 'No se pudo guardar el programa.', 'error');
        }
    };

    /**
     * Elimina un programa previa confirmación.
     * @param {number} id - ID del programa a eliminar
     */
    const eliminarPrograma = async (id) => {
        const programa = ModeloProgramas.obtenerCompletoPorId(id);
        if (!programa) return;

        if (confirm(`¿Está seguro de eliminar "${programa.nombrePrograma}"?\nSe eliminarán también sus detalles y beneficios.`)) {
            try {
                await ApiHub.eliminarPrograma(id);
                await sincronizarConBackend();
                Enrutador.renderizar();
                mostrarNotificacion('Programa eliminado correctamente.');
            } catch (error) {
                mostrarNotificacion(error.message || 'No se pudo eliminar el programa.', 'error');
            }
        }
    };

    // =====================================================================
    // BUSCADOR
    // =====================================================================

    /**
     * Ejecuta la búsqueda aplicando los filtros seleccionados.
     * Se llama cada vez que el usuario escribe o cambia un filtro.
     * Filtra los programas en tiempo real (sin necesidad de botón "buscar").
     */
    const ejecutarBusqueda = () => {
        // Obtener valores de los filtros
        const textoBusqueda = document.getElementById('campoBuscarTexto').value.toLowerCase();
        const institucionFiltro = document.getElementById('filtroBuscarInstitucion').value;
        const nivelFiltro = document.getElementById('filtroBuscarNivel').value;
        const modalidadFiltro = document.getElementById('filtroBuscarModalidad').value;

        // Obtener todos los programas completos (con JOIN simulado)
        let resultados = ModeloProgramas.obtenerTodosCompletos();

        // Aplicar filtros de forma secuencial
        if (textoBusqueda) {
            resultados = resultados.filter(p =>
                p.nombrePrograma.toLowerCase().includes(textoBusqueda) ||
                p.nombreInstitucion.toLowerCase().includes(textoBusqueda) ||
                p.codigoSnies.toLowerCase().includes(textoBusqueda)
            );
        }

        if (institucionFiltro) {
            resultados = resultados.filter(p =>
                p.idInstitucion === parseInt(institucionFiltro)
            );
        }

        if (nivelFiltro) {
            resultados = resultados.filter(p => p.nivelFormacion === nivelFiltro);
        }

        if (modalidadFiltro) {
            resultados = resultados.filter(p =>
                p.detalles && p.detalles.modalidad === modalidadFiltro
            );
        }

        // Actualizar solo la sección de resultados (no toda la página)
        const contenedorResultados = document.getElementById('resultadosBusqueda');
        if (contenedorResultados) {
            contenedorResultados.innerHTML = Vistas.generarResultadosBusqueda(resultados);
        }
    };

    /**
     * Ejecuta reparacion manual de textos con codificacion corrupta.
     */
    const repararTextos = () => {
        Almacenamiento.repararTextosCorruptos();
        Enrutador.renderizar();
        mostrarNotificacion('Textos reparados. Si persiste algo, recarga con Ctrl+F5.', 'info');
    };

    // =====================================================================
    // API PÚBLICA DEL CONTROLADOR
    // Todas estas funciones son accesibles desde los onclick del HTML.
    // =====================================================================
    return {
        // Modal
        cerrarModal,
        mostrarNotificacion,
        // Instituciones
        nuevaInstitucion,
        editarInstitucion,
        guardarInstitucion,
        eliminarInstitucion,
        // Sedes
        agregarSede,
        guardarSede,
        // Usuarios
        nuevoUsuario,
        editarUsuario,
        guardarUsuario,
        eliminarUsuario,
        // Programas
        nuevoPrograma,
        editarPrograma,
        guardarPrograma,
        eliminarPrograma,
        // Buscador
        ejecutarBusqueda,
        // Utilidades
        repararTextos
    };
})();


/* =========================================================================
   INICIALIZACIÓN DE LA APLICACIÓN
   Se ejecuta cuando el DOM está completamente cargado.
   ========================================================================= */
document.addEventListener('DOMContentLoaded', async () => {
    // 1. Cargar datos iniciales locales como respaldo
    Almacenamiento.cargarDatosIniciales();

    // 2. Intentar sincronizar desde backend antes de renderizar
    try {
        const datosBackend = await ApiHub.sincronizar();
        Almacenamiento.hidratarDesdeApi(datosBackend);
        console.log('Datos sincronizados desde la API.');
        Controlador.mostrarNotificacion('Conectado al backend y base de datos.', 'info');
    } catch (error) {
        console.warn('No se pudo sincronizar con la API. Se usa localStorage como respaldo.', error.message);
        Controlador.mostrarNotificacion('Sin conexion con backend/BD. Mostrando datos locales.', 'error');
    }

    // 3. Inicializar el enrutador (renderiza la vista inicial)
    Enrutador.inicializar();

    // 4. Configurar el botón de menú hamburguesa (para móviles)
    const botonMenu = document.getElementById('botonMenu');
    const navegacion = document.getElementById('navegacionPrincipal');

    botonMenu.addEventListener('click', () => {
        navegacion.classList.toggle('menuAbierto');
    });

    // Cerrar el menú al hacer clic en un enlace (en móviles)
    navegacion.addEventListener('click', (evento) => {
        if (evento.target.classList.contains('enlaceNav')) {
            navegacion.classList.remove('menuAbierto');
        }
    });

    // 5. Cerrar el modal al hacer clic fuera de él o en el botón X
    const fondoModal = document.getElementById('fondoModal');
    const botonCerrarModal = document.getElementById('botonCerrarModal');

    fondoModal.addEventListener('click', (evento) => {
        // Solo cierra si se hace clic en el fondo (no en el contenido)
        if (evento.target === fondoModal) {
            Controlador.cerrarModal();
        }
    });

    botonCerrarModal.addEventListener('click', () => {
        Controlador.cerrarModal();
    });

    // 6. Cerrar modal con la tecla Escape
    document.addEventListener('keydown', (evento) => {
        if (evento.key === 'Escape') {
            Controlador.cerrarModal();
        }
    });

    console.log('Hub Educativo Colombia - SPA inicializada correctamente.');
});
