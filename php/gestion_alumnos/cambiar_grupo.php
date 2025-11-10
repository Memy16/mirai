<?php
include("../conexion.php");
$con = conectar_bd();

$idAlumno = $_POST['id_alumno'] ?? '';
$idGrupo = $_POST['id_grupo'] ?? '';

if (!$idAlumno || !$idGrupo) {
    echo json_encode(["success" => false, "message" => "Faltan datos"]);
    exit;
}

$stmt = $con->prepare("UPDATE alumnos SET id_grupo = ? WHERE id_alumno = ?");
$stmt->bind_param("ii", $idGrupo, $idAlumno);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Grupo actualizado"]);
} else {
    echo json_encode(["success" => false, "message" => "Error al actualizar"]);
}

$stmt->close();
$con->close();
