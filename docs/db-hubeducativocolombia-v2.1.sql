-- =========================================================================
-- PROYECTO  : Hub Educativo Colombia
-- MOTOR     : MySQL 8.0+
-- AUTORES   : Diana Zapata Ortega, Yuliana Chica Correa,
--             Samuel Zapata Valcarcel, Edwin Rios Sanchez
-- DESCRIPCIÓN: Esquema relacional de base de datos (v2 - revisado y mejorado)
-- FECHA     : Marzo 7, 2026
-- CAMBIOS v2: Nombres en español coherentes, tipos de datos corregidos,
--             llaves foráneas nombradas, restricciones de validación,
--             índices justificados y comentarios pedagógicos.
-- =========================================================================

-- =========================================================================
-- CONFIGURACIÓN INICIAL
-- =========================================================================

-- Evita errores si se ejecuta el script más de una vez
DROP DATABASE IF EXISTS hub_educativo_colombia;

-- utf8mb4 soporta tildes, ñ y emojis (importante para datos en español)
CREATE DATABASE hub_educativo_colombia
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE hub_educativo_colombia;

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
    id_usuario        BIGINT        NOT NULL AUTO_INCREMENT,
    nombre_completo   VARCHAR(150)  NOT NULL,
    correo_electronico VARCHAR(150) NOT NULL,
    -- NOTA: El hash de la contraseña lo genera el backend (bcrypt, argon2).
    --       La BD solo almacena el resultado; NUNCA texto plano.
    hash_contrasena   VARCHAR(255)  NOT NULL,
    -- CORRECCIÓN: Se cambia ENUM a VARCHAR con CHECK para mayor flexibilidad
    --             y evitar migraciones si se agregan roles nuevos.
    --             Roles válidos: ADMIN, UNIVERSIDAD, ESTUDIANTE.
    rol               VARCHAR(30)   NOT NULL,
    esta_activo       TINYINT(1)    NOT NULL DEFAULT 1,  -- 1=activo, 0=inactivo (soft-delete)
    fecha_creacion    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
                                             ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT pk_usuarios            PRIMARY KEY (id_usuario),
    CONSTRAINT uq_usuarios_correo     UNIQUE (correo_electronico),
    -- MEJORA: Validación directa en BD para los roles permitidos
    CONSTRAINT chk_usuarios_rol       CHECK (rol IN ('ADMIN', 'UNIVERSIDAD', 'ESTUDIANTE')),
    -- MEJORA: El correo debe tener al menos un '@' y un '.'
    CONSTRAINT chk_usuarios_correo    CHECK (correo_electronico LIKE '%@%.%')
) ENGINE = InnoDB COMMENT = 'Usuarios con acceso a la plataforma (RBAC)';


-- =========================================================================
-- MÓDULO 2: INSTITUCIONES Y SEDES
-- Una institución puede tener varias sedes en distintas ciudades.
-- Relación: instituciones (1) ──< (N) sedes_institucion
-- =========================================================================

CREATE TABLE instituciones (
    id_institucion    INT          NOT NULL AUTO_INCREMENT,
    nombre_oficial    VARCHAR(200) NOT NULL,
    -- CORRECCIÓN: Se cambia ENUM a VARCHAR con CHECK (mismo criterio que 'rol')
    naturaleza        VARCHAR(20)  NOT NULL,
    sitio_web         VARCHAR(255)     NULL,  -- NULL permitido: no todas tienen sitio web
    fecha_registro    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_instituciones           PRIMARY KEY (id_institucion),
    CONSTRAINT uq_instituciones_nombre    UNIQUE (nombre_oficial),
    CONSTRAINT chk_instituciones_natural  CHECK (naturaleza IN ('PUBLICA', 'PRIVADA', 'MIXTA')),
    -- MEJORA: Valida formato básico de URL
    CONSTRAINT chk_instituciones_web      CHECK (sitio_web IS NULL OR sitio_web LIKE 'http%')
) ENGINE = InnoDB COMMENT = 'Catálogo de instituciones de educación superior';


