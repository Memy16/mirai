<?php
include("conexion.php");
$con = conectar_bd();

$id = intval($_POST['id']);

$stmt = $con->prepare("SELECT id_grupo, nombre, grado, turno, especificacion FROM grupo WHERE id_grupo=? LIMIT 1");
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    echo json_encode($row, JSON_UNESCAPED_UNICODE);
} else {
    echo json_encode(["error" => "Grupo no encontrado"]);
}

$stmt->close();
$con->close();
