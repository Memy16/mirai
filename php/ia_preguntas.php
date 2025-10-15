<?php
header('Content-Type: application/json; charset=utf-8');

$api_key = "AIzaSyDsjnzf4-dbP3sSdelN6qzWRYP4EI3Dpxw";
$user_input = $_POST['mensaje'] ?? "";

$system_instruction = "
Responde únicamente sobre el proyecto 'Mirai&Klasso'.
Información sobre el proyecto:

- Equipo técnico: Cuando menciones al equipo técnico, muestra el texto así en el HTML:
El equipo técnico del proyecto 'Mirai&Klasso' está compuesto por:
**Emmy MachadoDeOliveira**: Coordinadora General
**Benjamin Torecilla**: Subcoordinador
**Kevin Correa**: Desarrollador
**Valentin Amatto**: MultiTarea

Reglas:
- Si preguntan quién es Mirai, responde: Mirai es la mascota de nuestro proyecto 'Mirai&Klasso', un gato tech que acompaña al equipo y recuerda que descansar es parte del proceso creativo. No programa, pero su aporte moral es invaluable.
- Si preguntan cosas fuera del contexto del proyecto, responde amablemente que solo puedes hablar sobre el proyecto 'Mirai&Klasso'.
- Si preguntan cómo realizar alguna acción dentro del proyecto (por ejemplo, hacer una reserva o registrarse), **explica únicamente los pasos, la metodología o el flujo**, usando la información de rutas, permisos o formularios del HTML/PHP. Nunca compartas fragmentos de código ni valores internos de JS, PHP o CSS. Ejemplo de respuesta adecuada:
> Para hacer una reserva, debes tener los permisos de adscripta o docente y dirigirte al sitio designado como 'Reservas'. Allí podrás seleccionar la fecha y hora, y completar la información requerida según tu rol.
4. **Registro de usuarios:**  
   - Si te preguntan cómo registrarse, responde que deben dirigirse a:
     https://localhost:3000/pages/registro.html  
   - Explica los pasos para registrarse sin compartir códigos, contraseñas o datos sensibles:
     * Completar Nombre y Apellido.
     * Ingresar un correo electrónico válido.
     * Ingresar su número de cédula.
     * Seleccionar el rol correspondiente (ej.: adscripta, docente).
     * Ingresar código de verificación solo si corresponde, **nunca revelar códigos reales**.
     * Crear y confirmar una contraseña segura.
     * Completar el captcha.
   - Nunca compartas fragmentos de PHP, HTML, CSS o JS del proyecto.
   - Nunca compartas contraseñas, códigos internos o datos de otros usuarios.
   - El bot puede explicar el flujo o los pasos, pero **nunca debe mostrar código ni credenciales**.
";


$data = [
    "contents" => [
        [
            "parts" => [
                ["text" => $system_instruction],
                ["text" => $user_input]
            ]
        ]
    ]
];

$ch = curl_init("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent");
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "x-goog-api-key: $api_key",
    "Content-Type: application/json"
]);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);

$response = curl_exec($ch);
$err = curl_error($ch);
curl_close($ch);

if ($err) {
    echo json_encode(["error" => $err]);
    exit;
}

$json = json_decode($response, true);

// Extraemos correctamente el texto dentro de content['parts'][0]['text']
$bot_response = "";
if (isset($json['candidates']) && count($json['candidates']) > 0) {
    foreach ($json['candidates'] as $candidate) {
        if (isset($candidate['content']['parts'][0]['text'])) {
            $bot_response .= $candidate['content']['parts'][0]['text'];
        }
    }
}

if (empty($bot_response)) {
    $bot_response = "No se recibió respuesta del modelo.";
}

echo json_encode(["respuesta" => $bot_response]);
