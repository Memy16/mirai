<?php
session_start();
include("conexion.php");
$con = conectar_bd();

header("Content-Type: application/json");

if (!isset($_POST['id'], $_POST['rol'])) {
    echo json_encode(["error" => "Faltan datos"]);
    exit;
}

$id = intval($_POST['id']);
$rol = $_POST['rol'];
$nombre = ($_POST['nombre']);
$apellido = ($_POST['apellido']);
$email = ($_POST['email']);
$tel = ($_POST['telefono']);

/*$password_actual = $_POST['password_actual'] ?? null;
$password_nueva  = $_POST['password_nueva'] ?? null;
$password_repetir= $_POST['password_repetir'] ?? null;*/

switch($rol) {
    case "estudiante":
            $sql = "UPDATE alumnos SET nombre='$nombre', apellido='$apellido', mail='$email' WHERE id_alumno='$id'";
            break;
    case "profesor":
            $sql = "UPDATE docente SET nombre='$nombre', apellido='$apellido', mail_docente='$email', tel_docente='$tel' WHERE id_docente='$id'";
        break;

    case "administrador":
            $sql = "UPDATE adscripta SET nombre='$nombre', apellido='$apellido', mail_adscripta='$email', tel_adscripta='$tel' WHERE id_adscripta='$id'";
        break;
        
    default:
        echo json_encode(["error" => "Rol no válido"]);
        exit;
}

if ($con->query($sql) === TRUE) {
    if ($con->affected_rows > 0) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "error" => "No se encontró el usuario o no se realizaron cambios"]);
    }
} else {
    echo json_encode(["success" => false, "error" => $con->error]);
}

$con->close();
?>
