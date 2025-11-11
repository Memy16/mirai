<?php
include("../conexion.php");
$con = conectar_bd();

header('Content-Type: application/json; charset=utf-8');

try {
    $id = intval($_POST['id']);
    
    $stmt_rel = $con->prepare("DELETE FROM docente_asignatura WHERE id_asignatura = ?");
    $stmt_rel->bind_param("i", $id);
    $stmt_rel->execute();
    $stmt_rel->close();
    
    $stmt = $con->prepare("DELETE FROM asignatura WHERE id_asignatura = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "error" => "No se encontró la asignatura o ya fue eliminada"]);
    }

    $stmt->close();
    $con->close();

} catch (mysqli_sql_exception $e) {
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
?>
