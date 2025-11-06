<?php
session_start();
header('Content-Type: application/json; charset=utf-8');
include("../conexion.php");
$con = conectar_bd();

$data = json_decode(file_get_contents("php://input"), true);
$id_aula = intval($data['id_aula']);
$fecha   = $con->real_escape_string($data['fecha']);
$turno   = $con->real_escape_string($data['turno']);
$hora    = $con->real_escape_string($data['hora']);
if (!isset($_SESSION['ci'])) {
    echo json_encode(["error" => "no_logged_in"]);
    exit();
}
$ci = $_SESSION['ci'];

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

$stmt_check = $con->prepare("
    SELECT * FROM reserva_aulas
    WHERE id_aula = ?
    AND hora_turno = ?
    AND hora_reservada = ?
    AND turno = ?
");
$stmt_check->bind_param("isss", $id_aula, $hora, $fecha, $turno);
$stmt_check->execute();
$result = $stmt_check->get_result();

if($result && $result->num_rows > 0){
    echo json_encode(["success"=>false, "message"=>"El aula ya está reservada en esa fecha y hora."]);
    exit;
}
$stmt_check->close();


$sql_reserva = "INSERT INTO reserva (hora_entrada, hora_salida) VALUES ('00:00:00', '00:00:00')";
if($con->query($sql_reserva)){
    $id_reserva = $con->insert_id;

    $stmt_insert = $con->prepare("INSERT INTO reserva_aulas (id_reserva, id_aula, id_horario, hora_turno, hora_reservada, Prof_ci, turno) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt_insert->bind_param("iiissss", $id_reserva, $id_aula, $id_horario, $hora, $fecha, $ci, $turno);
    if($stmt_insert->execute()){
        echo json_encode(["success"=>true, "message"=>"Reserva realizada correctamente"]);
    } else {
        echo json_encode(["success"=>false, "message"=>"Error al guardar la reserva en reserva_aulas: ".$con->error]);
    }
    $stmt_insert->close();
} else {
    echo json_encode(["success"=>false, "message"=>"Error al crear la reserva: ".$con->error]);
}

$con->close();
?>
