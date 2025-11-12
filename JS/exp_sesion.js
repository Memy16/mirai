function checkSession() {
    const expire = localStorage.getItem("session_expire");
    if (!expire) return;
    if (Date.now() > expire) {
        localStorage.clear();
        Swal.fire({
            title: "⏰ Sesión expirada",
            html: `
        <p>Tu sesión ha caducado por inactividad.</p>
        <p>Serás redirigido al inicio en <b id="countdown">5</b> segundos...</p>
        `,
            icon: "info",
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false,
            timer: 5000,
            didOpen: () => {
                const countdownEl = Swal.getHtmlContainer().querySelector("#countdown");
                let timeLeft = 5;
                const timer = setInterval(() => {
                    timeLeft--;
                    countdownEl.textContent = timeLeft;
                    if (timeLeft <= 0) clearInterval(timer);
                }, 1000);
            },
            willClose: () => {
                // Redirige al login cuando cierra la alerta
                window.location.href = "../pages/login.html";
            }
        });
    }
}

setInterval(checkSession, 60000); 
document.addEventListener("mousemove", () => {
    const rol = localStorage.getItem("session_rol");
    if (!rol) return;
    const duraciones = {
        administrador: 4 * 60 * 60 * 1000,
        profesor: 1 * 60 * 60 * 1000,
        estudiante: 15 * 60 * 1000
    };
    localStorage.setItem("session_expire", Date.now() + (duraciones[rol] || 1800000));
});