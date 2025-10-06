<?php
require("conexion.php");
$con = conectar_bd();
require("loadenv.php");


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
        echo "
        <script src='https://cdn.jsdelivr.net/npm/sweetalert2@11'></script>
        <script>
            Swal.fire({
                icon: 'error',
                title: 'Captcha falló',
                text: 'Por favor completa el captcha correctamente',
                confirmButtonText: 'Intentar de nuevo'
            }).then(() => { window.history.back(); });
        </script>";
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
        die("❌ Código incorrecto para adscripto/a.");
        } else {
        $sql = "INSERT INTO adscripta (nombre, apellido, mail_adscripta, ci_adscripta, contrasena_adscripta) 
                VALUES ('$nombre', '$apellido', '$email', '$ci', '$contrasenia')";
        }
        break;
    case "profesor":
        if ($codigo !== $cod_docente) {
        die("❌ Código incorrecto para profesor/a.");
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
        echo "Usuario registrado correctamente <a href='../pages/login.html'>Iniciar Sesión</a>";
    } else {
        echo "Error: " . $con->error;
    }
    
    if (isset($stmt)) $stmt->close();
?>