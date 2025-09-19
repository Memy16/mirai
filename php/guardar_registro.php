<?php
require("conexion.php");
$con = conectar_bd();
    
    $nombre = $_POST['nombre'];
    $apellido = $_POST['apellido'];
    $email = $_POST['email'];
    $ci = $_POST['ci'];
    $rol = $_POST['rol'];
    $contrasenia = md5($_POST['contrasenia']);
    $codigo = $_POST['codigo'];
    
    $cod_docente = "prof123KLASSO";
    $cod_ads = "ads321KLASSO";

    switch($rol) {
    case "estudiante":
        $sql = "INSERT INTO alumnos (nombre, apellido, mail, ci_alumno, contrasena) 
                VALUES ('$nombre', '$apellido', '$email', '$ci', '$contrasenia')";
        break;
        
    case "administrador":
        if ($rol === "administrador" && $codigo !== $cod_ads){
        die("❌ Código incorrecto para adscripto/a.");
        } else {
        $sql = "INSERT INTO adscripta (nombre, apellido, mail_adscripta, ci_adscripta, contrasena_adscripta) 
                VALUES ('$nombre', '$apellido', '$email', '$ci', '$contrasenia')";
        }
        break;
    case "profesor":
        if ($codigo !== $cod_docente) {
        die("❌ Código incorrecto para profesor/a.");
        }else{
            $sql = "INSERT INTO docente (nombre, apellido, mail_docente, ci_docente, contrasena_docente) 
                VALUES ('$nombre', '$apellido', '$email', '$ci', '$contrasenia')";
        }
        break;

    default:
        die("Rol no válido.");
    }
    
    if($con->query($sql) === TRUE) {
        echo "Usuario registrado correctamente <a href='../pages/login.html'>Iniciar Sesión</a>";
    } else {
        echo "Error: " . $con->error;
    }
?>