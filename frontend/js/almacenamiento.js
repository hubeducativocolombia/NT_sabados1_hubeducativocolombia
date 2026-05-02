/* =========================================================================
   PROYECTO  : Hub Educativo Colombia - SPA
   ARCHIVO   : almacenamiento.js
   DESCRIPCIÓN: Capa de acceso a datos usando localStorage del navegador.
                Simula las operaciones CRUD (Crear, Leer, Actualizar, Eliminar)
                que normalmente haría un backend con una base de datos MySQL.
                Cada tabla de la BD se almacena como un arreglo JSON en localStorage.
   AUTORES   : Diana Zapata, Yuliana Chica, Samuel Zapata, Edwin Rios
   FECHA     : Marzo 2026
   ========================================================================= */

/**
 * Módulo Almacenamiento
 * Encapsula todas las operaciones de lectura/escritura en localStorage.
 * Usa el patrón "módulo revelador" para mantener las funciones organizadas.
 */
const Almacenamiento = (() => {
    // =====================================================================
    // CONSTANTES - Nombres de las llaves en localStorage
    // Cada llave corresponde a una tabla de la base de datos original.
    // =====================================================================
    const LLAVES = {
        instituciones:       'hubEducativo_instituciones',
        sedesInstitucion:    'hubEducativo_sedes',
        usuarios:            'hubEducativo_usuarios',
        programasAcademicos: 'hubEducativo_programas',
        detallesOperacion:   'hubEducativo_detalles',
        calidadBeneficios:   'hubEducativo_calidad'
    };

    // =====================================================================
    // FUNCIONES PRIVADAS AUXILIARES
    // =====================================================================

    /**
     * Obtiene un arreglo de objetos desde localStorage.
     * Si la llave no existe, retorna un arreglo vacío.
     * @param {string} llave - Nombre de la llave en localStorage
     * @returns {Array} Arreglo de objetos almacenados
     */
    const _obtener = (llave) => {
        try {
            const datos = localStorage.getItem(llave);
            return datos ? JSON.parse(datos) : [];
        } catch (error) {
            console.error(`Error al leer localStorage [${llave}]:`, error);
            return [];
        }
    };

    /**
     * Guarda un arreglo de objetos en localStorage.
     * Convierte el arreglo a JSON antes de almacenarlo.
     * @param {string} llave - Nombre de la llave en localStorage
     * @param {Array} datos - Arreglo de objetos a guardar
     */
    const _guardar = (llave, datos) => {
        try {
            localStorage.setItem(llave, JSON.stringify(datos));
        } catch (error) {
            console.error(`Error al escribir en localStorage [${llave}]:`, error);
        }
    };

    /**
     * Genera un ID numérico autoincremental.
     * Busca el ID más alto existente y le suma 1.
     * Simula el AUTO_INCREMENT de MySQL.
     * @param {Array} registros - Arreglo actual de registros
     * @param {string} campoId - Nombre del campo ID (ej: 'idUsuario')
     * @returns {number} Siguiente ID disponible
     */
    const _generarId = (registros, campoId) => {
        if (registros.length === 0) return 1;
        const idMaximo = Math.max(...registros.map(r => r[campoId] || 0));
        return idMaximo + 1;
    };

    /**
     * Obtiene la fecha y hora actual en formato ISO.
     * Simula el DEFAULT CURRENT_TIMESTAMP de MySQL.
     * @returns {string} Fecha en formato ISO 8601
     */
    const _fechaActual = () => new Date().toISOString();

    /**
     * Normaliza textos que puedan venir con caracteres corruptos por codificacion.
     * @param {string} valor - Texto a limpiar
     * @returns {string} Texto normalizado
     */
    const _normalizarTexto = (valor) => {
        if (typeof valor !== 'string') return valor;

        let texto = valor;

        // Corrige mojibake UTF-8 frecuente en espanol.
        texto = texto
            .replace(/\u00C3\u00A1/g, '\u00E1')
            .replace(/\u00C3\u00A9/g, '\u00E9')
            .replace(/\u00C3\u00AD/g, '\u00ED')
            .replace(/\u00C3\u00B3/g, '\u00F3')
            .replace(/\u00C3\u00BA/g, '\u00FA')
            .replace(/\u00C3\u00B1/g, '\u00F1')
            .replace(/\u00C3\u0081/g, '\u00C1')
            .replace(/\u00C3\u0089/g, '\u00C9')
            .replace(/\u00C3\u008D/g, '\u00CD')
            .replace(/\u00C3\u0093/g, '\u00D3')
            .replace(/\u00C3\u009A/g, '\u00DA')
            .replace(/\u00C3\u0091/g, '\u00D1');

        // Corrige variante donde "|" representa el byte alto de caracteres acentuados.
        texto = texto
            .replace(/\|\u00A1/g, '\u00E1')
            .replace(/\|\u00A9/g, '\u00E9')
            .replace(/\|\u00AD/g, '\u00ED')
            .replace(/\|\u00B3/g, '\u00F3')
            .replace(/\|\u00BA/g, '\u00FA')
            .replace(/\|\u00B1/g, '\u00F1');

        return texto.replace(/[|\u2502]/g, '').trim();
    };

    /**
     * Aplica normalizacion de texto para campos string por tabla.
     * @param {string} nombreTabla - Nombre logico de tabla
     * @param {string[]} camposTexto - Campos a normalizar
     */
    const _normalizarRegistrosTexto = (nombreTabla, camposTexto) => {
        const registros = _obtener(LLAVES[nombreTabla]);
        if (!Array.isArray(registros) || registros.length === 0) return;

        let huboCambios = false;
        const registrosNormalizados = registros.map((registro) => {
            let actualizado = { ...registro };

            camposTexto.forEach((campo) => {
                if (typeof registro[campo] !== 'string') return;
                const normalizado = _normalizarTexto(registro[campo]);
                if (normalizado !== registro[campo]) {
                    actualizado[campo] = normalizado;
                    huboCambios = true;
                }
            });

            return actualizado;
        });

        if (huboCambios) {
            _guardar(LLAVES[nombreTabla], registrosNormalizados);
        }
    };

    /**
     * Corrige campos de sedes con reglas por patron (independiente del ID).
     */
    const _corregirSedesConPatrones = () => {
        const sedes = _obtener(LLAVES.sedesInstitucion);
        if (!Array.isArray(sedes) || sedes.length === 0) return;

        let huboCambios = false;
        const sedesCorregidas = sedes.map((sede) => {
            const actualizada = { ...sede };

            if (typeof actualizada.ciudad === 'string') {
                const ciudadLimpia = _normalizarTexto(actualizada.ciudad);
                if (/medell/i.test(ciudadLimpia)) actualizada.ciudad = 'Medell\u00EDn';
                if (/bogot/i.test(ciudadLimpia)) actualizada.ciudad = 'Bogot\u00E1';
            }

            if (typeof actualizada.nombreSede === 'string') {
                const nombreLimpio = _normalizarTexto(actualizada.nombreSede);
                if (/sede\s+medell/i.test(nombreLimpio)) actualizada.nombreSede = 'Sede Medell\u00EDn';
                if (/sede\s+principal\s+bogot/i.test(nombreLimpio)) actualizada.nombreSede = 'Sede Principal Bogot\u00E1';
            }

            if (actualizada.nombreSede !== sede.nombreSede || actualizada.ciudad !== sede.ciudad) {
                huboCambios = true;
            }

            return actualizada;
        });

        if (huboCambios) {
            _guardar(LLAVES.sedesInstitucion, sedesCorregidas);
        }
    };

    /**
     * Corrige etiquetas conocidas del seed para garantizar tildes correctas.
     */
    const _aplicarCorreccionesSeed = () => {
        const programas = _obtener(LLAVES.programasAcademicos);
        if (Array.isArray(programas) && programas.length > 0) {
            const programasCorregidos = programas.map((prog) => {
                if (prog.idPrograma === 1) return { ...prog, nombrePrograma: 'Ingenier\u00EDa de Sistemas' };
                if (prog.idPrograma === 2) return { ...prog, nombrePrograma: 'Maestr\u00EDa en Administraci\u00F3n' };
                if (prog.idPrograma === 3) return { ...prog, nombrePrograma: 'Tecnolog\u00EDa en Desarrollo de Software' };
                return prog;
            });
            _guardar(LLAVES.programasAcademicos, programasCorregidos);
        }

        const sedes = _obtener(LLAVES.sedesInstitucion);
        if (Array.isArray(sedes) && sedes.length > 0) {
            const sedesCorregidas = sedes.map((sede) => {
                if (sede.idSede === 1) {
                    return {
                        ...sede,
                        nombreSede: 'Sede Ciudad Universitaria',
                        ciudad: 'Medell\u00EDn'
                    };
                }
                if (sede.idSede === 2) {
                    return {
                        ...sede,
                        nombreSede: 'Campus Las Vegas',
                        ciudad: 'Medell\u00EDn'
                    };
                }
                if (sede.idSede === 3) {
                    return {
                        ...sede,
                        nombreSede: 'Sede Principal Bogot\u00E1',
                        ciudad: 'Bogot\u00E1'
                    };
                }
                if (sede.idSede === 4) {
                    return {
                        ...sede,
                        nombreSede: 'Sede Medell\u00EDn',
                        ciudad: 'Medell\u00EDn'
                    };
                }
                return sede;
            });
            _guardar(LLAVES.sedesInstitucion, sedesCorregidas);
        }

        const instituciones = _obtener(LLAVES.instituciones);
        if (Array.isArray(instituciones) && instituciones.length > 0) {
            const institucionesCorregidas = instituciones.map((inst) => {
                if (inst.idInstitucion === 3) {
                    return { ...inst, nombreOficial: 'Corporaci\u00F3n Universitaria Minuto de Dios' };
                }
                return inst;
            });
            _guardar(LLAVES.instituciones, institucionesCorregidas);
        }
    };

    /**
     * Corrige registros previamente guardados en localStorage si tienen textos corruptos.
     */
    const _normalizarDatosGuardados = () => {
        _normalizarRegistrosTexto('instituciones', ['nombreOficial', 'naturaleza']);
        _normalizarRegistrosTexto('sedesInstitucion', ['nombreSede', 'ciudad', 'direccionFisica']);
        _normalizarRegistrosTexto('usuarios', ['nombreCompleto', 'rol']);
        _normalizarRegistrosTexto('programasAcademicos', ['nombrePrograma', 'nivelFormacion']);
        _normalizarRegistrosTexto('detallesOperacion', ['modalidad', 'jornada']);

        _corregirSedesConPatrones();
        _aplicarCorreccionesSeed();
    };

    /**
     * Ejecuta reparacion manual de textos corruptos.
     */
    const repararTextosCorruptos = () => {
        _normalizarDatosGuardados();
    };

    // =====================================================================
    // OPERACIONES CRUD GENÉRICAS
    // =====================================================================

    /**
     * Obtiene todos los registros de una tabla.
     * @param {string} nombreTabla - Nombre de la tabla (debe existir en LLAVES)
     * @returns {Array} Todos los registros de la tabla
     */
    const obtenerTodos = (nombreTabla) => {
        return _obtener(LLAVES[nombreTabla]);
    };

    /**
     * Busca un registro por su ID.
     * @param {string} nombreTabla - Nombre de la tabla
     * @param {string} campoId - Nombre del campo ID
     * @param {number} valorId - Valor del ID a buscar
     * @returns {Object|null} El registro encontrado o null
     */
    const obtenerPorId = (nombreTabla, campoId, valorId) => {
        const registros = _obtener(LLAVES[nombreTabla]);
        return registros.find(r => r[campoId] === valorId) || null;
    };

    /**
     * Crea un nuevo registro en una tabla.
     * Asigna automáticamente el ID y las fechas de creación.
     * @param {string} nombreTabla - Nombre de la tabla
     * @param {string} campoId - Nombre del campo ID
     * @param {Object} nuevoRegistro - Datos del nuevo registro (sin ID)
     * @returns {Object} El registro creado con su ID asignado
     */
    const crear = (nombreTabla, campoId, nuevoRegistro) => {
        const registros = _obtener(LLAVES[nombreTabla]);
        nuevoRegistro[campoId] = _generarId(registros, campoId);
        nuevoRegistro.fechaCreacion = _fechaActual();
        nuevoRegistro.fechaModificacion = _fechaActual();
        registros.push(nuevoRegistro);
        _guardar(LLAVES[nombreTabla], registros);
        return nuevoRegistro;
    };

    /**
     * Actualiza un registro existente buscándolo por su ID.
     * Solo modifica los campos proporcionados en datosActualizados.
     * Simula el ON UPDATE CURRENT_TIMESTAMP de MySQL.
     * @param {string} nombreTabla - Nombre de la tabla
     * @param {string} campoId - Nombre del campo ID
     * @param {number} valorId - ID del registro a actualizar
     * @param {Object} datosActualizados - Campos a modificar
     * @returns {boolean} true si se actualizó, false si no se encontró
     */
    const actualizar = (nombreTabla, campoId, valorId, datosActualizados) => {
        const registros = _obtener(LLAVES[nombreTabla]);
        const indice = registros.findIndex(r => r[campoId] === valorId);
        if (indice === -1) return false;

        // Fusiona los datos existentes con los nuevos (spread operator)
        registros[indice] = {
            ...registros[indice],
            ...datosActualizados,
            fechaModificacion: _fechaActual()
        };
        _guardar(LLAVES[nombreTabla], registros);
        return true;
    };

    /**
     * Elimina un registro por su ID.
     * Simula un DELETE en MySQL (eliminación física, no soft-delete).
     * @param {string} nombreTabla - Nombre de la tabla
     * @param {string} campoId - Nombre del campo ID
     * @param {number} valorId - ID del registro a eliminar
     * @returns {boolean} true si se eliminó, false si no se encontró
     */
    const eliminar = (nombreTabla, campoId, valorId) => {
        const registros = _obtener(LLAVES[nombreTabla]);
        const registrosFiltrados = registros.filter(r => r[campoId] !== valorId);
        if (registrosFiltrados.length === registros.length) return false;
        _guardar(LLAVES[nombreTabla], registrosFiltrados);
        return true;
    };

    /**
     * Busca registros que coincidan con un filtro.
     * Permite búsquedas parciales en campos de texto.
     * @param {string} nombreTabla - Nombre de la tabla
     * @param {string} campo - Campo en el que buscar
     * @param {string} valor - Valor a buscar (búsqueda parcial)
     * @returns {Array} Registros que coinciden con la búsqueda
     */
    const buscar = (nombreTabla, campo, valor) => {
        const registros = _obtener(LLAVES[nombreTabla]);
        const valorMinusculas = String(valor).toLowerCase();
        return registros.filter(r =>
            String(r[campo]).toLowerCase().includes(valorMinusculas)
        );
    };

    /**
     * Obtiene registros relacionados por una llave foránea.
     * Simula un JOIN simple de MySQL.
     * @param {string} nombreTabla - Nombre de la tabla hija
     * @param {string} campoFk - Nombre del campo de llave foránea
     * @param {number} valorFk - Valor de la llave foránea
     * @returns {Array} Registros relacionados
     */
    const obtenerPorForanea = (nombreTabla, campoFk, valorFk) => {
        const registros = _obtener(LLAVES[nombreTabla]);
        return registros.filter(r => r[campoFk] === valorFk);
    };

    // =====================================================================
    // DATOS INICIALES (SEED DATA)
    // Equivalente al INSERT INTO del script SQL.
    // Solo se ejecuta si localStorage está vacío.
    // =====================================================================

    /**
     * Carga los datos de prueba si no existen datos previos.
     * Replica el módulo de SEED DATA del script SQL original.
     */
    const cargarDatosIniciales = () => {
        // Aplica correcciones sobre datos existentes antes de evaluar seed.
        _normalizarDatosGuardados();

        // Solo carga datos si la tabla de instituciones está vacía
        if (_obtener(LLAVES.instituciones).length > 0) return;

        // --- Instituciones (equivale a la tabla 'instituciones') ---
        const instituciones = [
            {
                idInstitucion: 1,
                nombreOficial: 'Universidad de Antioquia',
                naturaleza: 'PUBLICA',
                sitioWeb: 'https://www.udea.edu.co',
                fechaRegistro: _fechaActual()
            },
            {
                idInstitucion: 2,
                nombreOficial: 'Universidad EAFIT',
                naturaleza: 'PRIVADA',
                sitioWeb: 'https://www.eafit.edu.co',
                fechaRegistro: _fechaActual()
            },
            {
                idInstitucion: 3,
                nombreOficial: 'Corporación Universitaria Minuto de Dios',
                naturaleza: 'PRIVADA',
                sitioWeb: 'https://www.uniminuto.edu',
                fechaRegistro: _fechaActual()
            }
        ];
        _guardar(LLAVES.instituciones, instituciones);

        // --- Sedes (equivale a la tabla 'sedes_institucion') ---
        const sedes = [
            {
                idSede: 1,
                idInstitucion: 1,
                nombreSede: 'Sede Ciudad Universitaria',
                ciudad: 'Medell\u00EDn',
                direccionFisica: 'Cl. 67 #53-108',
                esSedePrincipal: true
            },
            {
                idSede: 2,
                idInstitucion: 2,
                nombreSede: 'Campus Las Vegas',
                ciudad: 'Medell\u00EDn',
                direccionFisica: 'Carrera 49 #7 Sur-50',
                esSedePrincipal: true
            },
            {
                idSede: 3,
                idInstitucion: 3,
                nombreSede: 'Sede Principal Bogotá',
                ciudad: 'Bogotá',
                direccionFisica: 'Cl. 81B #72B-70',
                esSedePrincipal: true
            },
            {
                idSede: 4,
                idInstitucion: 3,
                nombreSede: 'Sede Medell\u00EDn',
                ciudad: 'Medell\u00EDn',
                direccionFisica: 'Cra. 87 #30-65 Bello',
                esSedePrincipal: false
            }
        ];
        _guardar(LLAVES.sedesInstitucion, sedes);

        // --- Usuarios (equivale a la tabla 'usuarios') ---
        const usuarios = [
            {
                idUsuario: 1,
                nombreCompleto: 'Administrador Sistema',
                correoElectronico: 'admin@hubeducativo.co',
                hashContrasena: '$2b$12$hashEjemplo1',
                rol: 'ADMIN',
                estaActivo: true,
                fechaCreacion: _fechaActual(),
                fechaModificacion: _fechaActual()
            },
            {
                idUsuario: 2,
                nombreCompleto: 'Edwin Rios Sanchez',
                correoElectronico: 'edwin@uniminuto.edu.co',
                hashContrasena: '$2b$12$hashEjemplo2',
                rol: 'ESTUDIANTE',
                estaActivo: true,
                fechaCreacion: _fechaActual(),
                fechaModificacion: _fechaActual()
            },
            {
                idUsuario: 3,
                nombreCompleto: 'EAFIT Admisiones',
                correoElectronico: 'admisiones@eafit.edu.co',
                hashContrasena: '$2b$12$hashEjemplo3',
                rol: 'UNIVERSIDAD',
                estaActivo: true,
                fechaCreacion: _fechaActual(),
                fechaModificacion: _fechaActual()
            }
        ];
        _guardar(LLAVES.usuarios, usuarios);

        // --- Programas Académicos (equivale a la tabla 'programas_academicos') ---
        const programas = [
            {
                idPrograma: 1,
                idInstitucion: 1,
                codigoSnies: '12345',
                nombrePrograma: 'Ingeniería de Sistemas',
                nivelFormacion: 'PREGRADO',
                totalSemestres: 10,
                estaActivo: true
            },
            {
                idPrograma: 2,
                idInstitucion: 2,
                codigoSnies: '67890',
                nombrePrograma: 'Maestría en Administración',
                nivelFormacion: 'MAESTRIA',
                totalSemestres: 4,
                estaActivo: true
            },
            {
                idPrograma: 3,
                idInstitucion: 3,
                codigoSnies: '11223',
                nombrePrograma: 'Tecnología en Desarrollo de Software',
                nivelFormacion: 'PREGRADO',
                totalSemestres: 6,
                estaActivo: true
            }
        ];
        _guardar(LLAVES.programasAcademicos, programas);

        // --- Detalles de Operación (equivale a la tabla 'detalles_operacion') ---
        const detalles = [
            {
                idDetalle: 1,
                idPrograma: 1,
                costoSemestre: 4500000,
                modalidad: 'PRESENCIAL',
                jornada: 'DIURNA',
                estudiantesActivos: 1800,
                fechaActualizacion: _fechaActual()
            },
            {
                idDetalle: 2,
                idPrograma: 2,
                costoSemestre: 12000000,
                modalidad: 'PRESENCIAL',
                jornada: 'FINES_DE_SEMANA',
                estudiantesActivos: 120,
                fechaActualizacion: _fechaActual()
            },
            {
                idDetalle: 3,
                idPrograma: 3,
                costoSemestre: 2800000,
                modalidad: 'VIRTUAL',
                jornada: 'MIXTA',
                estudiantesActivos: 650,
                fechaActualizacion: _fechaActual()
            }
        ];
        _guardar(LLAVES.detallesOperacion, detalles);

        // --- Calidad y Beneficios (equivale a la tabla 'calidad_beneficios') ---
        const calidad = [
            {
                idBeneficio: 1,
                idPrograma: 1,
                acreditacionAltaCalidad: true,
                ofreceBecas: true,
                dobleTitulacion: false,
                requiereSegundoIdioma: true
            },
            {
                idBeneficio: 2,
                idPrograma: 2,
                acreditacionAltaCalidad: true,
                ofreceBecas: false,
                dobleTitulacion: true,
                requiereSegundoIdioma: true
            },
            {
                idBeneficio: 3,
                idPrograma: 3,
                acreditacionAltaCalidad: false,
                ofreceBecas: true,
                dobleTitulacion: false,
                requiereSegundoIdioma: false
            }
        ];
        _guardar(LLAVES.calidadBeneficios, calidad);

        console.log('Datos iniciales cargados exitosamente en localStorage.');
    };

    /**
     * Sobrescribe todas las tablas locales usando datos sincronizados de la API.
     * @param {Object} datosApi - Estructura de tablas en formato del frontend
     */
    const hidratarDesdeApi = (datosApi) => {
        if (!datosApi || typeof datosApi !== 'object') return;

        Object.keys(LLAVES).forEach((nombreTabla) => {
            const llaveStorage = LLAVES[nombreTabla];
            const registros = Array.isArray(datosApi[nombreTabla]) ? datosApi[nombreTabla] : [];
            _guardar(llaveStorage, registros);
        });

        // Normaliza tildes y caracteres corruptos luego de sincronizar.
        _normalizarDatosGuardados();
    };

    // =====================================================================
    // API PÚBLICA DEL MÓDULO
    // Solo se exponen las funciones que otros módulos necesitan.
    // =====================================================================
    return {
        obtenerTodos,
        obtenerPorId,
        crear,
        actualizar,
        eliminar,
        buscar,
        obtenerPorForanea,
        cargarDatosIniciales,
        hidratarDesdeApi,
        repararTextosCorruptos
    };
})();
