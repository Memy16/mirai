<?php
include("conexion.php");
    
    $nombre = $_POST['nombre'];
    $apellido = $_POST['apellido'];
    $email = $_POST['email'];
    $ci = $_POST['ci'];
    $rol = $_POST['rol'];
    $contrasenia = $_POST['contrasenia'];
    
    switch($rol) {
    case "estudiante":
        $sql = "INSERT INTO alumnos (nombre, apellido, mail, ci_alumno, contrasena) 
                VALUES ('$nombre', '$apellido', '$email', '$ci', '$contrasenia')";
        break;
        
    case "profesor":
        $sql = "INSERT INTO docente (nombre, apellido, mail_docente, ci_docente, contrasena_docente) 
                VALUES ('$nombre', '$apellido', '$email', '$ci', '$contrasenia')";
        break;
        
    case "administrador":
        $sql = "INSERT INTO adscripta (nombre, apellido, mail_adscripta, ci_adscripta, contrasena_adscripta) 
                VALUES ('$nombre', '$apellido', '$email', '$ci', '$contrasenia')";
        break;
    
    default:
        die("Rol no válido.");
    }
    
    if($conexion->query($sql) === TRUE) {
        echo "Usuario registrado correctamente <a href='../pages/login.html'>Iniciar Sesión</a>";
    } else {
        echo "Error: " . $conexion->error;
    }
?>