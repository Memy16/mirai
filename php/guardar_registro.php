<?php
require("conexion.php");
$con = conectar_bd();
require("loadenv.php");

function cedulaYaRegistrada($con, $ci, $rol) {
    switch($rol) {
        case "estudiante":
            $sql = "SELECT 1 FROM alumnos WHERE ci_alumno = ?";
            break;
        case "profesor":
            $sql = "SELECT 1 FROM docente WHERE ci_docente = ?";
            break;
        case "administrador":
            $sql = "SELECT 1 FROM adscripta WHERE ci_adscripta = ?";
            break;
        default:
            return false;
    }

    $stmt = $con->prepare($sql);
    $stmt->bind_param("s", $ci);
    $stmt->execute();
    $resultado = $stmt->get_result();
    $existe = $resultado->num_rows > 0;
    $stmt->close();
    return $existe;
}

function validarCedulaUruguaya($cedula) {
    $cedula = preg_replace('/[^\d]/', '', $cedula);

    if (strlen($cedula) != 8) return false;

    $numeros = str_split($cedula);
    $verificador = (int) array_pop($numeros);
    $pesos = [2, 9, 8, 7, 6, 3, 4];
    $suma = 0;

    foreach ($numeros as $i => $n) {
        $suma += ((int)$n) * $pesos[$i]; 
    }

    $dv = 10 - ($suma % 10);
    if ($dv == 10) $dv = 0;

    return $verificador == $dv; 
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

    $nombre = $_POST['nombre'];
    $apellido = $_POST['apellido'];
    $email = $_POST['email'];
    $ci = $_POST['ci'];
    $rol = $_POST['rol'];
    $contrasenia = ($_POST['contrasenia']);
    $codigo = $_POST['codigo'];
    $hcaptcha_token = $_POST['h-captcha-response'] ?? '';
    
    $cod_docente = "prof123KLASSO";
    $cod_ads = "ads321KLASSO";
    if (!verificarHCaptcha($hcaptcha_token)) {
        include(__DIR__ . '/../templates/error_captcha.html');
        exit;
    }

    if (!validarCedulaUruguaya($ci)) {
        header("Location: /../templates/error_cedula_invalida.php?cedula=" . urlencode($ci));
        exit;
    }

    if (cedulaYaRegistrada($con, $ci, $rol)) {
        header("Location: /../templates/error_cedula_existente.php?cedula=" . urlencode($ci));
        exit;
    }
    
    switch($rol) {
    case "estudiante":
        $contrasenia = password_hash($contrasenia, PASSWORD_DEFAULT);
        $stmt = $con->prepare("INSERT INTO alumnos (nombre, apellido, mail, ci_alumno, contrasena) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("sssss", $nombre, $apellido, $email, $ci, $contrasenia);
        break;
        
    case "administrador":
        if ($rol === "administrador" && $codigo !== $cod_ads){
            include(__DIR__ . '/../templates/error_cod_ads.html');
        exit;
        } else {
            $contrasenia = password_hash($contrasenia, PASSWORD_DEFAULT);
            $stmt = $con->prepare("INSERT INTO adscripta (nombre, apellido, mail_adscripta, ci_adscripta, contrasena_adscripta) VALUES (?, ?, ?, ?, ?)");
            $stmt->bind_param("sssss", $nombre, $apellido, $email, $ci, $contrasenia);
        }
        break;
    case "profesor":
        if ($codigo !== $cod_docente) {
            include(__DIR__ . '/../templates/error_cod_prof.html');
            exit;
        }else{
            $contrasenia = password_hash($contrasenia, PASSWORD_DEFAULT);
            $stmt = $con->prepare("INSERT INTO docente (nombre, apellido, mail_docente, ci_docente, contrasena_docente) VALUES (?, ?, ?, ?, ?)");
            $stmt->bind_param("sssss", $nombre, $apellido, $email, $ci, $contrasenia);
        }
        break;
        
    default:
        die("Rol no válido.");
    }
    
    if(isset($stmt) && $stmt->execute()) {
        include(__DIR__ . '/../templates/exito_registro.html');
        exit;
    } else {
        $error = $con->error;
        include(__DIR__ . '/../templates/error_registro.html');
        exit;
    }
    
    if (isset($stmt)) $stmt->close();
?>