<?php
include("../conexion.php");
$con = conectar_bd();

$sql = "SELECT id_asignatura, nombre FROM asignatura ORDER BY nombre ASC";
$result = $con->query($sql);

$asignaturas = [];
while ($row = $result->fetch_assoc()) {
    $asignaturas[] = $row;
}

echo json_encode($asignaturas, JSON_UNESCAPED_UNICODE);

$con->close();
?>
