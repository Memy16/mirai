document.querySelector("form").addEventListener("submit", function(event) {
    event.preventDefault();

    // Cambiar los IDs para que coincidan con el HTML proporcionado
    const pass = document.getElementById("password_nueva").value;
    const repetir = document.getElementById("password_repetir").value;
    const mensaje = document.getElementById("mensaje");

    // Limpiar mensaje anterior
    mensaje.textContent = "";
    mensaje.className = "";

    // 1. primero comparar contraseñas
    if (pass !== repetir) {
        mensaje.textContent = "Las contraseñas no coinciden.";
        mensaje.className = "mensaje-error";
        return;
    }
    
    // 2. longitud mínima
    if (pass.length < 6) {
        mensaje.textContent = "La contraseña debe tener al menos 6 caracteres.";
        mensaje.className = "mensaje-error";
        return;
    }
    
    // 3. al menos una minúscula
    if (!/[a-z]/.test(pass)) {
        mensaje.textContent = "La contraseña debe incluir al menos una letra minúscula.";
        mensaje.className = "mensaje-error";
        return;
    }
    
    // 4. al menos una mayúscula
    if (!/[A-Z]/.test(pass)) {
        mensaje.textContent = "La contraseña debe incluir al menos una letra mayúscula.";
        mensaje.className = "mensaje-error";
        return;
    }
    
    // 5. al menos un número
    if (!/[0-9]/.test(pass)) {
        mensaje.textContent = "La contraseña debe incluir al menos un número.";
        mensaje.className = "mensaje-error";
        return;
    }

    // 6. al menos un símbolo especial
    if (!/[^A-Za-z0-9]/.test(pass)) {
        mensaje.textContent = "La contraseña debe incluir al menos un símbolo especial.";
        mensaje.className = "mensaje-error";
        return;
    }

    // Si pasa todas las validaciones
    mensaje.textContent = "Contraseña válida. Enviando...";
    mensaje.className = "mensaje-exito";
    
    // Enviar el formulario después de un breve retraso para que el usuario vea el mensaje
    setTimeout(() => {
        this.submit();
    }, 1500);
});

// Agregar funcionalidad a los botones adicionales
document.getElementById("btnCancelar").addEventListener("click", function() {
    if (confirm("¿Estás seguro de que deseas cancelar? Los cambios no guardados se perderán.")) {
        window.location.href = "#"; // Cambiar por la URL deseada
    }
});

document.getElementById("btnEliminar").addEventListener("click", function() {
    if (confirm("¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.")) {
        // Aquí iría la lógica para eliminar la cuenta
        alert("Cuenta eliminada (simulación)");
    }
});