<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Error</title>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
</head>
<body>
    <?php
    $cedula = htmlspecialchars($_GET['cedula'] ?? '');
    ?>
    <script>
        Swal.fire({
            icon: 'error',
            title: 'Cédula ya registrada',
            text: 'La cédula "<?php echo $cedula; ?>" ya se encuentra registrada en el sistema.',
            confirmButtonText: 'Intentar de nuevo'
        }).then(() => {
            window.history.back();
        });
    </script>
</body>
</html>