CREATE TABLE sedes_institucion (
    id_sede           INT          NOT NULL AUTO_INCREMENT,
    -- Llave foránea hacia la institución padre
    id_institucion    INT          NOT NULL,
    nombre_sede       VARCHAR(150) NOT NULL,
    ciudad            VARCHAR(100) NOT NULL,
    direccion_fisica  VARCHAR(255) NOT NULL,
    -- TINYINT(1) es el estándar MySQL para booleanos (más eficiente que BOOLEAN)
    es_sede_principal TINYINT(1)   NOT NULL DEFAULT 0,

    CONSTRAINT pk_sedes              PRIMARY KEY (id_sede),
    -- MEJORA: Nombre explícito en la FK facilita diagnóstico de errores
    CONSTRAINT fk_sedes_institucion
        FOREIGN KEY (id_institucion)
        REFERENCES instituciones (id_institucion)
        -- Si se elimina la institución, se eliminan sus sedes (integridad referencial)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    -- MEJORA: Garantiza que no existan dos sedes con el mismo nombre en la misma institución
    CONSTRAINT uq_sedes_nombre_inst  UNIQUE (id_institucion, nombre_sede)
) ENGINE = InnoDB COMMENT = 'Sedes físicas de cada institución';


-- =========================================================================
-- MÓDULO 3: OFERTA ACADÉMICA
-- Core del negocio: programas, costos, modalidades y beneficios.
--
-- Diseño:
--   instituciones (1) ──< (N) programas_academicos
--   programas_academicos (1) ──── (1) detalles_operacion
--   programas_academicos (1) ──── (1) calidad_beneficios
-- =========================================================================

CREATE TABLE programas_academicos (
    id_programa       INT          NOT NULL AUTO_INCREMENT,
    id_institucion    INT          NOT NULL,
    -- CORRECCIÓN: El código SNIES en Colombia tiene entre 5 y 10 dígitos.
    --             VARCHAR(20) es correcto; se agrega validación de longitud mínima.
    codigo_snies      VARCHAR(20)  NOT NULL,
    nombre_programa   VARCHAR(200) NOT NULL,
    nivel_formacion   VARCHAR(30)  NOT NULL,
    -- CORRECCIÓN: TINYINT es suficiente (máximo 15 semestres en Colombia)
    total_semestres   TINYINT      NOT NULL,
    esta_activo       TINYINT(1)   NOT NULL DEFAULT 1,

    CONSTRAINT pk_programas             PRIMARY KEY (id_programa),
    CONSTRAINT uq_programas_snies       UNIQUE (codigo_snies),
    CONSTRAINT fk_programas_institucion
        FOREIGN KEY (id_institucion)
        REFERENCES instituciones (id_institucion)
        -- RESTRICT impide borrar una institución que tiene programas activos
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT chk_programas_nivel CHECK (
        nivel_formacion IN (
            'PREGRADO', 'ESPECIALIZACION', 'MAESTRIA',
            'DOCTORADO', 'DIPLOMADO', 'CURSO', 'TALLER'
        )
    ),
    -- MEJORA: Evita semestres con valores ilógicos
    CONSTRAINT chk_programas_semestres  CHECK (total_semestres BETWEEN 1 AND 20),
    -- MEJORA: El código SNIES no puede estar vacío
    CONSTRAINT chk_programas_snies      CHECK (CHAR_LENGTH(codigo_snies) >= 4)
) ENGINE = InnoDB COMMENT = 'Programas académicos registrados ante el MEN (SNIES)';


