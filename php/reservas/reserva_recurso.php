<?php
header('Content-Type: application/json; charset=utf-8');
include("../conexion.php");
$con = conectar_bd();

$data = json_decode(file_get_contents("php://input"), true);
$id_recurso = intval($data['id_recurso']);
$fecha      = $con->real_escape_string($data['fecha']);
$turno      = $con->real_escape_string($data['turno']);
$hora       = $con->real_escape_string($data['hora']);

$sql_h = "SELECT id_horario FROM horarios WHERE turno='$turno' LIMIT 1";
$res_h = $con->query($sql_h);
if($res_h && $row_h = $res_h->fetch_assoc()){
    $id_horario = $row_h['id_horario'];
} else {
    echo json_encode(["success"=>false, "message"=>"Turno no válido"]);
    exit;
}

$sql_check = "SELECT * FROM reserva_recursos rr
JOIN horarios h ON h.id_horario = rr.id_horario
WHERE rr.id_recurso = $id_recurso
AND rr.hora_turno = '$hora'
AND rr.hora_reservada = '$fecha'
AND h.turno = '$turno'";

$result = $con->query($sql_check);
if($result && $result->num_rows > 0){
    echo json_encode(["success"=>false, "message"=>"El recurso ya está reservado en esa fecha y hora."]);
    exit;
}

$sql_reserva = "INSERT INTO reserva (hora_entrada, hora_salida) VALUES ('00:00:00', '00:00:00')";
if($con->query($sql_reserva)){
    $id_reserva = $con->insert_id;
    $sql_insert = "INSERT INTO reserva_recursos (id_reserva, id_recurso, id_horario, hora_turno, hora_reservada)
                   VALUES ($id_reserva, $id_recurso, $id_horario, '$hora', '$fecha')";
    if($con->query($sql_insert)){
        echo json_encode(["success"=>true, "message"=>"Recurso reservado correctamente"]);
    } else {
        echo json_encode(["success"=>false, "message"=>"Error al guardar la reserva en reserva_recursos: ".$con->error]);
    }
} else {
    echo json_encode(["success"=>false, "message"=>"Error al crear la reserva: ".$con->error]);
}

$con->close();
?>
