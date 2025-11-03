// foro.js - Funcionalidad del foro de Klasso

// Función para mostrar notificaciones
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

// Cargar temas del foro
async function cargarTemas() {
    try {
        const res = await fetch("../php/foro/get_topics.php");
        
        if (!res.ok) {
            throw new Error(`Error HTTP: ${res.status}`);
        }
        
        const temas = await res.json();
        const cont = document.getElementById("temas");
        cont.innerHTML = "";
        
        if (temas.length === 0) {
            cont.innerHTML = `
                <div class="alert alert-info text-center">
                    <i class="bi bi-chat-square-text"></i> No hay temas en el foro todavía.
                    <br><small>Sé el primero en crear un tema.</small>
                </div>`;
            return;
        }
        
        temas.forEach(t => {
            const temaDiv = document.createElement('div');
            temaDiv.className = 'card mb-3';
            temaDiv.innerHTML = `
                <div class="card-body">
                    <h5><a href="hilo.html?id=${t.id}" class="text-decoration-none">${t.titulo}</a></h5>
                    ${t.descripcion ? `<p class="text-muted">${t.descripcion}</p>` : ''}
                    <small class="text-muted">${new Date(t.fecha).toLocaleString()}</small>
                </div>`;
            cont.appendChild(temaDiv);
        });

    } catch (error) {
        console.error('Error cargando temas:', error);
        const cont = document.getElementById("temas");
        cont.innerHTML = `
            <div class="alert alert-danger text-center">
                <i class="bi bi-exclamation-triangle"></i> Error al cargar los temas.
                <br><small>${error.message}</small>
            </div>`;
    }
}

// Manejar envío del formulario de nuevo tema
function manejarFormularioTema() {
    const formTema = document.getElementById("formTema");
    
    if (!formTema) {
        console.error('Formulario de tema no encontrado');
        return;
    }

    formTema.addEventListener("submit", async e => {
        e.preventDefault();
        
        const tituloInput = e.target.titulo;
        const titulo = tituloInput.value.trim();
        const btnCrearTema = document.getElementById('btnCrearTema');
        const btnText = document.getElementById('btnText');
        const btnLoading = document.getElementById('btnLoading');
        
        if (!titulo) {
            mostrarNotificacion('Por favor escribe un título para el tema', 'error');
            tituloInput.focus();
            return;
        }

        try {
            // Mostrar loading
            btnText.classList.add('d-none');
            btnLoading.classList.remove('d-none');
            btnCrearTema.disabled = true;

            const datos = new FormData(e.target);
            
            const res = await fetch("../php/foro/add_topic.php", {
                method: "POST",
                body: datos
            });
            
            const result = await res.json();
            
            if (result.success) {
                e.target.reset();
                mostrarNotificacion('Tema creado correctamente');
                await cargarTemas(); // Recargar temas
            } else {
                console.error('Error del servidor:', result);
                mostrarNotificacion('Error: ' + (result.error || 'No se pudo crear el tema'), 'error');
            }
        } catch (error) {
            console.error('Error creando tema:', error);
            mostrarNotificacion('Error de conexión. Intenta nuevamente.', 'error');
        } finally {
            // Ocultar loading
            if (btnText && btnLoading && btnCrearTema) {
                btnText.classList.remove('d-none');
                btnLoading.classList.add('d-none');
                btnCrearTema.disabled = false;
            }
        }
    });
}

// Inicializar el foro cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('Inicializando foro...');
    
    // Verificar que los elementos necesarios existan
    if (!document.getElementById('temas')) {
        console.error('Elemento "temas" no encontrado');
        return;
    }
    
    // Inicializar funcionalidades
    manejarFormularioTema();
    cargarTemas();
    
    console.log('Foro inicializado correctamente');
});

// Exportar funciones para uso global (si es necesario)
window.mostrarNotificacion = mostrarNotificacion;
window.cargarTemas = cargarTemas;