<?php
include("../conexion.php");
$con = conectar_bd();

$ci = trim($_POST['ciAlumno'] ?? '');

$respuesta = ['registrado' => false];

$stmt = $con->prepare("SELECT id_alumno FROM alumnos WHERE ci_alumno = ? LIMIT 1");
$stmt->bind_param("s", $ci);
$stmt->execute();
$result = $stmt->get_result();

if ($result && $result->num_rows > 0) {
    $respuesta['registrado'] = true;
}

$stmt->close();
$con->close();

echo json_encode($respuesta, JSON_UNESCAPED_UNICODE);

