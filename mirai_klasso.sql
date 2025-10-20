-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: mirai_klasso
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `adscripta`
--

DROP TABLE IF EXISTS `adscripta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `adscripta` (
  `id_adscripta` int NOT NULL AUTO_INCREMENT,
  `mail_adscripta` varchar(100) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `tel_adscripta` varchar(20) DEFAULT NULL,
  `ci_adscripta` varchar(12) NOT NULL,
  `contrasena_adscripta` varchar(100) NOT NULL,
  PRIMARY KEY (`id_adscripta`),
  UNIQUE KEY `mail_adscripta` (`mail_adscripta`),
  UNIQUE KEY `ci_adscripta` (`ci_adscripta`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `adscripta`
--

LOCK TABLES `adscripta` WRITE;
/*!40000 ALTER TABLE `adscripta` DISABLE KEYS */;
INSERT INTO `adscripta` VALUES (1,'correaliliana129@gmail.com','Estados','Unidos',NULL,'57393691','Kevin1155#$');
/*!40000 ALTER TABLE `adscripta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `adscripta_grupo`
--

DROP TABLE IF EXISTS `adscripta_grupo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `adscripta_grupo` (
  `id_adscripta` int NOT NULL,
  `id_grupo` int NOT NULL,
  PRIMARY KEY (`id_adscripta`,`id_grupo`),
  KEY `id_grupo` (`id_grupo`),
  CONSTRAINT `adscripta_grupo_ibfk_1` FOREIGN KEY (`id_adscripta`) REFERENCES `adscripta` (`id_adscripta`),
  CONSTRAINT `adscripta_grupo_ibfk_2` FOREIGN KEY (`id_grupo`) REFERENCES `grupo` (`id_grupo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `adscripta_grupo`
--

