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
        die("<!DOCTYPE html>
    <html lang='es'>
    <head>
        <meta charset='UTF-8'>
        <title>Redirigiendo...</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background: #f0f2f5;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
            }
            .toast {
                background: #ff0000ff;
                color: white;
                padding: 20px 30px;
                border-radius: 8px;
                box-shadow: 0 4px 10px rgba(0,0,0,0.2);
                font-size: 18px;
                animation: fadein 0.5s, fadeout 0.5s 2.5s;
            }
            @keyframes fadein {
                from {opacity: 0; transform: translateY(20px);}
                to {opacity: 1; transform: translateY(0);}
            }
            @keyframes fadeout {
                from {opacity: 1;}
                to {opacity: 0;}
            }
        </style>
    </head>
    <body>
        <div class='toast'>
            Error al registrar usuario: ❌ Código incorrecto para adscripto/a.<br>
            Serás redirigido en 3 segundos...
        </div>
        
        <script>
            setTimeout(function(){
                window.location.href ='../pages/registro.html';
            }, 3000);
        </script>
    </body>
    </html>");
        } else {
        $sql = "INSERT INTO adscripta (nombre, apellido, mail_adscripta, ci_adscripta, contrasena_adscripta) 
                VALUES ('$nombre', '$apellido', '$email', '$ci', '$contrasenia')";
        }
        break;
    case "profesor":
        if ($codigo !== $cod_docente) {
        die("<!DOCTYPE html>
    <html lang='es'>
    <head>
        <meta charset='UTF-8'>
        <title>Redirigiendo...</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background: #f0f2f5;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
            }
            .toast {
                background: #ff0000ff;
                color: white;
                padding: 20px 30px;
                border-radius: 8px;
                box-shadow: 0 4px 10px rgba(0,0,0,0.2);
                font-size: 18px;
                animation: fadein 0.5s, fadeout 0.5s 2.5s;
            }
            @keyframes fadein {
                from {opacity: 0; transform: translateY(20px);}
                to {opacity: 1; transform: translateY(0);}
            }
            @keyframes fadeout {
                from {opacity: 1;}
                to {opacity: 0;}
            }
        </style>
    </head>
    <body>
        <div class='toast'>
            Error al registrar usuario: ❌ Código incorrecto para profesor/a.<br>
            Serás redirigido en 3 segundos...
        </div>
        
        <script>
            setTimeout(function(){
                window.location.href ='../pages/registro.html';
            }, 3000);
        </script>
    </body>
    </html>");
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
        echo "
    <!DOCTYPE html>
    <html lang='es'>
    <head>
        <meta charset='UTF-8'>
        <title>Redirigiendo...</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background: #f0f2f5;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
            }
            .toast {
                background: #4CAF50;
                color: white;
                padding: 20px 30px;
                border-radius: 8px;
                box-shadow: 0 4px 10px rgba(0,0,0,0.2);
                font-size: 18px;
                animation: fadein 0.5s, fadeout 0.5s 2.5s;
            }
            @keyframes fadein {
                from {opacity: 0; transform: translateY(20px);}
                to {opacity: 1; transform: translateY(0);}
            }
            @keyframes fadeout {
                from {opacity: 1;}
                to {opacity: 0;}
            }
        </style>
    </head>
    <body>
        <div class='toast'>
            ✅ Usuario registrado correctamente<br>
            Serás redirigido en 3 segundos...
        </div>
        
        <script>
            setTimeout(function(){
                window.location.href ='../pages/login.html';
            }, 3000);
        </script>
    </body>
    </html>
    ";
    } else {
        $error = $con->error;
        echo "
    <!DOCTYPE html>
    <html lang='es'>
    <head>
        <meta charset='UTF-8'>
        <title>Redirigiendo...</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background: #f0f2f5;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
            }
            .toast {
                background: #ff0000ff;
                color: white;
                padding: 20px 30px;
                border-radius: 8px;
                box-shadow: 0 4px 10px rgba(0,0,0,0.2);
                font-size: 18px;
                animation: fadein 0.5s, fadeout 0.5s 2.5s;
            }
            @keyframes fadein {
                from {opacity: 0; transform: translateY(20px);}
                to {opacity: 1; transform: translateY(0);}
            }
            @keyframes fadeout {
                from {opacity: 1;}
                to {opacity: 0;}
            }
        </style>
    </head>
    <body>
        <div class='toast'>
            Error al registrar usuario: $error<br>
            Serás redirigido en 3 segundos...
        </div>
        
        <script>
            setTimeout(function(){
                window.location.href ='../pages/registro.html';
            }, 3000);
        </script>
    </body>
    </html>
    ";
    }
    
    if (isset($stmt)) $stmt->close();
?>