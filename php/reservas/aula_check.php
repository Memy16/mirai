<?php
header('Content-Type: application/json; charset=utf-8');
include("../conexion.php");
$con = conectar_bd();

$data = json_decode(file_get_contents("php://input"), true);

$id_aula = intval($data['id_aula'] ?? 0);
$fecha   = $con->real_escape_string($data['fecha'] ?? '');
$turno   = $con->real_escape_string($data['turno'] ?? '');
$hora    = $con->real_escape_string($data['hora'] ?? '');

// Obtener id_horario según turno
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

// Verificar si ya existe reserva
$stmt_check = $con->prepare("SELECT * FROM reserva_aulas 
                WHERE id_aula=? 
                AND id_horario=? 
                AND hora_turno=?
                LIMIT 1");

$stmt_check->bind_param("iis", $id_aula, $id_horario, $hora);
$stmt_check->execute();
$result = $stmt_check->get_result();

if($result && $result->num_rows > 0){
    echo json_encode(["success"=>true, "reservado"=>true]);
}else{
    echo json_encode(["success"=>true, "reservado"=>false]);
}

$stmt_check->close();
$con->close();
?>
