const rol = sessionStorage.getItem("php_rol");
if (!rol) {
    console.warn("No se recibió rol desde PHP.");
} else {
    console.log("Sesión iniciada como:", rol);
}

localStorage.clear();
localStorage.setItem("session_start", Date.now());
localStorage.setItem("session_rol", rol);

const duraciones = {
    administrador: 4 * 60 * 60 * 1000, // 4 horas
    profesor: 1 * 60 * 60 * 1000, // 1 hora
    estudiante: 15 * 60 * 1000 // 15 minutos
};

localStorage.setItem(
    "session_expire",
    Date.now() + (duraciones[rol] || 30 * 60 * 1000)
);

console.log(
    "Sesión expira a las:",
    new Date(Number(localStorage.getItem("session_expire"))).toLocaleTimeString()
);