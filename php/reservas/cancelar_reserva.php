<?php
session_start();
if (!isset($_SESSION['ci'])) {
    header("Location: ../../login.html");
    exit();
}

require '../conexion.php';
$con = conectar_bd(); 

$data = json_decode(file_get_contents("php://input"), true);

$id = intval($data["id"]);
$tipo = $data["tipo"];
$ci = $_SESSION['ci'];

$tabla = $tipo === "aula" ? "reserva_aulas" : "reserva_recursos";

$check = $con->query("SELECT * FROM $tabla WHERE id_reserva = '$id' AND Prof_ci = '$ci'");
if ($check->num_rows === 0) {
    echo json_encode(["error" => "No tienes permiso para cancelar esta reserva."]);
    exit();
}

$con->query("DELETE FROM $tabla WHERE id_reserva = '$id'");
if ($con->affected_rows > 0) {
    echo json_encode(["message" => "Reserva cancelada exitosamente."]);
} else {
    echo json_encode(["error" => "Error al cancelar la reserva."]);
}

$con->close();
?>
