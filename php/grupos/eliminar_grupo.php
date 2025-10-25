<?php
include("../conexion.php");
$con = conectar_bd();

$id = intval($_POST['id']);
$stmt = $con->prepare("DELETE FROM grupo WHERE id_grupo=?");
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "error" => $con->error]);
}

$stmt->close();
$con->close();
