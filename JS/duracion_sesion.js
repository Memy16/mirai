const rol = sessionStorage.getItem("php_rol");
if (rol) {
    localStorage.clear();
    localStorage.setItem("session_start", Date.now());
    localStorage.setItem("session_rol", rol);
    
    // 15 minutos de inactividad para todos
    const tiempoExpiracion = 15 * 60 * 1000;
    localStorage.setItem("session_expire", Date.now() + tiempoExpiracion);
}