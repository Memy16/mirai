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

switch($rol) {
    case "estudiante":
            $stmt = $con->prepare("DELETE FROM alumnos WHERE id_alumno=?");
            $stmt->bind_param("i", $id);
            break;
    case "profesor":
            $stmt = $con->prepare("DELETE FROM docente WHERE id_docente=?");
            $stmt->bind_param("i", $id);
            break;
    case "administrador":
            $stmt = $con->prepare("DELETE FROM adscripta WHERE id_adscripta=?");
            $stmt->bind_param("i",  $id);
        break;
        
    default:
        echo json_encode(["error" => "Rol no válido"]);
        exit;
}


if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "error" => $con->error]);
}

$stmt->close();
$con->close();
?>