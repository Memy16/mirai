<?php
header("Content-Type: application/json");
include "../conexion.php";
$con = conectar_bd();

$res = $con->query("SELECT * FROM foro_temas ORDER BY fecha DESC");
$temas = [];
while ($row = $res->fetch_assoc()) {
    $temas[] = $row;
}
echo json_encode($temas);
$con->close();
