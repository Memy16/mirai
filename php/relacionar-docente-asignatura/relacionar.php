<?php
include("../conexion.php");
$con = conectar_bd();

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id_docente = $_POST['docente'];
    $id_asignatura = $_POST['asignatura'];
    
    if (!empty($id_docente) && !empty($id_asignatura)) {
        try {
            $stmt = $con->prepare("INSERT INTO docente_asignatura (id_docente, id_asignatura) VALUES (?, ?)");
            $stmt->bind_param("ii", $id_docente, $id_asignatura);
            $stmt->execute();
            
            include(__DIR__ . '/../../templates/exito_relacion.html');
            exit;
        
        } catch (mysqli_sql_exception $e) {
            // FK duplicada (e  
            if ($e->getCode() === 1062) {
                include(__DIR__ . '/../../templates/relacion_duplicada.html');
                exit;
            } else {
                $msg = addslashes($e->getMessage());
                include(__DIR__ . '/../../templates/error_relacion.html');
                exit;
            }
        } finally {
            if (isset($stmt)) $stmt->close();
            $con->close();
        }
    } else {
        include(__DIR__ . '/../../templates/relacion_incompleta.html');
        exit;
    }
}
?>