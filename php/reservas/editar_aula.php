<?php
require '../conexion.php';
$con = conectar_bd();

$data = json_decode(file_get_contents("php://input"), true);

$id = $data['id'] ?? null;
$nombre = $data['nombre'] ?? null;
$cantidad = $data['cantidad'] ?? null;
$tipo = $data['tipo'] ?? null;

if (!$id || !$nombre || !$cantidad || !$tipo) {
    echo json_encode(["success" => false, "message" => "Datos incompletos."]);
    exit;
}

$stmt = $con->prepare("UPDATE aulas SET nombre = ?, cantidad = ?, tipo = ? WHERE id_aula = ?");
$stmt->bind_param("sisi", $nombre, $cantidad, $tipo, $id);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Aula actualizada correctamente."]);
} else {
    echo json_encode(["success" => false, "message" => "Error al actualizar aula."]);
}

$stmt->close();
$con->close();
?>
