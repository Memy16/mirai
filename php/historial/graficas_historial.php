<?php
include("../conexion.php");
$con = conectar_bd();

// Distribución por tipo de reserva
$sql1 = "SELECT tipo_reserva, COUNT(*) as total FROM historial GROUP BY tipo_reserva";
$res1 = $con->query($sql1);
$data_tipo = [];
while ($row = $res1->fetch_assoc()) {
    $data_tipo[$row['tipo_reserva']] = intval($row['total']);
}

// Actividad por día (últimos 7 días)
$sql2 = "SELECT DATE(fecha) as dia, COUNT(*) as total 
            FROM historial 
            WHERE fecha >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
            GROUP BY dia";
$res2 = $con->query($sql2);
$data_fechas = [];
while ($row = $res2->fetch_assoc()) {
    $data_fechas[] = ["fecha" => $row['dia'], "total" => intval($row['total'])];
}

// Recursos más usados (requiere JOIN con reserva_recursos)
$sql3 = "SELECT r.nombre AS recursos, COUNT(h.id_historial) AS total
            FROM historial h
            JOIN reserva_recursos rr ON rr.id_reserva = h.id_reserva
            JOIN recursos r ON r.id_recurso = rr.id_recurso
            GROUP BY r.nombre
            ORDER BY total DESC
            LIMIT 5";
$res3 = $con->query($sql3);
$data_mas = [];
while ($row = $res3->fetch_assoc()) {
    $data_mas[] = ["recursos" => $row['recursos'], "total" => intval($row['total'])];
}

// Recursos menos usados (mismo JOIN, orden inverso)
$sql4 = "SELECT r.nombre AS recursos, COUNT(h.id_historial) AS total
            FROM historial h
            JOIN reserva_recursos rr ON rr.id_reserva = h.id_reserva
            JOIN recursos r ON r.id_recurso = rr.id_recurso
            GROUP BY r.nombre
            ORDER BY total ASC
            LIMIT 5";
$res4 = $con->query($sql4);
$data_menos = [];
while ($row = $res4->fetch_assoc()) {
    $data_menos[] = ["recursos" => $row['recursos'], "total" => intval($row['total'])];
}

// Tendencia mensual de reservas
$sql5 = "SELECT DATE_FORMAT(fecha, '%Y-%m') AS mes, COUNT(*) as total
            FROM historial
            GROUP BY mes
            ORDER BY mes ASC";
$res5 = $con->query($sql5);
$data_meses = [];
while ($row = $res5->fetch_assoc()) {
    $data_meses[] = ["mes" => $row['mes'], "total" => intval($row['total'])];
}

// Acciones registradas (crear, modificar, eliminar)
$sql6 = "SELECT accion, COUNT(*) as total FROM historial GROUP BY accion";
$res6 = $con->query($sql6);
$data_acciones = [];
while ($row = $res6->fetch_assoc()) {
    $data_acciones[] = ["accion" => $row['accion'], "total" => intval($row['total'])];
}

echo json_encode([
    "por_tipo" => $data_tipo,
    "por_fecha" => $data_fechas,
    "mas_usados" => $data_mas,
    "menos_usados" => $data_menos,
    "por_mes" => $data_meses,
    "acciones" => $data_acciones
], JSON_UNESCAPED_UNICODE);

$con->close();
