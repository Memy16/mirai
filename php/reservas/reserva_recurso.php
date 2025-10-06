<?php
header('Content-Type: application/json; charset=utf-8');
include("../conexion.php");
$con = conectar_bd();

$data = json_decode(file_get_contents("php://input"), true);
$id_recurso = intval($data['id_recurso']);
$fecha      = $con->real_escape_string($data['fecha']);
$turno      = $con->real_escape_string($data['turno']);
$hora       = $con->real_escape_string($data['hora']);

$stmt_h = $con->prepare("SELECT id_horario FROM horarios WHERE turno=? LIMIT 1");
$stmt_h->bind_param("s", $turno);
$stmt_h->execute();

$res_h = $stmt_h->get_result();
if($res_h && $row_h = $res_h->fetch_assoc()){
    $id_horario = $row_h['id_horario'];
} else {
    echo json_encode(["success"=>false, "message"=>"Turno no válido"]);
    exit;
}
$stmt_h->close();

$stmt_check = $con->prepare("SELECT * FROM reserva_recursos rr
JOIN horarios h ON h.id_horario = rr.id_horario
WHERE rr.id_recurso = ?
AND rr.hora_turno = ?
AND rr.hora_reservada = ?
AND h.turno = ?") ;
$stmt_check->bind_param("isss", $id_recurso, $hora, $fecha, $turno);
$stmt_check->execute();

$result = $stmt_check->get_result();
if($result && $result->num_rows > 0){
    echo json_encode(["success"=>false, "message"=>"El recurso ya está reservado en esa fecha y hora."]);
    exit;
}
$stmt_check->close();

$sql_reserva = "INSERT INTO reserva (hora_entrada, hora_salida) VALUES ('00:00:00', '00:00:00')";
if($con->query($sql_reserva)){
    $id_reserva = $con->insert_id;
    $stmt_insert = $con->prepare("INSERT INTO reserva_recursos (id_reserva, id_recurso, id_horario, hora_turno, hora_reservada) VALUES (?, ?, ?, ?, ?)");
    $stmt_insert->bind_param("iiiss", $id_reserva, $id_recurso, $id_horario, $hora, $fecha);
    if($stmt_insert->execute()){
        echo json_encode(["success"=>true, "message"=>"Recurso reservado correctamente"]);
    } else {
        echo json_encode(["success"=>false, "message"=>"Error al guardar la reserva en reserva_recursos: ".$con->error]);
    }
    $stmt_insert->close();
} else {
    echo json_encode(["success"=>false, "message"=>"Error al crear la reserva: ".$con->error]);
}

$con->close();
?>
