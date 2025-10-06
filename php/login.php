<?php
session_start();
require("conexion.php");

function limpiar($data) {
    return htmlspecialchars(stripslashes(trim($data)));
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
    $rol = limpiar($_POST['rol'] ?? '');
    
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
            <small>ID de usuario: {$usuario['user_id']}</small><br>
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
