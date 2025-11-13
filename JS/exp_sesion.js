function checkSession() {
    const expire = localStorage.getItem("session_expire");
    if (!expire) return;
    
    if (Date.now() > Number(expire)) {
        localStorage.clear();
        sessionStorage.clear();
        
        Swal.fire({
            title: "⏰ Sesión expirada",
            text: "Tu sesión ha caducado por inactividad. Serás redirigido al login.",
            icon: "warning",
            confirmButtonText: "OK",
            allowOutsideClick: false,
            allowEscapeKey: false
        }).then((result) => {
            window.location.href = "../pages/login.html";
        });
    }
}

// Verificar cada 30 segundos
setInterval(checkSession, 30000);

// Resetear el tiempo con cualquier interacción
function resetSessionTimer() {
    const tiempoExpiracion = 15 * 60 * 1000;
    localStorage.setItem("session_expire", Date.now() + tiempoExpiracion);
}

document.addEventListener("mousemove", resetSessionTimer);
document.addEventListener("keypress", resetSessionTimer);
document.addEventListener("click", resetSessionTimer);
document.addEventListener("scroll", resetSessionTimer);

// Verificar al cargar la página
document.addEventListener("DOMContentLoaded", checkSession);