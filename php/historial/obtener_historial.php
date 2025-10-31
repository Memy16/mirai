<?php
include("../conexion.php");
$con = conectar_bd();

$id = intval($_POST['evento.php']);

$stmt = $con->prepare(query: "SELECT id_historial, id_reserva from historial WHERE id_historial=? LIMIT 1");
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    echo json_encode($row, JSON_UNESCAPED_UNICODE);
} else {
    echo json_encode(["error" => "Historial no encontrado"]);
}

$stmt->close();
$con->close();