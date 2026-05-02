/* =========================================================================
   PROYECTO  : Hub Educativo Colombia - SPA
   ARCHIVO   : modelos.js
   DESCRIPCIÓN: Capa de lógica de negocio. Contiene las funciones que
                validan datos y coordinan las operaciones CRUD del módulo
                Almacenamiento. Cada "modelo" corresponde a una tabla
                de la base de datos original.
   AUTORES   : Diana Zapata, Yuliana Chica, Samuel Zapata, Edwin Rios
   FECHA     : Marzo 2026
   ========================================================================= */

/* =========================================================================
   MODELO: Instituciones
   Corresponde a la tabla 'instituciones' de la BD.
   Gestiona las instituciones de educación superior.
   ========================================================================= */
const ModeloInstituciones = (() => {
    const TABLA = 'instituciones';
    const CAMPO_ID = 'idInstitucion';

    // Valores permitidos para naturaleza (equivale al CHECK en la BD)
    const NATURALEZAS_VALIDAS = ['PUBLICA', 'PRIVADA', 'MIXTA'];

    /**
     * Obtiene todas las instituciones registradas.
     * @returns {Array} Lista de instituciones
     */
    const obtenerTodas = () => Almacenamiento.obtenerTodos(TABLA);

    /**
     * Obtiene una institución por su ID.
     * @param {number} id - ID de la institución
     * @returns {Object|null} La institución o null si no existe
     */
    const obtenerPorId = (id) => Almacenamiento.obtenerPorId(TABLA, CAMPO_ID, id);

    /**
     * Valida los datos de una institución antes de guardarla.
     * Aplica las mismas restricciones que los CHECK de la BD.
     * @param {Object} datos - Datos a validar
     * @returns {Object} Objeto con 'valido' (boolean) y 'errores' (Array)
     */
    const validar = (datos) => {
        const errores = [];

        // nombre_oficial NOT NULL - VARCHAR(200)
        if (!datos.nombreOficial || datos.nombreOficial.trim().length === 0) {
            errores.push('El nombre oficial es obligatorio.');
        }

        // CHECK (naturaleza IN ('PUBLICA', 'PRIVADA', 'MIXTA'))
        if (!NATURALEZAS_VALIDAS.includes(datos.naturaleza)) {
            errores.push('La naturaleza debe ser PUBLICA, PRIVADA o MIXTA.');
        }

        // CHECK (sitio_web IS NULL OR sitio_web LIKE 'http%')
        if (datos.sitioWeb && !datos.sitioWeb.startsWith('http')) {
            errores.push('El sitio web debe comenzar con http:// o https://');
        }

        return { valido: errores.length === 0, errores };
    };

    /**
     * Crea una nueva institución.
     * @param {Object} datos - Datos de la institución
     * @returns {Object} Resultado con 'exitoso', 'datos' o 'errores'
     */
    const crear = (datos) => {
        const validacion = validar(datos);
        if (!validacion.valido) {
            return { exitoso: false, errores: validacion.errores };
        }
        const institucion = Almacenamiento.crear(TABLA, CAMPO_ID, {
            nombreOficial: datos.nombreOficial.trim(),
            naturaleza: datos.naturaleza,
            sitioWeb: datos.sitioWeb ? datos.sitioWeb.trim() : null,
            fechaRegistro: new Date().toISOString()
        });
        return { exitoso: true, datos: institucion };
    };

    /**
     * Actualiza una institución existente.
     * @param {number} id - ID de la institución
     * @param {Object} datos - Datos a actualizar
     * @returns {Object} Resultado de la operación
     */
    const actualizar = (id, datos) => {
        const validacion = validar(datos);
        if (!validacion.valido) {
            return { exitoso: false, errores: validacion.errores };
        }
        const exito = Almacenamiento.actualizar(TABLA, CAMPO_ID, id, {
            nombreOficial: datos.nombreOficial.trim(),
            naturaleza: datos.naturaleza,
            sitioWeb: datos.sitioWeb ? datos.sitioWeb.trim() : null
        });
        return { exitoso: exito, errores: exito ? [] : ['Institución no encontrada.'] };
    };

    /**
     * Elimina una institución.
     * Verifica que no tenga programas asociados (simula ON DELETE RESTRICT).
     * @param {number} id - ID de la institución
     * @returns {Object} Resultado de la operación
     */
    const eliminar = (id) => {
        // Verificar programas asociados (simula RESTRICT de la FK)
        const programas = Almacenamiento.obtenerPorForanea(
            'programasAcademicos', 'idInstitucion', id
        );
        if (programas.length > 0) {
            return {
                exitoso: false,
                errores: ['No se puede eliminar: tiene programas académicos asociados.']
            };
        }
        // Eliminar sedes asociadas (simula ON DELETE CASCADE de la FK)
        const sedes = Almacenamiento.obtenerPorForanea('sedesInstitucion', 'idInstitucion', id);
        sedes.forEach(sede => {
            Almacenamiento.eliminar('sedesInstitucion', 'idSede', sede.idSede);
        });
        const exito = Almacenamiento.eliminar(TABLA, CAMPO_ID, id);
        return { exitoso: exito, errores: exito ? [] : ['Institución no encontrada.'] };
    };

    return { obtenerTodas, obtenerPorId, crear, actualizar, eliminar, validar, NATURALEZAS_VALIDAS };
})();


