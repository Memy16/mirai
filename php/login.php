<?php
session_start();
require("conexion.php");

function limpiar($data) {
    return htmlspecialchars(stripslashes(trim($data)));
}

function validarCredenciales($cedula, $pass, $rol) {
    $con = conectar_bd();
    $contrasenia_hash = md5($pass);
    
    switch($rol) {
        case "estudiante":
            $sql = "SELECT ci_alumno AS ci, nombre, apellido 
                    FROM alumnos 
                    WHERE ci_alumno = '$cedula' AND contrasena = '$contrasenia_hash'";
            $home = "../pages/alumno.html";
            break;
            
        case "profesor":
            $sql = "SELECT ci_docente AS ci, nombre, apellido 
                    FROM docente 
                    WHERE ci_docente = '$cedula' AND contrasena_docente = '$contrasenia_hash'";
            $home = "../pages/docente.html";
            break;
            
        case "administrador":
            $sql = "SELECT ci_adscripta AS ci, nombre, apellido 
                    FROM adscripta 
                    WHERE ci_adscripta = '$cedula' AND contrasena_adscripta = '$contrasenia_hash'";
            $home = "../pages/adscripcion.html";
            break;
            
        default:
            return false;
    }
    
    $resultado = mysqli_query($con, $sql);
    
    if ($resultado && mysqli_num_rows($resultado) == 1) {
        $usuario = mysqli_fetch_assoc($resultado);
        $usuario['rol'] = $rol;
        $usuario['home'] = $home;
        return $usuario;
    }

    return false;
}

function crearSesion($usuario) {
    $_SESSION['loggedin'] = true;
    $_SESSION['ci'] = $usuario['ci'];
    $_SESSION['nombre'] = $usuario['nombre'];
    $_SESSION['apellido'] = $usuario['apellido'];
    $_SESSION['rol'] = $usuario['rol'];
    $_SESSION['home'] = $usuario['home'];
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $cedula = limpiar($_POST['cedula']);
    $pass = $_POST['pass'];
    $rol = limpiar($_POST['rol']);
    
    $usuario = validarCredenciales($cedula, $pass, $rol);

    if ($usuario) {
        crearSesion($usuario);
        
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
            ✅ Bienvenido/a {$usuario['rol']} {$usuario['nombre']} {$usuario['apellido']}<br>
            Serás redirigido en 3 segundos...
        </div>

        <script>
            setTimeout(function(){
                window.location.href = '{$usuario['home']}';
            }, 3000);
        </script>
    </body>
    </html>
    ";
    } else {
        echo "
    <!DOCTYPE html>
    <html lang='es'>
    <head>
        <meta charset='UTF-8'>
        <title>Error</title>
        <script src='https://cdn.jsdelivr.net/npm/sweetalert2@11'></script>
    </head>
    <body>
        <script>
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Cédula o contraseña incorrectos',
                confirmButtonText: 'Intentar de nuevo'
            }).then(() => {
                window.history.back();
            });
        </script>
    </body>
    </html>
    ";
    }
}
?>