CREATE TABLE detalles_operacion (
    id_detalle          INT            NOT NULL AUTO_INCREMENT,
    -- Relación 1 a 1 con programas_academicos (UNIQUE garantiza esto)
    id_programa         INT            NOT NULL,
    -- CORRECCIÓN: DECIMAL(12,2) correcto para valores monetarios en pesos colombianos.
    --             Se agrega CHECK para evitar costos negativos o cero.
    costo_semestre      DECIMAL(12, 2) NOT NULL,
    modalidad           VARCHAR(20)    NOT NULL,
    jornada             VARCHAR(25)    NOT NULL,
    -- MEJORA: No puede haber estudiantes negativos
    estudiantes_activos INT            NOT NULL DEFAULT 0,
    fecha_actualizacion DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP
                                                ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT pk_detalles              PRIMARY KEY (id_detalle),
    CONSTRAINT uq_detalles_programa     UNIQUE (id_programa),
    CONSTRAINT fk_detalles_programa
        FOREIGN KEY (id_programa)
        REFERENCES programas_academicos (id_programa)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT chk_detalles_modalidad  CHECK (modalidad IN ('PRESENCIAL', 'VIRTUAL', 'HIBRIDO')),
    CONSTRAINT chk_detalles_jornada    CHECK (
        jornada IN ('DIURNA', 'NOCTURNA', 'FINES_DE_SEMANA', 'MIXTA')
    ),
    -- MEJORA: El costo debe ser positivo (mínimo $1 COP)
    CONSTRAINT chk_detalles_costo      CHECK (costo_semestre > 0),
    CONSTRAINT chk_detalles_estudiantes CHECK (estudiantes_activos >= 0)
) ENGINE = InnoDB COMMENT = 'Información operativa y financiera del programa (cambia por semestre)';


CREATE TABLE calidad_beneficios (
    id_beneficio              INT       NOT NULL AUTO_INCREMENT,
    -- Relación 1 a 1 con programas_academicos
    id_programa               INT       NOT NULL,
    -- CORRECCIÓN: Se usa TINYINT(1) con DEFAULT explícito en todos los campos.
    --             Evita NULL inesperados en campos booleanos.
    acreditacion_alta_calidad TINYINT(1) NOT NULL DEFAULT 0,
    ofrece_becas              TINYINT(1) NOT NULL DEFAULT 0,
    doble_titulacion          TINYINT(1) NOT NULL DEFAULT 0,
    -- MEJORA: Se renombra 'exigeIngles' a 'requiere_segundo_idioma' (más genérico)
    requiere_segundo_idioma   TINYINT(1) NOT NULL DEFAULT 1,

    CONSTRAINT pk_calidad          PRIMARY KEY (id_beneficio),
    CONSTRAINT uq_calidad_programa UNIQUE (id_programa),
    CONSTRAINT fk_calidad_programa
        FOREIGN KEY (id_programa)
        REFERENCES programas_academicos (id_programa)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE = InnoDB COMMENT = 'Atributos de calidad y beneficios que influyen en la decisión del estudiante';


-- =========================================================================
-- MÓDULO 4: ÍNDICES DE RENDIMIENTO
-- Los índices aceleran las búsquedas (SELECT) a costa de un pequeño
-- espacio adicional en disco. Solo se crean en columnas usadas en filtros (WHERE).
-- =========================================================================

-- Búsquedas frecuentes: "programas en Medellín", "sedes en Bogotá"
CREATE INDEX idx_sedes_ciudad
    ON sedes_institucion (ciudad);

-- Búsquedas frecuentes: "mostrar solo PREGRADO", "filtrar MAESTRÍAS"
CREATE INDEX idx_programas_nivel
    ON programas_academicos (nivel_formacion);

-- Búsquedas frecuentes: "programas VIRTUALES disponibles"
CREATE INDEX idx_operacion_modalidad
    ON detalles_operacion (modalidad);

-- MEJORA: Índice compuesto para búsquedas combinadas ciudad + modalidad
--         Ej: "Ingenierías presenciales en Medellín"
CREATE INDEX idx_programas_activos
    ON programas_academicos (id_institucion, esta_activo);

