<?php
header("Content-Type: application/json");
include "../conexion.php";
$con = conectar_bd();

$id_tema = intval($_GET["id_tema"] ?? 0);

$sql = "SELECT nombre, rol, mensaje, likes, fecha, id FROM foro_mensajes WHERE id_tema = ? ORDER BY fecha DESC";
// CORRECCIÓN: Usar $con en lugar de $conn
$stmt = $con->prepare($sql);
$stmt->bind_param("i", $id_tema);
$stmt->execute();
$result = $stmt->get_result();

$mensajes = [];
while ($row = $result->fetch_assoc()) {
    $mensajes[] = $row;
}

echo json_encode($mensajes);
