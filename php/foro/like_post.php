<?php
header("Content-Type: application/json");
include "../conexion.php";
$con = conectar_bd();

$id = intval($_POST["id"] ?? 0);

if ($id > 0) {
    // CORRECCIÓN: Usar consulta preparada para seguridad
    $stmt = $con->prepare("UPDATE foro_mensajes SET likes = likes + 1 WHERE id = ?");
    $stmt->bind_param("i", $id);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => $stmt->error]);
    }
} else {
    echo json_encode(['success' => false]);
}
