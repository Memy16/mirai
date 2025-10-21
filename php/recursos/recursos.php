<?php
include("../conexion.php");
$con = conectar_bd();

$nombreRecurso = $_POST['nombre'];
$estado = "LIBRE";
$cantidadRecurso = $_POST['cantidad'];

$stmt = $con->prepare("INSERT INTO recursos (nombre, estado, cantidad) VALUES (?, ?, ?)");
$stmt->bind_param("ssi", $nombreRecurso, $estado, $cantidadRecurso);


if($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => $con->error]);
}

$stmt->close();