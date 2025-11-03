<?php
session_start();
header("Content-Type: application/json");
include "../conexion.php";
$con = conectar_bd();

error_log("Creando tema - POST: " . print_r($_POST, true));

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'error' => 'No autenticado']);
    exit;
}

$titulo = trim($_POST["titulo"] ?? "");
$descripcion = trim($_POST["descripcion"] ?? "");

error_log("Datos tema - Título: $titulo, Descripción: $descripcion");

if ($titulo !== "") {
    try {
        // CORRECCIÓN: Usar $con en lugar de $conn
        $stmt = $con->prepare("INSERT INTO foro_temas (titulo, descripcion) VALUES (?, ?)");
        $stmt->bind_param("ss", $titulo, $descripcion);
        
        if ($stmt->execute()) {
            $nuevo_id = $con->insert_id; // CORRECCIÓN: Usar $con
            error_log("Tema creado con ID: $nuevo_id");
            echo json_encode(['success' => true, 'id' => $nuevo_id]);
        } else {
            error_log("Error creando tema: " . $stmt->error);
            echo json_encode(['success' => false, 'error' => $stmt->error]);
        }
    } catch (Exception $e) {
        error_log("Excepción creando tema: " . $e->getMessage());
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
} else {
    error_log("Título vacío");
    echo json_encode(['success' => false, 'error' => 'Título vacío']);
}
