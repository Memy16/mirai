<?php
include("../conexion.php");
$con = conectar_bd();

$nombreAsign = $_POST['nombre'];
$descripcionAsign = $_POST['descripcion'];

$stmt = $con->prepare("INSERT INTO asignatura (nombre, descripcion) VALUES (?, ?)");
$stmt->bind_param("ss", $nombreAsign, $descripcionAsign);


if($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => $con->error]);
}

$stmt->close();