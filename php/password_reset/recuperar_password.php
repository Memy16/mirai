<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require '../vendor/autoload.php';
require '../conexion.php';
require 'enviar_correo_recuperacion.php';
$con = conectar_bd();

$mensaje = '';
$redirigir = false;

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $email = $_POST['email'] ?? '';

    if (empty($email)) {
        $mensaje = "Debes ingresar tu correo institucional.";
    } else {
        // Generar token y expiración
        $token = bin2hex(random_bytes(32));
        $expiracion = date('Y-m-d H:i:s', strtotime('+1 hour'));

        // Buscar docente por email
        $stmt = $con->prepare("SELECT * FROM docente WHERE mail_docente = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $resultado = $stmt->get_result();
        $docente = $resultado->fetch_assoc();

        if (!$docente) {
            $mensaje = "El correo ingresado no está registrado.";
        } else {
            // Crear tabla resets si no existe
            $con->query("
                CREATE TABLE IF NOT EXISTS resets (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    email VARCHAR(150) NOT NULL,
                    token VARCHAR(255) NOT NULL,
                    expiracion DATETIME NOT NULL
                )
            ");

            // Guardar el token
            $stmt2 = $con->prepare("INSERT INTO resets (email, token, expiracion) VALUES (?, ?, ?)");
            $stmt2->bind_param("sss", $email, $token, $expiracion);
            $stmt2->execute();

            // Enviar correo de recuperación
            enviarCorreoRecuperacion($email, $token);

            $mensaje = "Se ha enviado un enlace de recuperación a tu correo. Serás redirigido al login en 3 segundos.";
            $redirigir = true;
        }
    }
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recuperar Contraseña</title>
    <link rel="shortcut icon" href="../../assets/img/klasso-logo.ico" type="image/x-icon">
    <link rel="stylesheet" href="../../css/style.css">
    <link rel="stylesheet" href="../../css/bootstrap.css">
    <?php if ($redirigir): ?>
        <meta http-equiv="refresh" content="3;url=../../pages/login.html">
    <?php endif; ?>
</head>
<body>
    <header>
        <nav class="navbar navbar-expand-lg" data-bs-theme="light">
            <div class="container-fluid">
                <a class="navbar-brand" href="../index.html">
                    <img src="https://cdn.jsdelivr.net/gh/Memy16/img-klasso@main/images/iconos/klasso-logo.png"
                        alt="Logo Klasso" class="logo">
                </a>

                <button class="navbar-toggler" id="navbarToggle" type="button" data-bs-toggle="collapse"
                    data-bs-target="#navbarColor03" aria-controls="navbarColor03" aria-expanded="false"
                    aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse" id="navbarColor03">
                    <ul class="navbar-nav me-auto">
                        <li class="nav-item">
                            <a class="nav-link active" href="horarios.html">Horarios
                                <span class="visually-hidden">(current)</span>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="eventos.html">Eventos</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="manual.html">Manual de Usuario</a>
                        </li>

                        <li class="nav-item nav-inicio">
                            <a class="nav-link" href="registro.html">Registrarse</a>
                        </li>
                        <li class="nav-item nav-inicio">
                            <a class="nav-link" href="login.html">Iniciar sesión</a>
                        </li>

                        <li>
                            <div class="light_mode">
                                <img src="../../assets/img/modo-oscuro.png" alt="Cambiar a modo oscuro">
                            </div>
                        </li>
                        <li class="nav-item">
                            <div class="gtranslate_wrapper"></div>
                            <script>
                                window.gtranslateSettings = {
                                    "default_language": "es",
                                    "languages": ["es", "en"],
                                    "globe_color": "#66aaff",
                                    "wrapper_selector": ".gtranslate_wrapper",
                                    "globe_size": 40
                                }
                            </script>
                            <script src="https://cdn.gtranslate.net/widgets/latest/globe.js" defer></script>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link d-flex align-items-center" href="#" id="profileBtn" role="button">
                                <img src="../../assets/img/profile.png" alt="Profile" class="profile">
                                <i class="fas fa-caret-down"></i>
                            </a>

                            <div class="dropdown-menu dropdown-menu-end p-3 shadow" id="profileDropdown">
                                <div class="d-flex align-items-center mb-3">
                                    <div>
                                        <p class="mb-0 fw-bold">Hola, <span id="userName"></span></p>
                                        <p class="mb-0 text-muted" id="userRol"></p>
                                    </div>
                                </div>
                                <a href="../../editar_perfil.html" class="dropdown-item">
                                    <i class="fas fa-user-edit me-2"></i> Editar Perfil
                                </a>
                                <a href="../php/logout.php" class="dropdown-item text-danger">
                                    <i class="fas fa-sign-out-alt me-2"></i> Cerrar Sesión
                                </a>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    </header>

    <main class="main-login">
        <h1>Recuperar Contraseña</h1>
        <?php if (!$redirigir): ?>
        <form method="POST" action="">
            <input type="email" name="email" placeholder="Correo institucional" class="form-control input-login" required>
            <button type="submit" class="btn btn-primary btn-login mt-3">Enviar enlace</button>
        </form>
        <?php endif; ?>

        <?php if (!empty($mensaje)): ?>
            <p class="mt-3"><?= htmlspecialchars($mensaje) ?></p>
        <?php endif; ?>
    </main>

    <footer>
        <div class="footer-container">
            <div class="footer-links">
                <a href="../../preguntasfrecuentes.html">Preguntas Frecuentes</a>
                <a href="../../sobrenosotros.html">Sobre Nosotros</a>
                <a href="../../contacto.html">Contactanos</a>
            </div>
            <div class="footer-social">
                <a href="https://www.instagram.com/miraicompanyofficial/"><img
                        src="https://cdn.jsdelivr.net/gh/Memy16/img-klasso@main/images/iconos/formkit-instagram.png"
                        alt="Instagram"></a>
                <a href="#"><img
                        src="https://cdn.jsdelivr.net/gh/Memy16/img-klasso@main/images/iconos/prime-twitter.png"
                        alt="Twitter"></a>
            </div>
            <p class="copyright">&copy; 2025 Mirai. Todos los derechos reservados.</p>
        </div>
    </footer>
</body>
</html>
