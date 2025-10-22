// En lugar de esto:
// document.getElementById("formulario").addEventListener("submit", function(event) {

// Usa esto:
document.querySelector("form").addEventListener("submit", function(event) {
    event.preventDefault();

    const pass = document.getElementById("contrasena").value;
    const repetir = document.getElementById("repetir").value;
    const mensaje = document.getElementById("mensaje");

    // Limpiar mensaje anterior
    mensaje.textContent = "";

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

    // 6. al menos un símbolo especial
    if (!/[^A-Za-z0-9]/.test(pass)) {
        mensaje.textContent = "La contraseña debe incluir al menos un símbolo especial.";
        mensaje.style.color = "red";
        return;
    }

    // Si pasa todas las validaciones
    mensaje.style.color = "green";
    mensaje.textContent = "Contraseña válida. Enviando...";
    
    // Enviar el formulario
    this.submit();
});

 const password = document.getElementById('contrasena');
  const repetir = document.getElementById('repetir');
  const viewPassword = document.getElementById('viewPassword');
  const iconoVer = document.getElementById('iconoVer');
  const texto = viewPassword.querySelector('span');
  let visible = false;

  viewPassword.addEventListener('click', () => {
    visible = !visible;
    const tipo = visible ? 'text' : 'password';
    password.type = tipo;
    repetir.type = tipo;
    texto.textContent = visible ? 'Ocultar contraseña' : 'Mostrar contraseña';
    iconoVer.src = visible
      ? 'https://cdn-icons-png.flaticon.com/512/159/159604.png'  // ícono de ocultar
      : 'https://cdn-icons-png.flaticon.com/512/565/565655.png'; // ícono de ver
  });