<?php
include("../conexion.php");
$con = conectar_bd();

$ci = trim($_POST['ciAlumno'] ?? '');

$respuesta = ['existe' => false];

$stmt = $con->prepare("SELECT id_alumno, nombre, apellido, ci_alumno, tel_referente FROM alumnos WHERE ci_alumno = ? LIMIT 1");
$stmt->bind_param("s", $ci);
$stmt->execute();
$result = $stmt->get_result();

if ($result && $result->num_rows > 0) {
    $alumno = $result->fetch_assoc();
    $respuesta['existe'] = true;
    $respuesta['id_alumno'] = $alumno['id_alumno'];
    $respuesta['nombre'] = $alumno['nombre'];
    $respuesta['apellido'] = $alumno['apellido'];
    $respuesta['ci_alumno'] = $alumno['ci_alumno'];
    $respuesta['tel_referente'] = $alumno['tel_referente'];
}

$stmt->close();
$con->close();

echo json_encode($respuesta, JSON_UNESCAPED_UNICODE);
