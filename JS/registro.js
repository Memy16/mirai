document.getElementById("formulario").addEventListener("submit", function(event) {
    event.preventDefault();

    const pass = document.getElementById("contrasena").value;
    const repetir = document.getElementById("repetir").value;
    const mensaje = document.getElementById("mensaje");
    
    // 1. primero comparar contraseñas
    if (pass !== repetir) {
        mensaje.textContent = "Las contraseñas no coinciden.";
        mensaje.style.color = "red";
        return;
    }
    
    // 2. longitud mínima
    if (pass.length < 6) {
        mensaje.textContent = "La contraseña debe tener al menos 6 caracteres.";
        mensaje.style.color = "red";
        return;
    }
    
    // 3. al menos una minúscula
    if (!/[a-z]/.test(pass)) {
        mensaje.textContent = "La contraseña debe incluir al menos una letra minúscula.";
        mensaje.style.color = "red";
        return;
    }
    
    // 4. al menos una mayúscula
    if (!/[A-Z]/.test(pass)) {
        mensaje.textContent = "La contraseña debe incluir al menos una letra mayúscula.";
        mensaje.style.color = "red";
        return;
    }
    
    // 5. al menos un número
    if (!/[0-9]/.test(pass)) {
        mensaje.textContent = "La contraseña debe incluir al menos un número.";
        mensaje.style.color = "red";
        return;
    }

    // 6. al menos un símbolo especial (cualquier no alfanumérico)
    if (!/[^A-Za-z0-9]/.test(pass)) {
        mensaje.textContent = "La contraseña debe incluir al menos un símbolo especial.";
        mensaje.style.color = "red";
        return;
    }
    
    mensaje.style.color = "green";
    mensaje.textContent = "Contraseña válida. Enviando...";
    this.submit();
});
