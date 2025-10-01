<?php
include("conexion.php");
$con = conectar_bd();

header('Content-Type: application/json');

if (!isset($_POST['id'], $_POST['nombre'], $_POST['grado'], $_POST['turno'], $_POST['especificacion'])) {
    echo json_encode(["success" => false, "error" => "Faltan datos"]);
    exit;
}

$id = intval($_POST['id']);
$nombre = ($_POST['nombre']);
$grado = ($_POST['grado']);
$turno = ($_POST['turno']);
$especificacion = ($_POST['especificacion']);

$sql = "UPDATE grupo 
        SET nombre='$nombre', grado='$grado', turno='$turno', especificacion='$especificacion' 
        WHERE id_grupo=$id";
        
if ($con->query($sql) === TRUE) {
    if ($con->affected_rows > 0) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "error" => "No se encontró el grupo o no se realizaron cambios"]);
    }
} else {
    echo json_encode(["success" => false, "error" => $con->error]);
}

$con->close();
