<?php
session_start();
require("conexion.php");
require("loadenv.php");

function limpiar($data) {
    return htmlspecialchars(stripslashes(trim($data)));
}

function validarCedulaUruguaya($cedula) {
    $cedula = preg_replace('/[^\d]/', '', $cedula);

    if (strlen($cedula) != 8) return false;

    $numeros = str_split($cedula);
    $verificador = array_pop($numeros);
    $pesos = [2, 9, 8, 7, 6, 3, 4];
    $suma = 0;

    foreach ($numeros as $i => $n) {
        $suma += $n * $pesos[$i];
    }

    $dv = 10 - ($suma % 10);
    if ($dv == 10) $dv = 0;

    return intval($verificador) === $dv;
}

function verificarHCaptcha($token) {
    $secret = $_ENV['HCAPTCHA_SECRET'] ?? '';
    
    $ch = curl_init('https://hcaptcha.com/siteverify');
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
        'secret' => $secret,
        'response' => $token,
        'remoteip' => $_SERVER['REMOTE_ADDR']
    ]));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // evita errores SSL en Windows
    
    $response = curl_exec($ch);
    curl_close($ch);
    
    $data = json_decode($response, true);
    return $data['success'] ?? false;
}


function validarCredenciales($cedula, $pass, $rol) {
    $con = conectar_bd();
    
    switch($rol) {
        case "estudiante":
            $sql = "SELECT id_alumno AS user_id, ci_alumno AS ci, nombre, apellido, contrasena AS hash 
                    FROM alumnos 
                    WHERE ci_alumno = ?";
            $home = "../pages/alumno.html";
            break;
            
        case "profesor":
            $sql = "SELECT id_docente AS user_id, ci_docente AS ci, nombre, apellido, contrasena_docente AS hash  
                    FROM docente 
                    WHERE ci_docente = ?";
            $home = "../pages/docente.html";
            break;
            
        case "administrador":
            $sql = "SELECT id_adscripta AS user_id, ci_adscripta AS ci, nombre, apellido, contrasena_adscripta AS hash 
                    FROM adscripta 
                    WHERE ci_adscripta = ?";
            $home = "../pages/adscripcion.html";
            break;
            
        default:
            return false;
    }
    
    $stmt = mysqli_prepare($con, $sql);
    mysqli_stmt_bind_param($stmt, "s", $cedula);
    mysqli_stmt_execute($stmt);
    $resultado = mysqli_stmt_get_result($stmt);
    
    if ($resultado && mysqli_num_rows($resultado) == 1) {
        $usuario = mysqli_fetch_assoc($resultado);
        
        if (password_verify($pass, $usuario['hash'])) {
            unset($usuario['hash']); 
            $usuario['rol'] = $rol;
            $usuario['home'] = $home;
            return $usuario;
        }
    }
    
    return false;
}

function crearSesion($usuario) {
    $_SESSION['loggedin'] = true;
    $_SESSION['user_id'] = $usuario['user_id'];
    $_SESSION['ci'] = $usuario['ci'];
    $_SESSION['nombre'] = $usuario['nombre'];
    $_SESSION['apellido'] = $usuario['apellido'];
    $_SESSION['rol'] = $usuario['rol'];
    $_SESSION['home'] = $usuario['home'];
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $cedula = limpiar($_POST['cedula'] ?? '');
    $pass = $_POST['pass'] ?? '';
    $rol = limpiar($_POST['rol']) ?? '';
    $hcaptcha_token = $_POST['h-captcha-response'] ?? '';
    
    if (!verificarHCaptcha($hcaptcha_token)) {
        include(__DIR__ . '/../templates/error_captcha.html');
        exit;
    }

    if (strpos($cedula, '@') !== false) {
        include(__DIR__ . '/../templates/error_cedula.html');
        exit;
    }

    if (!validarCedulaUruguaya($cedula)) {
        header("Location: ../templates/error_cedula_invalida.php?cedula=" . urlencode($cedula));
        exit;
    }

    $usuario = validarCredenciales($cedula, $pass, $rol);
    
    if ($usuario) {
        crearSesion($usuario);
        include(__DIR__ . '/../templates/exito_login.php');
        exit;
    } else {
        include(__DIR__ . '/../templates/error_login.html');
        exit;
    }
}
?>
