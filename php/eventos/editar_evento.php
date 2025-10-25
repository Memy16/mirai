<?php
include("../conexion.php");
$con = conectar_bd();

header('Content-Type: application/json');

if (!isset($_POST['id'], $_POST['nombre'], $_POST['descripcion'])) {
    echo json_encode(["success" => false, "error" => "Faltan datos"]);
    exit;
}

$id = intval($_POST['id']);
$nombre = ($_POST['nombre']);
$descripcion = ($_POST['descripcion']);

$stmt = $con->prepare("UPDATE asignatura 
        SET nombre=?, descripcion=?
        WHERE id_asignatura=?");
$stmt->bind_param("ssi", $nombre, $descripcion, $id);
if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "error" => "No se encontró la asignatura o no se realizaron cambios"]);
    }
} else {
    echo json_encode(["success" => false, "error" => $con->error]);
}

$stmt->close();
$con->close();