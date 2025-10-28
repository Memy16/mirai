<?php
session_start();
if (!isset($_SESSION['ci'])) {
    header("Location: ../../login.html");
    exit();
}

require '../conexion.php';
$con = conectar_bd(); 

$data = json_decode(file_get_contents("php://input"), true);

$id = intval($data["id_reserva"]);
$fecha = $data["hora_reservada"];
$hora = $data["hora_turno"];
$turno = $data["turno"];
$tipo = $data["tipo"]; 

$tabla = $tipo === "aula" ? "reserva_aulas" : "reserva_recursos";
$ci = $_SESSION['ci'];


$check = $con->query("SELECT * FROM $tabla WHERE id_reserva = '$id' AND Prof_ci = '$ci'");
if ($check->num_rows === 0) {
    echo json_encode(["error" => "No tienes permiso para editar esta reserva."]);
    exit();
}

$sql = "UPDATE $tabla SET hora_reservada = ?, hora_turno = ?, turno = ? WHERE id_reserva = ?";
$stmt = $con->prepare($sql);
$stmt->bind_param("sssi", $fecha, $hora, $turno, $id);

if ($stmt->execute()) {
    echo json_encode(["message" => "Reserva actualizada correctamente."]);
} else {
    echo json_encode(["error" => "Error al actualizar la reserva."]);
}

$stmt->close();
$con->close();
?>
