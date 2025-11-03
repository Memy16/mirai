<?php
session_start();
header("Content-Type: application/json");
include "../conexion.php";
$con = conectar_bd();

// Debug: registrar lo que llega
error_log("POST data: " . print_r($_POST, true));
error_log("SESSION data: " . print_r($_SESSION, true));

if (!isset($_SESSION['user_id'])) {
    error_log("Usuario no autenticado");
    echo json_encode(['success' => false, 'error' => 'No autenticado']);
    exit;
}

// CORRECCIÓN: Variables de sesión corregidas
$nombre = $_SESSION['nombre'] ?? $_SESSION['usuario_nombre'] ?? 'Usuario';
$rol = $_SESSION['rol'] ?? $_SESSION['usuario_rol'] ?? 'Estudiante'; // CORRECCIÓN: Agregar $rol
$id_usuario = $_SESSION['user_id'] ?? $_SESSION['id'] ?? 0;

$id_tema = intval($_POST["id_tema"] ?? 0);
$mensaje = trim($_POST["mensaje"] ?? "");

error_log("Datos procesados - ID Tema: $id_tema, Mensaje: $mensaje, Usuario: $nombre, Rol: $rol, ID Usuario: $id_usuario");

if ($id_tema && $mensaje !== "" && $id_usuario) {
    try {
        // CORRECCIÓN: Usar $con en lugar de $conn
        $stmt = $con->prepare("INSERT INTO foro_mensajes (id_tema, id_usuario, nombre, rol, mensaje) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("iisss", $id_tema, $id_usuario, $nombre, $rol, $mensaje);
        
        if ($stmt->execute()) {
            error_log("Mensaje insertado correctamente");
            echo json_encode(['success' => true]);
        } else {
            error_log("Error en execute: " . $stmt->error);
            echo json_encode(['success' => false, 'error' => 'Error en la base de datos: ' . $stmt->error]);
        }
    } catch (Exception $e) {
        error_log("Excepción: " . $e->getMessage());
        echo json_encode(['success' => false, 'error' => 'Excepción: ' . $e->getMessage()]);
    }
} else {
    error_log("Datos incompletos - ID Tema: $id_tema, Mensaje: $mensaje, ID Usuario: $id_usuario");
    echo json_encode(['success' => false, 'error' => 'Datos incompletos']);
}
?>