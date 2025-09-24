<?php
include("conexion.php");
$con = conectar_bd();

$id = intval($_POST['id']);
$sql = "DELETE FROM grupo WHERE id_grupo=$id";

if ($con->query($sql) === TRUE) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "error" => $con->error]);
}
$con->close();
