<?php
include("../conexion.php");
$con = conectar_bd();

header('Content-Type: application/json');

if (!isset($_POST['id'], $_POST['nombre'], $_POST['cantidad'])) {
    echo json_encode(["success" => false, "error" => "Faltan datos"]);
    exit;
}

$id = intval($_POST['id']);
$nombre = ($_POST['nombre']);
$cantidad = ($_POST['cantidad']);

$stmt = $con->prepare("UPDATE recursos 
        SET nombre=?, cantidad=?
        WHERE id_recurso=?");
$stmt->bind_param("sii", $nombre, $cantidad, $id);
if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "error" => "No se encontró el recurso o no se realizaron cambios"]);
    }
} else {
    echo json_encode(["success" => false, "error" => $con->error]);
}

$stmt->close();
$con->close();