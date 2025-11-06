<?php
header('Content-Type: application/json; charset=utf-8');
session_start();
include("conexion.php");

$con = conectar_bd();

$sql = "SELECT id_reserva, tipo_reserva, fecha, accion FROM historial ORDER BY id_historial";
$result = $con->query($sql);

$data = [];

while ($row = $result->fetch_assoc()) {
    $id_reserva = $row['id_reserva'];
    $tipo = $row['tipo_reserva'];

    if ($tipo == "AULA") {
        $sql2 = $con->prepare("SELECT id_aula, Prof_ci, hora_reservada, hora_turno, turno FROM reserva_aulas WHERE id_reserva = ?");
        $sql2->bind_param("i", $id_reserva);
    } else {
        $sql2 = $con->prepare("SELECT id_recurso, Prof_ci, hora_reservada, hora_turno, turno FROM reserva_recursos WHERE id_reserva = ?");
        $sql2->bind_param("i", $id_reserva);
    }

    $sql2->execute();
    $res2 = $sql2->get_result()->fetch_assoc();
    $sql2->close();

    if (!$res2) continue;

    $ci = $res2['Prof_ci'];

    // Datos del docente
    $stmt_doc = $con->prepare("SELECT nombre, apellido FROM adscripta WHERE ci_adscripta = ?");
    $stmt_doc->bind_param("s", $ci);
    $stmt_doc->execute();
    $doc = $stmt_doc->get_result()->fetch_assoc();
    $stmt_doc->close();

    // Datos del Aula o Recurso
    if ($tipo == "AULA") {
        $id = $res2['id_aula'];
        $stmt_item = $con->prepare("SELECT nombre FROM aulas WHERE id_aula = ?");
        $stmt_item->bind_param("i", $id);
    } else {
        $id = $res2['id_recurso'];
        $stmt_item = $con->prepare("SELECT nombre FROM recursos WHERE id_recurso = ?");
        $stmt_item->bind_param("i", $id);
    }

    $stmt_item->execute();
    $item = $stmt_item->get_result()->fetch_assoc();
    $stmt_item->close();

    $data[] = [
        "id_reserva"   => $id_reserva,
        "tipo"         => $tipo,
        "docente"      => $doc['nombre'] . " " . $doc['apellido'],
        "ci"           => $ci,
        "item"         => $item['nombre'], // aula o recurso
        "fecha"        => $res2['hora_reservada'],
        "hora"         => $res2['hora_turno'],
        "turno"        => $res2['turno'],
        "accion"       => $row['accion'],
        "fecha_hist"   => $row['fecha']
    ];
}

echo json_encode(["success" => true, "historial" => $data], JSON_PRETTY_PRINT);

$con->close();
?>
