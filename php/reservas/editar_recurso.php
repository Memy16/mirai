<?php
require '../conexion.php';
$con = conectar_bd();

$data = json_decode(file_get_contents("php://input"), true);

$id = $data['id'] ?? null;
$nombre = $data['nombre'] ?? null;
$estado = $data['estado'] ?? null;

if (!$id || !$nombre || !$estado) {
    echo json_encode(["success" => false, "message" => "Datos incompletos."]);
    exit;
}

$stmt = $con->prepare("UPDATE recursos SET nombre = ?, estado = ? WHERE id_recurso = ?");
$stmt->bind_param("ssi", $nombre, $estado, $id);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Recurso actualizado correctamente."]);
} else {
    echo json_encode(["success" => false, "message" => "Error al actualizar recurso."]);
}

$stmt->close();
$con->close();
?>
