<?php
include("../conexion.php");
$conexion = conectar_bd();

header('Content-Type: application/json');

$id = (int)$_GET['id'];
$sql = "SELECT hora, hora_fin FROM asistencia WHERE id=?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("i", $id);
$stmt->execute();
$res = $stmt->get_result()->fetch_assoc();
echo json_encode($res);
