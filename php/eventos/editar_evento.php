<?php
include("../conexion.php");
$con = conectar_bd();

header('Content-Type: application/json');

if (!isset($_POST['id'], $_POST['nombre'], $_POST['descripcion'], $_POST['tipo'], $_POST['filtro'], $_POST['detalles'])) {
    echo json_encode(["success" => false, "error" => "Faltan datos"]);
    exit;
}

$id = intval($_POST['id']);
$nombre = ($_POST['nombre']);
$descripcion = ($_POST['descripcion']);
$tipo_evento = $_POST['tipo'] ?? '';
$filtro = $_POST['filtro'] ?? '';
$detalles = $_POST['detalles'] ?? '';

$query = $con->prepare("SELECT img_url FROM eventos WHERE id_evento = ?");
$query->bind_param("i", $id);
$query->execute();
$result = $query->get_result();
$evento = $result->fetch_assoc();
$img_actual = $evento['img_url'];

$nueva_img_url = $img_actual;

if (isset($_FILES['img']) && $_FILES['img']['error'] === UPLOAD_ERR_OK) {
    $rutaVieja = __DIR__ . '/../../' . $img_actual;
    
    $nombreArchivo = time() . "_" . basename($_FILES['img']['name']);
    $rutaDestino = __DIR__ . '/../../uploads/img/' . $nombreArchivo;
    
    if (move_uploaded_file($_FILES['img']['tmp_name'], $rutaDestino)) {
        $nueva_img_url = 'uploads/img/' . $nombreArchivo;
        
        if (file_exists($rutaVieja) && is_file($rutaVieja)) {
            unlink($rutaVieja);
        }
    }
}

$stmt = $con->prepare("UPDATE eventos 
        SET titulo=?, descripcion=?, tipo_evento=?, filtro=?, detalles=?, img_url=?
        WHERE id_evento=?");
$stmt->bind_param("ssssssi", $nombre, $descripcion, $tipo_evento, $filtro, $detalles, $nueva_img_url, $id);
if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "error" => "No se encontró el evento o no se realizaron cambios"]);
    }
} else {
    echo json_encode(["success" => false, "error" => $con->error]);
}

$stmt->close();
$con->close();