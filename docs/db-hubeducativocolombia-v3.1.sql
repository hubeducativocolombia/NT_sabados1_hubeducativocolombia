-- =========================================================================
-- PROYECTO  : Hub Educativo Colombia
-- MOTOR     : MySQL 8.4 InnoDB
-- AUTORES   : Diana Zapata Ortega, Yuliana Chica Correa,
--             Samuel Zapata Valcarcel, Edwin Rios Sanchez
-- DESCRIPCIÓN: Esquema relacional de base de datos (v3.1)
-- FECHA     : Mayo 15, 2026
-- CAMBIOS v3.1:
--   - Collation migrada a utf8mb4_0900_ai_ci (default MySQL 8.0+, más rápida)
--   - TINYINT(1) reemplazado por BOOLEAN (alias equivalente, más semántico)
--   - DEFAULT 1/0 migrado a TRUE/FALSE para coherencia con BOOLEAN
--   - FOREIGN_KEY_CHECKS: 0 al inicio, 1 al final del script (práctica correcta)
--   - CHECK de codigosnies corregido: BETWEEN 5 AND 10 (alineado con SNIES MEN)
--   - Nota de diseño sobre relación programa-sede sin FK explícita
-- =========================================================================

-- =========================================================================
-- CONFIGURACIÓN INICIAL
-- =========================================================================

-- Evita errores si se ejecuta el script más de una vez
DROP DATABASE IF EXISTS dbhubeducativocolombia;

-- utf8mb4 soporta tildes, ñ y emojis (importante para datos en español).
-- utf8mb4_0900_ai_ci es el default de MySQL 8.0+ y usa Unicode 9.0:
-- más rápida en comparaciones e índices que la antigua unicode_ci de MySQL 5.x.
CREATE DATABASE dbhubeducativocolombia
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_0900_ai_ci;

USE dbhubeducativocolombia;

-- Se deshabilita al inicio para que el script sea robusto ante reordenamientos
-- de tablas en versiones futuras. Se restaura al final del script.
SET FOREIGN_KEY_CHECKS = 0;

-- =========================================================================
-- MÓDULO 1: SEGURIDAD Y ACCESO
-- Gestiona quién puede ingresar a la plataforma y con qué permisos.
-- =========================================================================

CREATE TABLE usuarios (
    -- CORRECCIÓN: Se usa BIGINT en lugar de INT para soportar crecimiento
    --             futuro (más de 2 mil millones de registros con INT no es
    --             suficiente para plataformas nacionales).
    idusuario        BIGINT        NOT NULL AUTO_INCREMENT,
    nombrecompleto   VARCHAR(150)  NOT NULL,
    correoelectronico VARCHAR(150) NOT NULL,
    -- NOTA: El hash de la contraseña lo genera el backend (bcrypt, argon2).
    --       La BD solo almacena el resultado; NUNCA texto plano.
    hashcontrasena   VARCHAR(255)  NOT NULL,
    -- CORRECCIÓN: Se cambia ENUM a VARCHAR con CHECK para mayor flexibilidad
    --             y evitar migraciones si se agregan roles nuevos.
    --             Roles válidos: ADMIN, UNIVERSIDAD, ASPIRANTE.
    rol               VARCHAR(30)   NOT NULL,
    -- BOOLEAN es alias de TINYINT(1) en MySQL; semánticamente más claro.
    -- TRUE/FALSE son alias de 1/0, respectivamente.
    estaactivo       BOOLEAN       NOT NULL DEFAULT TRUE,   -- soft-delete
    fechacreacion    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fechamodificacion DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
                                             ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT pkusuarios            PRIMARY KEY (idusuario),
    CONSTRAINT uqusuarioscorreo     UNIQUE (correoelectronico),
    -- MEJORA: Validación directa en BD para los roles permitidos
    CONSTRAINT chkusuariosrol       CHECK (rol IN ('ADMIN', 'UNIVERSIDAD', 'ASPIRANTE')),
    -- MEJORA: El correo debe tener al menos un '@' y un '.'
    CONSTRAINT chkusuarioscorreo    CHECK (correoelectronico LIKE '%@%.%')
) ENGINE = InnoDB COMMENT = 'Usuarios con acceso a la plataforma (RBAC)';


-- =========================================================================
-- MÓDULO 2: INSTITUCIONES Y SEDES
-- Una institución puede tener varias sedes en distintas ciudades.
-- Relación: instituciones (1) ──< (N) sedesinstituciones
-- =========================================================================

