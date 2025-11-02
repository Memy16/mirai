-- phpMyAdmin SQL Dump
-- version 5.2.1deb1+deb12u1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost:3306
-- Tiempo de generación: 30-10-2025 a las 12:30:36
-- Versión del servidor: 8.0.44
-- Versión de PHP: 8.2.29

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `db_mirai.klasso`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `adscripta`
--

CREATE TABLE `adscripta` (
  `id_adscripta` int NOT NULL,
  `mail_adscripta` varchar(100) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `tel_adscripta` varchar(20) DEFAULT NULL,
  `ci_adscripta` varchar(12) NOT NULL,
  `contrasena_adscripta` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `adscripta`
--

INSERT INTO `adscripta` (`id_adscripta`, `mail_adscripta`, `nombre`, `apellido`, `tel_adscripta`, `ci_adscripta`, `contrasena_adscripta`) VALUES
(1, 'alekarbonell@gmail.com', 'Luis', 'Carbonell', NULL, '45816856', '$2y$10$Ydj9E5z4qLqCX434jeU5J.hzI0fbZCsJ4RsQ0XVAbAqis.u8RM2J6');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `adscripta_grupo`
--

CREATE TABLE `adscripta_grupo` (
  `id_adscripta` int NOT NULL,
  `id_grupo` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `adscripta_horarios`
--

CREATE TABLE `adscripta_horarios` (
  `id_horario` int NOT NULL,
  `id_adscripta` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `alumnos`
--

CREATE TABLE `alumnos` (
  `id_alumno` int NOT NULL,
  `nombre` varchar(24) COLLATE utf8mb4_general_ci NOT NULL,
  `apellido` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `ci_alumno` varchar(12) COLLATE utf8mb4_general_ci NOT NULL,
  `mail` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `tel_referente` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `contrasena` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `id_grupo` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `alumnos`
--

INSERT INTO `alumnos` (`id_alumno`, `nombre`, `apellido`, `ci_alumno`, `mail`, `tel_referente`, `contrasena`, `id_grupo`) VALUES
(3, 'Juan', 'Peréz', '54321234', 'perezjuan17@gmail.com', '', '81dc9bdb52d04dc20036dbd8313ed055', NULL),
(5, 'Juan', 'Peréz', '1234566', 'perezjuan17@gmail.com', '', '81dc9bdb52d04dc20036dbd8313ed055', NULL),
(6, 'Emmy', 'Machado de Oliveira', '56172574', 'emmymachadodeoliveira16@gmail.com', '', '6b2cc9abb6a40ceeabc1e14780bfaa0a', NULL),
(8, 'Pablo', 'Klasso', '98766785', 'miraiyco18@gmail.com', '', '4d186321c1a7f0f354b297e8914ab240', NULL),
(9, 'Usuario', 'Prueba Alumno', '12344321', 'usuario1@gmail.com', '', '202cb962ac59075b964b07152d234b70', 2),
(10, 'Bruno', 'Rodriguez', '123123', 'br@gmail.com', '', '$2y$10$bHM3qv2USnYLCM81qzoVruXmuVrfs1UZ8dsTwbeTyMmACBvLVLo5y', NULL),
(16, '1', '1', '1111111', '1@gmail.com', '', '$2y$10$.TwbyfCqbFmcjk3o6xcgNOUvQz5c9uDBKsetiQ/6cRD2hwwVJbk8.', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `asignatura`
--

CREATE TABLE `asignatura` (
  `id_asignatura` int NOT NULL,
  `nombre` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `asignaturas_grupo`
--

CREATE TABLE `asignaturas_grupo` (
  `id_grupo` int NOT NULL,
  `id_asignatura` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `asignatura_horas`
--

CREATE TABLE `asignatura_horas` (
  `id_asignatura` int NOT NULL,
  `id_horas` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `asistencia`
--

CREATE TABLE `asistencia` (
  `id` int NOT NULL,
  `dia` varchar(10) DEFAULT NULL,
  `hora` int NOT NULL,
  `hora_fin` int DEFAULT NULL,
  `grupo` varchar(20) DEFAULT NULL,
  `profesor` varchar(50) DEFAULT NULL,
  `materia` varchar(100) DEFAULT NULL,
  `estado` enum('si','no') DEFAULT 'si'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `asistencia`
--

INSERT INTO `asistencia` (`id`, `dia`, `hora`, `hora_fin`, `grupo`, `profesor`, `materia`, `estado`) VALUES
(26, 'Lunes', 1, 2, '3ºMA MATUTINO', NULL, 'Matematica CTS', ''),
(27, 'Lunes', 3, 5, '3ºMA MATUTINO', NULL, 'S.Operativo', ''),
(28, 'Lunes', 6, 7, '3ºMA MATUTINO', NULL, 'Fisica', ''),
(29, 'Lunes', 8, 8, '3ºMA MATUTINO', NULL, 'Filosofia', ''),
(30, 'VIernes', 159, 14588, '3ºMA MATUTINO', NULL, '11111111111111111111111111111111111111111111111111111111111111111111111111111111', '');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `aulas`
--

CREATE TABLE `aulas` (
  `id_aula` int NOT NULL,
  `nombre` varchar(25) COLLATE utf8mb4_general_ci NOT NULL,
  `tipo` varchar(100) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `docente`
--

CREATE TABLE `docente` (
  `id_docente` int NOT NULL,
  `ci_docente` varchar(12) COLLATE utf8mb4_general_ci NOT NULL,
  `nombre` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `apellido` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `mail_docente` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `tel_docente` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `contrasena_docente` varchar(255) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `docente_asignatura`
--

CREATE TABLE `docente_asignatura` (
  `id_docente` int NOT NULL,
  `id_asignatura` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `grupo`
--

CREATE TABLE `grupo` (
  `id_grupo` int NOT NULL,
  `nombre` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `grado` varchar(5) COLLATE utf8mb4_general_ci NOT NULL,
  `turno` enum('MATUTINO','VESPERTINO','NOCTURNO') COLLATE utf8mb4_general_ci NOT NULL,
  `especificacion` varchar(100) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `grupo`
--

INSERT INTO `grupo` (`id_grupo`, `nombre`, `grado`, `turno`, `especificacion`) VALUES
(1, 'MA', '3º', 'MATUTINO', 'Tecnologías de la Información'),
(2, 'MB', '3º', 'MATUTINO', 'Tecnologías de la Información'),
(4, 'MD', '3º', 'MATUTINO', 'Tecnologías de la Información Bilingue');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `grupo_docente`
--

CREATE TABLE `grupo_docente` (
  `id_grupo` int NOT NULL,
  `id_docente` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `grupo_horas`
--

CREATE TABLE `grupo_horas` (
  `id_grupo` int NOT NULL,
  `id_horas` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `horarios`
--

CREATE TABLE `horarios` (
  `id_horario` int NOT NULL,
  `VESPERTINO` int NOT NULL,
  `MATUTINO` int NOT NULL,
  `NOCTURNO` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `horas`
--

CREATE TABLE `horas` (
  `id_horas` int NOT NULL,
  `descripcion` varchar(5) COLLATE utf8mb4_general_ci NOT NULL,
  `hora_entrada` time NOT NULL,
  `hora_salida` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `horas_horarios`
--

CREATE TABLE `horas_horarios` (
  `id_horas` int NOT NULL,
  `id_horario` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `recursos`
--

CREATE TABLE `recursos` (
  `id_recurso` int NOT NULL,
  `nombre` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `estado` enum('RESERVADO','LIBRE') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'LIBRE',
  `cantidad` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reserva`
--

CREATE TABLE `reserva` (
  `id_reserva` int NOT NULL,
  `hora_entrada` time NOT NULL,
  `hora_salida` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `reserva`
--

INSERT INTO `reserva` (`id_reserva`, `hora_entrada`, `hora_salida`) VALUES
(1, '00:00:00', '00:00:00'),
(2, '00:00:00', '00:00:00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reserva_aulas`
--

CREATE TABLE `reserva_aulas` (
  `id_reserva` int NOT NULL,
  `id_aula` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reserva_docente`
--

CREATE TABLE `reserva_docente` (
  `id_reserva` int NOT NULL,
  `id_docente` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reserva_recursos`
--

CREATE TABLE `reserva_recursos` (
  `id_reserva` int NOT NULL,
  `id_recurso` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `resets`
--

CREATE TABLE `resets` (
  `id` int NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `token` varchar(255) DEFAULT NULL,
  `expiracion` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `adscripta`
--
ALTER TABLE `adscripta`
  ADD PRIMARY KEY (`id_adscripta`),
  ADD UNIQUE KEY `mail_adscripta` (`mail_adscripta`),
  ADD UNIQUE KEY `ci_adscripta` (`ci_adscripta`);

--
-- Indices de la tabla `adscripta_grupo`
--
ALTER TABLE `adscripta_grupo`
  ADD PRIMARY KEY (`id_adscripta`,`id_grupo`),
  ADD KEY `id_grupo` (`id_grupo`);

--
-- Indices de la tabla `adscripta_horarios`
--
ALTER TABLE `adscripta_horarios`
  ADD PRIMARY KEY (`id_horario`,`id_adscripta`),
  ADD KEY `id_adscripta` (`id_adscripta`);

--
-- Indices de la tabla `alumnos`
--
ALTER TABLE `alumnos`
  ADD PRIMARY KEY (`id_alumno`),
  ADD UNIQUE KEY `ci_alumno` (`ci_alumno`),
  ADD KEY `id_grupo` (`id_grupo`);

--
-- Indices de la tabla `asignatura`
--
ALTER TABLE `asignatura`
  ADD PRIMARY KEY (`id_asignatura`);

--
-- Indices de la tabla `asignaturas_grupo`
--
ALTER TABLE `asignaturas_grupo`
  ADD PRIMARY KEY (`id_grupo`,`id_asignatura`),
  ADD KEY `id_asignatura` (`id_asignatura`);

--
-- Indices de la tabla `asignatura_horas`
--
ALTER TABLE `asignatura_horas`
  ADD PRIMARY KEY (`id_asignatura`,`id_horas`),
  ADD KEY `id_horas` (`id_horas`);

--
-- Indices de la tabla `asistencia`
--
ALTER TABLE `asistencia`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `aulas`
--
ALTER TABLE `aulas`
  ADD PRIMARY KEY (`id_aula`);

--
-- Indices de la tabla `docente`
--
ALTER TABLE `docente`
  ADD PRIMARY KEY (`id_docente`),
  ADD UNIQUE KEY `ci_docente` (`ci_docente`),
  ADD UNIQUE KEY `mail_docente` (`mail_docente`);

--
-- Indices de la tabla `docente_asignatura`
--
ALTER TABLE `docente_asignatura`
  ADD PRIMARY KEY (`id_docente`,`id_asignatura`),
  ADD KEY `id_asignatura` (`id_asignatura`);

--
-- Indices de la tabla `grupo`
--
ALTER TABLE `grupo`
  ADD PRIMARY KEY (`id_grupo`);

--
-- Indices de la tabla `grupo_docente`
--
ALTER TABLE `grupo_docente`
  ADD PRIMARY KEY (`id_grupo`,`id_docente`),
  ADD KEY `id_docente` (`id_docente`);

--
-- Indices de la tabla `grupo_horas`
--
ALTER TABLE `grupo_horas`
  ADD PRIMARY KEY (`id_grupo`,`id_horas`),
  ADD KEY `id_horas` (`id_horas`);

--
-- Indices de la tabla `horarios`
--
ALTER TABLE `horarios`
  ADD PRIMARY KEY (`id_horario`);

--
-- Indices de la tabla `horas`
--
ALTER TABLE `horas`
  ADD PRIMARY KEY (`id_horas`);

--
-- Indices de la tabla `horas_horarios`
--
ALTER TABLE `horas_horarios`
  ADD PRIMARY KEY (`id_horas`,`id_horario`),
  ADD KEY `id_horario` (`id_horario`);

--
-- Indices de la tabla `recursos`
--
ALTER TABLE `recursos`
  ADD PRIMARY KEY (`id_recurso`);

--
-- Indices de la tabla `reserva`
--
ALTER TABLE `reserva`
  ADD PRIMARY KEY (`id_reserva`) USING BTREE;

--
-- Indices de la tabla `reserva_aulas`
--
ALTER TABLE `reserva_aulas`
  ADD PRIMARY KEY (`id_reserva`,`id_aula`),
  ADD KEY `id_aula` (`id_aula`);

--
-- Indices de la tabla `reserva_docente`
--
ALTER TABLE `reserva_docente`
  ADD PRIMARY KEY (`id_reserva`,`id_docente`),
  ADD KEY `id_docente` (`id_docente`);

--
-- Indices de la tabla `reserva_recursos`
--
ALTER TABLE `reserva_recursos`
  ADD PRIMARY KEY (`id_reserva`,`id_recurso`),
  ADD KEY `id_recurso` (`id_recurso`);

--
-- Indices de la tabla `resets`
--
ALTER TABLE `resets`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `adscripta`
--
ALTER TABLE `adscripta`
  MODIFY `id_adscripta` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `alumnos`
--
ALTER TABLE `alumnos`
  MODIFY `id_alumno` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT de la tabla `asignatura`
--
ALTER TABLE `asignatura`
  MODIFY `id_asignatura` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `asistencia`
--
ALTER TABLE `asistencia`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT de la tabla `aulas`
--
ALTER TABLE `aulas`
  MODIFY `id_aula` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `docente`
--
ALTER TABLE `docente`
  MODIFY `id_docente` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `grupo`
--
ALTER TABLE `grupo`
  MODIFY `id_grupo` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `horas`
--
ALTER TABLE `horas`
  MODIFY `id_horas` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `recursos`
--
ALTER TABLE `recursos`
  MODIFY `id_recurso` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `reserva`
--
ALTER TABLE `reserva`
  MODIFY `id_reserva` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `resets`
--
ALTER TABLE `resets`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `adscripta_grupo`
--
ALTER TABLE `adscripta_grupo`
  ADD CONSTRAINT `adscripta_grupo_ibfk_1` FOREIGN KEY (`id_adscripta`) REFERENCES `adscripta` (`id_adscripta`),
  ADD CONSTRAINT `adscripta_grupo_ibfk_2` FOREIGN KEY (`id_grupo`) REFERENCES `grupo` (`id_grupo`);

--
-- Filtros para la tabla `adscripta_horarios`
--
ALTER TABLE `adscripta_horarios`
  ADD CONSTRAINT `adscripta_horarios_ibfk_1` FOREIGN KEY (`id_horario`) REFERENCES `horarios` (`id_horario`),
  ADD CONSTRAINT `adscripta_horarios_ibfk_2` FOREIGN KEY (`id_adscripta`) REFERENCES `adscripta` (`id_adscripta`);

--
-- Filtros para la tabla `alumnos`
--
ALTER TABLE `alumnos`
  ADD CONSTRAINT `alumnos_ibfk_1` FOREIGN KEY (`id_grupo`) REFERENCES `grupo` (`id_grupo`);

--
-- Filtros para la tabla `asignaturas_grupo`
--
ALTER TABLE `asignaturas_grupo`
  ADD CONSTRAINT `asignaturas_grupo_ibfk_1` FOREIGN KEY (`id_grupo`) REFERENCES `grupo` (`id_grupo`),
  ADD CONSTRAINT `asignaturas_grupo_ibfk_2` FOREIGN KEY (`id_asignatura`) REFERENCES `asignatura` (`id_asignatura`);

--
-- Filtros para la tabla `asignatura_horas`
--
ALTER TABLE `asignatura_horas`
  ADD CONSTRAINT `asignatura_horas_ibfk_1` FOREIGN KEY (`id_asignatura`) REFERENCES `asignatura` (`id_asignatura`),
  ADD CONSTRAINT `asignatura_horas_ibfk_2` FOREIGN KEY (`id_horas`) REFERENCES `horas` (`id_horas`);

--
-- Filtros para la tabla `docente_asignatura`
--
ALTER TABLE `docente_asignatura`
  ADD CONSTRAINT `docente_asignatura_ibfk_1` FOREIGN KEY (`id_docente`) REFERENCES `docente` (`id_docente`),
  ADD CONSTRAINT `docente_asignatura_ibfk_2` FOREIGN KEY (`id_asignatura`) REFERENCES `asignatura` (`id_asignatura`);

--
-- Filtros para la tabla `grupo_docente`
--
ALTER TABLE `grupo_docente`
  ADD CONSTRAINT `grupo_docente_ibfk_1` FOREIGN KEY (`id_grupo`) REFERENCES `grupo` (`id_grupo`),
  ADD CONSTRAINT `grupo_docente_ibfk_2` FOREIGN KEY (`id_docente`) REFERENCES `docente` (`id_docente`);

--
-- Filtros para la tabla `grupo_horas`
--
ALTER TABLE `grupo_horas`
  ADD CONSTRAINT `grupo_horas_ibfk_1` FOREIGN KEY (`id_grupo`) REFERENCES `grupo` (`id_grupo`),
  ADD CONSTRAINT `grupo_horas_ibfk_2` FOREIGN KEY (`id_horas`) REFERENCES `horas` (`id_horas`);

--
-- Filtros para la tabla `horas_horarios`
--
ALTER TABLE `horas_horarios`
  ADD CONSTRAINT `horas_horarios_ibfk_1` FOREIGN KEY (`id_horas`) REFERENCES `horas` (`id_horas`),
  ADD CONSTRAINT `horas_horarios_ibfk_2` FOREIGN KEY (`id_horario`) REFERENCES `horarios` (`id_horario`);

--
-- Filtros para la tabla `reserva_aulas`
--
ALTER TABLE `reserva_aulas`
  ADD CONSTRAINT `reserva_aulas_ibfk_1` FOREIGN KEY (`id_reserva`) REFERENCES `reserva` (`id_reserva`),
  ADD CONSTRAINT `reserva_aulas_ibfk_2` FOREIGN KEY (`id_aula`) REFERENCES `aulas` (`id_aula`);

--
-- Filtros para la tabla `reserva_docente`
--
ALTER TABLE `reserva_docente`
  ADD CONSTRAINT `reserva_docente_ibfk_1` FOREIGN KEY (`id_reserva`) REFERENCES `reserva` (`id_reserva`),
  ADD CONSTRAINT `reserva_docente_ibfk_2` FOREIGN KEY (`id_docente`) REFERENCES `docente` (`id_docente`);

--
-- Filtros para la tabla `reserva_recursos`
--
ALTER TABLE `reserva_recursos`
  ADD CONSTRAINT `reserva_recursos_ibfk_1` FOREIGN KEY (`id_reserva`) REFERENCES `reserva` (`id_reserva`),
  ADD CONSTRAINT `reserva_recursos_ibfk_2` FOREIGN KEY (`id_recurso`) REFERENCES `recursos` (`id_recurso`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
