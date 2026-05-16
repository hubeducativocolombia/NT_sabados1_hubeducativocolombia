-- =========================================================================
-- PROYECTO  : Hub Educativo Colombia
-- MOTOR     : MySQL 8.0+
-- AUTORES   : Diana Zapata Ortega, Yuliana Chica Correa,
--             Samuel Zapata Valcarcel, Edwin Rios Sanchez
-- DESCRIPCIÓN: Esquema relacional de base de datos (v2 - revisado y mejorado)
-- FECHA     : Mayo 8, 2026
-- CAMBIOS v3: Nombres en español coherentes, tipos de datos corregidos,
--             llaves foráneas nombradas, restricciones de validación,
--             índices justificados y comentarios pedagógicos.
-- =========================================================================

-- =========================================================================
-- CONFIGURACIÓN INICIAL
-- =========================================================================

-- Evita errores si se ejecuta el script más de una vez
DROP DATABASE IF EXISTS dbhubeducativocolombia;

-- utf8mb4 soporta tildes, ñ y emojis (importante para datos en español)
CREATE DATABASE dbhubeducativocolombia
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE dbhubeducativocolombia;

-- Asegura que MySQL valide las llaves foráneas durante la sesión
SET FOREIGN_KEY_CHECKS = 1;

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
    estaactivo       TINYINT(1)    NOT NULL DEFAULT 1,  -- 1=activo, 0=inactivo (soft-delete)
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
-- Relación: instituciones (1) ──< (N) sedesinstitucion
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
    -- TINYINT(1) es el estándar MySQL para booleanos (más eficiente que BOOLEAN)
    essedeprincipal TINYINT(1)   NOT NULL DEFAULT 0,

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
    --             VARCHAR(20) es correcto; se agrega validación de longitud mínima.
    codigosnies      VARCHAR(20)  NOT NULL,
    nombreprograma   VARCHAR(200) NOT NULL,
    nivelformacion   VARCHAR(30)  NOT NULL,
    -- CORRECCIÓN: TINYINT es suficiente (máximo 15 semestres en Colombia)
    totalsemestres   TINYINT      NOT NULL,
    estaactivo       TINYINT(1)   NOT NULL DEFAULT 1,

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
    -- MEJORA: El código SNIES no puede estar vacío
    CONSTRAINT chkprogramassnies      CHECK (CHAR_LENGTH(codigosnies) >= 4)
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
    idbeneficio              INT       NOT NULL AUTO_INCREMENT,
    -- Relación 1 a 1 con programasacademicos
    idprograma               INT       NOT NULL,
    -- CORRECCIÓN: Se usa TINYINT(1) con DEFAULT explícito en todos los campos.
    --             Evita NULL inesperados en campos booleanos.
    acreditacionaltacalidad TINYINT(1) NOT NULL DEFAULT 0,
    ofrecebecas              TINYINT(1) NOT NULL DEFAULT 0,
    dobletitulacion          TINYINT(1) NOT NULL DEFAULT 0,
    -- MEJORA: Se renombra 'exigeIngles' a 'requieresegundoidioma' (más genérico)
    requieresegundoidioma   TINYINT(1) NOT NULL DEFAULT 1,

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
    ON sedesinstitucion (ciudad);

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

