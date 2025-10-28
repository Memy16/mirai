<?php
header('Content-Type: application/json; charset=utf-8');
include("conexion.php");
$con = conectar_bd();

$result = $con->query("SELECT id, hora, hora_fin FROM horas_horarios ORDER BY id ASC");
$horarios = [];

if($result){
    while($row = $result->fetch_assoc()){
        $horarios[] = [
            "id" => $row['id'],
            "hora" => $row['hora'],
            "hora_fin" => $row['hora_fin'],
            "formatted" => $row['hora'] . " - " . $row['hora_fin']
        ];
    }
}

echo json_encode($horarios);
$con->close();
?>
