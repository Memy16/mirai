<?php
include("../conexion.php");
$conexion = conectar_bd();

header('Content-Type: application/json');

$grupo = $_GET['grupo'] ?? '3MA';

$sql = "SELECT id, dia, hora, hora_fin, materia, estado FROM asistencia WHERE grupo = ? ORDER BY hora, dia";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("s", $grupo);
$stmt->execute();
$result = $stmt->get_result();

$asistencia = $result->fetch_all(MYSQLI_ASSOC);
echo json_encode($asistencia);
