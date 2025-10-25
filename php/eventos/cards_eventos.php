<?php
include("../conexion.php");
$con = conectar_bd();

$sql = "SELECT * FROM eventos ORDER BY id_evento DESC";
$result = $con->query($sql);

$eventos = [];
while ($row = $result->fetch_assoc()) {
    $eventos[] = $row;
}

echo json_encode($eventos);