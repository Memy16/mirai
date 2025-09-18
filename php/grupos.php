<?php
include("conexion.php");
    
    $nombreGrupo = $_POST['nombreGrupo'];
    $gradoGrupo = $_POST['gradoGrupo'];
    $turno = $_POST['turno'];
    $especificacionGrupo = $_POST['especificacionGrupo'];
    
    $turnosValidos = ['MATUTINO', 'VESPERTINO', 'NOCTURNO'];
    if (!in_array($turno, $turnosValidos)) {
        die("Turno no válido.");
    }
    
    $sql = "INSERT INTO grupo (nombre, grado, turno, especificacion) 
            VALUES ('$nombreGrupo', '$gradoGrupo', '$turno', '$especificacionGrupo')";
            
    if($conexion->query($sql) === TRUE) {
        echo "Grupo registrado correctamente <a href='../pages/adscripcion.html'>Volver</a>";
    } else {
        echo "Error: " . $conexion->error;
    }
?>