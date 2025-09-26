// editar_perfil.js
// RUTAS: ajusta si tu estructura es diferente
const GET_USER_URL = "../php/getUser.php";
const SAVE_URL = "../php/save_profile.php";

// Lista de estilos DiceBear que mostramos (podés agregar más)
const STYLES = [
    "adventurer",
    "bottts",
    "pixel-art",
    "identicon",
    "micah",
    "thumbs" // si alguno no existe, cambialo; estos son ejemplos
];

// helpers
function dicebearUrl(style, seed, size = 200) {
    // Usamos SVG para mejor nitidez
    // Formato: https://api.dicebear.com/7.x/{style}/svg?seed={seed}
    return `https://api.dicebear.com/7.x/${encodeURIComponent(style)}/svg?seed=${encodeURIComponent(seed)}&scale=100`;
}

function randomSeed(len = 8) {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let s = "";
    for (let i = 0; i < len; i++) s += chars.charAt(Math.floor(Math.random() * chars.length));
    return s;
}

// DOM
const seedInput = document.getElementById("seedInput");
const avatarPreview = document.getElementById("avatarPreview");
const stylesGrid = document.getElementById("stylesGrid");
const guardarBtn = document.getElementById("guardarBtn");
const randomSeedBtn = document.getElementById("randomSeedBtn");
const statusMsg = document.getElementById("statusMsg");

let selectedStyle = STYLES[0]; // default

// Render thumbnails
function renderStyles(seed = "user") {
    stylesGrid.innerHTML = "";
    STYLES.forEach(style => {
        const col = document.createElement("div");
        col.className = "col-6 col-sm-4 col-md-3";

        const card = document.createElement("div");
        card.className = "style-card p-2 d-flex align-items-center gap-2";
        card.dataset.style = style;

        const thumb = document.createElement("div");
        thumb.className = "style-thumb me-2";
        const img = document.createElement("img");
        img.src = dicebearUrl(style, seed, 80);
        img.alt = style;
        img.style.width = "100%";
        img.style.height = "100%";
        img.style.objectFit = "cover";
        thumb.appendChild(img);

        const txt = document.createElement("div");
        txt.innerHTML = `<small class="text-muted">${style}</small>`;

        card.appendChild(thumb);
        card.appendChild(txt);

        card.addEventListener("click", () => {
            selectStyle(style);
        });

        col.appendChild(card);
        stylesGrid.appendChild(col);
    });
    highlightSelected();
}

// marcar seleccionado
function highlightSelected() {
    document.querySelectorAll(".style-card").forEach(card => {
        card.classList.toggle("selected", card.dataset.style === selectedStyle);
    });
}

// selecciona un estilo y actualiza preview
function selectStyle(style) {
    selectedStyle = style;
    const seed = seedInput.value.trim() || "Usuario";
    avatarPreview.src = dicebearUrl(selectedStyle, seed);
    highlightSelected();
}

// eventos
randomSeedBtn.addEventListener("click", () => {
    const s = randomSeed(10);
    seedInput.value = s;
    selectStyle(selectedStyle);
});

seedInput.addEventListener("input", () => {
    const seed = seedInput.value.trim() || "Usuario";
    avatarPreview.src = dicebearUrl(selectedStyle, seed);
    // actualizar thumbs para que muestren la nueva semilla
    document.querySelectorAll(".style-thumb img").forEach((img, i) => {
        img.src = dicebearUrl(STYLES[i], seed);
    });
});

// guardar
guardarBtn.addEventListener("click", async () => {
    const seed = seedInput.value.trim();
    if (!seed) {
        statusMsg.innerHTML = `<div class="alert alert-danger py-1">Ingresá una semilla (seed) para generar tu avatar.</div>`;
        return;
    }

    guardarBtn.disabled = true;
    guardarBtn.innerHTML = `<i class="fas fa-spinner fa-spin me-1"></i> Guardando...`;

    try {
        const res = await fetch(SAVE_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                style: selectedStyle,
                seed
            })
        });
        const data = await res.json();
        if (res.ok && data.success) {
            statusMsg.innerHTML = `<div class="alert alert-success py-1">Avatar guardado correctamente.</div>`;
            // Actualizar navbar/profile general: buscamos imágenes con clase .profile y las cambiamos
            const newAvatar = dicebearUrl(selectedStyle, seed, 80);
            document.querySelectorAll(".profile").forEach(img => {
                img.src = newAvatar;
            });
        } else {
            statusMsg.innerHTML = `<div class="alert alert-danger py-1">Error: ${data.error || "No se pudo guardar."}</div>`;
        }
    } catch (err) {
        statusMsg.innerHTML = `<div class="alert alert-danger py-1">Error de red o servidor.</div>`;
    } finally {
        guardarBtn.disabled = false;
        guardarBtn.innerHTML = `<i class="fas fa-save me-1"></i> Guardar avatar`;
    }
});

// Cargar datos del usuario (nombre + avatar si existe)
async function init() {
    renderStyles("Usuario");
    try {
        const res = await fetch(GET_USER_URL);
        const data = await res.json();
        if (data.error) {
            // no logueado: dejá valores por defecto
            seedInput.value = "";
            selectedStyle = STYLES[0];
        } else {
            const seed = data.avatar_seed || (data.nombre ? data.nombre : "Usuario");
            const style = data.avatar_style || STYLES[0];
            seedInput.value = seed;
            selectedStyle = style;
            // set preview and thumbs
            avatarPreview.src = dicebearUrl(selectedStyle, seed);
            renderStyles(seed);
            // si querés mostrar nombre en la página:
            // document.getElementById('someElement').textContent = data.nombre + ' ' + data.apellido;
        }
    } catch (err) {
        // fallback
        seedInput.value = "";
        selectedStyle = STYLES[0];
        avatarPreview.src = dicebearUrl(selectedStyle, "Usuario");
    }
    highlightSelected();
}

init();