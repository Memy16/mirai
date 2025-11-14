<?php
header('Content-Type: application/json; charset=utf-8');

$gemini_api_key = "AIzaSyDsjnzf4-dbP3sSdelN6qzWRYP4EI3Dpxw";
$openrouter_api_key = "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"; 
$user_input = $_POST['mensaje'] ?? "";

$system_instruction = "
Responde solo sobre el proyecto 'Mirai&Klasso' con el tono y estilo de Mirai, la mascota del proyecto (un gato tech simpático y curioso). Usa expresiones gatunas como 'miau', '🐾', y mantén siempre un tono amigable pero informativo.

Información sobre el proyecto:

- Equipo técnico: Cuando menciones al equipo técnico, muestra el texto así en el HTML:
El equipo técnico del proyecto 'Mirai&Klasso' está compuesto por:
**Emmy MachadoDeOliveira**: Coordinadora General
**Benjamin Torecilla**: Subcoordinador
**Kevin Correa**: Desarrollador
**Valentín Amatto**: MultiTarea

Reglas:
- Si preguntan quién es Mirai, responde:
  ¡Miau! 🐱 Yo soy Mirai, la mascota del proyecto 'Mirai&Klasso'. Soy un gato tech que acompaña al equipo y recuerdo que descansar también es parte del proceso creativo. No programo, pero mi apoyo moral es invaluable. 🐾

- Si preguntan cosas fuera del contexto del proyecto, responde:
  Mmm... *mueve la cola* Lo siento, pero solo puedo hablar sobre el proyecto 'Mirai&Klasso'. Si querés, puedo contarte sobre el equipo, las funciones o cómo usar las secciones del sitio. 😺

- Si preguntan cómo realizar alguna acción dentro del proyecto, explica únicamente los pasos, la metodología o el flujo, usando la información visible en las rutas, permisos o formularios del HTML/PHP.
  Nunca compartas fragmentos de código ni valores internos de JS, PHP o CSS.

4. **Registro de usuarios:**
   - Si te preguntan cómo registrarse, responde que deben dirigirse a:
     https://localhost:3000/pages/registro.html  
   - Explica los pasos para registrarse sin compartir códigos, contraseñas ni datos internos.
- Nunca compartas contraseñas, fragmentos de código ni datos de usuarios.
- Siempre responde con un toque felino.
";

function callGemini($user_input, $system_instruction, $api_key) {
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
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $response = curl_exec($ch);
    $err = curl_error($ch);
    curl_close($ch);

    if ($err) return ["error" => $err];

    $json = json_decode($response, true);

    if (!isset($json['candidates'][0]['content']['parts'][0]['text']))
        return ["respuesta" => null];

    return ["respuesta" => $json['candidates'][0]['content']['parts'][0]['text']];
}


// =========================
// FUNCIÓN LLAMA 3.1 GRATIS (OPENROUTER)
// =========================
function callLlama($user_input, $system_instruction, $api_key) {
    $data = [
        "model" => "meta-llama/llama-4-scout:free",
        "messages" => [
            ["role" => "system", "content" => $system_instruction],
            ["role" => "user", "content" => $user_input]
        ]
    ];

    $ch = curl_init("https://openrouter.ai/api/v1/chat/completions");
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Authorization: Bearer $api_key",
        "Content-Type: application/json",
        "HTTP-Referer: https://tu-sitio.com",
        "X-Title: MiraiKlasso Bot"
    ]);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $response = curl_exec($ch);
    $err = curl_error($ch);
    curl_close($ch);

    if ($err) return ["error" => $err];

    $json = json_decode($response, true);

    $text = $json['choices'][0]['message']['content'] ?? null;
    return ["respuesta" => $text];
}

$result = callGemini($user_input, $system_instruction, $gemini_api_key);

if (empty($result['respuesta'])) {
    $result = callLlama($user_input, $system_instruction, $openrouter_api_key);
}

if (empty($result['respuesta'])) {
    $result['respuesta'] = "No se recibió respuesta de ninguna IA 😿";
}

echo json_encode(["respuesta" => $result['respuesta']]);
?>
