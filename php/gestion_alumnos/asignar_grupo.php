<?php
header("Content-Type: application/json");
require_once '../conexion.php';
$con = conectar_bd();

$idAlumno = $_POST['id_alumno'] ?? null;
$idGrupo = $_POST['id_grupo'] ?? null;

if (!$idAlumno || !$idGrupo) {
    echo json_encode([
        "success" => false,
        "message" => "Faltan parámetros"
    ]);
    exit;
}

$stmt = $con->prepare("UPDATE alumnos SET id_grupo = ? WHERE id_alumno = ?");
$stmt->bind_param("ii", $idGrupo, $idAlumno);

if ($stmt->execute()) {
    echo json_encode([
        "success" => true,
        "message" => "Alumno asignado correctamente"
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Error al asignar alumno"
    ]);
}

$stmt->close();
$con->close();
?>
