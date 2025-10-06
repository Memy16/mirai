<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
header('Content-Type: application/json; charset=utf-8');

include("../conexion.php");
$con = conectar_bd();

$valor = $_GET['valor'] ?? '';
$valor = urldecode($valor);

function obtenerAulas($conexion) {
    $aulas = [];
    $sql = "SELECT id_aula, nombre, tipo, cantidad FROM aulas ORDER BY id_aula";
    $result = $conexion->query($sql);

    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $aulas[] = $row;
        }
        return $aulas;
    } else {
        http_response_code(500);
        return ["error" => $conexion->error];
    }
}

function obtenerRecursos($conexion) {
    $recursos = [];
    $sql = "SELECT id_recurso, nombre, estado FROM recursos ORDER BY id_recurso";
    $result = $conexion->query($sql);

    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $recursos[] = $row;
        }
        return $recursos;
    } else {
        http_response_code(500);
        return ["error" => $conexion->error];
    }
}

if ($valor == "Aulas") {
    echo json_encode(obtenerAulas($con), JSON_UNESCAPED_UNICODE);
} elseif ($valor == "Recursos") {
    echo json_encode(obtenerRecursos($con), JSON_UNESCAPED_UNICODE);
} else {
    echo json_encode(["error" => "Valor inválido: $valor"]);
}

$con->close();
?>