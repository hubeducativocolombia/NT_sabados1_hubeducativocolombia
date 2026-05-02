/* =========================================================================
   PROYECTO  : Hub Educativo Colombia - SPA
   ARCHIVO   : vistas.js
   DESCRIPCIÓN: Capa de presentación. Genera el HTML dinámico de cada
                sección de la aplicación. Cada función retorna un string
                HTML que el enrutador inyecta en el contenedor principal.
   AUTORES   : Diana Zapata, Yuliana Chica, Samuel Zapata, Edwin Rios
   FECHA     : Marzo 2026
   ========================================================================= */

/**
 * Módulo Vistas
 * Contiene todas las funciones que generan el HTML de las vistas.
 */
const Vistas = (() => {

    // =====================================================================
    // VISTA: INICIO (Dashboard)
    // Página principal con estadísticas y acceso rápido.
    // =====================================================================

    /**
     * Genera la vista del dashboard principal.
     * Muestra estadísticas generales y accesos rápidos a cada módulo.
     * @returns {string} HTML de la vista de inicio
     */
    const inicio = () => {
        // Obtener datos para las estadísticas
        const totalInstituciones = ModeloInstituciones.obtenerTodas().length;
        const totalProgramas = ModeloProgramas.obtenerTodosCompletos().length;
        const totalUsuarios = ModeloUsuarios.obtenerTodos().length;
        const totalSedes = Almacenamiento.obtenerTodos('sedesInstitucion').length;

        return `
            <section class="seccionInicio">
                <h2 class="tituloInicio">Bienvenido al Hub Educativo Colombia</h2>
                <p class="subtituloInicio">
                    Plataforma de consulta de instituciones y programas de educación superior
                </p>
                <p style="margin-top:0.75rem;">
                    <button class="boton botonAdvertencia" onclick="Controlador.repararTextos()">Reparar textos</button>
                </p>

                <!-- Tarjetas de estadísticas (datos en tiempo real desde localStorage) -->
                <div class="contenedorEstadisticas">
                    <div class="tarjetaEstadistica">
                        <h3>Instituciones</h3>
                        <div class="valorEstadistica">${totalInstituciones}</div>
                    </div>
                    <div class="tarjetaEstadistica">
                        <h3>Programas Académicos</h3>
                        <div class="valorEstadistica">${totalProgramas}</div>
                    </div>
                    <div class="tarjetaEstadistica">
                        <h3>Usuarios Registrados</h3>
                        <div class="valorEstadistica">${totalUsuarios}</div>
                    </div>
                    <div class="tarjetaEstadistica">
                        <h3>Sedes</h3>
                        <div class="valorEstadistica">${totalSedes}</div>
                    </div>
                </div>

                <!-- Accesos rápidos a cada módulo -->
                <div class="contenedorAccesoRapido">
                    <a href="#/instituciones" class="tarjetaAccesoRapido">
                        <div class="iconoAcceso">🏛️</div>
                        <h3>Instituciones</h3>
                        <p>Gestionar instituciones de educación superior y sus sedes</p>
                    </a>
                    <a href="#/programas" class="tarjetaAccesoRapido">
                        <div class="iconoAcceso">📚</div>
                        <h3>Programas Académicos</h3>
                        <p>Consultar y administrar la oferta académica</p>
                    </a>
                    <a href="#/usuarios" class="tarjetaAccesoRapido">
                        <div class="iconoAcceso">👥</div>
                        <h3>Usuarios</h3>
                        <p>Administrar usuarios y roles de la plataforma</p>
                    </a>
                    <a href="#/buscar" class="tarjetaAccesoRapido">
                        <div class="iconoAcceso">🔍</div>
                        <h3>Buscador</h3>
                        <p>Buscar programas por nombre, modalidad o institución</p>
                    </a>
                </div>
            </section>
        `;
    };

    // =====================================================================
    // VISTA: INSTITUCIONES
    // Lista de instituciones con CRUD completo.
    // =====================================================================

    /**
     * Genera la vista de instituciones con sus tarjetas y sedes.
     * @returns {string} HTML de la vista de instituciones
     */
    const instituciones = () => {
        const listaInstituciones = ModeloInstituciones.obtenerTodas();

        // Generar HTML para cada tarjeta de institución
        const tarjetasHtml = listaInstituciones.length > 0
            ? listaInstituciones.map(inst => {
                // Obtener sedes de esta institución (simula JOIN)
                const sedes = ModeloSedes.obtenerPorInstitucion(inst.idInstitucion);
                const sedesHtml = sedes.map(s =>
                    `<span style="font-size:0.85rem;">📍 ${s.nombreSede} — ${s.ciudad}${s.esSedePrincipal ? ' (Principal)' : ''}</span>`
                ).join('<br>');

                // Clase CSS según naturaleza (PUBLICA, PRIVADA, MIXTA)
                const claseNaturaleza = `etiqueta etiqueta${inst.naturaleza.charAt(0) + inst.naturaleza.slice(1).toLowerCase()}`;

                return `
                    <div class="tarjeta">
                        <h3>${inst.nombreOficial}</h3>
                        <p><span class="${claseNaturaleza}">${inst.naturaleza}</span></p>
                        ${inst.sitioWeb ? `<p><strong>Web:</strong> <a href="${inst.sitioWeb}" target="_blank" rel="noopener">${inst.sitioWeb}</a></p>` : ''}
                        <p><strong>Fecha registro:</strong> ${Formato.fecha(inst.fechaRegistro)}</p>
                        ${sedes.length > 0 ? `<p><strong>Sedes (${sedes.length}):</strong><br>${sedesHtml}</p>` : '<p><em>Sin sedes registradas</em></p>'}
                        <div class="accionesTarjeta">
                            <button class="boton botonPequeno botonAdvertencia" onclick="Controlador.editarInstitucion(${inst.idInstitucion})">Editar</button>
                            <button class="boton botonPequeno botonExito" onclick="Controlador.agregarSede(${inst.idInstitucion})">+ Sede</button>
                            <button class="boton botonPequeno botonError" onclick="Controlador.eliminarInstitucion(${inst.idInstitucion})">Eliminar</button>
                        </div>
                    </div>
                `;
            }).join('')
            : `<div class="mensajeVacio">
                    <div class="iconoVacio">🏛️</div>
                    <p>No hay instituciones registradas.</p>
                    <p>Haz clic en "Nueva Institución" para comenzar.</p>
               </div>`;

        return `
            <section>
                <div class="encabezadoSeccion">
                    <h2 class="tituloSeccion">Instituciones de Educación Superior</h2>
                    <button class="boton botonPrimario" onclick="Controlador.nuevaInstitucion()">+ Nueva Institución</button>
                </div>
                <div class="contenedorTarjetas">
                    ${tarjetasHtml}
                </div>
            </section>
        `;
    };

    // =====================================================================
    // VISTA: PROGRAMAS ACADÉMICOS
    // Lista de programas con información completa (JOIN simulado).
    // =====================================================================

    /**
     * Genera la vista de programas académicos.
     * Cada tarjeta muestra datos de 3 tablas: programa, detalles y calidad.
     * @returns {string} HTML de la vista de programas
     */
    const programas = () => {
        const listaProgramas = ModeloProgramas.obtenerTodosCompletos();

        const tarjetasHtml = listaProgramas.length > 0
            ? listaProgramas.map(prog => {
                const detalle = prog.detalles || {};
                const calidad = prog.calidad || {};

                return `
                    <div class="tarjeta">
                        <h3>${prog.nombrePrograma}</h3>
                        <p>
                            <span class="etiqueta etiquetaNivel">${prog.nivelFormacion}</span>
                            ${detalle.modalidad ? `<span class="etiqueta etiquetaModalidad">${detalle.modalidad}</span>` : ''}
                            <span class="etiqueta ${prog.estaActivo ? 'etiquetaActivo' : 'etiquetaInactivo'}">${prog.estaActivo ? 'ACTIVO' : 'INACTIVO'}</span>
                        </p>
                        <p><strong>Institución:</strong> ${prog.nombreInstitucion}</p>
                        <p><strong>Código SNIES:</strong> ${prog.codigoSnies}</p>
                        <p><strong>Semestres:</strong> ${prog.totalSemestres}</p>
                        ${detalle.costoSemestre ? `<p><strong>Costo semestre:</strong> <span class="valorMoneda">${Formato.moneda(detalle.costoSemestre)}</span></p>` : ''}
                        ${detalle.jornada ? `<p><strong>Jornada:</strong> ${detalle.jornada}</p>` : ''}
                        ${detalle.estudiantesActivos !== undefined ? `<p><strong>Estudiantes activos:</strong> ${detalle.estudiantesActivos.toLocaleString('es-CO')}</p>` : ''}
                        <p>
                            ${calidad.acreditacionAltaCalidad ? '✅ Acreditación alta calidad' : ''}
                            ${calidad.ofreceBecas ? ' | 🎓 Ofrece becas' : ''}
                            ${calidad.dobleTitulacion ? ' | 📜 Doble titulación' : ''}
                            ${calidad.requiereSegundoIdioma ? ' | 🌐 Requiere segundo idioma' : ''}
                        </p>
                        <div class="accionesTarjeta">
                            <button class="boton botonPequeno botonAdvertencia" onclick="Controlador.editarPrograma(${prog.idPrograma})">Editar</button>
                            <button class="boton botonPequeno botonError" onclick="Controlador.eliminarPrograma(${prog.idPrograma})">Eliminar</button>
                        </div>
                    </div>
                `;
            }).join('')
            : `<div class="mensajeVacio">
                    <div class="iconoVacio">📚</div>
                    <p>No hay programas académicos registrados.</p>
                    <p>Haz clic en "Nuevo Programa" para comenzar.</p>
               </div>`;

        return `
            <section>
                <div class="encabezadoSeccion">
                    <h2 class="tituloSeccion">Programas Académicos</h2>
                    <button class="boton botonPrimario" onclick="Controlador.nuevoPrograma()">+ Nuevo Programa</button>
                </div>
                <div class="contenedorTarjetas">
                    ${tarjetasHtml}
                </div>
            </section>
        `;
    };

    // =====================================================================
    // VISTA: USUARIOS
    // Tabla de usuarios con acciones CRUD.
    // =====================================================================

    /**
     * Genera la vista de usuarios en formato de tabla.
     * @returns {string} HTML de la vista de usuarios
     */
    const usuarios = () => {
        const listaUsuarios = ModeloUsuarios.obtenerTodos();

        const filasHtml = listaUsuarios.length > 0
            ? listaUsuarios.map(u => `
                <tr>
                    <td>${u.idUsuario}</td>
                    <td>${u.nombreCompleto}</td>
                    <td>${u.correoElectronico}</td>
                    <td><span class="etiqueta etiquetaNivel">${u.rol}</span></td>
                    <td><span class="etiqueta ${u.estaActivo ? 'etiquetaActivo' : 'etiquetaInactivo'}">${u.estaActivo ? 'Activo' : 'Inactivo'}</span></td>
                    <td>${Formato.fecha(u.fechaCreacion)}</td>
                    <td>
                        <button class="boton botonPequeno botonAdvertencia" onclick="Controlador.editarUsuario(${u.idUsuario})">Editar</button>
                        <button class="boton botonPequeno botonError" onclick="Controlador.eliminarUsuario(${u.idUsuario})">Eliminar</button>
                    </td>
                </tr>
            `).join('')
            : `<tr><td colspan="7" style="text-align:center; padding:2rem; color:#718096;">No hay usuarios registrados.</td></tr>`;

        return `
            <section>
                <div class="encabezadoSeccion">
                    <h2 class="tituloSeccion">Gestión de Usuarios</h2>
                    <button class="boton botonPrimario" onclick="Controlador.nuevoUsuario()">+ Nuevo Usuario</button>
                </div>
                <div class="contenedorTabla">
                    <table class="tablaUsuarios">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Correo</th>
                                <th>Rol</th>
                                <th>Estado</th>
                                <th>Fecha Creación</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${filasHtml}
                        </tbody>
                    </table>
                </div>
            </section>
        `;
    };

    // =====================================================================
    // VISTA: BUSCADOR
    // Búsqueda avanzada de programas con filtros.
    // =====================================================================

    /**
     * Genera la vista del buscador con filtros y resultados.
     * @returns {string} HTML de la vista de búsqueda
     */
    const buscar = () => {
        // Generar opciones de instituciones para el filtro
        const listaInstituciones = ModeloInstituciones.obtenerTodas();
        const opcionesInstituciones = listaInstituciones.map(i =>
            `<option value="${i.idInstitucion}">${i.nombreOficial}</option>`
        ).join('');

        // Generar opciones de niveles
        const opcionesNiveles = ModeloProgramas.NIVELES_VALIDOS.map(n =>
            `<option value="${n}">${n}</option>`
        ).join('');

        // Generar opciones de modalidades
        const opcionesModalidades = ModeloProgramas.MODALIDADES_VALIDAS.map(m =>
            `<option value="${m}">${m}</option>`
        ).join('');

        return `
            <section class="seccionBusqueda">
                <h2 class="tituloSeccion">Buscador de Programas Académicos</h2>

                <!-- Filtros de búsqueda -->
                <div class="contenedorBusqueda">
                    <div class="campoBusqueda">
                        <input type="text" id="campoBuscarTexto" placeholder="Buscar por nombre del programa..." oninput="Controlador.ejecutarBusqueda()">
                        <select id="filtroBuscarInstitucion" onchange="Controlador.ejecutarBusqueda()">
                            <option value="">Todas las instituciones</option>
                            ${opcionesInstituciones}
                        </select>
                        <select id="filtroBuscarNivel" onchange="Controlador.ejecutarBusqueda()">
                            <option value="">Todos los niveles</option>
                            ${opcionesNiveles}
                        </select>
                        <select id="filtroBuscarModalidad" onchange="Controlador.ejecutarBusqueda()">
                            <option value="">Todas las modalidades</option>
                            ${opcionesModalidades}
                        </select>
                    </div>
                </div>

                <!-- Resultados de búsqueda -->
                <div id="resultadosBusqueda">
                    ${_generarResultadosBusqueda(ModeloProgramas.obtenerTodosCompletos())}
                </div>
            </section>
        `;
    };

    /**
     * Genera la tabla de resultados de búsqueda.
     * Se llama internamente y también desde el controlador al filtrar.
     * @param {Array} resultados - Programas que coinciden con la búsqueda
     * @returns {string} HTML de la tabla de resultados
     */
    const _generarResultadosBusqueda = (resultados) => {
        if (resultados.length === 0) {
            return `
                <div class="mensajeVacio">
                    <div class="iconoVacio">🔍</div>
                    <p>No se encontraron programas con esos criterios.</p>
                </div>
            `;
        }

        const filasHtml = resultados.map(prog => {
            const detalle = prog.detalles || {};
            return `
                <tr>
                    <td>${prog.nombrePrograma}</td>
                    <td>${prog.nombreInstitucion}</td>
                    <td><span class="etiqueta etiquetaNivel">${prog.nivelFormacion}</span></td>
                    <td><span class="etiqueta etiquetaModalidad">${detalle.modalidad || 'N/A'}</span></td>
                    <td class="valorMoneda">${detalle.costoSemestre ? Formato.moneda(detalle.costoSemestre) : 'N/A'}</td>
                    <td>${prog.totalSemestres}</td>
                </tr>
            `;
        }).join('');

        return `
            <p style="margin-bottom:1rem; color:#718096;">${resultados.length} resultado(s) encontrado(s)</p>
            <div class="contenedorTabla">
                <table class="tablaResultados">
                    <thead>
                        <tr>
                            <th>Programa</th>
                            <th>Institución</th>
                            <th>Nivel</th>
                            <th>Modalidad</th>
                            <th>Costo Semestre</th>
                            <th>Semestres</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${filasHtml}
                    </tbody>
                </table>
            </div>
        `;
    };

    // =====================================================================
    // FORMULARIOS PARA MODALES
    // Generan el HTML de los formularios de crear/editar.
    // =====================================================================

    /**
     * Genera el formulario de institución (crear o editar).
     * @param {Object|null} datos - Datos existentes (null si es nuevo)
     * @returns {string} HTML del formulario
     */
    const formularioInstitucion = (datos = null) => {
        const esEdicion = datos !== null;
        const opcionesNaturaleza = ModeloInstituciones.NATURALEZAS_VALIDAS.map(n =>
            `<option value="${n}" ${datos && datos.naturaleza === n ? 'selected' : ''}>${n}</option>`
        ).join('');

        return `
            <h2>${esEdicion ? 'Editar' : 'Nueva'} Institución</h2>
            <form class="formulario" id="formularioInstitucion" onsubmit="Controlador.guardarInstitucion(event, ${esEdicion ? datos.idInstitucion : 'null'})">
                <div class="grupoFormulario">
                    <label for="nombreOficial">Nombre Oficial *</label>
                    <input type="text" id="nombreOficial" name="nombreOficial" required maxlength="200"
                           value="${datos ? datos.nombreOficial : ''}" placeholder="Ej: Universidad de Antioquia">
                </div>
                <div class="grupoFormulario">
                    <label for="naturaleza">Naturaleza *</label>
                    <select id="naturaleza" name="naturaleza" required>
                        <option value="">Seleccionar...</option>
                        ${opcionesNaturaleza}
                    </select>
                </div>
                <div class="grupoFormulario">
                    <label for="sitioWeb">Sitio Web</label>
                    <input type="url" id="sitioWeb" name="sitioWeb"
                           value="${datos && datos.sitioWeb ? datos.sitioWeb : ''}" placeholder="https://www.ejemplo.edu.co">
                </div>
                <div id="erroresFormulario"></div>
                <div class="botonesFormulario">
                    <button type="button" class="boton botonOutline" onclick="Controlador.cerrarModal()">Cancelar</button>
                    <button type="submit" class="boton botonPrimario">${esEdicion ? 'Actualizar' : 'Crear'}</button>
                </div>
            </form>
        `;
    };

    /**
     * Genera el formulario de sede.
     * @param {number} idInstitucion - ID de la institución padre
     * @returns {string} HTML del formulario
     */
    const formularioSede = (idInstitucion) => {
        return `
            <h2>Nueva Sede</h2>
            <form class="formulario" id="formularioSede" onsubmit="Controlador.guardarSede(event, ${idInstitucion})">
                <div class="grupoFormulario">
                    <label for="nombreSede">Nombre de la Sede *</label>
                    <input type="text" id="nombreSede" name="nombreSede" required maxlength="150"
                           placeholder="Ej: Sede Norte">
                </div>
                <div class="grupoFormulario">
                    <label for="ciudad">Ciudad *</label>
                    <input type="text" id="ciudad" name="ciudad" required maxlength="100"
                           placeholder="Ej: Medellín">
                </div>
                <div class="grupoFormulario">
                    <label for="direccionFisica">Dirección Física *</label>
                    <input type="text" id="direccionFisica" name="direccionFisica" required maxlength="255"
                           placeholder="Ej: Cl. 67 #53-108">
                </div>
                <div class="grupoFormulario grupoCheckbox">
                    <input type="checkbox" id="esSedePrincipal" name="esSedePrincipal">
                    <label for="esSedePrincipal">Es sede principal</label>
                </div>
                <div id="erroresFormulario"></div>
                <div class="botonesFormulario">
                    <button type="button" class="boton botonOutline" onclick="Controlador.cerrarModal()">Cancelar</button>
                    <button type="submit" class="boton botonPrimario">Crear Sede</button>
                </div>
            </form>
        `;
    };

    /**
     * Genera el formulario de usuario (crear o editar).
     * @param {Object|null} datos - Datos existentes (null si es nuevo)
     * @returns {string} HTML del formulario
     */
    const formularioUsuario = (datos = null) => {
        const esEdicion = datos !== null;
        const opcionesRol = ModeloUsuarios.ROLES_VALIDOS.map(r =>
            `<option value="${r}" ${datos && datos.rol === r ? 'selected' : ''}>${r}</option>`
        ).join('');

        return `
            <h2>${esEdicion ? 'Editar' : 'Nuevo'} Usuario</h2>
            <form class="formulario" id="formularioUsuario" onsubmit="Controlador.guardarUsuario(event, ${esEdicion ? datos.idUsuario : 'null'})">
                <div class="grupoFormulario">
                    <label for="nombreCompleto">Nombre Completo *</label>
                    <input type="text" id="nombreCompleto" name="nombreCompleto" required maxlength="150"
                           value="${datos ? datos.nombreCompleto : ''}" placeholder="Ej: Diana Zapata Ortega">
                </div>
                <div class="grupoFormulario">
                    <label for="correoElectronico">Correo Electrónico *</label>
                    <input type="email" id="correoElectronico" name="correoElectronico" required maxlength="150"
                           value="${datos ? datos.correoElectronico : ''}" placeholder="ejemplo@correo.com">
                </div>
                <div class="grupoFormulario">
                    <label for="rol">Rol *</label>
                    <select id="rol" name="rol" required>
                        <option value="">Seleccionar...</option>
                        ${opcionesRol}
                    </select>
                </div>
                <div class="grupoFormulario grupoCheckbox">
                    <input type="checkbox" id="estaActivo" name="estaActivo" ${!datos || datos.estaActivo ? 'checked' : ''}>
                    <label for="estaActivo">Usuario activo</label>
                </div>
                <div id="erroresFormulario"></div>
                <div class="botonesFormulario">
                    <button type="button" class="boton botonOutline" onclick="Controlador.cerrarModal()">Cancelar</button>
                    <button type="submit" class="boton botonPrimario">${esEdicion ? 'Actualizar' : 'Crear'}</button>
                </div>
            </form>
        `;
    };

    /**
     * Genera el formulario de programa académico (crear o editar).
     * Incluye campos de las tres tablas relacionadas.
     * @param {Object|null} datos - Datos existentes completos (null si es nuevo)
     * @returns {string} HTML del formulario
     */
    const formularioPrograma = (datos = null) => {
        const esEdicion = datos !== null;
        const detalle = datos ? datos.detalles || {} : {};
        const calidad = datos ? datos.calidad || {} : {};

        // Opciones de instituciones para el select
        const listaInstituciones = ModeloInstituciones.obtenerTodas();
        const opcionesInstituciones = listaInstituciones.map(i =>
            `<option value="${i.idInstitucion}" ${datos && datos.idInstitucion === i.idInstitucion ? 'selected' : ''}>${i.nombreOficial}</option>`
        ).join('');

        // Opciones de niveles
        const opcionesNiveles = ModeloProgramas.NIVELES_VALIDOS.map(n =>
            `<option value="${n}" ${datos && datos.nivelFormacion === n ? 'selected' : ''}>${n}</option>`
        ).join('');

        // Opciones de modalidades
        const opcionesModalidades = ModeloProgramas.MODALIDADES_VALIDAS.map(m =>
            `<option value="${m}" ${detalle.modalidad === m ? 'selected' : ''}>${m}</option>`
        ).join('');

        // Opciones de jornadas
        const opcionesJornadas = ModeloProgramas.JORNADAS_VALIDAS.map(j =>
            `<option value="${j}" ${detalle.jornada === j ? 'selected' : ''}>${j}</option>`
        ).join('');

        return `
            <h2>${esEdicion ? 'Editar' : 'Nuevo'} Programa Académico</h2>
            <form class="formulario" id="formularioPrograma" onsubmit="Controlador.guardarPrograma(event, ${esEdicion ? datos.idPrograma : 'null'})">
                <!-- Datos del programa (tabla programas_academicos) -->
                <div class="grupoFormulario">
                    <label for="idInstitucion">Institución *</label>
                    <select id="idInstitucion" name="idInstitucion" required>
                        <option value="">Seleccionar institución...</option>
                        ${opcionesInstituciones}
                    </select>
                </div>
                <div class="grupoFormulario">
                    <label for="codigoSnies">Código SNIES *</label>
                    <input type="text" id="codigoSnies" name="codigoSnies" required maxlength="20"
                           value="${datos ? datos.codigoSnies : ''}" placeholder="Ej: 12345">
                </div>
                <div class="grupoFormulario">
                    <label for="nombrePrograma">Nombre del Programa *</label>
                    <input type="text" id="nombrePrograma" name="nombrePrograma" required maxlength="200"
                           value="${datos ? datos.nombrePrograma : ''}" placeholder="Ej: Ingeniería de Sistemas">
                </div>
                <div class="grupoFormulario">
                    <label for="nivelFormacion">Nivel de Formación *</label>
                    <select id="nivelFormacion" name="nivelFormacion" required>
                        <option value="">Seleccionar nivel...</option>
                        ${opcionesNiveles}
                    </select>
                </div>
                <div class="grupoFormulario">
                    <label for="totalSemestres">Total Semestres * (1-20)</label>
                    <input type="number" id="totalSemestres" name="totalSemestres" required min="1" max="20"
                           value="${datos ? datos.totalSemestres : ''}" placeholder="Ej: 10">
                </div>

                <!-- Datos operativos (tabla detalles_operacion) -->
                <div class="grupoFormulario">
                    <label for="costoSemestre">Costo Semestre (COP) *</label>
                    <input type="number" id="costoSemestre" name="costoSemestre" required min="1" step="0.01"
                           value="${detalle.costoSemestre || ''}" placeholder="Ej: 4500000">
                </div>
                <div class="grupoFormulario">
                    <label for="modalidad">Modalidad *</label>
                    <select id="modalidad" name="modalidad" required>
                        <option value="">Seleccionar modalidad...</option>
                        ${opcionesModalidades}
                    </select>
                </div>
                <div class="grupoFormulario">
                    <label for="jornada">Jornada *</label>
                    <select id="jornada" name="jornada" required>
                        <option value="">Seleccionar jornada...</option>
                        ${opcionesJornadas}
                    </select>
                </div>
                <div class="grupoFormulario">
                    <label for="estudiantesActivos">Estudiantes Activos</label>
                    <input type="number" id="estudiantesActivos" name="estudiantesActivos" min="0"
                           value="${detalle.estudiantesActivos || 0}" placeholder="Ej: 500">
                </div>

                <!-- Calidad y beneficios (tabla calidad_beneficios) -->
                <div class="grupoFormulario grupoCheckbox">
                    <input type="checkbox" id="acreditacionAltaCalidad" name="acreditacionAltaCalidad" ${calidad.acreditacionAltaCalidad ? 'checked' : ''}>
                    <label for="acreditacionAltaCalidad">Acreditación de alta calidad</label>
                </div>
                <div class="grupoFormulario grupoCheckbox">
                    <input type="checkbox" id="ofreceBecas" name="ofreceBecas" ${calidad.ofreceBecas ? 'checked' : ''}>
                    <label for="ofreceBecas">Ofrece becas</label>
                </div>
                <div class="grupoFormulario grupoCheckbox">
                    <input type="checkbox" id="dobleTitulacion" name="dobleTitulacion" ${calidad.dobleTitulacion ? 'checked' : ''}>
                    <label for="dobleTitulacion">Doble titulación</label>
                </div>
                <div class="grupoFormulario grupoCheckbox">
                    <input type="checkbox" id="requiereSegundoIdioma" name="requiereSegundoIdioma" ${calidad.requiereSegundoIdioma ? 'checked' : ''}>
                    <label for="requiereSegundoIdioma">Requiere segundo idioma</label>
                </div>

                <div id="erroresFormulario"></div>
                <div class="botonesFormulario">
                    <button type="button" class="boton botonOutline" onclick="Controlador.cerrarModal()">Cancelar</button>
                    <button type="submit" class="boton botonPrimario">${esEdicion ? 'Actualizar' : 'Crear'}</button>
                </div>
            </form>
        `;
    };

    // =====================================================================
    // API PÚBLICA DEL MÓDULO
    // =====================================================================
    return {
        inicio,
        instituciones,
        programas,
        usuarios,
        buscar,
        generarResultadosBusqueda: _generarResultadosBusqueda,
        formularioInstitucion,
        formularioSede,
        formularioUsuario,
        formularioPrograma
    };
})();