LOCK TABLES `adscripta_grupo` WRITE;
/*!40000 ALTER TABLE `adscripta_grupo` DISABLE KEYS */;
/*!40000 ALTER TABLE `adscripta_grupo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `adscripta_horarios`
--

DROP TABLE IF EXISTS `adscripta_horarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `adscripta_horarios` (
  `id_horario` int NOT NULL,
  `id_adscripta` int NOT NULL,
  PRIMARY KEY (`id_horario`,`id_adscripta`),
  KEY `id_adscripta` (`id_adscripta`),
  CONSTRAINT `adscripta_horarios_ibfk_1` FOREIGN KEY (`id_horario`) REFERENCES `horarios` (`id_horario`),
  CONSTRAINT `adscripta_horarios_ibfk_2` FOREIGN KEY (`id_adscripta`) REFERENCES `adscripta` (`id_adscripta`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `adscripta_horarios`
--

LOCK TABLES `adscripta_horarios` WRITE;
/*!40000 ALTER TABLE `adscripta_horarios` DISABLE KEYS */;
/*!40000 ALTER TABLE `adscripta_horarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `asignatura`
--

DROP TABLE IF EXISTS `asignatura`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `asignatura` (
  `id_asignatura` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  PRIMARY KEY (`id_asignatura`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asignatura`
--

LOCK TABLES `asignatura` WRITE;
/*!40000 ALTER TABLE `asignatura` DISABLE KEYS */;
/*!40000 ALTER TABLE `asignatura` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `asignatura_horas`
--

DROP TABLE IF EXISTS `asignatura_horas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `asignatura_horas` (
  `id_asignatura` int NOT NULL,
  `id_horas` int NOT NULL,
  PRIMARY KEY (`id_asignatura`,`id_horas`),
  KEY `id_horas` (`id_horas`),
  CONSTRAINT `asignatura_horas_ibfk_1` FOREIGN KEY (`id_asignatura`) REFERENCES `asignatura` (`id_asignatura`),
  CONSTRAINT `asignatura_horas_ibfk_2` FOREIGN KEY (`id_horas`) REFERENCES `horas` (`id_horas`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asignatura_horas`
--

LOCK TABLES `asignatura_horas` WRITE;
/*!40000 ALTER TABLE `asignatura_horas` DISABLE KEYS */;
/*!40000 ALTER TABLE `asignatura_horas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `asignaturas_grupo`
--

DROP TABLE IF EXISTS `asignaturas_grupo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `asignaturas_grupo` (
  `id_grupo` int NOT NULL,
  `id_asignatura` int NOT NULL,
  PRIMARY KEY (`id_grupo`,`id_asignatura`),
  KEY `id_asignatura` (`id_asignatura`),
  CONSTRAINT `asignaturas_grupo_ibfk_1` FOREIGN KEY (`id_grupo`) REFERENCES `grupo` (`id_grupo`),
  CONSTRAINT `asignaturas_grupo_ibfk_2` FOREIGN KEY (`id_asignatura`) REFERENCES `asignatura` (`id_asignatura`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asignaturas_grupo`
--

LOCK TABLES `asignaturas_grupo` WRITE;
/*!40000 ALTER TABLE `asignaturas_grupo` DISABLE KEYS */;
/*!40000 ALTER TABLE `asignaturas_grupo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `asistencia`
--

DROP TABLE IF EXISTS `asistencia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `asistencia` (
  `id` int NOT NULL AUTO_INCREMENT,
  `dia` varchar(10) DEFAULT NULL,
  `hora` int NOT NULL,
  `hora_fin` int DEFAULT NULL,
  `grupo` varchar(20) DEFAULT NULL,
  `profesor` varchar(50) DEFAULT NULL,
  `materia` varchar(100) DEFAULT NULL,
  `estado` enum('si','no') DEFAULT 'si',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asistencia`
--

LOCK TABLES `asistencia` WRITE;
/*!40000 ALTER TABLE `asistencia` DISABLE KEYS */;
INSERT INTO `asistencia` VALUES (15,'Lunes',1,1,'2°MA MATUTINO',NULL,'Klasso',''),(16,'Lunes',1,1,'2°MA MATUTINO',NULL,'A.S. Operativos',''),(17,'Martes',1,1,'2°MA MATUTINO',NULL,'A.S. Operativos',''),(18,'Martes',1,1,'2°MA MATUTINO',NULL,'Historia',''),(21,'Lunes',1,1,'3°MA MATUTINO',NULL,'Matematica',''),(22,'Lunes',1,2,'3°MA MATUTINO',NULL,'Matematica','si');
/*!40000 ALTER TABLE `asistencia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aulas`
--

DROP TABLE IF EXISTS `aulas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `aulas` (
  `id_aula` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(25) NOT NULL,
  `tipo` varchar(100) NOT NULL,
  `cantidad` int NOT NULL DEFAULT '20',
  PRIMARY KEY (`id_aula`)
) ENGINE=InnoDB AUTO_INCREMENT=103 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aulas`
--

LOCK TABLES `aulas` WRITE;
/*!40000 ALTER TABLE `aulas` DISABLE KEYS */;
INSERT INTO `aulas` VALUES (1,'Aula 1','Laboratorio',30),(2,'Aula 2','Aula',20),(102,'Aula 3','Aula de Robotica',32);
/*!40000 ALTER TABLE `aulas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `docente`
--

DROP TABLE IF EXISTS `docente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `docente` (
  `id_docente` int NOT NULL AUTO_INCREMENT,
  `ci_docente` varchar(12) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `mail_docente` varchar(150) NOT NULL,
  `tel_docente` varchar(20) DEFAULT NULL,
  `contrasena_docente` varchar(100) NOT NULL,
  PRIMARY KEY (`id_docente`),
  UNIQUE KEY `ci_docente` (`ci_docente`),
  UNIQUE KEY `mail_docente` (`mail_docente`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `docente`
--

LOCK TABLES `docente` WRITE;
/*!40000 ALTER TABLE `docente` DISABLE KEYS */;
INSERT INTO `docente` VALUES (1,'57393699','Kevin','correa','correakevin121314@gmail.com','091755001','$2y$12$efA2m8C7qAwMggB6Y0k2oe5X4Fbq0G3tMXejdcYtp0DbmYdRIf.iS');
/*!40000 ALTER TABLE `docente` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `docente_asignatura`
--

DROP TABLE IF EXISTS `docente_asignatura`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `docente_asignatura` (
  `id_docente` int NOT NULL,
  `id_asignatura` int NOT NULL,
  PRIMARY KEY (`id_docente`,`id_asignatura`),
  KEY `id_asignatura` (`id_asignatura`),
  CONSTRAINT `docente_asignatura_ibfk_1` FOREIGN KEY (`id_docente`) REFERENCES `docente` (`id_docente`),
  CONSTRAINT `docente_asignatura_ibfk_2` FOREIGN KEY (`id_asignatura`) REFERENCES `asignatura` (`id_asignatura`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `docente_asignatura`
--

LOCK TABLES `docente_asignatura` WRITE;
/*!40000 ALTER TABLE `docente_asignatura` DISABLE KEYS */;
/*!40000 ALTER TABLE `docente_asignatura` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `grupo`
--

DROP TABLE IF EXISTS `grupo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `grupo` (
  `id_grupo` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(20) NOT NULL,
  `grado` varchar(5) NOT NULL,
  `turno` enum('MATUTINO','VESPERTINO','NOCTURNO') NOT NULL,
  `especificacion` varchar(100) NOT NULL,
  PRIMARY KEY (`id_grupo`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `grupo`
--

LOCK TABLES `grupo` WRITE;
/*!40000 ALTER TABLE `grupo` DISABLE KEYS */;
INSERT INTO `grupo` VALUES (2,'MA','3°','MATUTINO','informatica'),(3,'MA','2°','MATUTINO','Informatica');
/*!40000 ALTER TABLE `grupo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `grupo_docente`
--

DROP TABLE IF EXISTS `grupo_docente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `grupo_docente` (
  `id_grupo` int NOT NULL,
  `id_docente` int NOT NULL,
  PRIMARY KEY (`id_grupo`,`id_docente`),
  KEY `id_docente` (`id_docente`),
  CONSTRAINT `grupo_docente_ibfk_1` FOREIGN KEY (`id_grupo`) REFERENCES `grupo` (`id_grupo`),
  CONSTRAINT `grupo_docente_ibfk_2` FOREIGN KEY (`id_docente`) REFERENCES `docente` (`id_docente`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `grupo_docente`
--

LOCK TABLES `grupo_docente` WRITE;
/*!40000 ALTER TABLE `grupo_docente` DISABLE KEYS */;
/*!40000 ALTER TABLE `grupo_docente` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `grupo_horas`
--

DROP TABLE IF EXISTS `grupo_horas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `grupo_horas` (
  `id_grupo` int NOT NULL,
  `id_horas` int NOT NULL,
  PRIMARY KEY (`id_grupo`,`id_horas`),
  KEY `id_horas` (`id_horas`),
  CONSTRAINT `grupo_horas_ibfk_1` FOREIGN KEY (`id_grupo`) REFERENCES `grupo` (`id_grupo`),
  CONSTRAINT `grupo_horas_ibfk_2` FOREIGN KEY (`id_horas`) REFERENCES `horas` (`id_horas`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `grupo_horas`
--

LOCK TABLES `grupo_horas` WRITE;
/*!40000 ALTER TABLE `grupo_horas` DISABLE KEYS */;
/*!40000 ALTER TABLE `grupo_horas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `horarios`
--

DROP TABLE IF EXISTS `horarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `horarios` (
  `id_horario` int NOT NULL AUTO_INCREMENT,
  `turno` enum('MATUTINO','VESPERTINO','NOCTURNO') NOT NULL,
  PRIMARY KEY (`id_horario`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `horarios`
--

LOCK TABLES `horarios` WRITE;
/*!40000 ALTER TABLE `horarios` DISABLE KEYS */;
INSERT INTO `horarios` VALUES (1,'MATUTINO'),(2,'VESPERTINO'),(3,'NOCTURNO');
/*!40000 ALTER TABLE `horarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `horas`
--

DROP TABLE IF EXISTS `horas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `horas` (
  `id_horas` int NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(5) NOT NULL,
  `hora_entrada` time NOT NULL,
  `hora_salida` time NOT NULL,
  PRIMARY KEY (`id_horas`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `horas`
--

LOCK TABLES `horas` WRITE;
/*!40000 ALTER TABLE `horas` DISABLE KEYS */;
/*!40000 ALTER TABLE `horas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `horas_horarios`
--

DROP TABLE IF EXISTS `horas_horarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `horas_horarios` (
  `id_horas` int NOT NULL,
  `id_horario` int NOT NULL,
  PRIMARY KEY (`id_horas`,`id_horario`),
  KEY `id_horario` (`id_horario`),
  CONSTRAINT `horas_horarios_ibfk_1` FOREIGN KEY (`id_horas`) REFERENCES `horas` (`id_horas`),
  CONSTRAINT `horas_horarios_ibfk_2` FOREIGN KEY (`id_horario`) REFERENCES `horarios` (`id_horario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `horas_horarios`
--

LOCK TABLES `horas_horarios` WRITE;
/*!40000 ALTER TABLE `horas_horarios` DISABLE KEYS */;
/*!40000 ALTER TABLE `horas_horarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recursos`
--

DROP TABLE IF EXISTS `recursos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recursos` (
  `id_recurso` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `estado` enum('RESERVADO','LIBRE') NOT NULL DEFAULT 'LIBRE',
  PRIMARY KEY (`id_recurso`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recursos`
--

LOCK TABLES `recursos` WRITE;
/*!40000 ALTER TABLE `recursos` DISABLE KEYS */;
INSERT INTO `recursos` VALUES (1,'Alargue 1','LIBRE');
/*!40000 ALTER TABLE `recursos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reserva`
--

DROP TABLE IF EXISTS `reserva`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reserva` (
  `id_reserva` int NOT NULL AUTO_INCREMENT,
  `hora_entrada` time NOT NULL,
  `hora_salida` time NOT NULL,
  PRIMARY KEY (`id_reserva`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reserva`
--

LOCK TABLES `reserva` WRITE;
/*!40000 ALTER TABLE `reserva` DISABLE KEYS */;
INSERT INTO `reserva` VALUES (1,'08:00:00','10:00:00'),(2,'08:00:00','10:00:00'),(3,'00:00:00','00:00:00'),(4,'00:00:00','00:00:00'),(5,'00:00:00','00:00:00'),(6,'00:00:00','00:00:00'),(7,'00:00:00','00:00:00'),(8,'00:00:00','00:00:00'),(9,'00:00:00','00:00:00'),(10,'00:00:00','00:00:00'),(11,'00:00:00','00:00:00'),(12,'00:00:00','00:00:00');
/*!40000 ALTER TABLE `reserva` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reserva_aulas`
--

DROP TABLE IF EXISTS `reserva_aulas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reserva_aulas` (
  `id_reserva` int NOT NULL,
  `id_aula` int NOT NULL,
  `id_horario` int NOT NULL,
  `hora_turno` enum('1°','2°','3°','4°','5°','6°','7°','8°') NOT NULL,
  `hora_reservada` date NOT NULL,
  PRIMARY KEY (`id_reserva`,`id_aula`),
  UNIQUE KEY `reservas` (`id_aula`,`id_horario`,`hora_turno`),
  UNIQUE KEY `unica_reserva` (`id_aula`,`id_horario`,`hora_turno`,`hora_reservada`),
  UNIQUE KEY `reserva` (`id_aula`,`id_horario`,`hora_turno`,`hora_reservada`),
  KEY `fk_horario` (`id_horario`),
  CONSTRAINT `fk_horario` FOREIGN KEY (`id_horario`) REFERENCES `horarios` (`id_horario`),
  CONSTRAINT `reserva_aulas_ibfk_1` FOREIGN KEY (`id_reserva`) REFERENCES `reserva` (`id_reserva`),
  CONSTRAINT `reserva_aulas_ibfk_2` FOREIGN KEY (`id_aula`) REFERENCES `aulas` (`id_aula`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reserva_aulas`
--

LOCK TABLES `reserva_aulas` WRITE;
/*!40000 ALTER TABLE `reserva_aulas` DISABLE KEYS */;
INSERT INTO `reserva_aulas` VALUES (3,1,1,'1°','2025-10-02'),(12,1,1,'2°','2025-10-01'),(4,1,2,'1°','2025-10-02');
/*!40000 ALTER TABLE `reserva_aulas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reserva_docente`
--

DROP TABLE IF EXISTS `reserva_docente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reserva_docente` (
  `id_reserva` int NOT NULL,
  `id_docente` int NOT NULL,
  PRIMARY KEY (`id_reserva`,`id_docente`),
  KEY `id_docente` (`id_docente`),
  CONSTRAINT `reserva_docente_ibfk_1` FOREIGN KEY (`id_reserva`) REFERENCES `reserva` (`id_reserva`),
  CONSTRAINT `reserva_docente_ibfk_2` FOREIGN KEY (`id_docente`) REFERENCES `docente` (`id_docente`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reserva_docente`
--

LOCK TABLES `reserva_docente` WRITE;
/*!40000 ALTER TABLE `reserva_docente` DISABLE KEYS */;
/*!40000 ALTER TABLE `reserva_docente` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reserva_recursos`
--

DROP TABLE IF EXISTS `reserva_recursos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reserva_recursos` (
  `id_reserva` int NOT NULL,
  `id_recurso` int NOT NULL,
  `id_horario` int NOT NULL,
  `hora_turno` enum('1°','2°','3°','4°','5°','6°','7°','8°') NOT NULL,
  `hora_reservada` date NOT NULL,
  PRIMARY KEY (`id_reserva`,`id_recurso`),
  UNIQUE KEY `reserva_unica` (`id_recurso`,`id_horario`,`hora_turno`,`hora_reservada`),
  KEY `fk_reserva_recursos_horario` (`id_horario`),
  CONSTRAINT `fk_reserva_recursos_horario` FOREIGN KEY (`id_horario`) REFERENCES `horarios` (`id_horario`),
  CONSTRAINT `fk_reserva_recursos_recurso` FOREIGN KEY (`id_recurso`) REFERENCES `recursos` (`id_recurso`),
  CONSTRAINT `fk_reserva_recursos_reserva` FOREIGN KEY (`id_reserva`) REFERENCES `reserva` (`id_reserva`),
  CONSTRAINT `reserva_recursos_ibfk_1` FOREIGN KEY (`id_reserva`) REFERENCES `reserva` (`id_reserva`),
  CONSTRAINT `reserva_recursos_ibfk_2` FOREIGN KEY (`id_recurso`) REFERENCES `recursos` (`id_recurso`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reserva_recursos`
--

LOCK TABLES `reserva_recursos` WRITE;
/*!40000 ALTER TABLE `reserva_recursos` DISABLE KEYS */;
INSERT INTO `reserva_recursos` VALUES (5,1,1,'1°','2025-10-01'),(9,1,1,'2°','2025-10-01');
/*!40000 ALTER TABLE `reserva_recursos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `resets`
--

DROP TABLE IF EXISTS `resets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `resets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) DEFAULT NULL,
  `token` varchar(255) DEFAULT NULL,
  `expiracion` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resets`
--

LOCK TABLES `resets` WRITE;
/*!40000 ALTER TABLE `resets` DISABLE KEYS */;
INSERT INTO `resets` VALUES (1,'correakevin121314@gmail.com','f36ba1fe2fa2eb8d08c836a68ccfef6583b6827d8b98bc7c89414d04352e92ab','2025-10-14 19:19:27'),(2,'correakevin121314@gmail.com','d85a17b870611bb4bf0137920130b0932377c61892757e86cd1892135eda7c5e','2025-10-14 19:21:03'),(4,'correakevin121314@gmail.com','b72129481c1d93191e7c71799606d1088bfd3516766bb866822fbb70abb00be4','2025-10-14 19:29:17'),(5,'correakevin121314@gmail.com','3501b044aa79aefad5ca4efa86281a71feb340cb2fad3e1581bb3d1feec3897a','2025-10-14 19:30:24'),(6,'correakevin121314@gmail.com','e12a81341c9fe502e744aad1241b5ea490cf4e93c8b0dbb3a0a548ac0adc95a8','2025-10-14 19:32:37');
/*!40000 ALTER TABLE `resets` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-17  8:19:50
