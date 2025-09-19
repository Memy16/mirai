<?php
include("../conexion.php");
$con = conectar_bd();

header('Content-Type: application/json');

$sql = "SELECT DISTINCT grupo FROM asistencia ORDER BY grupo";
$result = $conexion->query($sql);

$grupos = [];
while($row = $result->fetch_assoc()) {
    $grupos[] = $row['grupo'];
}

echo json_encode($grupos);
?>
