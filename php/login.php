<?php 
require("conexion.php"); 
$con = conectar_bd();

if (isset($_POST["inicio_sesion"])) {
    $ci = $_POST["cedula"];      // 👈 input del formulario
    $contrasenia = $_POST["pass"]; // 👈 input del formulario
    
    logear($con, $ci, $contrasenia);
}

function logear($con, $ci, $contrasenia) {
    session_start();

    // ======================
    // 1. Buscar en ALUMNOS
    // ======================
    $consulta = "SELECT * FROM alumnos WHERE ci_alumno = '$ci'";
    $resultado = mysqli_query($con, $consulta);
    
    if (mysqli_num_rows($resultado) > 0) {
        $fila = mysqli_fetch_assoc($resultado);
        $password_bd = $fila["contrasena"]; 
        if (password_verify($contrasenia, $password_bd)) {
            $_SESSION["ci"] = $ci;
            $_SESSION["usuario"] = $fila["nombre"]." ".$fila["apellido"];
            $_SESSION["rol"] = "estudiante";

            // Mensaje de bienvenida
            echo "Bienvenido Estudiante ".$fila['nombre']." ".$fila['apellido']."<br>";
            echo "<a href='../pages/alumno.html'>Ir a tu home</a>";
            exit();
        }
    }
    
    // ======================
    // 2. Buscar en DOCENTES
    // ======================
    $consulta = "SELECT * FROM docente WHERE ci_docente = '$ci'";
    $resultado = mysqli_query($con, $consulta);
    
    if (mysqli_num_rows($resultado) > 0) {
        $fila = mysqli_fetch_assoc($resultado);
        $password_bd = $fila["contrasena_docente"]; 
        if (password_verify($contrasenia, $password_bd)) {
            $_SESSION["ci"] = $ci;
            $_SESSION["usuario"] = $fila["nombre"]." ".$fila["apellido"];
            $_SESSION["rol"] = "docente";

            echo "Bienvenido Docente ".$fila['nombre']." ".$fila['apellido']."<br>";
            echo "<a href='../pages/docente.html'>Ir a tu home</a>";
            exit();
        }
    }
    
    // ======================
    // 3. Buscar en ADSCRIPTAS
    // ======================
    $consulta = "SELECT * FROM adscripta WHERE ci_adscripta = '$ci'";
    $resultado = mysqli_query($con, $consulta);

    if (mysqli_num_rows($resultado) > 0) {
        $fila = mysqli_fetch_assoc($resultado);
        $password_bd = $fila["contrasena_adscripta"]; 
        if (password_verify($contrasenia, $password_bd)) {
            $_SESSION["ci"] = $ci;
            $_SESSION["usuario"] = $fila["nombre"]." ".$fila["apellido"];
            $_SESSION["rol"] = "adscripta";

            echo "Bienvenida Adscripta ".$fila['nombre']." ".$fila['apellido']."<br>";
            echo "<a href='../pages/adscripcion.html'>Ir a tu home</a>";
            exit();
        }
    }
    
    // ========================
    // Si no encontró coincidencia
    // ========================
    echo "Cédula o contraseña incorrecta";
}
?>

