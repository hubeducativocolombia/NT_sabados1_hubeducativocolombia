-- =========================================================================
-- PROYECTO  : Hub Educativo Colombia
-- MOTOR     : MySQL 8.4 InnoDB
-- AUTORES   : Diana Zapata Ortega, Yuliana Chica Correa,
--             Samuel Zapata Valcarcel, Edwin Rios Sanchez
-- DESCRIPCION: Datos de prueba (10 registros por tabla)
-- FECHA     : Mayo 16, 2026
-- REQUISITO : Ejecutar primero db-hubeducativocolombia-v3.2.sql
-- =========================================================================

USE dbhubeducativocolombia;

SET FOREIGN_KEY_CHECKS = 0;

-- =========================================================================
-- SECCION 1: INSTITUCIONES (10 registros)
-- Sin dependencias FK. Referenciada por sedes y programas.
-- =========================================================================

INSERT INTO instituciones (idinstitucion, nombreoficial, naturaleza, sitioweb, fecharegistro)
VALUES
    (1,  'Universidad Nacional de Colombia',       'PUBLICA', 'https://unal.edu.co', '1990-0-01'),
    (2,  'Universidad de Antioquia',               'PUBLICA', 'https://www.udea.edu.co', '1990-0-01'),
    (3,  'Universidad de los Andes',               'PRIVADA', 'https://uniandes.edu.co', '1990-0-01'),
    (4,  'Pontificia Universidad Javeriana',       'PRIVADA', 'https://www.javeriana.edu.co', '1990-0-01'),
    (5,  'Universidad del Valle',                  'PUBLICA', 'https://www.univalle.edu.co', '1990-0-01'),
    (6,  'Universidad EAFIT',                      'PRIVADA', 'https://www.eafit.edu.co', '1990-0-01'),
    (7,  'Universidad Industrial de Santander',    'PUBLICA', 'https://uis.edu.co', '1990-0-01'),
    (8,  'Universidad del Norte',                  'PRIVADA', 'https://www.uninorte.edu.co', '1990-0-01'),
    (9,  'Universidad Tecnologica de Pereira',     'PUBLICA', 'https://www.utp.edu.co', '1990-0-01'),
    (10, 'Universidad de Medellin',                'MIXTA',   NULL, '1990-0-01');


-- =========================================================================
-- SECCION 2: USUARIOS (10 registros)
-- Tabla independiente. Hashes bcrypt de ejemplo (no corresponden a
-- contrasenas reales).
-- =========================================================================

