<?php
    $servidor = "localhost";
    $usuario = "root";
    $clave = "root";
    $base_datos = "mirai_klasso";

    $conexion = new mysqli($servidor, $usuario, $clave, $base_datos);

    if ($conexion->connect_error) {
        die("Error en la conexion: " . $conexion->connect_error);
    }
?>