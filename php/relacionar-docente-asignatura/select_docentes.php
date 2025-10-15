<?php
header('Content-Type: application/json; charset=utf-8');

include("../conexion.php");
$con = conectar_bd();

$docentes = [];
$sql = "SELECT id_docente, nombre, apellido FROM docente ORDER BY nombre, apellido";
$result = $con->query($sql);

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $docentes[] = $row;
    }
    echo json_encode($docentes, JSON_UNESCAPED_UNICODE);
} else {
    http_response_code(500);
    echo json_encode(["error" => $con->error]);
}

$con->close();
?>
