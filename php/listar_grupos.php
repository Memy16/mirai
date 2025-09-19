<?php
// listar_grupos.php
header('Content-Type: application/json; charset=utf-8');
// evitar que errores se impriman junto al JSON en producción
ini_set('display_errors', 0);
error_reporting(E_ALL & ~E_NOTICE & ~E_WARNING);

require_once 'conexion.php';

$grupos = [];
$sql = "SELECT grado, nombre, especificacion FROM grupo ORDER BY grado, nombre";
if ($stmt = $conexion->prepare($sql)) {
    $stmt->execute();
    $res = $stmt->get_result();
    while ($row = $res->fetch_assoc()) {
        $grupos[] = $row;
    }
    $stmt->close();
}

echo json_encode($grupos, JSON_UNESCAPED_UNICODE);
$conexion->close();
?>