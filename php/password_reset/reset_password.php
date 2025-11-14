<?php
require '../conexion.php';
$con = conectar_bd();

$token = $_GET['token'] ?? '';
$mensaje = '';
$redirigir = false;

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $token = $_POST['token'];
    $nueva = $_POST['contrasena'] ?? '';

    if (empty($nueva)) {
        $mensaje = "Debes ingresar una nueva contraseña.";
    } else {
        // Buscar el token
        $stmt = $con->prepare("SELECT email, expiracion FROM resets WHERE token = ?");
        $stmt->bind_param("s", $token);
        $stmt->execute();
        $resultado = $stmt->get_result();
        $reset = $resultado->fetch_assoc();

        if (!$reset) {
            $mensaje = "El enlace no es válido.";
        } elseif (strtotime($reset['expiracion']) < time()) {
            $mensaje = "El enlace ha expirado.";
        } else {
            // Actualizar contraseña
            $hash = password_hash($nueva, PASSWORD_BCRYPT);
            $stmt2 = $con->prepare("UPDATE docente SET contrasena_docente = ? WHERE mail_docente = ?");
            $stmt2->bind_param("ss", $hash, $reset['email']);
            $stmt2->execute();

            // Eliminar token
            $stmt3 = $con->prepare("DELETE FROM resets WHERE token = ?");
            $stmt3->bind_param("s", $token);
            $stmt3->execute();

            $mensaje = "Tu contraseña ha sido actualizada correctamente. Serás redirigido al login en 3 segundos.";
            $redirigir = true; // marcar que debe redirigir
        }
    }
}
?>

<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Restablecer Contraseña</title>
    <link rel="shortcut icon" href="../../assets/img/klasso-logo.ico" type="image/x-icon">
    <link rel="stylesheet" href="../../css/style.css">
    <link rel="stylesheet" href="../../css/bootstrap.css">
    <?php if ($redirigir): ?>
        <meta http-equiv="refresh" content="3;url=../pages/login.html">
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

    <main class="main-login mrg-top">
        <h1>Restablecer Contraseña</h1>
        <?php if (!$redirigir): ?>
        <form action="" method="POST">
            <fieldset>
                <input type="hidden" name="token" value="<?= htmlspecialchars($token) ?>">
                <div>
                    <label for="InputPassword1" class="form-label mt-4">Nueva Contraseña</label>
                    <input type="password" name="contrasena" class="form-control input-login" id="InputPassword1"
                        placeholder="Ingrese su nueva contraseña" required>
                </div>
                <div id="captcha"></div>
                <button type="submit" class="btn btn-primary btn-login mt-3">Guardar Nueva Contraseña</button>
            </fieldset>
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

    <script src="../../JS/app.js"></script>
    <script src="../../JS/navbar.js"></script>
    <script src="../../JS/perfil.js"></script>
    <script src="https://hcaptcha.com/1/api.js" async defer></script>
    <script>
        window.onload = function () {
            fetch("../get_sitekey.php")
                .then(res => res.json())
                .then(data => {
                    if (data.sitekey) {
                        document.getElementById("captcha").setAttribute("data-sitekey", data.sitekey);
                        if (window.hcaptcha) {
                            hcaptcha.render('captcha', { sitekey: data.sitekey });
                        }
                    } else {
                        console.error("No se pudo cargar la clave del captcha");
                    }
                })
                .catch(err => console.error(err));
        };
    </script>
    <script src="https://website-widgets.pages.dev/dist/sienna.min.js" defer></script>
</body>

</html>