INSERT INTO usuarios (idusuario, nombrecompleto, correoelectronico, hashcontrasena, rol, ocupacion, estaactivo, fechacreacion, fechamodificacion)
VALUES
    (1,  'Carlos Alberto Ramirez Lopez',    'carlos.ramirez@hubeducativo.co',  '$2a$12$LJ3m4ys8Gk0vZbXrQp7Wn.TYvGhF9kN1mRdXsA5oP3qBcU6wJxHe2', 'MASTER', 'ARQUITECTO', TRUE, '1990-0-01', '1990-0-01'),
    (2,  'Maria Fernanda Gutierrez Ossa',   'maria.gutierrez@unal.edu.co',     '$2a$12$Kp9r2Ws5Ht7vQeM1Xn3Yb.UdFgH8jL0kOiAzC4wR6tNsE7mVxJa5', 'ADMIN', 'UNIVERSIDAD', TRUE, '1990-0-01', '1990-0-01'),
    (3,  'Juan David Herrera Castano',      'juan.herrera@udea.edu.co',        '$2a$12$Mn7q1Xt4Gs6uPdL0Yw2Xa.RbDfG5hJ8kNiCzA3vQ9sOtE6lWxKc4', 'ADMIN', 'UNIVERSIDAD', TRUE, '1990-0-01', '1990-0-01'),
    (4,  'Laura Valentina Gomez Restrepo',  'laura.gomez@correo.com',          '$2a$12$Np8s3Yu5Ht9wReN2Zx4Yc.SdEgH6iK7lOjBzD5wR0tPuF8mXyLd3', 'USER', 'ASPIRANTE',   TRUE, '1990-0-01', '1990-0-01'),
    (5,  'Andres Felipe Morales Diaz',      'andres.morales@correo.com',       '$2a$12$Oq0t4Zv6Ju1xSfO3Ay5Zd.TeHhI7jL8mPkCzE6xS1uQvG9nYzMe4', 'USER', 'ASPIRANTE',   TRUE, '1990-0-01', '1990-0-01'),
    (6,  'Diana Patricia Zapata Ortega',    'diana.zapata@hubeducativo.co',    '$2a$12$Pr1u5Aw7Kv2yTgP4Bz6Ae.UfIiJ8kM9nQlDzF7yT2vRwH0oZaNf5', 'MASTER', 'ARQUITECTO', TRUE, '1990-0-01', '1990-0-01'),
    (7,  'Santiago Mejia Velez',            'santiago.mejia@eafit.edu.co',     '$2a$12$Qs2v6Bx8Lw3zUhQ5Ca7Bf.VgJjK9lN0oRmEzG8zU3wSxI1pAbOg6', 'ADMIN', 'UNIVERSIDAD', TRUE, '1990-0-01', '1990-0-01'),
    (8,  'Valentina Rios Sanchez',          'valentina.rios@correo.com',       '$2a$12$Rt3w7Cy9Mx4aViR6Db8Cg.WhKkL0mO1pSnFzH9aV4xTyJ2qBcPh7', 'USER', 'ASPIRANTE',   TRUE, '1990-0-01', '1990-0-01'),
    (9,  'Camilo Andres Duque Marin',       'camilo.duque@correo.com',         '$2a$12$Su4x8Dz0Ny5bWjS7Ec9Dh.XiLlM1nP2qToGzI0bW5yUzK3rCdQi8', 'USER', 'ASPIRANTE',   FALSE, '1990-0-01', '1990-0-01'),
    (10, 'Natalia Andrea Posada Gil',       'natalia.posada@uninorte.edu.co',  '$2a$12$Tv5y9Ea1Oz6cXkT8Fd0Ei.YjMmN2oQ3rUpHzJ1cX6zVaL4sDeSj9', 'ADMIN', 'UNIVERSIDAD', TRUE, '1990-0-01', '1990-0-01');


-- =========================================================================
-- SECCION 3: SEDES INSTITUCIONES (10 registros)
-- FK: idinstitucion -> instituciones(idinstitucion)
-- La institucion 1 (UNAL) tiene 2 sedes para demostrar relacion 1:N.
-- =========================================================================

INSERT INTO sedesinstituciones (idsede, idinstitucion, nombresede, ciudad, direccionfisica, essedeprincipal)
VALUES
    (1,  1, 'Sede Bogota',                  'Bogota',       'Carrera 45 No. 26-85',        TRUE),
    (2,  1, 'Sede Medellin',                'Medellin',     'Calle 59A No. 63-20',         FALSE),
    (3,  2, 'Ciudad Universitaria',          'Medellin',     'Calle 67 No. 53-108',         TRUE),
    (4,  3, 'Sede Principal',                'Bogota',       'Carrera 1 No. 18A-12',        TRUE),
    (5,  4, 'Sede Bogota',                   'Bogota',       'Carrera 7 No. 40-62',         TRUE),
    (6,  5, 'Sede Melendez',                 'Cali',         'Calle 13 No. 100-00',         TRUE),
    (7,  6, 'Campus Poblado',                'Medellin',     'Carrera 49 No. 7 Sur-50',     TRUE),
    (8,  7, 'Sede Principal Bucaramanga',    'Bucaramanga',  'Carrera 27 Calle 9',          TRUE),
    (9,  8, 'Campus Puerto Colombia',        'Barranquilla', 'Km 5 Via Puerto Colombia',    TRUE),
    (10, 9, 'Campus La Julita',              'Pereira',      'Carrera 27 No. 10-02',        TRUE);


-- =========================================================================
-- SECCION 4: PROGRAMAS ACADEMICOS (10 registros)
-- FK: idinstitucion -> instituciones(idinstitucion)
-- La institucion 1 (UNAL) tiene 2 programas (ids 1 y 10).
-- Codigo SNIES: entre 5 y 10 caracteres.
-- =========================================================================