/* =========================================================================
   MODELO: Sedes de Institución
   Corresponde a la tabla 'sedes_institucion' de la BD.
   ========================================================================= */
const ModeloSedes = (() => {
    const TABLA = 'sedesInstitucion';
    const CAMPO_ID = 'idSede';

    /**
     * Obtiene todas las sedes de una institución específica.
     * @param {number} idInstitucion - ID de la institución
     * @returns {Array} Lista de sedes
     */
    const obtenerPorInstitucion = (idInstitucion) => {
        return Almacenamiento.obtenerPorForanea(TABLA, 'idInstitucion', idInstitucion);
    };

    /**
     * Valida los datos de una sede.
     * @param {Object} datos - Datos a validar
     * @returns {Object} Resultado de validación
     */
    const validar = (datos) => {
        const errores = [];
        if (!datos.nombreSede || datos.nombreSede.trim().length === 0) {
            errores.push('El nombre de la sede es obligatorio.');
        }
        if (!datos.ciudad || datos.ciudad.trim().length === 0) {
            errores.push('La ciudad es obligatoria.');
        }
        if (!datos.direccionFisica || datos.direccionFisica.trim().length === 0) {
            errores.push('La dirección física es obligatoria.');
        }
        if (!datos.idInstitucion) {
            errores.push('Debe seleccionar una institución.');
        }
        return { valido: errores.length === 0, errores };
    };

    /**
     * Crea una nueva sede.
     * @param {Object} datos - Datos de la sede
     * @returns {Object} Resultado de la operación
     */
    const crear = (datos) => {
        const validacion = validar(datos);
        if (!validacion.valido) {
            return { exitoso: false, errores: validacion.errores };
        }
        const sede = Almacenamiento.crear(TABLA, CAMPO_ID, {
            idInstitucion: datos.idInstitucion,
            nombreSede: datos.nombreSede.trim(),
            ciudad: datos.ciudad.trim(),
            direccionFisica: datos.direccionFisica.trim(),
            esSedePrincipal: datos.esSedePrincipal || false
        });
        return { exitoso: true, datos: sede };
    };

    /**
     * Elimina una sede.
     * @param {number} id - ID de la sede
     * @returns {boolean} true si se eliminó correctamente
     */
    const eliminar = (id) => Almacenamiento.eliminar(TABLA, CAMPO_ID, id);

    return { obtenerPorInstitucion, crear, eliminar, validar };
})();


/* =========================================================================
   MODELO: Usuarios
   Corresponde a la tabla 'usuarios' de la BD.
   ========================================================================= */
