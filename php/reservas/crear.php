<?php
header('Content-Type: application/json');
require '../conexion.php';
$con = conectar_bd(); 


$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['tipo'])) {
    echo json_encode(['error' => true, 'message' => 'Tipo no especificado']);
    exit;
}

$tipo = $input['tipo'];

if ($tipo === "aula") {
    
    if (!isset($input['nombre'], $input['cantidad'], $input['tipo_aula'])) {
        echo json_encode(['error' => true, 'message' => 'Faltan datos para crear el aula']);
        exit;
    }

    $nombre = $input['nombre'];
    $cantidad = intval($input['cantidad']);
    $tipo_aula = $input['tipo_aula'];

    $stmt = $con->prepare("INSERT INTO aulas (nombre, cantidad, tipo) VALUES (?, ?, ?)");
    $stmt->bind_param("sis", $nombre, $cantidad, $tipo_aula);

} elseif ($tipo === "recurso") {
    
    if (!isset($input['nombre'], $input['estado'])) {
        echo json_encode(['error' => true, 'message' => 'Faltan datos para crear el recurso']);
        exit;
    }

    $nombre = $input['nombre'];
    $estado = $input['estado'];

    $stmt = $con->prepare("INSERT INTO recursos (nombre, estado) VALUES (?, ?)");
    $stmt->bind_param("ss", $nombre, $estado);

} else {
    echo json_encode(['error' => true, 'message' => 'Tipo inválido']);
    exit;
}


if ($stmt->execute()) {
    echo json_encode(['error' => false, 'message' => ucfirst($tipo) . ' creado correctamente']);
} else {
    echo json_encode(['error' => true, 'message' => 'Error al crear ' . $tipo]);
}

$stmt->close();
$con->close();
?>
