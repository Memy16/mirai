<?php
header('Content-Type: application/json; charset=utf-8');
error_reporting(0);

include("../conexion.php");
$con = conectar_bd();

// Aceptar varios nombres de campo (por si tus formularios usan otro)
$ci = '';
if (!empty($_POST['ciAlumno'])) $ci = trim($_POST['ciAlumno']);
elseif (!empty($_POST['ci'])) $ci = trim($_POST['ci']);
elseif (!empty($_POST['ci_alumno'])) $ci = trim($_POST['ci_alumno']);
elseif (!empty($_GET['ci'])) $ci = trim($_GET['ci']);
//echo json_encode(['error' => true, 'message' => $ci]);
// Si no llegó la CI -> devolver error claro
if ($ci === '') {
    echo json_encode(['error' => true, 'message' => 'CI no recibida']);
    exit;
}

// Buscar alumno y su id_grupo en una sola query
$sql = "SELECT id_alumno, nombre, apellido, IFNULL(id_grupo, 0) AS id_grupo FROM alumnos WHERE ci_alumno = ? LIMIT 1";
$stmt = $con->prepare($sql);
if (!$stmt) {
    echo json_encode(['error' => true, 'message' => 'Error en la preparación de la consulta', 'debug' => $con->error]);
    exit;
}
$stmt->bind_param("s", $ci);
$stmt->execute();
$res = $stmt->get_result();

if (!$res || $res->num_rows === 0) {
    echo json_encode(['estado' => 'no_registrado', 'message' => 'Cédula no encontrada']);
    exit;
}

$alumno = $res->fetch_assoc();
$idAlumno = (int)$alumno['id_alumno'];
$idGrupo = (int)$alumno['id_grupo'];

// Si no tiene grupo
if ($idGrupo === 0) {
    echo json_encode([
        'estado' => 'registrado_sin_grupo',
        'id_alumno' => $idAlumno,
        'nombre' => $alumno['nombre'],
        'apellido' => $alumno['apellido']
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// Si tiene grupo: buscar datos del grupo
$sqlG = "SELECT grado, nombre AS nombre_grupo, IFNULL(especificacion, '') AS especificacion FROM grupos WHERE id_grupo = ? LIMIT 1";
$stmt2 = $con->prepare($sqlG);
if (!$stmt2) {
    echo json_encode(['error' => true, 'message' => 'Error preparando consulta grupo', 'debug' => $con->error]);
    exit;
}
$stmt2->bind_param("i", $idGrupo);
$stmt2->execute();
$resG = $stmt2->get_result();

if ($resG && $resG->num_rows > 0) {
    $g = $resG->fetch_assoc();
    $grupoCompleto = trim("{$g['grado']} {$g['nombre_grupo']} {$g['especificacion']}");
    echo json_encode([
        'estado' => 'registrado_con_grupo',
        'id_alumno' => $idAlumno,
        'nombre' => $alumno['nombre'],
        'apellido' => $alumno['apellido'],
        'id_grupo' => $idGrupo,
        'grupo' => $grupoCompleto
    ], JSON_UNESCAPED_UNICODE);
} else {
    // id_grupo no existe en tabla grupos -> tratamos como sin grupo
    echo json_encode([
        'estado' => 'registrado_sin_grupo',
        'id_alumno' => $idAlumno,
        'nombre' => $alumno['nombre'],
        'apellido' => $alumno['apellido'],
        'warning' => 'id_grupo no encontrado en tabla grupos'
    ], JSON_UNESCAPED_UNICODE);
}

$stmt->close();
if (isset($stmt2)) $stmt2->close();
$con->close();
?>