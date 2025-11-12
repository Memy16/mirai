const urlParams = new URLSearchParams(window.location.search);
const idTema = urlParams.get('id');

// mostrar notificaciones
function mostrarNotificacion(mensaje, tipo = 'success') {
    const notificaciones = document.getElementById('notificaciones');
    const alerta = document.createElement('div');
    alerta.className = `alert alert-${tipo === 'success' ? 'success' : 'danger'} alert-dismissible fade show`;
    alerta.innerHTML = `
            ${mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
    notificaciones.appendChild(alerta);

    // Auto-eliminar después de 5 segundos
    setTimeout(() => {
        if (alerta.parentNode) {
            alerta.remove();
        }
    }, 5000);
}

function getBadgeClass(rol) {
    switch (rol.toLowerCase()) {
        case 'docente':
            return 'badge-docente';
        case 'estudiante':
            return 'badge-estudiante';
        case 'adscripta':
            return 'badge-adscripta';
        default:
            return 'badge-secondary';
    }
}

async function cargarMensajes() {
    try {
        const cont = document.getElementById("mensajes");

        const res = await fetch(`../php/foro/get_posts.php?id_tema=${idTema}`);

        if (!res.ok) {
            throw new Error(`Error HTTP: ${res.status}`);
        }

        const mensajes = await res.json();
        cont.innerHTML = "";

        if (mensajes.length === 0) {
            cont.innerHTML = `
                    <div class="alert alert-info text-center">
                        <i class="bi bi-chat-square-text"></i> No hay mensajes en este hilo todavía.
                        <br><small>Sé el primero en comentar.</small>
                    </div>`;
            return;
        }

        mensajes.forEach(m => {
            const badgeClass = getBadgeClass(m.rol);
            const mensajeDiv = document.createElement('div');
            mensajeDiv.className = 'card mb-3 shadow-sm';
            mensajeDiv.innerHTML = `
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center">
                            <strong>${m.nombre}</strong>
                            <span class="badge ${badgeClass}">${m.rol}</span>
                        </div>
                        <p class="mt-2 mb-2">${m.mensaje}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <small class="text-muted">${new Date(m.fecha).toLocaleString()}</small>
                            <button class="btn btn-outline-danger btn-sm like-btn" data-id="${m.id}">
                                <i class="bi bi-heart"></i> <span class="like-count">${m.likes}</span>
                            </button>
                        </div>
                    </div>`;
            cont.appendChild(mensajeDiv);
        });

        document.querySelectorAll('.like-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                const postId = this.getAttribute('data-id');
                like(postId);
            });
        });

    } catch (error) {
        console.error('Error cargando mensajes:', error);
        const cont = document.getElementById("mensajes");
        cont.innerHTML = `
                <div class="alert alert-danger text-center">
                    <i class="bi bi-exclamation-triangle"></i> Error al cargar los mensajes.
                    <br><small>${error.message}</small>
                </div>`;
    }
}

async function like(id) {
    try {
        const formData = new FormData();
        formData.append("id", id);

        const res = await fetch("../php/foro/like_post.php", {
            method: "POST",
            body: formData
        });

        const result = await res.json();
        if (result.success) {
            // Actualizar el contador visualmente
            const likeBtn = document.querySelector(`.like-btn[data-id="${id}"]`);
            const likeCount = likeBtn.querySelector('.like-count');
            likeCount.textContent = parseInt(likeCount.textContent) + 1;

            likeBtn.classList.add('btn-danger');
            likeBtn.classList.remove('btn-outline-danger');
            setTimeout(() => {
                likeBtn.classList.remove('btn-danger');
                likeBtn.classList.add('btn-outline-danger');
            }, 500);

        } else {
            mostrarNotificacion('Error al dar like', 'error');
        }
    } catch (error) {
        console.error('Error dando like:', error);
        mostrarNotificacion('Error de conexión al dar like', 'error');
    }
}

document.getElementById("formMensaje").addEventListener("submit", async e => {
    e.preventDefault();

    const mensajeInput = e.target.mensaje;
    const mensaje = mensajeInput.value.trim();
    const btnEnviar = document.getElementById('btnEnviar');
    const btnText = document.getElementById('btnText');
    const btnLoading = document.getElementById('btnLoading');

    if (!mensaje) {
        mostrarNotificacion('Por favor escribe un mensaje', 'error');
        mensajeInput.focus();
        return;
    }

    try {
        // Mostrar loading
        btnText.classList.add('d-none');
        btnLoading.classList.remove('d-none');
        btnEnviar.disabled = true;

        const datos = new FormData(e.target);
        datos.append("id_tema", idTema);

        const res = await fetch("../php/foro/add_post.php", {
            method: "POST",
            body: datos
        });

        const result = await res.json();

        if (result.success) {
            mensajeInput.value = '';
            mostrarNotificacion('Mensaje enviado correctamente');
            await cargarMensajes(); // Recargar mensajes
        } else {
            console.error('Error del servidor:', result);
            mostrarNotificacion('Error: ' + (result.error || 'No se pudo enviar el mensaje'),
                'error');
        }
    } catch (error) {
        console.error('Error enviando mensaje:', error);
        mostrarNotificacion('Error de conexión. Intenta nuevamente.', 'error');
    } finally {
        // Ocultar loading
        btnText.classList.remove('d-none');
        btnLoading.classList.add('d-none');
        btnEnviar.disabled = false;
    }
});

document.addEventListener('DOMContentLoaded', function () {
    cargarMensajes();

    const successParam = urlParams.get('success');
    if (successParam === 'true') {
        mostrarNotificacion('Tema creado correctamente');
    }
});