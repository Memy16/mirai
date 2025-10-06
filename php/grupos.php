<?php
include("conexion.php");
$con = conectar_bd();

$nombreGrupo = $_POST['nombreGrupo'];
$gradoGrupo = $_POST['gradoGrupo'];
$turno = $_POST['turno'];
$especificacionGrupo = $_POST['especificacionGrupo'];

$turnosValidos = ['MATUTINO', 'VESPERTINO', 'NOCTURNO'];
if (!in_array($turno, $turnosValidos)) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Turno no válido"]);
    exit;
}

$stmt = $con->prepare("INSERT INTO grupo (nombre, grado, turno, especificacion) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssss", $nombreGrupo, $gradoGrupo, $turno, $especificacionGrupo);


if($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => $con->error]);
}

$stmt->close();