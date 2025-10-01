<?php
session_start();
header("Content-Type: application/json");

if (isset($_SESSION['loggedin']) && $_SESSION['loggedin'] === true) {
    $res = [
        "nombre" => $_SESSION['nombre'],
        "apellido" => $_SESSION['apellido'],
        "rol" => $_SESSION['rol']
    ];
    if (isset($_SESSION['avatar_style'])) $res['avatar_style'] = $_SESSION['avatar_style'];
    if (isset($_SESSION['avatar_seed'])) $res['avatar_seed'] = $_SESSION['avatar_seed'];
    echo json_encode($res);
} else {
    echo json_encode(["error" => "No autorizado"]);
}