const ModeloUsuarios = (() => {
    const TABLA = 'usuarios';
    const CAMPO_ID = 'idUsuario';

    // CHECK (rol IN ('ADMIN', 'UNIVERSIDAD', 'ESTUDIANTE'))
    const ROLES_VALIDOS = ['ADMIN', 'UNIVERSIDAD', 'ESTUDIANTE'];

    /**
     * Obtiene todos los usuarios registrados.
     * @returns {Array} Lista de usuarios
     */
    const obtenerTodos = () => Almacenamiento.obtenerTodos(TABLA);

    /**
     * Obtiene un usuario por su ID.
     * @param {number} id - ID del usuario
     * @returns {Object|null} El usuario o null
     */
    const obtenerPorId = (id) => Almacenamiento.obtenerPorId(TABLA, CAMPO_ID, id);

    /**
     * Valida los datos de un usuario.
     * Aplica las mismas restricciones que los CHECK y UNIQUE de la BD.
     * @param {Object} datos - Datos a validar
     * @param {number|null} idExcluir - ID a excluir en validación de unicidad
     * @returns {Object} Resultado de validación
     */
    const validar = (datos, idExcluir = null) => {
        const errores = [];

        // nombre_completo NOT NULL
        if (!datos.nombreCompleto || datos.nombreCompleto.trim().length === 0) {
            errores.push('El nombre completo es obligatorio.');
        }

        // correo_electronico NOT NULL + CHECK (LIKE '%@%.%')
        if (!datos.correoElectronico || datos.correoElectronico.trim().length === 0) {
            errores.push('El correo electrónico es obligatorio.');
        } else if (!datos.correoElectronico.includes('@') || !datos.correoElectronico.includes('.')) {
            errores.push('El correo electrónico debe tener un formato válido (ejemplo@dominio.com).');
        }

        // UNIQUE (correo_electronico) - Verificar que no exista otro usuario con el mismo correo
        if (datos.correoElectronico) {
            const existente = Almacenamiento.buscar(TABLA, 'correoElectronico', datos.correoElectronico.trim());
            const duplicado = existente.find(u =>
                u.correoElectronico.toLowerCase() === datos.correoElectronico.trim().toLowerCase() &&
                u[CAMPO_ID] !== idExcluir
            );
            if (duplicado) {
                errores.push('Ya existe un usuario con ese correo electrónico.');
            }
        }

        // CHECK (rol IN ('ADMIN', 'UNIVERSIDAD', 'ESTUDIANTE'))
        if (!ROLES_VALIDOS.includes(datos.rol)) {
            errores.push('El rol debe ser ADMIN, UNIVERSIDAD o ESTUDIANTE.');
        }

        return { valido: errores.length === 0, errores };
    };

    /**
     * Crea un nuevo usuario.
     * @param {Object} datos - Datos del usuario
     * @returns {Object} Resultado de la operación
     */
    const crear = (datos) => {
        const validacion = validar(datos);
        if (!validacion.valido) {
            return { exitoso: false, errores: validacion.errores };
        }
        const usuario = Almacenamiento.crear(TABLA, CAMPO_ID, {
            nombreCompleto: datos.nombreCompleto.trim(),
            correoElectronico: datos.correoElectronico.trim(),
            hashContrasena: datos.hashContrasena || '$2b$12$hashPorDefecto',
            rol: datos.rol,
            estaActivo: datos.estaActivo !== undefined ? datos.estaActivo : true
        });
        return { exitoso: true, datos: usuario };
    };

    /**
     * Actualiza un usuario existente.
     * @param {number} id - ID del usuario
     * @param {Object} datos - Datos a actualizar
     * @returns {Object} Resultado de la operación
     */
    const actualizar = (id, datos) => {
        const validacion = validar(datos, id);
        if (!validacion.valido) {
            return { exitoso: false, errores: validacion.errores };
        }
        const exito = Almacenamiento.actualizar(TABLA, CAMPO_ID, id, {
            nombreCompleto: datos.nombreCompleto.trim(),
            correoElectronico: datos.correoElectronico.trim(),
            rol: datos.rol,
            estaActivo: datos.estaActivo
        });
        return { exitoso: exito, errores: exito ? [] : ['Usuario no encontrado.'] };
    };

    /**
     * Elimina un usuario.
     * @param {number} id - ID del usuario
     * @returns {Object} Resultado de la operación
     */
    const eliminar = (id) => {
        const exito = Almacenamiento.eliminar(TABLA, CAMPO_ID, id);
        return { exitoso: exito, errores: exito ? [] : ['Usuario no encontrado.'] };
    };

    return { obtenerTodos, obtenerPorId, crear, actualizar, eliminar, validar, ROLES_VALIDOS };
})();


