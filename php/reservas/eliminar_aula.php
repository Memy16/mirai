<?php
header('Content-Type: application/json');
require '../conexion.php'; 
$con = conectar_bd(); 


$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['id'])) {
    echo json_encode(['error' => true, 'message' => 'ID no proporcionado']);
    exit;
}

$id = intval($input['id']);


$stmt = $con->prepare("DELETE FROM aulas WHERE id_aula = ?");
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    echo json_encode(['error' => false, 'message' => 'Aula eliminada correctamente']);
} else {
    echo json_encode(['error' => true, 'message' => 'Error al eliminar aula']);
}

$stmt->close();
$con->close();
?>
