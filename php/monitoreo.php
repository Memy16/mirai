<?php
// Ejecutar el script manualmente
shell_exec('bash /home/mirai.klasso/mirai/scripts/monitor.sh');

// Directorio de logs
$logDir = '/home/mirai.klasso/mirai/logs/';
$files = glob($logDir . 'monitor_*.log');
rsort($files);

if (!empty($files)) {
    $latest = $files[0];
    $content = file_get_contents($latest);

    // Convertir códigos de color ANSI a HTML
    $ansi_map = [
        "/\033\[1;31m/" => "<span style='color:#f55;'>", // rojo
        "/\033\[1;32m/" => "<span style='color:#0f0;'>", // verde
        "/\033\[1;33m/" => "<span style='color:#ff0;'>", // amarillo
        "/\033\[1;34m/" => "<span style='color:#0af;'>", // azul
        "/\033\[1;36m/" => "<span style='color:#0ff;'>", // cian
        "/\033\[0m/"    => "</span>",                    // reset
    ];

    $content = preg_replace(array_keys($ansi_map), array_values($ansi_map), htmlspecialchars($content));

    echo "<pre style='background:#FFFFFF; color:#062863; padding:1rem; border-radius:10px; box-shadow:rgba(0, 0, 0, 0.2);'>";
    echo $content;
    echo "</pre>";
} else {
    echo "<p>No hay informes disponibles aún.</p>";
}
?>
