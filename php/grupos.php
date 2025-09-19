<?php
include("conexion.php");
$con = conectar_bd();

    
    $nombreGrupo = $_POST['nombreGrupo'];
    $gradoGrupo = $_POST['gradoGrupo'];
    $turno = $_POST['turno'];
    $especificacionGrupo = $_POST['especificacionGrupo'];
    
    $turnosValidos = ['MATUTINO', 'VESPERTINO', 'NOCTURNO'];
    if (!in_array($turno, $turnosValidos)) {
        http_response_code(400);
        echo json_encode(["error" => "Turno no válido."]);
        exit;
    }
    
    $sql = "INSERT INTO grupo (nombre, grado, turno, especificacion) 
            VALUES ('$nombreGrupo', '$gradoGrupo', '$turno', '$especificacionGrupo')";
            
    if($conexion->query($sql) === TRUE) {
        echo json_encode(["success" => true]);
        echo "Grupo registrado correctamente <a href='../pages/adscripcion.html'>Volver</a>";
    } else {
        http_response_code(500);
        echo json_encode(["Error: " => $conexion->error]);
    }
?>