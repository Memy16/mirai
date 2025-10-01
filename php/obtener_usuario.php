<?php
session_start();
include("conexion.php");
$con = conectar_bd();

header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["error" => "Método no permitido"]);
    exit;
}

if (isset($_SESSION['loggedin']) && $_SESSION['loggedin'] === true) {
    $res = [
        "nombre"   => $_SESSION['nombre'],
        "apellido" => $_SESSION['apellido'],
        "rol"      => $_SESSION['rol']
    ];
    
    if (isset($_SESSION['avatar_style'])) $res['avatar_style'] = $_SESSION['avatar_style'];
    if (isset($_SESSION['avatar_seed']))  $res['avatar_seed']  = $_SESSION['avatar_seed'];
    
    // Si se piden datos completos
    if (isset($_POST['datos_completos']) && $_POST['datos_completos'] === 'true') {
        $rol = $_SESSION['rol'];
        $id  = $_SESSION['user_id'] ?? null;
        
        if ($id) {
            switch($rol) {
                case "estudiante":
                    $sql = "SELECT id_alumno, nombre, apellido, mail AS email
                            FROM alumnos WHERE id_alumno=?";
                    break;
                case "profesor":
                    $sql = "SELECT id_docente, nombre, apellido, mail_docente AS email, tel_docente 
                            FROM docente WHERE id_docente=?";
                    break;
                case "administrador":
                    $sql = "SELECT id_adscripta, nombre, apellido, ci_adscripta, mail_adscripta AS email, tel_adscripta 
                            FROM adscripta WHERE id_adscripta=?";
                    break;
                default:
                    echo json_encode(["error" => "Rol no válido"]);
                    exit;
            }
            
            $stmt = $con->prepare($sql);
            $stmt->bind_param("i", $id);
            $stmt->execute();
            $result = $stmt->get_result();

            if ($result && $result->num_rows > 0) {
                $userData = $result->fetch_assoc();
                $res = array_merge($res, $userData);
                $res['datos_completos'] = true;
            } else {
                $res['error_datos'] = "No se pudieron cargar los datos completos";
            }
        } else {
            $res['error_datos'] = "ID de usuario no encontrado en sesión";
        }
    }

    echo json_encode($res);
} else {
    echo json_encode(["error" => "No autorizado"]);
}

if (isset($con)) $con->close();
?>
