<?php
include("../conexion.php");
$con = conectar_bd();

$idAlumno = $_POST['id_alumno'] ?? '';
$idGrupo = $_POST['id_grupo'] ?? '';

if ($idAlumno && $idGrupo) {
    $stmt = $con->prepare("UPDATE alumnos SET id_grupo = ? WHERE id_alumno = ?");
    $stmt->bind_param("ii", $idGrupo, $idAlumno);
    $stmt->execute();
    $stmt->close();
}

// Redirige de vuelta
header("Location: " . $_SERVER['HTTP_REFERER']);
exit;
?>