CREATE TABLE instituciones (
    idinstitucion    INT          NOT NULL AUTO_INCREMENT,
    nombreoficial    VARCHAR(200) NOT NULL,
    -- CORRECCIÓN: Se cambia ENUM a VARCHAR con CHECK (mismo criterio que 'rol')
    naturaleza        VARCHAR(20)  NOT NULL,
    sitioweb         VARCHAR(255)     NULL,  -- NULL permitido: no todas tienen sitio web
    fecharegistro    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pkinstituciones           PRIMARY KEY (idinstitucion),
    CONSTRAINT uqinstitucionesnombre    UNIQUE (nombreoficial),
    CONSTRAINT chkinstitucionesnatural  CHECK (naturaleza IN ('PUBLICA', 'PRIVADA', 'MIXTA')),
    -- MEJORA: Valida formato básico de URL
    CONSTRAINT chkinstitucionesweb      CHECK (sitioweb IS NULL OR sitioweb LIKE 'http%')
) ENGINE = InnoDB COMMENT = 'Catálogo de instituciones de educación superior';


CREATE TABLE sedesinstituciones (
    idsede           INT          NOT NULL AUTO_INCREMENT,
    -- Llave foránea hacia la institución padre
    idinstitucion    INT          NOT NULL,
    nombresede       VARCHAR(150) NOT NULL,
    ciudad            VARCHAR(100) NOT NULL,
    direccionfisica  VARCHAR(255) NOT NULL,
    essedeprincipal BOOLEAN      NOT NULL DEFAULT FALSE,

    CONSTRAINT pksedes              PRIMARY KEY (idsede),
    -- MEJORA: Nombre explícito en la FK facilita diagnóstico de errores
    CONSTRAINT fksedesinstituciones
        FOREIGN KEY (idinstitucion)
        REFERENCES instituciones (idinstitucion)
        -- Si se elimina la institución, se eliminan sus sedes (integridad referencial)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    -- MEJORA: Garantiza que no existan dos sedes con el mismo nombre en la misma institución
    CONSTRAINT uqsedesnombreinstitucion  UNIQUE (idinstitucion, nombresede)
    -- NOTA DE DISEÑO: idsede actualmente no es referenciado por programasacademicos.
    --                 Si en una versión futura un programa se imparte en una sede
    --                 específica, agregar FK idsede en programasacademicos.
) ENGINE = InnoDB COMMENT = 'Sedes físicas de cada institución';


-- =========================================================================
-- MÓDULO 3: OFERTA ACADÉMICA
-- Core del negocio: programas, costos, modalidades y beneficios.
--
-- Diseño:
--   instituciones (1) ──< (N) programasacademicos
--   programasacademicos (1) ──── (1) detallesoperacion
--   programasacademicos (1) ──── (1) calidadbeneficios
-- =========================================================================

CREATE TABLE programasacademicos (
    idprograma       INT          NOT NULL AUTO_INCREMENT,
    idinstitucion    INT          NOT NULL,
    -- CORRECCIÓN: El código SNIES en Colombia tiene entre 5 y 10 dígitos.
    --             VARCHAR(20) es correcto; CHECK alineado con la regla del MEN.
    codigosnies      VARCHAR(20)  NOT NULL,
    nombreprograma   VARCHAR(200) NOT NULL,
    nivelformacion   VARCHAR(30)  NOT NULL,
    -- CORRECCIÓN: TINYINT es suficiente (máximo 15 semestres en Colombia)
    totalsemestres   TINYINT      NOT NULL,
    estaactivo       BOOLEAN      NOT NULL DEFAULT TRUE,

    CONSTRAINT pkprogramas             PRIMARY KEY (idprograma),
    CONSTRAINT uqprogramassnies       UNIQUE (codigosnies),
    CONSTRAINT fkprogramasinstitucion
        FOREIGN KEY (idinstitucion)
        REFERENCES instituciones (idinstitucion)
        -- RESTRICT impide borrar una institución que tiene programas activos
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT chkprogramasnivel CHECK (
        nivelformacion IN (
            'PREGRADO', 'ESPECIALIZACION', 'MAESTRIA',
            'DOCTORADO', 'DIPLOMADO', 'CURSO', 'TALLER'
        )
    ),
    -- MEJORA: Evita semestres con valores ilógicos
    CONSTRAINT chkprogramassemestres  CHECK (totalsemestres BETWEEN 1 AND 20),
    -- CORRECCIÓN v3.1: SNIES Colombia exige entre 5 y 10 dígitos (antes >= 4)
    CONSTRAINT chkprogramassnies      CHECK (CHAR_LENGTH(codigosnies) BETWEEN 5 AND 10)
) ENGINE = InnoDB COMMENT = 'Programas académicos registrados ante el MEN (SNIES)';


