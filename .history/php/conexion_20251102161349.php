<?php
    function conectar_bd(){
        
        $servidor = "localhost";
        $usuario = "root";
        $clave = "root";
        $base_datos = "mirai_klasso";
        
        $conexion = mysqli_connect($servidor, $usuario, $clave, $base_datos);
    
        if ($conexion->connect_error) {
        die("Error en la conexion: " . $conexion->connect_error);
    }
        
        return $conexion;
    }
    
    $con = conectar_bd();
?>