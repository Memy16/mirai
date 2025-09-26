<?php
// save_profile.php
session_start();
header("Content-Type: application/json");

// Requerir login
if (!isset($_SESSION['loggedin']) || $_SESSION['loggedin'] !== true) {
    http_response_code(401);
    echo json_encode(["error"=>"No autorizado"]);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$style = isset($input['style']) ? $input['style'] : null;
$seed  = isset($input['seed']) ? $input['seed'] : null;

// Validaciones básicas
if (!$style || !$seed) {
    http_response_code(400);
    echo json_encode(["error"=>"Faltan datos (style o seed)"]);
    exit;
}

// Sanitizar: permitir solo letras, números, guiones y underscores en style
$style = preg_replace('/[^a-z0-9_-]/i', '', $style);
// Limitar longitud de seed
$seed = substr(trim($seed), 0, 60);

// Guardar en sesión (ejemplo funcional sin DB)
$_SESSION['avatar_style'] = $style;
$_SESSION['avatar_seed'] = $seed;

// Si querés persistir en la BD: ejemplo con mysqli (comentar/ajustar según tu esquema)
/*
require_once 'conexion.php';
$con = conectar_bd(); // tu función
$userCi = $_SESSION['ci']; // o id de usuario

$stmt = $con->prepare("UPDATE usuarios SET avatar_style = ?, avatar_seed = ? WHERE ci = ?");
$stmt->bind_param("sss", $style, $seed, $userCi);
$stmt->execute();
$stmt->close();
*/

echo json_encode(["success" => true]);
