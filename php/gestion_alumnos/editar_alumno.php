<?php
include("conexion.php");
$con = conectar_bd();

header('Content-Type: application/json');

if (!isset($_POST['id'], $_POST['cedula'])) {
    echo json_encode(["success" => false, "error" => "Faltan datos"]);
    exit;
}

$id = intval($_POST['id']);
$nombre = ($_POST['nombre']);
$apellido = ($_POST['apellido']);
$tel = ($_POST['telefonoReferente']);

$stmt = $con->prepare("UPDATE alumnos 
        SET nombre=?, apellido=?, telefonoReferente=? 
        WHERE id_alumno=?");
$stmt->bind_param("siss", $nombre, $apellido, $tel, $id);
if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "error" => "No se encontró el alumno o no se realizaron cambios"]);
    }
} else {
    echo json_encode(["success" => false, "error" => $con->error]);
}

$stmt->close();
$con->close();