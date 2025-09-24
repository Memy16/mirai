<?php
include("conexion.php");
$con = conectar_bd();

$id = intval($_POST['id']);
$sql = "SELECT id_grupo, nombre, grado, turno, especificacion FROM grupo WHERE id_grupo=$id LIMIT 1";
$result = $con->query($sql);

if ($row = $result->fetch_assoc()) {
    echo json_encode($row, JSON_UNESCAPED_UNICODE);
} else {
    echo json_encode(["error" => "Grupo no encontrado"]);
}
$con->close();
