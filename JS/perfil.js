fetch("../php/obtener_usuario.php")
    .then(res => res.json())
    .then(data => {
        if (!data.error) {
            document.getElementById("userName").textContent = data.nombre + " " + data.apellido;
            document.getElementById("userRol").textContent = data.rol.charAt(0).toUpperCase() + data.rol.slice(1);
        }
    });
    
const profileBtn = document.getElementById("profileBtn");
const profileDropdown = document.getElementById("profileDropdown");

profileBtn.addEventListener("click", (e) => {
    e.preventDefault();
    profileDropdown.classList.toggle("show");
});

document.addEventListener("click", (e) => {
    if (!profileBtn.contains(e.target) && !profileDropdown.contains(e.target)) {
        profileDropdown.classList.remove("show");
    }
});