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
            $stmt = $con->prepare("UPDATE alumnos SET nombre=?, apellido=?, mail=? WHERE id_alumno=?");
            $stmt->bind_param("sssi", $nombre, $apellido, $email, $id);
            break;
    case "profesor":
            $stmt = $con->prepare("UPDATE docente SET nombre=?, apellido=?, mail_docente=?, tel_docente=? WHERE id_docente=?");
            $stmt->bind_param("ssssi", $nombre, $apellido, $email, $tel, $id);
        break;
        
    case "administrador":
            $stmt = $con->prepare("UPDATE adscripta SET nombre=?, apellido=?, mail_adscripta=?, tel_adscripta=? WHERE id_adscripta=?");
            $stmt->bind_param("ssssi", $nombre, $apellido, $email, $tel, $id);
        break;
        
    default:
        echo json_encode(["error" => "Rol no válido"]);
        exit;
}

if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "error" => "No se encontró el usuario o no se realizaron cambios"]);
    }
} else {
    echo json_encode(["success" => false, "error" => $con->error]);
}

$stmt->close();
$con->close();
?>
