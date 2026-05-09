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
-- MÓDULO 5: DATOS DE PRUEBA (SEED DATA)
-- Insertar datos mínimos para verificar el esquema sin herramientas externas.
-- =========================================================================

INSERT INTO instituciones (nombre_oficial, naturaleza, sitio_web) VALUES
    ('Universidad de Antioquia',          'PUBLICA',  'https://www.udea.edu.co'),
    ('Universidad EAFIT',                 'PRIVADA',  'https://www.eafit.edu.co'),
    ('Corporación Universitaria Minuto de Dios', 'PRIVADA', 'https://www.uniminuto.edu');

INSERT INTO sedes_institucion (id_institucion, nombre_sede, ciudad, direccion_fisica, es_sede_principal) VALUES
    (1, 'Sede Ciudad Universitaria', 'Medellín',  'Cl. 67 #53-108',         1),
    (2, 'Campus Las Vegas',          'Medellín',  'Carrera 49 #7 Sur-50',   1),
    (3, 'Sede Principal Bogotá',     'Bogotá',    'Cl. 81B #72B-70',        1),
    (3, 'Sede Medellín',             'Medellín',  'Cra. 87 #30-65 Bello',   0);

INSERT INTO usuarios (nombre_completo, correo_electronico, hash_contrasena, rol) VALUES
    ('Administrador Sistema',  'admin@hubeducativo.co',  '$2b$12$hashEjemplo1', 'ADMIN'),
    ('Edwin Rios Sanchez',     'edwin@uniminuto.edu.co', '$2b$12$hashEjemplo2', 'ESTUDIANTE'),
    ('EAFIT Admisiones',       'admisiones@eafit.edu.co','$2b$12$hashEjemplo3', 'UNIVERSIDAD');

INSERT INTO programas_academicos (id_institucion, codigo_snies, nombre_programa, nivel_formacion, total_semestres) VALUES
    (1, '12345',  'Ingeniería de Sistemas',     'PREGRADO',       10),
    (2, '67890',  'Maestría en Administración', 'MAESTRIA',        4),
    (3, '11223',  'Tecnología en Desarrollo de Software', 'PREGRADO', 6);

INSERT INTO detalles_operacion (id_programa, costo_semestre, modalidad, jornada, estudiantes_activos) VALUES
    (1,  4500000.00, 'PRESENCIAL', 'DIURNA',          1800),
    (2, 12000000.00, 'PRESENCIAL', 'FINES_DE_SEMANA',  120),
    (3,  2800000.00, 'VIRTUAL',    'MIXTA',             650);

INSERT INTO calidad_beneficios (id_programa, acreditacion_alta_calidad, ofrece_becas, doble_titulacion, requiere_segundo_idioma) VALUES
    (1, 1, 1, 0, 1),
    (2, 1, 0, 1, 1),
    (3, 0, 1, 0, 0);


-- =========================================================================
-- CONSULTAS DE VERIFICACIÓN
-- Ejecutar estas consultas para validar que el esquema funciona correctamente.
-- =========================================================================

-- 1. Ver todos los programas con su institución y costo
-- SELECT
--     i.nombre_oficial,
--     p.nombre_programa,
--     p.nivel_formacion,
--     d.modalidad,
--     d.costo_semestre
-- FROM programas_academicos p
-- JOIN instituciones i ON p.id_institucion = i.id_institucion
-- JOIN detalles_operacion d ON p.id_programa = d.id_programa
-- ORDER BY i.nombre_oficial, p.nombre_programa;

-- 2. Filtrar programas virtuales con acreditación de alta calidad
-- SELECT
--     i.nombre_oficial,
--     p.nombre_programa,
--     d.costo_semestre
-- FROM programas_academicos p
-- JOIN instituciones i    ON p.id_institucion = i.id_institucion
-- JOIN detalles_operacion d ON p.id_programa = d.id_programa
-- JOIN calidad_beneficios c ON p.id_programa = c.id_programa
-- WHERE d.modalidad = 'VIRTUAL'
--   AND c.acreditacion_alta_calidad = 1;

-- =========================================================================
-- FIN DEL SCRIPT
-- =========================================================================