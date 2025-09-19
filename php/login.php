<?php
session_start();
require("conexion.php");

function limpiar($data) {
    return htmlspecialchars(stripslashes(trim($data)));
}

function validarCredenciales($cedula, $pass, $rol) {
    $con = conectar_bd();
    $contrasenia_hash = md5($pass);

    switch($rol) {
        case "estudiante":
            $sql = "SELECT ci_alumno AS ci, nombre, apellido 
                    FROM alumnos 
                    WHERE ci_alumno = '$cedula' AND contrasena = '$contrasenia_hash'";
            $home = "../pages/alumno.html";
            break;

        case "profesor":
            $sql = "SELECT ci_docente AS ci, nombre, apellido 
                    FROM docente 
                    WHERE ci_docente = '$cedula' AND contrasena_docente = '$contrasenia_hash'";
            $home = "../pages/docente.html";
            break;

        case "administrador":
            $sql = "SELECT ci_adscripta AS ci, nombre, apellido 
                    FROM adscripta 
                    WHERE ci_adscripta = '$cedula' AND contrasena_adscripta = '$contrasenia_hash'";
            $home = "../pages/adscripcion.html";
            break;

        default:
            return false;
    }

    $resultado = mysqli_query($con, $sql);

    if ($resultado && mysqli_num_rows($resultado) == 1) {
        $usuario = mysqli_fetch_assoc($resultado);
        $usuario['rol'] = $rol;
        $usuario['home'] = $home;
        return $usuario;
    }

    return false;
}

function crearSesion($usuario) {
    $_SESSION['loggedin'] = true;
    $_SESSION['ci'] = $usuario['ci'];
    $_SESSION['nombre'] = $usuario['nombre'];
    $_SESSION['apellido'] = $usuario['apellido'];
    $_SESSION['rol'] = $usuario['rol'];
    $_SESSION['home'] = $usuario['home'];
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $cedula = limpiar($_POST['cedula']);
    $pass = $_POST['pass'];
    $rol = limpiar($_POST['rol']);

    $usuario = validarCredenciales($cedula, $pass, $rol);

    if ($usuario) {
        crearSesion($usuario);
        
        echo "Bienvenido/a {$usuario['rol']} {$usuario['nombre']} {$usuario['apellido']}<br>";
        echo "Tu home es: <a href='{$usuario['home']}'>Ingresar</a>";
    } else {
        echo "Cédula o contraseña incorrectos";
    }
}
?>



