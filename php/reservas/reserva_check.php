<?php
header('Content-Type: application/json; charset=utf-8');
include("../conexion.php");
$con = conectar_bd();

$data = json_decode(file_get_contents("php://input"), true);
$id_recurso = intval($data['id_recurso']);
$fecha = $con->real_escape_string($data['fecha']);
$turno = $con->real_escape_string($data['turno']);
$hora = $con->real_escape_string($data['hora']);

$sql_check = "SELECT * FROM reserva_recursos rr
JOIN horarios h ON h.id_horario = rr.id_horario
WHERE rr.id_recurso = $id_recurso
AND rr.hora_turno = '$hora'
AND rr.hora_reservada = '$fecha'
AND h.turno = '$turno'";

$result = $con->query($sql_check);

echo json_encode([
    "reservado" => ($result && $result->num_rows > 0)
]);

$con->close();
?>
