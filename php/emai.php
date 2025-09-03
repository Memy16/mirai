<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php'; // Composer: composer require phpmailer/phpmailer

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $nombre = $_POST['nombre'];
    $email = $_POST['email'];
    $mensaje = $_POST['mensaje'];

    // ----- Configuración de PHPMailer -----
    $mail = new PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host       = 'smtp.zoho.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = 'miraiyco@mastalentos.site';
        $mail->Password   = 'jQaQgHWeTrhC';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port       = 465;

        $mail->setFrom('miraiyco@mastalentos.site', 'Mastalentos');

        // Enviar Correo de notificacion al propietario del sitio
        $mail->addAddress('correakevin121314@gmail.com', 'Kevin');
        $mail->Subject = 'Nuevo mensaje desde el formulario de contacto';
        $mail->isHTML(true);
        $mail->Body = "
            <html>
            <head>
                <title>Nuevo mensaje de contacto</title>
            </head>
            <body>
                <h2>Nuevo mensaje desde el formulario de contacto</h2>
                <p><strong>Nombre:</strong> $nombre</p>
                <p><strong>Email:</strong> $email</p>
                <p><strong>Mensaje:</strong><br>$mensaje</p>
            </body>
            </html>
        ";
        $mail->send();

        // Envio Confirmacion a usuario que relleno formulario
        $mail->clearAddresses();
        $mail->addAddress($email, $nombre);
        $mail->Subject = 'Hemos recibido tu mensaje';
        $mail->Body = "
            <html>
            <head>
                <title>Confirmación de contacto</title>
            </head>
            <body>
                <p>Hola $nombre,</p>
                <p>Gracias por contactarnos. Hemos recibido tu mensaje y nos pondremos en contacto contigo si es necesario.</p>
                <p>Mensaje enviado:</p>
                <blockquote>$mensaje</blockquote>
                <p>Saludos,<br>Miraiyco</p>
            </body>
            </html>
        ";
        $mail->send();

    } catch (Exception $e) {
    }
}
?>