CREATE TABLE detallesoperacion (
    iddetalle          INT            NOT NULL AUTO_INCREMENT,
    -- Relación 1 a 1 con programasacademicos (UNIQUE garantiza esto)
    idprograma         INT            NOT NULL,
    -- CORRECCIÓN: DECIMAL(12,2) correcto para valores monetarios en pesos colombianos.
    --             Se agrega CHECK para evitar costos negativos o cero.
    costosemestre      DECIMAL(12, 2) NOT NULL,
    modalidad           VARCHAR(20)    NOT NULL,
    jornada             VARCHAR(25)    NOT NULL,
    -- MEJORA: No puede haber estudiantes negativos
    estudiantesactivos INT            NOT NULL DEFAULT 0,
    fechaactualizacion DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP
                                                ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT pkdetalles              PRIMARY KEY (iddetalle),
    CONSTRAINT uqdetallesprograma     UNIQUE (idprograma),
    CONSTRAINT fkdetallesprograma
        FOREIGN KEY (idprograma)
        REFERENCES programasacademicos (idprograma)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT chkdetallesmodalidad  CHECK (modalidad IN ('PRESENCIAL', 'VIRTUAL', 'HIBRIDO')),
    CONSTRAINT chkdetallesjornada    CHECK (
        jornada IN ('DIURNA', 'NOCTURNA', 'FINESDESEMANA', 'MIXTA')
    ),
    -- MEJORA: El costo debe ser positivo (mínimo $1 COP)
    CONSTRAINT chkdetallescosto      CHECK (costosemestre > 0),
    CONSTRAINT chkdetallesestudiantes CHECK (estudiantesactivos >= 0)
) ENGINE = InnoDB COMMENT = 'Información operativa y financiera del programa (cambia por semestre)';


CREATE TABLE calidadbeneficios (
    idbeneficio              INT      NOT NULL AUTO_INCREMENT,
    -- Relación 1 a 1 con programasacademicos
    idprograma               INT      NOT NULL,
    -- CORRECCIÓN: Se usa BOOLEAN con DEFAULT explícito en todos los campos.
    --             Evita NULL inesperados y es semánticamente más claro que TINYINT(1).
    acreditacionaltacalidad BOOLEAN   NOT NULL DEFAULT FALSE,
    ofrecebecas              BOOLEAN  NOT NULL DEFAULT FALSE,
    dobletitulacion          BOOLEAN  NOT NULL DEFAULT FALSE,
    -- MEJORA: Se renombra 'exigeIngles' a 'requieresegundoidioma' (más genérico)
    requieresegundoidioma   BOOLEAN   NOT NULL DEFAULT TRUE,

    CONSTRAINT pkcalidad          PRIMARY KEY (idbeneficio),
    CONSTRAINT uqcalidadprograma UNIQUE (idprograma),
    CONSTRAINT fkcalidadprograma
        FOREIGN KEY (idprograma)
        REFERENCES programasacademicos (idprograma)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE = InnoDB COMMENT = 'Atributos de calidad y beneficios que influyen en la decisión del estudiante';


-- =========================================================================
-- MÓDULO 4: ÍNDICES DE RENDIMIENTO
-- Los índices aceleran las búsquedas (SELECT) a costa de un pequeño
-- espacio adicional en disco. Solo se crean en columnas usadas en filtros (WHERE).
-- =========================================================================

-- Búsquedas frecuentes: "programas en Medellín", "sedes en Bogotá"
CREATE INDEX idxsedesciudad
    ON sedesinstituciones (ciudad);

-- Búsquedas frecuentes: "mostrar solo PREGRADO", "filtrar MAESTRÍAS"
CREATE INDEX idxprogramasnivel
    ON programasacademicos (nivelformacion);

-- Búsquedas frecuentes: "programas VIRTUALES disponibles"
CREATE INDEX idxoperacionmodalidad
    ON detallesoperacion (modalidad);

-- MEJORA: Índice compuesto para búsquedas combinadas ciudad + modalidad
--         Ej: "Ingenierías presenciales en Medellín"
CREATE INDEX idxprogramasactivos
    ON programasacademicos (idinstitucion, estaactivo);

-- Restaurar validación de llaves foráneas al finalizar el script
SET FOREIGN_KEY_CHECKS = 1;
