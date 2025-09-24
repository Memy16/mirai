<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
header('Content-Type: application/json; charset=utf-8');

include("conexion.php");
$con = conectar_bd();

$grupos = [];
$sql = "SELECT id_grupo, grado, nombre, turno, especificacion FROM grupo ORDER BY grado, nombre";
$result = $con->query($sql);

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $grupos[] = $row;
    }
    echo json_encode($grupos, JSON_UNESCAPED_UNICODE);
} else {
    // devuelve error en formato JSON
    http_response_code(500);
    echo json_encode(["error" => $con->error]);
}

$con->close();
