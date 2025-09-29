<?php
include("../conexion.php");
$conexion = conectar_bd();

header('Content-Type: application/json');

$grupo = $_GET['grupo'] ?? '';
$grupo = urldecode($grupo);

$sqlAsistencia = "SELECT id, dia, hora, hora_fin, materia, estado 
                  FROM asistencia 
                  WHERE grupo = ? 
                  ORDER BY hora, dia";
$stmt = $conexion->prepare($sqlAsistencia);
$stmt->bind_param("s", $grupo);
$stmt->execute();
$resultAsistencia = $stmt->get_result();

$asistencias = $resultAsistencia->fetch_all(MYSQLI_ASSOC);

echo json_encode($asistencias, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
