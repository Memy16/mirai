-- =============================================
-- ENTIDADES PRINCIPALES
-- =============================================

-- Entidad HORAS TERMINADA
CREATE TABLE horas (
    id_horas INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    descripcion VARCHAR(5) NOT NULL,
    hora_entrada TIME NOT NULL,
    hora_salida TIME NOT NULL
);

-- Entidad HORARIOS TERMINADA
CREATE TABLE horarios (
    id_horario INT PRIMARY KEY AUTO_INCREMENT,
    turno ENUM('MATUTINO', 'VESPERTINO', 'NOCTURNO') NOT NULL
);

-- Entidad GRUPO TERMINADA
CREATE TABLE grupo (
    id_grupo INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    nombre VARCHAR(20) NOT NULL,
    grado VARCHAR(5) NOT NULL,
    turno ENUM('MATUTINO', 'VESPERTINO', 'NOCTURNO') NOT NULL,
    especificacion VARCHAR(100) NOT NULL
);

-- Entidad ALUMNOS TERMINADA
--DUDA EXISTENCIAS: LA CONTRASEÑA DEBE SER NOT NULL? 
--SE VAN A REGISTRAR LOS ALUMNOS O LA ADSCRIPTA LOS VA A REGISTRAR?
CREATE TABLE alumnos (
    id_alumno INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(24) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    ci_alumno VARCHAR(12) UNIQUE NOT NULL,
    mail VARCHAR(50),
    tel_referente VARCHAR(20) NOT NULL,
    contrasena VARCHAR(100), 
    id_grupo INT,  
    FOREIGN KEY (id_grupo) REFERENCES grupo(id_grupo)
);

-- Entidad DOCENTE TERMINADA
CREATE TABLE docente (
    id_docente INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    ci_docente VARCHAR(12) UNIQUE NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    mail_docente VARCHAR(150) NOT NULL UNIQUE,
    tel_docente VARCHAR(20),
    contrasena_docente VARCHAR(100) NOT NULL
);

-- Entidad ASIGNATURA TERMINADA
CREATE TABLE asignatura (
    id_asignatura INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    nombre VARCHAR(100) NOT NULL
);

-- Entidad ADSCRIPTA TERMINADA
CREATE TABLE adscripta (
    id_adscripta INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    mail_adscripta VARCHAR(100) NOT NULL UNIQUE,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    tel_adscripta VARCHAR(20),
    ci_adscripta VARCHAR(12) UNIQUE NOT NULL,
    contrasena_adscripta VARCHAR(100) NOT NULL
);

-- Entidad RECURSOS TERMINADA
CREATE TABLE recursos (
    id_recurso INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    estado ENUM('RESERVADO', 'LIBRE') DEFAULT 'LIBRE' NOT NULL
);

-- Entidad AULAS TERMINADA
CREATE TABLE aulas (
    id_aula INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    nombre VARCHAR(25) NOT NULL,
    tipo VARCHAR(100) NOT NULL
);

-- Entidad RESERVA TERMINADA
CREATE TABLE reserva (
    id_reserva INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    hora_entrada TIME NOT NULL,
    hora_salida TIME NOT NULL
);

-- =============================================
-- RELACIONES N:N (MUCHOS A MUCHOS)
-- =============================================

-- Relación TIENE entre HORAS y HORARIOS (N:N) TERMINADA
CREATE TABLE horas_horarios (
    id_horas INT,
    id_horario INT,
    PRIMARY KEY (id_horas, id_horario),
    FOREIGN KEY (id_horas) REFERENCES horas(id_horas),
    FOREIGN KEY (id_horario) REFERENCES horarios(id_horario)
);

-- Relación MODIFICA entre HORARIOS y ADSCRIPTA (N:N) TERMINADA
CREATE TABLE adscripta_horarios (
    id_horario INT,
    id_adscripta INT,
    PRIMARY KEY (id_horario, id_adscripta),
    FOREIGN KEY (id_horario) REFERENCES horarios(id_horario),
    FOREIGN KEY (id_adscripta) REFERENCES adscripta(id_adscripta) 
);

-- Relación NOTIFICA entre ADSCRIPTA y GRUPO (N:N) TERMINADA
CREATE TABLE adscripta_grupo (
    id_adscripta INT,
    id_grupo INT,
    PRIMARY KEY (id_adscripta, id_grupo),
    FOREIGN KEY (id_adscripta) REFERENCES adscripta(id_adscripta),
    FOREIGN KEY (id_grupo) REFERENCES grupo(id_grupo) 
);

-- Relación TIENEN entre GRUPO y DOCENTE (N:N) TERMINADA
CREATE TABLE grupo_docente (
    id_grupo INT,
    id_docente INT,
    PRIMARY KEY (id_grupo, id_docente),
    FOREIGN KEY (id_grupo) REFERENCES grupo(id_grupo),
    FOREIGN KEY (id_docente) REFERENCES docente(id_docente)
);

-- Relación ENSEÑA entre DOCENTE y ASIGNATURA (N:N)
CREATE TABLE docente_asignatura (
    id_docente INT,
    id_asignatura INT,
    PRIMARY KEY (id_docente, id_asignatura),
    FOREIGN KEY (id_docente) REFERENCES docente(id_docente),
    FOREIGN KEY (id_asignatura) REFERENCES asignatura(id_asignatura)
);

-- Relación ASISTE entre ASIGNATURA y HORARIOS (N:N)
CREATE TABLE asignatura_horas (
    id_asignatura INT,
    id_horas INT,
    PRIMARY KEY (id_asignatura, id_horas),
    FOREIGN KEY (id_asignatura) REFERENCES asignatura(id_asignatura),
    FOREIGN KEY (id_horas) REFERENCES horas(id_horas)
);

-- Relación TIENE entre ALUMNOS y HORAS (N:N)
CREATE TABLE grupo_horas (
    id_grupo INT,
    id_horas INT,
    PRIMARY KEY (id_grupo, id_horas),
    FOREIGN KEY (id_grupo) REFERENCES grupo(id_grupo),
    FOREIGN KEY (id_horas) REFERENCES horas(id_horas)
);

-- Relación entre GRUPO y ASIGNATURA (según el MER)
CREATE TABLE asignaturas_grupo (
    id_grupo INT,
    id_asignatura INT,
    PRIMARY KEY (id_grupo, id_asignatura),
    FOREIGN KEY (id_grupo) REFERENCES grupo(id_grupo),
    FOREIGN KEY (id_asignatura) REFERENCES asignatura(id_asignatura)
);

-- Relación entre RESERVA y DOCENTE (N:N)
CREATE TABLE reserva_docente (
    id_reserva INT,
    id_docente INT,
    PRIMARY KEY (id_reserva, id_docente),
    FOREIGN KEY (id_reserva) REFERENCES reserva(id_reserva),
    FOREIGN KEY (id_docente) REFERENCES docente(id_docente)
);

-- Relación entre RESERVA y RECURSOS (N:N)
CREATE TABLE reserva_recursos (
    id_reserva INT,
    id_recurso INT,
    PRIMARY KEY (id_reserva, id_recurso),
    FOREIGN KEY (id_reserva) REFERENCES reserva(id_reserva),
    FOREIGN KEY (id_recurso) REFERENCES recursos(id_recurso) 
);

-- Relación entre RESERVA y AULAS (N:N)
CREATE TABLE reserva_aulas (
    id_reserva INT,
    id_aula INT,
    PRIMARY KEY (id_reserva, id_aula),
    FOREIGN KEY (id_reserva) REFERENCES reserva(id_reserva),
    FOREIGN KEY (id_aula) REFERENCES aulas(id_aula)
);
