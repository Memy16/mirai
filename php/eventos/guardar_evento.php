<?php
include("../conexion.php");
$con = conectar_bd();

// ---------------------
// CONFIGURACIÓN DE IMAGEN
// ---------------------
$inputName  = 'img'; 
$uploadDir = __DIR__ . '/../../uploads/img'; // carpeta donde se guardan
$publicBase = 'uploads/img/'; // ruta pública (desde raíz web)

if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

// ---------------------
// VALIDAR DATOS DEL FORM
// ---------------------
$titulo = $_POST['nombre'] ?? '';
$descripcion = $_POST['descripcion'] ?? '';
$tipo_evento = $_POST['tipo'] ?? '';
$filtro = $_POST['filtro'] ?? '';
$detalles = $_POST['detalles'] ?? '';
$img_url = null;

// ---------------------
// SUBIDA DE IMAGEN (basado en el PHP que te dieron)
// ---------------------
if (isset($_FILES[$inputName]) && $_FILES[$inputName]['error'] === UPLOAD_ERR_OK) {
    $tmp = $_FILES[$inputName]['tmp_name'];
    $imgInfo = @getimagesize($tmp);
    
    if ($imgInfo === false) {
        http_response_code(400);
        echo json_encode(["success" => false, "error" => "El archivo no es una imagen válida."]);
        exit;
    }
    
    $extension = image_type_to_extension($imgInfo[2], false);
    $permitidas = ['jpeg', 'jpg', 'png', 'gif', 'webp'];
    if ($extension === 'jpg') $extension = 'jpeg';
    
    if (!in_array($extension, $permitidas, true)) {
        http_response_code(415);
        echo json_encode(["success" => false, "error" => "Formato de imagen no permitido."]);
        exit;
    }
    
    $filename = bin2hex(random_bytes(8)) . '_' . time() . '.' . ($extension === 'jpeg' ? 'jpg' : $extension);
    $destPath = $uploadDir . DIRECTORY_SEPARATOR . $filename;
    
    if (!move_uploaded_file($tmp, $destPath)) {
        http_response_code(500);
        echo json_encode(["success" => false, "error" => "No se pudo guardar la imagen."]);
        exit;
    }
    
    $img_url = $publicBase . $filename;
}

// ---------------------
// GUARDAR EN BD
// ---------------------
$stmt = $con->prepare("INSERT INTO eventos (titulo, descripcion, tipo_evento, filtro, detalles, img_url)
                        VALUES (?, ?, ?, ?, ?, ?)");
$stmt->bind_param("ssssss", $titulo, $descripcion, $tipo_evento, $filtro, $detalles, $img_url);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    @unlink($destPath ?? ''); // eliminar archivo si la inserción falla
    http_response_code(500);
    echo json_encode(["success" => false, "error" => $con->error]);
}

$stmt->close();
