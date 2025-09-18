<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $nombre = $_POST['nombre'];
    $email = $_POST['email'];
    $mensaje = $_POST['mensaje'];

    $mail = new PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host       = 'smtp.zoho.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = 'miraiyco@mastalentos.site';
        $mail->Password   = 'jQaQgHWeTrhC';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port       = 465;

        $mail->setFrom('miraiyco@mastalentos.site', 'MiraiYco Site');
        
        $mail->addAddress('correakevin121314@gmail.com', 'Kevin');
        $mail->Subject = 'Nuevo mensaje desde el formulario de contacto';
        $mail->isHTML(true);
        $mail->Body = "
        <html>
        <head>
          <title>Nuevo mensaje de contacto</title>
        </head>
        <body style=\"margin:0; padding:0; font-family: Arial, sans-serif; background:#f5f8ff;\">
          <table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\">
            <tr>
              <td align=\"center\">
                <table width=\"600\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"background: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);\">
        
                  <tr>
                    <td style=\"text-align:center; background: url('https://i.ibb.co/9JxndDJ/img-itsp-1.png') no-repeat center center; background-size: cover; border-radius: 12px 12px 0 0; padding: 30px;\">
                      <img src=\"https://i.ibb.co/chkvvQd5/klasso-logo.png\" alt=\"Logo\" style=\"max-width:120px; border:none;\">
                      <h2 style=\"margin:15px 0 0 0; font-size:22px; color:#fff; text-shadow: 1px 1px 4px rgba(0,0,0,0.5);\">
                        📩 Nuevo mensaje desde el formulario
                      </h2>
                    </td>
                  </tr>
                  
                  <tr>
                    <td style=\"padding:20px; color:#333;\">
                      <p style=\"font-size:16px; margin-bottom:10px;\">
                        <strong style=\"color:#007bff;\">Nombre:</strong> $nombre
                      </p>
                      <p style=\"font-size:16px; margin-bottom:10px;\">
                        <strong style=\"color:#ffc107;\">Email:</strong> $email
                      </p>
                      <p style=\"font-size:16px; line-height:1.5;\">
                        <strong style=\"color:#00cfff;\">Mensaje:</strong><br>
                        $mensaje
                      </p>
                    </td>
                  </tr>
                  
                  <tr>
                    <td align=\"center\" style=\"background:#f1f9ff; border-top: 1px solid #eee; border-radius: 0 0 12px 12px; color:#666; font-size:14px; padding:15px;\">
                      Este correo fue enviado automáticamente desde tu página web.
                    </td>
                  </tr>
                
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
        ";
        $mail->send();

        $mail->clearAddresses();
        $mail->addAddress($email, $nombre);
        $mail->Subject = 'Gracias por contactarnos - MiraiYco';
        $mail->Body = "
        <html>
        <head>
          <title>Gracias por contactarnos</title>
        </head>
        <body style=\"margin:0; padding:0; font-family: Arial, sans-serif; background:#f5f8ff;\">
          <table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\">
            <tr>
              <td align=\"center\">
                <table width=\"600\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"background: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);\">
        
                  <tr>
                    <td style=\"text-align:center; background: url('https://i.ibb.co/9JxndDJ/img-itsp-1.png') no-repeat center center; background-size: cover; border-radius: 12px 12px 0 0; padding: 30px;\">
                      <img src=\"https://i.ibb.co/chkvvQd5/klasso-logo.png\" alt=\"Logo\" style=\"max-width:120px; border:none;\">
                      <h2 style=\"margin:15px 0 0 0; font-size:22px; color:#fff; text-shadow: 1px 1px 4px rgba(0,0,0,0.5);\">
                        ✅ Gracias por contactarnos
                      </h2>
                    </td>
                  </tr>
                  
                  <tr>
                    <td style=\"padding:20px; color:#333;\">
                      <p style=\"font-size:16px;\">Hola <strong>$nombre</strong>,</p>
                      <p style=\"font-size:16px; line-height:1.5;\">
                        Hemos recibido tu mensaje y nuestro equipo se pondrá en contacto contigo lo antes posible.
                      </p>
                      <p style=\"font-size:16px; line-height:1.5; margin-top:20px;\">
                        <strong style=\"color:#00cfff;\">Tu mensaje enviado:</strong><br>
                        <blockquote style=\"border-left:4px solid #00cfff; padding-left:10px; margin:10px 0; color:#555;\">$mensaje</blockquote>
                      </p>
                      <p style=\"font-size:16px; line-height:1.5; margin-top:20px;\">
                        ¡Gracias por confiar en <strong>MiraiYco</strong>!<br>
                        Te responderemos pronto.
                      </p>
                    </td>
                  </tr>
                  
                  <tr>
                    <td align=\"center\" style=\"background:#f1f9ff; border-top: 1px solid #eee; border-radius: 0 0 12px 12px; color:#666; font-size:14px; padding:15px;\">
                      Este correo es una confirmación automática, por favor no respondas a este mensaje.
                    </td>
                  </tr>
                
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
        ";
        $mail->isHTML(true);
        $mail->send();

        header("Location: ../pages/contacto.html?status=ok");
        exit;

    } catch (Exception $e) {
    }
}
?>
