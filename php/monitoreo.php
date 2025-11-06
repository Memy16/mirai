<?php
// Ejecutar el script manualmente
shell_exec('bash /home/mirai.klasso/mirai/scripts/monitoreo.sh');

// Directorio de logs
$logDir = '/home/mirai.klasso/mirai/logs/';
$files = glob($logDir . 'monitor_*.log');
rsort($files);

if (!empty($files)) {
    $latest = $files[0];
    $content = file_get_contents($latest);

    // Convertir códigos de color ANSI a HTML
    $ansi_map = [
        "/\e\[38;5;18m/"  => "<span style='color:#062863;'>", // azul oscuro
        "/\e\[38;5;68m/"  => "<span style='color:#607EC9;'>", // azul
        "/\e\[38;5;136m/" => "<span style='color:#A87B04;'>", // amarillo oscuro
        "/\e\[38;5;232m/" => "<span style='color:#1E1E1E;'>", // negro
        "/\e\[32m/"       => "<span style='color:#00FF00;'>", // verde 
        "/\e\[31m/"       => "<span style='color:#FF0000;'>", // rojo 
        "/\e\[0m/"        => "</span>",
    ];

    $content = preg_replace(array_keys($ansi_map), array_values($ansi_map), htmlspecialchars($content));

    echo "<pre style='background:#FFFFFF; padding:1rem; border-radius:10px; box-shadow:rgba(0, 0, 0, 0.2);'>";
    echo $content;
    echo "</pre>";
} else {
    echo "<p>No hay informes disponibles aún.</p>";
}
?>