/* =========================================================================
   MODELO: Programas Académicos
   Corresponde a las tablas 'programas_academicos', 'detalles_operacion'
   y 'calidad_beneficios' de la BD.
   ========================================================================= */
const ModeloProgramas = (() => {
    const TABLA = 'programasAcademicos';
    const CAMPO_ID = 'idPrograma';

    // CHECK (nivel_formacion IN (...))
    const NIVELES_VALIDOS = [
        'PREGRADO', 'ESPECIALIZACION', 'MAESTRIA',
        'DOCTORADO', 'DIPLOMADO', 'CURSO', 'TALLER'
    ];

    // CHECK (modalidad IN (...))
    const MODALIDADES_VALIDAS = ['PRESENCIAL', 'VIRTUAL', 'HIBRIDO'];

    // CHECK (jornada IN (...))
    const JORNADAS_VALIDAS = ['DIURNA', 'NOCTURNA', 'FINES_DE_SEMANA', 'MIXTA'];

    /**
     * Obtiene todos los programas con sus datos completos.
     * Simula un JOIN entre programas, detalles, calidad e instituciones.
     * @returns {Array} Programas con datos enriquecidos
     */
    const obtenerTodosCompletos = () => {
        const programas = Almacenamiento.obtenerTodos(TABLA);
        const detalles = Almacenamiento.obtenerTodos('detallesOperacion');
        const calidad = Almacenamiento.obtenerTodos('calidadBeneficios');
        const instituciones = Almacenamiento.obtenerTodos('instituciones');

        // Simula el JOIN: une programas con sus detalles, calidad e institución
        return programas.map(programa => {
            const detalle = detalles.find(d => d.idPrograma === programa.idPrograma) || {};
            const beneficio = calidad.find(c => c.idPrograma === programa.idPrograma) || {};
            const institucion = instituciones.find(i => i.idInstitucion === programa.idInstitucion) || {};
            return {
                ...programa,
                detalles: detalle,
                calidad: beneficio,
                nombreInstitucion: institucion.nombreOficial || 'Sin institución'
            };
        });
    };

    /**
     * Obtiene un programa completo por su ID.
     * @param {number} id - ID del programa
     * @returns {Object|null} Programa con datos completos o null
     */
    const obtenerCompletoPorId = (id) => {
        const programa = Almacenamiento.obtenerPorId(TABLA, CAMPO_ID, id);
        if (!programa) return null;

        const detalles = Almacenamiento.obtenerPorForanea('detallesOperacion', 'idPrograma', id);
        const calidad = Almacenamiento.obtenerPorForanea('calidadBeneficios', 'idPrograma', id);
        const institucion = Almacenamiento.obtenerPorId('instituciones', 'idInstitucion', programa.idInstitucion);

        return {
            ...programa,
            detalles: detalles[0] || {},
            calidad: calidad[0] || {},
            nombreInstitucion: institucion ? institucion.nombreOficial : 'Sin institución'
        };
    };

    /**
     * Valida los datos de un programa académico.
     * @param {Object} datos - Datos a validar
     * @returns {Object} Resultado de validación
     */
    const validar = (datos) => {
        const errores = [];

        if (!datos.idInstitucion) {
            errores.push('Debe seleccionar una institución.');
        }
        // CHECK (CHAR_LENGTH(codigo_snies) >= 4)
        if (!datos.codigoSnies || datos.codigoSnies.trim().length < 4) {
            errores.push('El código SNIES debe tener al menos 4 caracteres.');
        }
        if (!datos.nombrePrograma || datos.nombrePrograma.trim().length === 0) {
            errores.push('El nombre del programa es obligatorio.');
        }
        // CHECK (nivel_formacion IN (...))
        if (!NIVELES_VALIDOS.includes(datos.nivelFormacion)) {
            errores.push('El nivel de formación no es válido.');
        }
        // CHECK (total_semestres BETWEEN 1 AND 20)
        const semestres = parseInt(datos.totalSemestres);
        if (isNaN(semestres) || semestres < 1 || semestres > 20) {
            errores.push('Los semestres deben estar entre 1 y 20.');
        }
        // CHECK (modalidad IN (...))
        if (!MODALIDADES_VALIDAS.includes(datos.modalidad)) {
            errores.push('La modalidad no es válida.');
        }
        // CHECK (jornada IN (...))
        if (!JORNADAS_VALIDAS.includes(datos.jornada)) {
            errores.push('La jornada no es válida.');
        }
        // CHECK (costo_semestre > 0)
        const costo = parseFloat(datos.costoSemestre);
        if (isNaN(costo) || costo <= 0) {
            errores.push('El costo del semestre debe ser mayor a 0.');
        }

        return { valido: errores.length === 0, errores };
    };

    /**
     * Crea un programa académico completo.
     * Crea registros en las tres tablas: programa, detalles y calidad.
     * Simula una transacción de MySQL.
     * @param {Object} datos - Datos completos del programa
     * @returns {Object} Resultado de la operación
     */
    const crear = (datos) => {
        const validacion = validar(datos);
        if (!validacion.valido) {
            return { exitoso: false, errores: validacion.errores };
        }

        // 1. Crear programa académico
        const programa = Almacenamiento.crear(TABLA, CAMPO_ID, {
            idInstitucion: parseInt(datos.idInstitucion),
            codigoSnies: datos.codigoSnies.trim(),
            nombrePrograma: datos.nombrePrograma.trim(),
            nivelFormacion: datos.nivelFormacion,
            totalSemestres: parseInt(datos.totalSemestres),
            estaActivo: true
        });

        // 2. Crear detalles de operación (relación 1:1)
        Almacenamiento.crear('detallesOperacion', 'idDetalle', {
            idPrograma: programa.idPrograma,
            costoSemestre: parseFloat(datos.costoSemestre),
            modalidad: datos.modalidad,
            jornada: datos.jornada,
            estudiantesActivos: parseInt(datos.estudiantesActivos) || 0,
            fechaActualizacion: new Date().toISOString()
        });

        // 3. Crear calidad y beneficios (relación 1:1)
        Almacenamiento.crear('calidadBeneficios', 'idBeneficio', {
            idPrograma: programa.idPrograma,
            acreditacionAltaCalidad: datos.acreditacionAltaCalidad || false,
            ofreceBecas: datos.ofreceBecas || false,
            dobleTitulacion: datos.dobleTitulacion || false,
            requiereSegundoIdioma: datos.requiereSegundoIdioma || false
        });

        return { exitoso: true, datos: programa };
    };

    /**
     * Actualiza un programa y sus datos relacionados.
     * @param {number} id - ID del programa
     * @param {Object} datos - Datos a actualizar
     * @returns {Object} Resultado de la operación
     */
    const actualizar = (id, datos) => {
        const validacion = validar(datos);
        if (!validacion.valido) {
            return { exitoso: false, errores: validacion.errores };
        }

        // Actualizar programa principal
        Almacenamiento.actualizar(TABLA, CAMPO_ID, id, {
            idInstitucion: parseInt(datos.idInstitucion),
            codigoSnies: datos.codigoSnies.trim(),
            nombrePrograma: datos.nombrePrograma.trim(),
            nivelFormacion: datos.nivelFormacion,
            totalSemestres: parseInt(datos.totalSemestres),
            estaActivo: datos.estaActivo !== undefined ? datos.estaActivo : true
        });

        // Actualizar detalles de operación
        const detalles = Almacenamiento.obtenerPorForanea('detallesOperacion', 'idPrograma', id);
        if (detalles.length > 0) {
            Almacenamiento.actualizar('detallesOperacion', 'idDetalle', detalles[0].idDetalle, {
                costoSemestre: parseFloat(datos.costoSemestre),
                modalidad: datos.modalidad,
                jornada: datos.jornada,
                estudiantesActivos: parseInt(datos.estudiantesActivos) || 0
            });
        }

        // Actualizar calidad y beneficios
        const calidad = Almacenamiento.obtenerPorForanea('calidadBeneficios', 'idPrograma', id);
        if (calidad.length > 0) {
            Almacenamiento.actualizar('calidadBeneficios', 'idBeneficio', calidad[0].idBeneficio, {
                acreditacionAltaCalidad: datos.acreditacionAltaCalidad || false,
                ofreceBecas: datos.ofreceBecas || false,
                dobleTitulacion: datos.dobleTitulacion || false,
                requiereSegundoIdioma: datos.requiereSegundoIdioma || false
            });
        }

        return { exitoso: true };
    };

    /**
     * Elimina un programa y sus datos relacionados.
     * Simula ON DELETE CASCADE de la BD.
     * @param {number} id - ID del programa
     * @returns {Object} Resultado de la operación
     */
    const eliminar = (id) => {
        // Eliminar en cascada (detalles y calidad)
        const detalles = Almacenamiento.obtenerPorForanea('detallesOperacion', 'idPrograma', id);
        detalles.forEach(d => Almacenamiento.eliminar('detallesOperacion', 'idDetalle', d.idDetalle));

        const calidad = Almacenamiento.obtenerPorForanea('calidadBeneficios', 'idPrograma', id);
        calidad.forEach(c => Almacenamiento.eliminar('calidadBeneficios', 'idBeneficio', c.idBeneficio));

        const exito = Almacenamiento.eliminar(TABLA, CAMPO_ID, id);
        return { exitoso: exito, errores: exito ? [] : ['Programa no encontrado.'] };
    };

    return {
        obtenerTodosCompletos, obtenerCompletoPorId, crear, actualizar, eliminar,
        validar, NIVELES_VALIDOS, MODALIDADES_VALIDAS, JORNADAS_VALIDAS
    };
})();


/* =========================================================================
   UTILIDADES DE FORMATO
   Funciones auxiliares para formateo de datos en la interfaz.
   ========================================================================= */
const Formato = (() => {
    /**
     * Formatea un número como moneda colombiana (COP).
     * Ejemplo: 4500000 → "$ 4.500.000"
     * @param {number} valor - Valor numérico
     * @returns {string} Valor formateado como moneda
     */
    const moneda = (valor) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(valor);
    };

    /**
     * Formatea una fecha ISO a formato legible en español.
     * Ejemplo: "2026-03-07T..." → "7 de marzo de 2026"
     * @param {string} fechaIso - Fecha en formato ISO 8601
     * @returns {string} Fecha formateada en español
     */
    const fecha = (fechaIso) => {
        if (!fechaIso) return 'Sin fecha';
        return new Date(fechaIso).toLocaleDateString('es-CO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    /**
     * Convierte un valor booleano a texto legible.
     * @param {boolean} valor - Valor booleano
     * @returns {string} "Sí" o "No"
     */
    const siNo = (valor) => valor ? 'Sí' : 'No';

    return { moneda, fecha, siNo };
})();
