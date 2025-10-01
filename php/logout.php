<?php
session_start();
//borra el registo de session
$_SESSION = array();
//Cerrar la sesión
session_destroy();
//Redirigir a la página actual (recarga como F5)
header("Location: ../pages/login.html");
?>