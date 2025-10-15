<?php
include("../conexion.php");
$con = conectar_bd();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id_docente = $_POST['docente'];
    $id_asignatura = $_POST['asignatura'];
    
    if (!empty($id_docente) && !empty($id_asignatura)) {
        
        $stmt = $con->prepare("INSERT INTO docente_asignatura (id_docente, id_asignatura) VALUES (?, ?)");
        $stmt->bind_param("ii", $id_docente, $id_asignatura);
        
        if ($stmt->execute()) {
            include(__DIR__ . '/../../templates/exito_relacion.html');
            exit;
        } else {
            include(__DIR__ . '/../../templates/error_relacion.html') . $con->error;
            exit;
        }
        $stmt->close();
    } else {
        echo "Datos incompletos.";
    }
}
?>
