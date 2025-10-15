<?php
include("../conexion.php");
$con = conectar_bd();

$sql = "SELECT d.id_docente, d.nombre, d.apellido, a.id_asignatura, a.nombre AS asignatura
        FROM docente_asignatura da
        JOIN docente d ON da.id_docente = d.id_docente
        JOIN asignatura a ON da.id_asignatura = a.id_asignatura
        ORDER BY d.nombre, d.apellido";

$result = $con->query($sql);

$datos = [];
while ($row = $result->fetch_assoc()) {
    $docente_key = $row['id_docente'];
    if (!isset($datos[$docente_key])) {
        $datos[$docente_key] = [
            "nombre" => $row['nombre'],
            "apellido" => $row['apellido'],
            "asignaturas" => []
        ];
    }
    $datos[$docente_key]["asignaturas"][] = [
        "id_asignatura" => $row['id_asignatura'],
        "nombre" => $row['asignatura']
    ];
}
echo json_encode(array_values($datos), JSON_UNESCAPED_UNICODE);
$con->close();
?>
