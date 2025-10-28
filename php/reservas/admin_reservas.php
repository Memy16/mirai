<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['ci'])) {
    echo json_encode(["error" => "no_logged_in"]);
    exit();
}

require '../conexion.php';
$con = conectar_bd(); 

$ci = $_SESSION['ci'];

$resAulas = $con->query("SELECT id_reserva, id_aula, hora_turno, hora_reservada, turno 
                          FROM reserva_aulas 
                          WHERE Prof_ci = '$ci'");

$resRecursos = $con->query("SELECT id_reserva, id_recurso, hora_turno, hora_reservada, turno 
                             FROM reserva_recursos 
                             WHERE Prof_ci = '$ci'");

$resultado = [
    "aulas" => [],
    "recursos" => []
];

while ($row = $resAulas->fetch_assoc()) {
    $resultado["aulas"][] = $row;
}

while ($row = $resRecursos->fetch_assoc()) {
    $resultado["recursos"][] = $row;
}

echo json_encode($resultado);
$con->close();
?>
