<?php
include("../conexion.php");
$con = conectar_bd();

header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);

if(isset($data['accion'])) {
    $accion = $data['accion'];

    if($accion === "nuevo") {
        $grupo = $data['grupo'];
        $dia = $data['dia'] ?? 'Lunes';
        $hora = $data['hora'];
        $hora_fin = $data['hora_fin'] ?? '';
        $materia = $data['materia'] ?? '';
        $estado = $data['estado'] ?? '0';

        $sql = "INSERT INTO asistencia (grupo, dia, hora, hora_fin, materia, estado) VALUES (?, ?, ?, ?, ?, ?)";
        $stmt = $conexion->prepare($sql);
        $stmt->bind_param("ssssss", $grupo, $dia, $hora, $hora_fin, $materia, $estado);
        $stmt->execute();
        echo json_encode(["status"=>"ok", "id"=>$stmt->insert_id]);

    } elseif($accion === "eliminar") {
        $id = (int)$data['id'];
        $sql = "DELETE FROM asistencia WHERE id=?";
        $stmt = $conexion->prepare($sql);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        echo json_encode(["status"=>"ok"]);

    } elseif($accion === "guardar") {
        $id = (int)$data['id'];

        // Si solo viene estado, actualizamos solo el estado
        if(isset($data['estado']) && !isset($data['materia'])) {
            $estado = $data['estado'];
            $sql = "UPDATE asistencia SET estado=? WHERE id=?";
            $stmt = $conexion->prepare($sql);
            $stmt->bind_param("si", $estado, $id);
            $stmt->execute();
            echo json_encode(["status"=>"ok"]);
            exit;
        }

        // Si viene toda la info, actualizamos todo
        $grupo = $data['grupo'];
        $materia = $data['materia'];
        $hora = $data['hora'];
        $hora_fin = $data['hora_fin'];
        $estado = $data['estado'] ?? "0";

        $sql = "UPDATE asistencia SET grupo=?, materia=?, hora=?, hora_fin=?, estado=? WHERE id=?";
        $stmt = $conexion->prepare($sql);
        $stmt->bind_param("sssssi", $grupo, $materia, $hora, $hora_fin, $estado, $id);
        $stmt->execute();
        echo json_encode(["status"=>"ok"]);
    } elseif($accion === "reducir_hora") {
        $id = (int)$data['id'];
        $sql = "UPDATE asistencia SET hora_fin = hora_fin - 1 WHERE id = ? AND hora_fin > hora";
        $stmt = $conexion->prepare($sql);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        echo json_encode(["status"=>"ok"]);
    }
}
