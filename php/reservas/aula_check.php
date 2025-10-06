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
$sql_h = "SELECT id_horario FROM horarios WHERE turno='$turno' LIMIT 1";
$res_h = $con->query($sql_h);
if($res_h && $row_h = $res_h->fetch_assoc()){
    $id_horario = $row_h['id_horario'];
} else {
    echo json_encode(["success"=>false, "message"=>"Turno no válido"]);
    exit;
}

// Verificar si ya existe reserva
$sql_check = "SELECT * FROM reserva_aulas 
              WHERE id_aula=$id_aula 
              AND id_horario=$id_horario 
              AND hora_turno='$hora'
              LIMIT 1";


$result = $con->query($sql_check);

if($result && $result->num_rows > 0){
    echo json_encode(["success"=>true, "reservado"=>true]);
}else{
    echo json_encode(["success"=>true, "reservado"=>false]);
}

$con->close();
?>
