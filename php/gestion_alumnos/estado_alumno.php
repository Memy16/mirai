<?php
header('Content-Type: application/json; charset=utf-8');
error_reporting(0);

include("../conexion.php");
$con = conectar_bd();

// Array para debug
$debug = [];

$ci = '';
if (!empty($_POST['ciAlumno'])) $ci = trim($_POST['ciAlumno']);
elseif (!empty($_POST['ci'])) $ci = trim($_POST['ci']);
elseif (!empty($_POST['ci_alumno'])) $ci = trim($_POST['ci_alumno']);
elseif (!empty($_GET['ci'])) $ci = trim($_GET['ci']);

$debug[] = "CI recibida: " . $ci;

if ($ci === '') {
    echo json_encode(['error' => true, 'message' => 'CI no recibida', 'debug' => $debug]);
    exit;
}

// Buscar alumno + grupo
$sql = "SELECT id_alumno, nombre, apellido, IFNULL(id_grupo, 0) AS id_grupo 
        FROM alumnos WHERE ci_alumno = ? LIMIT 1";
$stmt = $con->prepare($sql);

if (!$stmt) {
    echo json_encode(['error' => true, 'message' => 'Error en prepare', 'debug' => [$con->error]]);
    exit;
}

$stmt->bind_param("s", $ci);
$stmt->execute();
$res = $stmt->get_result();

$debug[] = "Query alumno ejecutado";
$debug[] = "Filas encontradas: " . ($res ? $res->num_rows : 0);

if (!$res || $res->num_rows === 0) {
    echo json_encode([
        'estado' => 'no_registrado', 
        'message' => 'Cédula no encontrada',
        'debug' => $debug
    ]);
    exit;
}

$alumno = $res->fetch_assoc();
$idAlumno = (int)$alumno['id_alumno'];
$idGrupo = (int)$alumno['id_grupo'];

$debug[] = "ID alumno: $idAlumno";
$debug[] = "ID grupo: $idGrupo";

if ($idGrupo === 0) {
    echo json_encode([
        'estado' => 'registrado_sin_grupo',
        'id_alumno' => $idAlumno,
        'nombre' => $alumno['nombre'],
        'apellido' => $alumno['apellido'],
        'debug' => $debug
    ]);
    exit;
}

// Buscar grupo
$sqlG = "SELECT grado, nombre AS nombre_grupo, IFNULL(especificacion, '') AS especificacion
         FROM grupo WHERE id_grupo = ? LIMIT 1";
$stmt2 = $con->prepare($sqlG);

if (!$stmt2) {
    echo json_encode(['error' => true, 'message' => 'Error prepare grupos', 'debug' => [$con->error]]);
    exit;
}

$stmt2->bind_param("i", $idGrupo);
$stmt2->execute();
$resG = $stmt2->get_result();

$debug[] = "Query grupo ejecutado";
$debug[] = "Filas grupo: " . ($resG ? $resG->num_rows : 0);

if ($resG && $resG->num_rows > 0) {
    $g = $resG->fetch_assoc();
    $grupoCompleto = trim("{$g['grado']} {$g['nombre_grupo']} {$g['especificacion']}");

    echo json_encode([
        'estado' => 'registrado_con_grupo',
        'id_alumno' => $idAlumno,
        'nombre' => $alumno['nombre'],
        'apellido' => $alumno['apellido'],
        'id_grupo' => $idGrupo,
        'grupo' => $grupoCompleto,
        'debug' => $debug
    ]);
} else {
    echo json_encode([
        'estado' => 'registrado_sin_grupo',
        'id_alumno' => $idAlumno,
        'nombre' => $alumno['nombre'],
        'apellido' => $alumno['apellido'],
        'warning' => 'Grupo no encontrado',
        'debug' => $debug
    ]);
}

$stmt->close();
if (isset($stmt2)) $stmt2->close();
$con->close();
?>