INSERT INTO programasacademicos (idprograma, idinstitucion, codigosnies, nombreprograma, nivelformacion, totalsemestres, estaactivo)
VALUES
    (1,  1, '10723',  'Ingenieria de Sistemas y Computacion',  'PREGRADO',         10, TRUE),
    (2,  2, '15284',  'Medicina',                              'PREGRADO',         12, TRUE),
    (3,  3, '91413',  'Maestria en Ciencia de Datos',          'MAESTRIA',          4, TRUE),
    (4,  4, '106832', 'Especializacion en Derecho Laboral',    'ESPECIALIZACION',   2, TRUE),
    (5,  5, '20547',  'Ingenieria Industrial',                 'PREGRADO',         10, TRUE),
    (6,  6, '53168',  'Doctorado en Administracion',           'DOCTORADO',         8, TRUE),
    (7,  7, '84291',  'Ingenieria de Petroleos',               'PREGRADO',         10, TRUE),
    (8,  8, '62370',  'Psicologia',                            'PREGRADO',         10, TRUE),
    (9,  9, '113056', 'Diplomado en Gestion de Proyectos',     'DIPLOMADO',         1, TRUE),
    (10, 1, '30915',  'Maestria en Ingenieria de Software',    'MAESTRIA',          4, FALSE);


-- =========================================================================
-- SECCION 5: DETALLES OPERACION (10 registros, relacion 1:1 con programas)
-- FK: idprograma -> programasacademicos(idprograma)
-- Costos en pesos colombianos (COP). Publicas ~1.6M-2.3M, privadas ~8.5M-15M.
-- =========================================================================

INSERT INTO detallesoperacion (iddetalle, idprograma, costosemestre, modalidad, jornada, USERsactivos, fechaactualizacion)
VALUES
    (1,  1,   1850000.00, 'PRESENCIAL', 'DIURNA',         320, '1990-0-01'),
    (2,  2,   2100000.00, 'PRESENCIAL', 'DIURNA',         480, '1990-0-01'),
    (3,  3,  12500000.00, 'HIBRIDO',    'NOCTURNA',        85, '1990-0-01'),
    (4,  4,   9800000.00, 'PRESENCIAL', 'NOCTURNA',        42, '1990-0-01'),
    (5,  5,   1650000.00, 'PRESENCIAL', 'DIURNA',         275, '1990-0-01'),
    (6,  6,  15000000.00, 'VIRTUAL',    'MIXTA',           30, '1990-0-01'),
    (7,  7,   2300000.00, 'PRESENCIAL', 'DIURNA',         190, '1990-0-01'),
    (8,  8,   8500000.00, 'PRESENCIAL', 'DIURNA',         350, '1990-0-01'),
    (9,  9,   3200000.00, 'VIRTUAL',    'FINESDESEMANA',  120, '1990-0-01'),
    (10, 10, 11000000.00, 'HIBRIDO',    'NOCTURNA',         0, '1990-0-01');


-- =========================================================================
-- SECCION 6: CALIDAD Y BENEFICIOS (10 registros, relacion 1:1 con programas)
-- FK: idprograma -> programasacademicos(idprograma)
-- =========================================================================

INSERT INTO calidadbeneficios (idbeneficio, idprograma, acreditacionaltacalidad, ofrecebecas, dobletitulacion, requieresegundoidioma)
VALUES
    (1,  1,  TRUE,  TRUE,  FALSE, TRUE),
    (2,  2,  TRUE,  TRUE,  FALSE, TRUE),
    (3,  3,  TRUE,  TRUE,  TRUE,  TRUE),
    (4,  4,  FALSE, FALSE, FALSE, TRUE),
    (5,  5,  TRUE,  TRUE,  FALSE, TRUE),
    (6,  6,  TRUE,  TRUE,  TRUE,  TRUE),
    (7,  7,  TRUE,  FALSE, FALSE, TRUE),
    (8,  8,  TRUE,  TRUE,  TRUE,  TRUE),
    (9,  9,  FALSE, FALSE, FALSE, FALSE),
    (10, 10, FALSE, FALSE, TRUE,  TRUE);


SET FOREIGN_KEY_CHECKS = 1;

-- =========================================================================
-- CONSULTAS DE VERIFICACION
-- =========================================================================

SELECT 'instituciones'        AS tabla, COUNT(*) AS registros FROM instituciones
UNION ALL
SELECT 'usuarios',                      COUNT(*)              FROM usuarios
UNION ALL
SELECT 'sedesinstituciones',            COUNT(*)              FROM sedesinstituciones
UNION ALL
SELECT 'programasacademicos',           COUNT(*)              FROM programasacademicos
UNION ALL
SELECT 'detallesoperacion',             COUNT(*)              FROM detallesoperacion
UNION ALL
SELECT 'calidadbeneficios',             COUNT(*)              FROM calidadbeneficios;
