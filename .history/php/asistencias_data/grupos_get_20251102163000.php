<?php
session_start();
header('Content-Type: application/json'); // <-- siempre primero
if (!isset($_SESSION['ci'])) {
    echo json_encode(["error" => "no_logged_in"]);
    exit();
}
include("../conexion.php");
$conexion = conectar_bd();

header('Content-Type: application/json');

$sql = "SELECT nombre, grado, turno, especificacion FROM grupo ORDER BY nombre";
$result = $conexion->query($sql);

$grupos = [];
while($row = $result->fetch_assoc()) {
    $grupos[] = $row;
}

echo json_encode($grupos, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
