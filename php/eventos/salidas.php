<?php
include("../conexion.php");
$con = conectar_bd();

$sql = "SELECT * FROM eventos WHERE tipo_evento = 'Salida' ORDER BY id_evento DESC";
$result = $con->query($sql);

$salidas = [];
while ($row = $result->fetch_assoc()) {
    $salidas[] = $row;
}

echo json_encode($salidas);