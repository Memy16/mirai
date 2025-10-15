<?php
header('Content-Type: application/json; charset=utf-8');

include("../conexion.php");
$con = conectar_bd();

$asignaturas = [];
$sql = "SELECT id_asignatura, nombre FROM asignatura ORDER BY nombre";
$result = $con->query($sql);

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $asignaturas[] = $row;
    }
    echo json_encode($asignaturas, JSON_UNESCAPED_UNICODE);
} else {
    http_response_code(500);
    echo json_encode(["error" => $con->error]);
}

$con->close();
?>