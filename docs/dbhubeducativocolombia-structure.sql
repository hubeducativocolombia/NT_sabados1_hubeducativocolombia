-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: May 28, 2026 at 01:07 AM
-- Server version: 8.4.7
-- PHP Version: 8.3.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `dbhubeducativocolombia`
--

-- --------------------------------------------------------

--
-- Table structure for table `calidadbeneficios`
--

DROP TABLE IF EXISTS `calidadbeneficios`;
CREATE TABLE IF NOT EXISTS `calidadbeneficios` (
  `idbeneficio` int NOT NULL AUTO_INCREMENT,
  `acreditacionaltacalidad` bit(1) NOT NULL,
  `dobletitulacion` bit(1) NOT NULL,
  `ofrecebecas` bit(1) NOT NULL,
  `requieresegundoidioma` bit(1) NOT NULL,
  `idprograma` int DEFAULT NULL,
  PRIMARY KEY (`idbeneficio`),
  KEY `FKc4p6152o5qadn5uq0p9munlqk` (`idprograma`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `detallesoperacion`
--

DROP TABLE IF EXISTS `detallesoperacion`;
CREATE TABLE IF NOT EXISTS `detallesoperacion` (
  `iddetalle` int NOT NULL AUTO_INCREMENT,
  `costosemestre` decimal(38,2) NOT NULL,
  `estudiantesactivos` int NOT NULL,
  `fechaactualizacion` datetime(6) NOT NULL,
  `jornada` varchar(25) COLLATE utf8mb4_unicode_ci NOT NULL,
  `modalidad` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `idprograma` int DEFAULT NULL,
  PRIMARY KEY (`iddetalle`),
  KEY `FKgw57mt9y20kvrejob87x0cp3o` (`idprograma`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `instituciones`
--

DROP TABLE IF EXISTS `instituciones`;
CREATE TABLE IF NOT EXISTS `instituciones` (
  `idinstitucion` int NOT NULL AUTO_INCREMENT,
  `fecharegistro` date NOT NULL,
  `naturaleza` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nombreoficial` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sitioweb` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`idinstitucion`),
  UNIQUE KEY `UKeuico9biatkid5nwua4j009op` (`nombreoficial`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `programasacademicos`
--

DROP TABLE IF EXISTS `programasacademicos`;
CREATE TABLE IF NOT EXISTS `programasacademicos` (
  `idprograma` int NOT NULL AUTO_INCREMENT,
  `codigosnies` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `estaactivo` bit(1) NOT NULL,
  `nivelformacion` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nombreprograma` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `totalsemestres` int NOT NULL,
  `idinstitucion` int DEFAULT NULL,
  PRIMARY KEY (`idprograma`),
  UNIQUE KEY `UK5wf0gmxsrpjei4b4n1i115n70` (`codigosnies`),
  KEY `FKmuq9e9n54hg8x1o1kfk3ogm7c` (`idinstitucion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sedesinstituciones`
--

DROP TABLE IF EXISTS `sedesinstituciones`;
CREATE TABLE IF NOT EXISTS `sedesinstituciones` (
  `idsede` int NOT NULL AUTO_INCREMENT,
  `ciudad` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `direccionfisica` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `essedeprincipal` bit(1) NOT NULL,
  `nombresede` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `idinstitucion` int DEFAULT NULL,
  PRIMARY KEY (`idsede`),
  KEY `FKsycvdkrnyrgfrwued85uyppik` (`idinstitucion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
CREATE TABLE IF NOT EXISTS `usuarios` (
  `idusuario` bigint NOT NULL AUTO_INCREMENT,
  `correoelectronico` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `estaactivo` bit(1) NOT NULL,
  `fechacreacion` date NOT NULL,
  `fechamodificacion` date NOT NULL,
  `hashcontrasena` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nombrecompleto` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ocupacion` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rol` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`idusuario`),
  UNIQUE KEY `UKkg7nb8eufbbnurgv1l5yioosl` (`correoelectronico`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `calidadbeneficios`
--
ALTER TABLE `calidadbeneficios`
  ADD CONSTRAINT `FKc4p6152o5qadn5uq0p9munlqk` FOREIGN KEY (`idprograma`) REFERENCES `programasacademicos` (`idprograma`);

--
-- Constraints for table `detallesoperacion`
--
ALTER TABLE `detallesoperacion`
  ADD CONSTRAINT `FKgw57mt9y20kvrejob87x0cp3o` FOREIGN KEY (`idprograma`) REFERENCES `programasacademicos` (`idprograma`);

--
-- Constraints for table `programasacademicos`
--
ALTER TABLE `programasacademicos`
  ADD CONSTRAINT `FKmuq9e9n54hg8x1o1kfk3ogm7c` FOREIGN KEY (`idinstitucion`) REFERENCES `instituciones` (`idinstitucion`);

--
-- Constraints for table `sedesinstituciones`
--
ALTER TABLE `sedesinstituciones`
  ADD CONSTRAINT `FKsycvdkrnyrgfrwued85uyppik` FOREIGN KEY (`idinstitucion`) REFERENCES `instituciones` (`idinstitucion`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
