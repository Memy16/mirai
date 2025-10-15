<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

function enviarCorreoRecuperacion($email, $token) {
    $mail = new PHPMailer(true);

    try {
        // Configuración SMTP (Zoho)
        $mail->isSMTP();
        $mail->Host       = 'smtp.zoho.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = 'miraiyco@mastalentos.site';
        $mail->Password   = 'jQaQgHWeTrhC';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port       = 465;

        $mail->setFrom('miraiyco@mastalentos.site', 'Recuperacion de Contrasena');
        $mail->addAddress($email);
        $mail->isHTML(true);
        $mail->Subject = '🔐 Recuperacion de contrasena - Plataforma Docente';

        $enlace = "https://localhost:3000/php/password_reset/reset_password.php?token=" . urlencode($token);

        $mail->Body = "
        <html>
        <head><title>Recuperar contraseña</title></head>
        <body style='font-family: Arial, sans-serif; background:#f5f8ff;'>
          <table width='100%' cellpadding='0' cellspacing='0'>
            <tr><td align='center'>
              <table width='600' style='background:#fff; border-radius:10px; box-shadow:0 4px 10px rgba(0,0,0,0.1);'>
                <tr>
                  <td style='background:#007bff; color:white; padding:20px; border-radius:10px 10px 0 0; text-align:center;'>
                    <h2>🔐 Recuperación de Contraseña</h2>
                  </td>
                </tr>
                <tr><td style='padding:25px; color:#333;'>
                  <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta docente.</p>
                  <p>Si fuiste tú, haz clic en el siguiente botón:</p>
                  <p style='text-align:center; margin:30px 0;'>
                    <a href='$enlace' style='background:#007bff; color:white; padding:12px 20px; border-radius:8px; text-decoration:none;'>Restablecer Contraseña</a>
                  </p>
                  <p>Este enlace expirará en <strong>1 hora</strong>.</p>
                  <p>Si no solicitaste este cambio, ignora este correo.</p>
                </td></tr>
                <tr><td style='background:#f1f9ff; color:#666; text-align:center; padding:15px; border-radius:0 0 10px 10px;'>
                  © ".date('Y')." Plataforma Docente — Recuperación Automática
                </td></tr>
              </table>
            </td></tr>
          </table>
        </body>
        </html>
        ";

        $mail->send();
    } catch (Exception $e) {
        error_log("Error enviando correo: " . $mail->ErrorInfo);
    }
}
?>
