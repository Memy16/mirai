<?php
header('Content-Type: application/json; charset=utf-8');
include("../conexion.php");
$con = conectar_bd();

$data = json_decode(file_get_contents("php://input"), true);
$id_aula = intval($data['id_aula']);
$fecha   = $con->real_escape_string($data['fecha']);
$turno   = $con->real_escape_string($data['turno']);
$hora    = $con->real_escape_string($data['hora']);

$sql_h = "SELECT id_horario FROM horarios WHERE turno='$turno' LIMIT 1";
$res_h = $con->query($sql_h);
if($res_h && $row_h = $res_h->fetch_assoc()){
    $id_horario = $row_h['id_horario'];
} else {
    echo json_encode(["success"=>false, "message"=>"Turno no válido"]);
    exit;
}

$sql_check = "SELECT * FROM reserva_aulas ra
JOIN horarios h ON h.id_horario = ra.id_horario
WHERE ra.id_aula = $id_aula
AND ra.hora_turno = '$hora'
AND ra.hora_reservada = '$fecha'
AND h.turno = '$turno'";

$result = $con->query($sql_check);
if($result && $result->num_rows > 0){
    echo json_encode(["success"=>false, "message"=>"El aula ya está reservada en esa fecha y hora."]);
    exit;
}

$sql_reserva = "INSERT INTO reserva (hora_entrada, hora_salida) VALUES ('00:00:00', '00:00:00')";
if($con->query($sql_reserva)){
    $id_reserva = $con->insert_id;
    $sql_insert = "INSERT INTO reserva_aulas (id_reserva, id_aula, id_horario, hora_turno, hora_reservada)
                   VALUES ($id_reserva, $id_aula, $id_horario, '$hora', '$fecha')";
    if($con->query($sql_insert)){
        echo json_encode(["success"=>true, "message"=>"Reserva realizada correctamente"]);
    } else {
        echo json_encode(["success"=>false, "message"=>"Error al guardar la reserva en reserva_aulas: ".$con->error]);
    }
} else {
    echo json_encode(["success"=>false, "message"=>"Error al crear la reserva: ".$con->error]);
}

$con->close();
?>
