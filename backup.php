<?php
// Configuración
$backupDir = __DIR__ . '/backups/';
$siteDir = __DIR__;
$dbHost = 'localhost';
$dbUser = 'root';
$dbPass = 'root';
$dbName = 'mirai_klasso';

if (!file_exists($backupDir)) {
    mkdir($backupDir, 0777, true);
}

$date = date('Y-m-d_H-i-s');
$backupFile = $backupDir . "backup_$date.zip";

function backupDatabase($host, $user, $pass, $name, $file) {
    $command = "mysqldump -h $host -u $user -p$pass $name > $file.sql";
    exec($command);
}

function zipSite($sourceDir, $zipFile, $dbFile, $ignoreDirs = []) {
    $zip = new ZipArchive();
    if ($zip->open($zipFile, ZipArchive::CREATE) === TRUE) {
        if (file_exists($dbFile)) {
            $zip->addFile($dbFile, basename($dbFile));
        }

        $sourceDir = realpath($sourceDir);

        $files = new RecursiveIteratorIterator(
            new RecursiveDirectoryIterator($sourceDir, RecursiveDirectoryIterator::SKIP_DOTS),
            RecursiveIteratorIterator::LEAVES_ONLY
        );

        foreach ($files as $file) {
            if (!$file->isDir()) {
                $filePath = $file->getRealPath();
                $relativePath = substr($filePath, strlen($sourceDir) + 1);

                $relativePathNormalized = str_replace('\\', '/', $relativePath);

                $skip = false;
                foreach ($ignoreDirs as $dir) {
                    $dir = trim($dir, '/');
                    if (strpos($relativePathNormalized, $dir . '/') === 0) {
                        $skip = true;
                        break;
                    }
                }

                if (!$skip && $relativePathNormalized != basename($dbFile)) {
                    $zip->addFile($filePath, $relativePathNormalized);
                }
            }
        }

        $zip->close();
    }
}

$dbFile = $backupDir . "db_$date.sql";
backupDatabase($dbHost, $dbUser, $dbPass, $dbName, $dbFile);

// Ignorar el directorio 'backups' al hacer el zip
zipSite($siteDir, $backupFile, $dbFile, ['backups']);

if(file_exists($dbFile)){
    unlink($dbFile);
} else {
    echo "Aviso: No se encontró el archivo SQL para borrar.\n";
}

echo "Backup completado: $backupFile\n";
?>
