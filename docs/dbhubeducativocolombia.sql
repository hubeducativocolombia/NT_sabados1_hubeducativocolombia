-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 22-05-2026 a las 21:56:10
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `dbhubeducativocolombia`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `calidadbeneficios`
--

CREATE TABLE `calidadbeneficios` (
  `idbeneficio` int(11) NOT NULL,
  `acreditacionaltacalidad` bit(1) NOT NULL,
  `dobletitulacion` bit(1) NOT NULL,
  `ofrecebecas` bit(1) NOT NULL,
  `requieresegundoidioma` bit(1) NOT NULL,
  `idprograma` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detallesoperacion`
--

CREATE TABLE `detallesoperacion` (
  `iddetalle` int(11) NOT NULL,
  `costosemestre` decimal(38,2) NOT NULL,
  `estudiantesactivos` int(11) NOT NULL,
  `fechaactualizacion` datetime(6) NOT NULL,
  `jornada` varchar(25) NOT NULL,
  `modalidad` varchar(20) NOT NULL,
  `idprograma` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `instituciones`
--

CREATE TABLE `instituciones` (
  `idinstitucion` int(11) NOT NULL,
  `fecharegistro` date NOT NULL,
  `naturaleza` varchar(20) NOT NULL,
  `nombreoficial` varchar(200) NOT NULL,
  `sitioweb` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `instituciones`
--

INSERT INTO `instituciones` (`idinstitucion`, `fecharegistro`, `naturaleza`, `nombreoficial`, `sitioweb`) VALUES
(1, '2026-05-16', 'PUBLICA', 'Universidad Nacional de Colombia', 'https://unal.edu.co'),
(2, '2026-05-16', 'PUBLICA', 'Universidad de Antioquia', 'https://www.udea.edu.co'),
(3, '2026-05-16', 'PUBLICA', 'Universidad del Valle', 'https://www.univalle.edu.co'),
(4, '2026-05-16', 'PUBLICA', 'Universidad Industrial de Santander', 'https://www.uis.edu.co'),
(5, '2026-05-16', 'PUBLICA', 'Universidad de Cartagena', 'https://www.unicartagena.edu.co'),
(6, '2026-05-16', 'PUBLICA', 'Universidad del Cauca', 'https://www.unicauca.edu.co'),
(7, '2026-05-16', 'PUBLICA', 'Universidad Tecnológica de Pereira', 'https://www.utp.edu.co'),
(8, '2026-05-16', 'PUBLICA', 'Universidad de Caldas', 'https://www.ucaldas.edu.co'),
(9, '2026-05-16', 'PUBLICA', 'Universidad del Tolima', 'https://www.ut.edu.co'),
(10, '2026-05-16', 'PUBLICA', 'Universidad Pedagógica Nacional', 'https://www.pedagogica.edu.co'),
(11, '2026-05-16', 'PUBLICA', 'Universidad Distrital Francisco José de Caldas', 'https://www.udistrital.edu.co'),
(12, '2026-05-16', 'PUBLICA', 'Universidad Militar Nueva Granada', 'https://www.unimilitar.edu.co'),
(13, '2026-05-16', 'PRIVADA', 'Pontificia Universidad Javeriana', 'https://www.javeriana.edu.co'),
(14, '2026-05-16', 'PRIVADA', 'Universidad de los Andes', 'https://uniandes.edu.co'),
(15, '2026-05-16', 'PRIVADA', 'Universidad EAFIT', 'https://www.eafit.edu.co'),
(16, '2026-05-16', 'PRIVADA', 'Universidad del Norte', 'https://www.uninorte.edu.co'),
(17, '2026-05-16', 'PRIVADA', 'Universidad Pontificia Bolivariana', 'https://www.upb.edu.co'),
(18, '2026-05-16', 'PRIVADA', 'Universidad Libre', 'https://www.unilibre.edu.co'),
(19, '2026-05-16', 'PRIVADA', 'Universidad del Rosario', 'https://urosario.edu.co'),
(20, '2026-05-16', 'PRIVADA', 'Universidad Externado de Colombia', 'https://www.uexternado.edu.co'),
(21, '2026-05-16', 'PRIVADA', 'Universidad de La Sabana', 'https://www.unisabana.edu.co'),
(22, '2026-05-16', 'PRIVADA', 'Universidad ICESI', 'https://www.icesi.edu.co'),
(23, '2026-05-16', 'PRIVADA', 'Universidad Autónoma de Occidente', 'https://www.uao.edu.co'),
(24, '2026-05-16', 'PRIVADA', 'Universidad Autónoma de Bucaramanga', 'https://www.unab.edu.co'),
(25, '2026-05-16', 'PRIVADA', 'Universidad Antonio Nariño', 'https://www.uan.edu.co'),
(26, '2026-05-16', 'PRIVADA', 'Universidad Cooperativa de Colombia', 'https://www.ucc.edu.co'),
(27, '2026-05-16', 'PRIVADA', 'Universidad Santo Tomás', 'https://www.usta.edu.co'),
(28, '2026-05-16', 'PRIVADA', 'Universidad Sergio Arboleda', 'https://www.usergioarboleda.edu.co'),
(29, '2026-05-16', 'PRIVADA', 'Universidad Simón Bolívar', 'https://www.unisimon.edu.co'),
(31, '2026-05-17', 'PRIVADA', 'Fundación Universitaria del Área Andina', 'https://www.areandina.edu.co'),
(32, '2026-05-17', 'PRIVADA', 'Fundación Universitaria Konrad Lorenz', 'https://www.konradlorenz.edu.co'),
(33, '2026-05-17', 'PRIVADA', 'Fundación Universitaria Luis Amigó', 'https://www.funlam.edu.co'),
(34, '2026-05-17', 'PRIVADA', 'Fundación Universitaria Juan N. Corpas', 'https://www.juanncorpas.edu.co'),
(35, '2026-05-17', 'PRIVADA', 'Fundación Universitaria CEIPA', 'https://www.ceipa.edu.co'),
(36, '2026-05-17', 'PRIVADA', 'Fundación Universitaria María Cano', 'https://www.fumc.edu.co'),
(37, '2026-05-17', 'PRIVADA', 'Fundación Universitaria Católica del Norte', 'https://www.ucn.edu.co'),
(38, '2026-05-17', 'PRIVADA', 'Fundación Universitaria Compensar', 'https://www.ucompensar.edu.co'),
(39, '2026-05-17', 'PRIVADA', 'Fundación Universitaria Cafam', 'https://www.unicafam.edu.co'),
(40, '2026-05-17', 'PRIVADA', 'Fundación Universitaria Los Libertadores', 'https://www.ulibertadores.edu.co'),
(41, '2026-05-17', 'PRIVADA', 'Politécnico Grancolombiano', 'https://www.poli.edu.co'),
(42, '2026-05-17', 'PUBLICA', 'Institución Universitaria Pascual Bravo', 'https://www.pascualbravo.edu.co'),
(43, '2026-05-17', 'PUBLICA', 'Institución Universitaria Colegio Mayor de Antioquia', 'https://www.colmayor.edu.co'),
(44, '2026-05-17', 'PUBLICA', 'Institución Universitaria ITM', 'https://www.itm.edu.co'),
(45, '2026-05-17', 'PRIVADA', 'Institución Universitaria Escolme', 'https://www.escolme.edu.co'),
(46, '2026-05-17', 'PRIVADA', 'Institución Universitaria Salazar y Herrera', 'https://www.iuys.edu.co'),
(47, '2026-05-17', 'PRIVADA', 'Institución Universitaria CESMAG', 'https://www.iucesmag.edu.co'),
(48, '2026-05-17', 'PUBLICA', 'Tecnológico de Antioquia', 'https://www.tdea.edu.co'),
(49, '2026-05-17', 'PUBLICA', 'Institución Universitaria Digital de Antioquia', 'https://www.iudigital.edu.co'),
(50, '2026-05-17', 'PRIVADA', 'Tecnológico Comfenalco', 'https://tecnologicocomfenalco.edu.co'),
(51, '2026-05-17', 'PRIVADA', 'Corporación Tecnológica de Bogotá', 'https://www.ctb.edu.co'),
(52, '2026-05-17', 'PRIVADA', 'Corporación Tecnológica Industrial Colombiana', 'https://www.teinco.edu.co'),
(53, '2026-05-17', 'PUBLICA', 'SENA', 'https://www.sena.edu.co'),
(54, '2026-05-17', 'PRIVADA', 'Corporación Educativa Indoamericana', 'https://indoamericana.edu.co'),
(55, '2026-05-17', 'PRIVADA', 'CESDE', 'https://www.cesde.edu.co'),
(56, '2026-05-17', 'PRIVADA', 'Politécnico Internacional', 'https://www.politecnicointernacional.edu.co'),
(57, '2026-05-17', 'PRIVADA', 'Corporación Academia Tecnológica de Colombia', 'https://atec.edu.co'),
(58, '2026-05-17', 'PUBLICA', 'Escuela Tecnológica Instituto Técnico Central', 'https://www.itc.edu.co'),
(59, '2026-05-17', 'PRIVADA', 'Escuela Tecnológica de Oriente', 'https://www.eto.edu.co'),
(60, '2026-05-17', 'PUBLICA', 'Escuela Tecnológica Instituto Técnico de Comercio', 'https://www.itc.edu.co'),
(61, '2026-05-17', 'PRIVADA', 'Escuela Tecnológica CENSA', 'https://www.censa.edu.co'),
(62, '2026-05-17', 'PUBLICA', 'Escuela Tecnológica Jesús Oviedo Pérez', 'https://etjop.edu.co'),
(63, '2026-05-17', 'PRIVADA', 'Escuela Tecnológica de Ingeniería', 'https://etengineering.edu.co'),
(64, '2026-05-17', 'PRIVADA', 'Escuela Colombiana de Carreras Industriales', 'https://www.ecci.edu.co'),
(65, '2026-05-17', 'PRIVADA', 'Escuela de Administración y Mercadotecnia del Quindío', 'https://www.eam.edu.co'),
(66, '2026-05-17', 'PUBLICA', 'Escuela Militar de Aviación Marco Fidel Suárez', 'https://www.emavi.edu.co'),
(67, '2026-05-17', 'PUBLICA', 'Escuela Naval de Cadetes Almirante Padilla', 'https://www.escuelanaval.edu.co'),
(68, '2026-05-17', 'PUBLICA', 'Escuela Superior de Administración Pública', 'https://www.esap.edu.co'),
(69, '2026-05-17', 'PUBLICA', 'Escuela de Ingenieros Militares', 'https://www.esing.edu.co'),
(70, '2026-05-17', 'PUBLICA', 'Escuela Tecnológica Agrícola de Ipiales', 'https://www.etai.edu.co'),
(71, '2026-05-17', 'PRIVADA', 'Escuela Tecnológica del Oriente', 'https://etodigital.edu.co');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `programasacademicos`
--

CREATE TABLE `programasacademicos` (
  `idprograma` int(11) NOT NULL,
  `codigosnies` varchar(20) NOT NULL,
  `estaactivo` bit(1) NOT NULL,
  `nivelformacion` varchar(30) NOT NULL,
  `nombreprograma` varchar(200) NOT NULL,
  `totalsemestres` int(11) NOT NULL,
  `idinstitucion` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `programasacademicos`
--

INSERT INTO `programasacademicos` (`idprograma`, `codigosnies`, `estaactivo`, `nivelformacion`, `nombreprograma`, `totalsemestres`, `idinstitucion`) VALUES
(166, 'UNAL001', b'1', 'PREGRADO', 'Ingeniería de Sistemas', 10, NULL),
(167, 'UNAL002', b'1', 'PREGRADO', 'Medicina', 12, NULL),
(168, 'UNAL003', b'1', 'PREGRADO', 'Arquitectura', 10, NULL),
(169, 'UNAL004', b'1', 'PREGRADO', 'Derecho', 10, NULL),
(170, 'UDEA001', b'1', 'PREGRADO', 'Ingeniería Industrial', 10, NULL),
(171, 'UDEA002', b'1', 'PREGRADO', 'Psicología', 10, NULL),
(172, 'UDEA003', b'1', 'PREGRADO', 'Odontología', 10, NULL),
(173, 'UDEA004', b'1', 'PREGRADO', 'Comunicación Social', 8, NULL),
(174, 'UNIVALLE001', b'1', 'PREGRADO', 'Ingeniería Electrónica', 10, NULL),
(175, 'UNIVALLE002', b'1', 'PREGRADO', 'Trabajo Social', 8, NULL),
(176, 'UNIVALLE003', b'1', 'PREGRADO', 'Enfermería', 10, NULL),
(177, 'UIS001', b'1', 'PREGRADO', 'Ingeniería Mecánica', 10, NULL),
(178, 'UIS002', b'1', 'PREGRADO', 'Ingeniería Civil', 10, NULL),
(179, 'UIS003', b'1', 'PREGRADO', 'Geología', 10, NULL),
(180, 'UNICARTAGENA001', b'1', 'PREGRADO', 'Química Farmacéutica', 10, NULL),
(181, 'UNICARTAGENA002', b'1', 'PREGRADO', 'Derecho', 10, NULL),
(182, 'UNICAUCA001', b'1', 'PREGRADO', 'Ingeniería Física', 10, NULL),
(183, 'UNICAUCA002', b'1', 'PREGRADO', 'Licenciatura en Matemáticas', 10, NULL),
(184, 'UTP001', b'1', 'PREGRADO', 'Ingeniería de Sistemas y Computación', 10, NULL),
(185, 'UTP002', b'1', 'TECNOLOGICO', 'Tecnología Industrial', 6, NULL),
(186, 'UCALDAS001', b'1', 'PREGRADO', 'Medicina Veterinaria', 10, NULL),
(187, 'UCALDAS002', b'1', 'PREGRADO', 'Diseño Visual', 8, NULL),
(188, 'UTOLIMA001', b'1', 'PREGRADO', 'Ingeniería Agroindustrial', 10, NULL),
(189, 'UTOLIMA002', b'1', 'PREGRADO', 'Biología', 8, NULL),
(190, 'UPN001', b'1', 'PREGRADO', 'Licenciatura en Educación Infantil', 10, NULL),
(191, 'UPN002', b'1', 'PREGRADO', 'Licenciatura en Ciencias Sociales', 10, NULL),
(192, 'UDISTRITAL001', b'1', 'PREGRADO', 'Ingeniería Catastral', 10, NULL),
(193, 'UDISTRITAL002', b'1', 'PREGRADO', 'Ingeniería Ambiental', 10, NULL),
(194, 'UMNG001', b'1', 'PREGRADO', 'Medicina', 12, NULL),
(195, 'UMNG002', b'1', 'PREGRADO', 'Ingeniería Multimedia', 10, NULL),
(196, 'JAVERIANA001', b'1', 'PREGRADO', 'Nutrición y Dietética', 10, NULL),
(197, 'JAVERIANA002', b'1', 'PREGRADO', 'Ingeniería Biomédica', 10, NULL),
(198, 'ANDES001', b'1', 'PREGRADO', 'Economía', 8, NULL),
(199, 'ANDES002', b'1', 'PREGRADO', 'Ciencia Política', 8, NULL),
(200, 'EAFIT001', b'1', 'PREGRADO', 'Negocios Internacionales', 9, NULL),
(201, 'EAFIT002', b'1', 'PREGRADO', 'Ingeniería de Diseño', 10, NULL),
(202, 'UNINORTE001', b'1', 'PREGRADO', 'Ingeniería Civil', 10, NULL),
(203, 'UNINORTE002', b'1', 'PREGRADO', 'Periodismo', 8, NULL),
(204, 'UPB001', b'1', 'PREGRADO', 'Ingeniería Aeronáutica', 10, NULL),
(205, 'UPB002', b'1', 'PREGRADO', 'Teología', 8, NULL),
(206, 'UNILIBRE001', b'1', 'PREGRADO', 'Contaduría Pública', 10, NULL),
(207, 'UNILIBRE002', b'1', 'PREGRADO', 'Derecho', 10, NULL),
(208, 'ROSARIO001', b'1', 'PREGRADO', 'Relaciones Internacionales', 8, NULL),
(209, 'ROSARIO002', b'1', 'PREGRADO', 'Administración de Negocios Internacionales', 8, NULL),
(210, 'EXTERNADO001', b'1', 'PREGRADO', 'Gobierno y Relaciones Internacionales', 8, NULL),
(211, 'EXTERNADO002', b'1', 'PREGRADO', 'Finanzas y Comercio Exterior', 8, NULL),
(212, 'SABANA001', b'1', 'PREGRADO', 'Comunicación Audiovisual', 8, NULL),
(213, 'SABANA002', b'1', 'PREGRADO', 'Administración de Mercadeo', 8, NULL),
(214, 'ICESI001', b'1', 'PREGRADO', 'Ingeniería Telemática', 10, NULL),
(215, 'ICESI002', b'1', 'PREGRADO', 'Mercadeo Internacional', 8, NULL),
(216, 'UAO001', b'1', 'PREGRADO', 'Ingeniería Informática', 10, NULL),
(217, 'UAO002', b'1', 'PREGRADO', 'Cine y Comunicación Digital', 8, NULL),
(218, 'UNAB001', b'1', 'PREGRADO', 'Administración de Empresas', 10, NULL),
(219, 'UNAB002', b'1', 'PREGRADO', 'Ingeniería Financiera', 10, NULL),
(220, 'UAN001', b'1', 'PREGRADO', 'Optometría', 10, NULL),
(221, 'UAN002', b'1', 'PREGRADO', 'Ingeniería Mecánica', 10, NULL),
(222, 'UCC001', b'1', 'PREGRADO', 'Medicina Veterinaria y Zootecnia', 10, NULL),
(223, 'UCC002', b'1', 'PREGRADO', 'Ingeniería de Telecomunicaciones', 10, NULL),
(224, 'USTA001', b'1', 'PREGRADO', 'Filosofía', 8, NULL),
(225, 'USTA002', b'1', 'PREGRADO', 'Ingeniería Mecatrónica', 10, NULL),
(226, 'SERGIO001', b'1', 'PREGRADO', 'Marketing y Negocios Internacionales', 8, NULL),
(227, 'SERGIO002', b'1', 'PREGRADO', 'Comunicación Corporativa', 8, NULL),
(228, 'UNISIMON001', b'1', 'PREGRADO', 'Fisioterapia', 10, NULL),
(229, 'UNISIMON002', b'1', 'PREGRADO', 'Ingeniería de Sistemas', 10, NULL),
(230, 'AREANDINA001', b'1', 'PREGRADO', 'Diseño de Modas', 8, NULL),
(231, 'KONRAD001', b'1', 'PREGRADO', 'Psicología', 10, NULL),
(232, 'FUNLAM001', b'1', 'PREGRADO', 'Trabajo Social', 8, NULL),
(233, 'CORPAS001', b'1', 'PREGRADO', 'Medicina', 12, NULL),
(234, 'CEIPA001', b'1', 'PREGRADO', 'Administración Financiera', 8, NULL),
(235, 'MARIACANO001', b'1', 'PREGRADO', 'Fisioterapia', 10, NULL),
(236, 'UCN001', b'1', 'PREGRADO', 'Ingeniería Informática', 10, NULL),
(237, 'COMPENSAR001', b'1', 'PREGRADO', 'Ingeniería de Software', 10, NULL),
(238, 'UNICAFAM001', b'1', 'PREGRADO', 'Administración Turística', 8, NULL),
(239, 'LIBERTADORES001', b'1', 'PREGRADO', 'Diseño Gráfico', 8, NULL),
(240, 'POLI001', b'1', 'TECNOLOGICO', 'Tecnología en Logística', 6, NULL),
(241, 'PASCUAL001', b'1', 'PREGRADO', 'Ingeniería Mecánica', 10, NULL),
(242, 'COLMAYOR001', b'1', 'PREGRADO', 'Administración en Salud', 8, NULL),
(243, 'ITM001', b'1', 'PREGRADO', 'Ingeniería Biomédica', 10, NULL),
(244, 'ESCOLME001', b'1', 'PREGRADO', 'Negocios Internacionales', 8, NULL),
(245, 'SALAZAR001', b'1', 'PREGRADO', 'Derecho', 10, NULL),
(246, 'CESMAG001', b'1', 'PREGRADO', 'Arquitectura', 10, NULL),
(247, 'TDEA001', b'1', 'TECNOLOGICO', 'Tecnología en Sistemas', 6, NULL),
(248, 'IUDIGITAL001', b'1', 'PREGRADO', 'Ingeniería de Datos', 10, NULL),
(249, 'COMFENALCO001', b'1', 'TECNOLOGICO', 'Tecnología Logística', 6, NULL),
(250, 'CTB001', b'1', 'TECNOLOGICO', 'Tecnología Industrial', 6, NULL),
(251, 'TEINCO001', b'1', 'TECNOLOGICO', 'Tecnología en Redes', 6, NULL),
(252, 'SENA001', b'1', 'TECNICO', 'Técnico en Programación de Software', 4, NULL),
(253, 'INDO001', b'1', 'TECNICO', 'Técnico Laboral Auxiliar Contable', 4, NULL),
(254, 'CESDE001', b'1', 'TECNICO', 'Técnico en Diseño Gráfico', 4, NULL),
(255, 'POLIINT001', b'1', 'TECNICO', 'Técnico en Marketing Digital', 4, NULL),
(256, 'ATEC001', b'1', 'TECNICO', 'Técnico en Sistemas', 4, NULL),
(257, 'ETITC001', b'1', 'TECNOLOGICO', 'Tecnología Electromecánica', 6, NULL),
(258, 'ETO001', b'1', 'TECNOLOGICO', 'Tecnología Industrial', 6, NULL),
(259, 'ITC001', b'1', 'TECNOLOGICO', 'Tecnología Comercial', 6, NULL),
(260, 'CENSA001', b'1', 'TECNOLOGICO', 'Tecnología en Salud Ocupacional', 6, NULL),
(261, 'JOP001', b'1', 'TECNOLOGICO', 'Tecnología Administrativa', 6, NULL),
(262, 'ETI001', b'1', 'PREGRADO', 'Ingeniería de Sistemas', 10, NULL),
(263, 'ECCI001', b'1', 'PREGRADO', 'Ingeniería Mecánica', 10, NULL),
(264, 'EAM001', b'1', 'PREGRADO', 'Mercadeo y Publicidad', 8, NULL),
(265, 'EMAVI001', b'1', 'PREGRADO', 'Ciencias Militares Aeronáuticas', 8, NULL),
(266, 'ENAP001', b'1', 'PREGRADO', 'Ingeniería Naval', 10, NULL),
(267, 'ESAP001', b'1', 'PREGRADO', 'Administración Pública', 10, NULL),
(268, 'ESING001', b'1', 'PREGRADO', 'Ingeniería Civil Militar', 10, NULL),
(269, 'ETAI001', b'1', 'TECNOLOGICO', 'Tecnología Agropecuaria', 6, NULL),
(270, 'ETORIENTE001', b'1', 'TECNOLOGICO', 'Tecnología Empresarial', 6, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sedesinstituciones`
--

CREATE TABLE `sedesinstituciones` (
  `idsede` int(11) NOT NULL,
  `ciudad` varchar(100) NOT NULL,
  `direccionfisica` varchar(255) NOT NULL,
  `essedeprincipal` bit(1) NOT NULL,
  `nombresede` varchar(150) NOT NULL,
  `idinstitucion` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `sedesinstituciones`
--

INSERT INTO `sedesinstituciones` (`idsede`, `ciudad`, `direccionfisica`, `essedeprincipal`, `nombresede`, `idinstitucion`) VALUES
(198, 'Bogotá', 'Carrera 45 #26-85', b'1', 'Sede Bogotá', NULL),
(199, 'Medellín', 'Calle 59A #63-20', b'0', 'Sede Medellín', NULL),
(200, 'Medellín', 'Calle 67 #53-108', b'1', 'Ciudad Universitaria UdeA', NULL),
(201, 'Cali', 'Calle 13 #100-00', b'1', 'Campus Meléndez', NULL),
(202, 'Bucaramanga', 'Carrera 27 Calle 9', b'1', 'Campus UIS', NULL),
(203, 'Cartagena', 'Centro Histórico', b'1', 'Campus San Agustín', NULL),
(204, 'Popayán', 'Carrera 2 #1A-25', b'1', 'Campus Tulcán', NULL),
(205, 'Pereira', 'Avenida Las Américas', b'1', 'Campus La Julita', NULL),
(206, 'Manizales', 'Calle 65 #26-10', b'1', 'Campus Palogrande', NULL),
(207, 'Ibagué', 'Barrio Santa Helena', b'1', 'Campus Santa Helena', NULL),
(208, 'Bogotá', 'Calle 72 #11-86', b'1', 'Sede Calle 72', NULL),
(209, 'Bogotá', 'Calle 13 #31-75', b'1', 'Sede Aduanilla de Paiba', NULL),
(210, 'Cajicá', 'Kilómetro 2 Vía Cajicá-Zipaquirá', b'1', 'Campus Cajicá', NULL),
(211, 'Bogotá', 'Carrera 7 #40-62', b'1', 'Campus Central Javeriana', NULL),
(212, 'Bogotá', 'Carrera 1 #18A-12', b'1', 'Campus Uniandes', NULL),
(213, 'Medellín', 'Carrera 49 #7 Sur-50', b'1', 'Campus EAFIT', NULL),
(214, 'Barranquilla', 'Km 5 Vía Puerto Colombia', b'1', 'Campus Barranquilla', NULL),
(215, 'Medellín', 'Circular 1 #70-01', b'1', 'Campus Laureles UPB', NULL),
(216, 'Bogotá', 'Calle 8 #5-80', b'1', 'Sede Candelaria', NULL),
(217, 'Bogotá', 'Calle 12 #1-17 Este', b'1', 'Claustro Externado', NULL),
(218, 'Chía', 'Autopista Norte Km 7', b'1', 'Campus Puente del Común', NULL),
(219, 'Cali', 'Calle 18 #122-135', b'1', 'Campus Pance ICESI', NULL),
(220, 'Cali', 'Km 2 Vía Cali-Jamundí', b'1', 'Campus Valle del Lili', NULL),
(221, 'Bucaramanga', 'Avenida 42 #48-11', b'1', 'Campus El Jardín', NULL),
(222, 'Bogotá', 'Calle 58A #37-94', b'1', 'Campus Sur UAN', NULL),
(223, 'Medellín', 'Carrera 73 #50A-14', b'1', 'Campus Medellín UCC', NULL),
(224, 'Bogotá', 'Carrera 9 #51-11', b'1', 'Campus Doctor Angélico', NULL),
(225, 'Bogotá', 'Calle 74 #14-14', b'1', 'Campus Principal Sergio', NULL),
(226, 'Barranquilla', 'Carrera 59 #59-65', b'1', 'Campus Barranquilla Unisimón', NULL),
(227, 'Bogotá', 'Carrera 14A #70A-34', b'1', 'Campus Principal Areandina', NULL),
(228, 'Bogotá', 'Carrera 9 Bis #62-43', b'1', 'Campus Konrad Lorenz', NULL),
(229, 'Medellín', 'Transversal 51A #67B-90', b'1', 'Campus Luis Amigó', NULL),
(230, 'Bogotá', 'Carrera 111 #159A-61', b'1', 'Campus Juan N. Corpas', NULL),
(231, 'Sabaneta', 'Calle 77 Sur #40-165', b'1', 'Campus CEIPA', NULL),
(232, 'Medellín', 'Calle 56 #41-90', b'1', 'Campus María Cano', NULL),
(233, 'Santa Rosa de Osos', 'Kilómetro 1 Vía Donmatías', b'1', 'Campus Católica del Norte', NULL),
(234, 'Bogotá', 'Avenida 68 #49A-47', b'1', 'Campus Compensar', NULL),
(235, 'Bogotá', 'Avenida Carrera 68 #90-88', b'1', 'Campus UNICAFAM', NULL),
(236, 'Bogotá', 'Carrera 16 #63A-68', b'1', 'Campus Libertadores', NULL),
(237, 'Bogotá', 'Calle 57 #3-00 Este', b'1', 'Campus Principal Poli', NULL),
(238, 'Medellín', 'Calle 73 #73A-226', b'1', 'Campus Robledo', NULL),
(239, 'Medellín', 'Carrera 78 #65-46', b'1', 'Campus Colmayor', NULL),
(240, 'Medellín', 'Calle 54A #30-01', b'1', 'Campus ITM Fraternidad', NULL),
(241, 'Medellín', 'Calle 50 #41-55', b'1', 'Campus Escolme', NULL),
(242, 'Medellín', 'Carrera 82A #30A-1', b'1', 'Campus Salazar y Herrera', NULL),
(243, 'Pasto', 'Carrera 20A #14-54', b'1', 'Campus CESMAG', NULL),
(244, 'Medellín', 'Calle 78B #72A-220', b'1', 'Campus Central TDEA', NULL),
(245, 'Medellín', 'Calle 10 Sur #50E-31', b'1', 'Campus IU Digital', NULL),
(246, 'Cartagena', 'Barrio España', b'1', 'Campus Tecnológico Comfenalco', NULL),
(247, 'Bogotá', 'Avenida Boyacá #49-29', b'1', 'Campus CTB', NULL),
(248, 'Bogotá', 'Carrera 16 #63A-68', b'1', 'Campus TEINCO', NULL),
(249, 'Medellín', 'Calle 51 #57-70', b'1', 'Centro Industrial SENA', NULL),
(250, 'Pereira', 'Carrera 7 #20-63', b'1', 'Campus Indoamericana', NULL),
(251, 'Medellín', 'Calle 49 #41-9', b'1', 'Campus CESDE', NULL),
(252, 'Bogotá', 'Avenida Caracas #63-55', b'1', 'Campus Politécnico Internacional', NULL),
(253, 'Bogotá', 'Carrera 14 #76-26', b'1', 'Campus ATEC', NULL),
(254, 'Bogotá', 'Calle 13 #16-74', b'1', 'Campus Instituto Técnico Central', NULL),
(255, 'Bucaramanga', 'Carrera 27 #35-45', b'1', 'Campus ETO', NULL),
(256, 'Bogotá', 'Carrera 10 #20-30', b'1', 'Campus Instituto Técnico Comercio', NULL),
(257, 'Medellín', 'Calle 52 #47-42', b'1', 'Campus CENSA', NULL),
(258, 'Bogotá', 'Carrera 10 #12-15', b'1', 'Campus Jesús Oviedo Pérez', NULL),
(259, 'Bogotá', 'Calle 80 #19-30', b'1', 'Campus ET Ingeniería', NULL),
(260, 'Bogotá', 'Carrera 19 #49-20', b'1', 'Campus ECCI', NULL),
(261, 'Armenia', 'Carrera 19 #25-34', b'1', 'Campus EAM', NULL),
(262, 'Cali', 'Calle 5 Vía Palmira', b'1', 'Base Aérea EMAVI', NULL),
(263, 'Cartagena', 'Isla Manzanillo', b'1', 'Campus Naval ENAP', NULL),
(264, 'Bogotá', 'Calle 44 #53-37', b'1', 'Campus ESAP', NULL),
(265, 'Bogotá', 'Calle 80 #38-00', b'1', 'Campus ESING', NULL),
(266, 'Ipiales', 'Carrera 6 #12-45', b'1', 'Campus ETAI', NULL),
(267, 'Bucaramanga', 'Calle 35 #18-40', b'1', 'Campus Oriente', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `idusuario` bigint(20) NOT NULL,
  `correoelectronico` varchar(150) NOT NULL,
  `estaactivo` bit(1) NOT NULL,
  `fechacreacion` date NOT NULL,
  `fechamodificacion` date NOT NULL,
  `hashcontrasena` varchar(255) NOT NULL,
  `nombrecompleto` varchar(150) NOT NULL,
  `ocupacion` varchar(30) NOT NULL,
  `rol` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `calidadbeneficios`
--
ALTER TABLE `calidadbeneficios`
  ADD PRIMARY KEY (`idbeneficio`),
  ADD KEY `FKc4p6152o5qadn5uq0p9munlqk` (`idprograma`);

--
-- Indices de la tabla `detallesoperacion`
--
ALTER TABLE `detallesoperacion`
  ADD PRIMARY KEY (`iddetalle`),
  ADD KEY `FKgw57mt9y20kvrejob87x0cp3o` (`idprograma`);

--
-- Indices de la tabla `instituciones`
--
ALTER TABLE `instituciones`
  ADD PRIMARY KEY (`idinstitucion`),
  ADD UNIQUE KEY `UKeuico9biatkid5nwua4j009op` (`nombreoficial`);

--
-- Indices de la tabla `programasacademicos`
--
ALTER TABLE `programasacademicos`
  ADD PRIMARY KEY (`idprograma`),
  ADD UNIQUE KEY `UK5wf0gmxsrpjei4b4n1i115n70` (`codigosnies`),
  ADD KEY `FKmuq9e9n54hg8x1o1kfk3ogm7c` (`idinstitucion`);

--
-- Indices de la tabla `sedesinstituciones`
--
ALTER TABLE `sedesinstituciones`
  ADD PRIMARY KEY (`idsede`),
  ADD KEY `FKsycvdkrnyrgfrwued85uyppik` (`idinstitucion`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`idusuario`),
  ADD UNIQUE KEY `UKkg7nb8eufbbnurgv1l5yioosl` (`correoelectronico`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `calidadbeneficios`
--
ALTER TABLE `calidadbeneficios`
  MODIFY `idbeneficio` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `detallesoperacion`
--
ALTER TABLE `detallesoperacion`
  MODIFY `iddetalle` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `instituciones`
--
ALTER TABLE `instituciones`
  MODIFY `idinstitucion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=72;

--
-- AUTO_INCREMENT de la tabla `programasacademicos`
--
ALTER TABLE `programasacademicos`
  MODIFY `idprograma` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=271;

--
-- AUTO_INCREMENT de la tabla `sedesinstituciones`
--
ALTER TABLE `sedesinstituciones`
  MODIFY `idsede` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=268;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `idusuario` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `calidadbeneficios`
--
ALTER TABLE `calidadbeneficios`
  ADD CONSTRAINT `FKc4p6152o5qadn5uq0p9munlqk` FOREIGN KEY (`idprograma`) REFERENCES `programasacademicos` (`idprograma`);

--
-- Filtros para la tabla `detallesoperacion`
--
ALTER TABLE `detallesoperacion`
  ADD CONSTRAINT `FKgw57mt9y20kvrejob87x0cp3o` FOREIGN KEY (`idprograma`) REFERENCES `programasacademicos` (`idprograma`);

--
-- Filtros para la tabla `programasacademicos`
--
ALTER TABLE `programasacademicos`
  ADD CONSTRAINT `FKmuq9e9n54hg8x1o1kfk3ogm7c` FOREIGN KEY (`idinstitucion`) REFERENCES `instituciones` (`idinstitucion`);

--
-- Filtros para la tabla `sedesinstituciones`
--
ALTER TABLE `sedesinstituciones`
  ADD CONSTRAINT `FKsycvdkrnyrgfrwued85uyppik` FOREIGN KEY (`idinstitucion`) REFERENCES `instituciones` (`idinstitucion`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
