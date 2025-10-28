// Usar el ID correcto de tu input
document.getElementById('InputPassword1').addEventListener('keydown', function(e) {
    // Combinaciones a bloquear
    const blockedCombinations = [
        { ctrl: true, keyCode: 67 }, // Ctrl+C
        { ctrl: true, keyCode: 86 }, // Ctrl+V
        { ctrl: true, keyCode: 88 }, // Ctrl+X
        { ctrl: true, keyCode: 65 }  // Ctrl+A (seleccionar todo)
    ];
    
    for (let combo of blockedCombinations) {
        if (e.ctrlKey === combo.ctrl && e.keyCode === combo.keyCode) {
            e.preventDefault();
            return false;
        }
    }
});

// También bloquear el menú contextual en el mismo input
document.getElementById('InputPassword1').addEventListener('contextmenu', function(e) {
    e.preventDefault();  // Cancela la acción por defecto
    return false;        // Previene la propagación del evento
});


const password = document.getElementById('InputPassword1');
const viewPassword = document.getElementById('viewPassword');
const iconoVer = document.getElementById('iconoVer');
const texto = viewPassword.querySelector('span');
let visible = false;

// Función para mostrar/ocultar contraseña
viewPassword.addEventListener('click', () => {
    visible = !visible;
    password.type = visible ? 'text' : 'password';
    texto.textContent = visible ? 'Ocultar contraseña' : 'Mostrar contraseña';
    iconoVer.src = visible
        ? 'https://cdn-icons-png.flaticon.com/512/159/159604.png'  // ícono de ocultar
        : 'https://cdn-icons-png.flaticon.com/512/565/565655.png'; // ícono de ver
});

// PROTECCIÓN CONTRA COPIADO Y PEGADO
password.addEventListener('keydown', function(e) {
    if (e.ctrlKey && 'cvas'.includes(e.key.toLowerCase())) {
        e.preventDefault();
        return false;
    }
});

// Bloquear menú contextual (clic derecho)
password.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    return false;
});

// Bloquear eventos de copiar, pegar y cortar
password.addEventListener('copy', function(e) {
    e.preventDefault();
});

password.addEventListener('paste', function(e) {
    e.preventDefault();
});

password.addEventListener('cut', function(e) {
    e.preventDefault();
});