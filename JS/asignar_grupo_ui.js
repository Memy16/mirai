document.addEventListener('DOMContentLoaded', () => {
    const btnAbrir = document.getElementById('btn-asignar-grupo');
    const listaSection = document.getElementById('asignar-grupo');
    const gruposContainer = document.getElementById('grupos-container');
    const titulo = document.getElementById('titulo-asignar');
    const btnConfirmar = document.getElementById('btn-confirmar-asignacion');
    const inputIdAlumno = document.getElementById('input-id-alumno');
    const inputIdGrupo = document.getElementById('input-id-grupo');
    const form = document.getElementById('form-asignar-grupo');
    
    const msgSinGrupo = document.getElementById('mensaje-registrado-sin-grupo');
    const msgGrupo = document.getElementById('mensaje-registrado-grupo');
    const textoGrupo = document.getElementById('texto-registrado-grupo');
    
    if (!btnAbrir || !listaSection || !gruposContainer || !btnConfirmar || !form) return;
    
    let grupoSeleccionado = null;
    btnConfirmar.disabled = true;
    
    // 🔹 1. Mostrar la sección al hacer clic en "Asignar grupo"
    btnAbrir.addEventListener('click', async () => {
        listaSection.classList.remove('d-none');
        btnAbrir.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        if (window.alumnoSeleccionado) {
            titulo.textContent = `Asignar alumno ${window.alumnoSeleccionado.nombre} ${window.alumnoSeleccionado.apellido} a un grupo`;
            inputIdAlumno.value = window.alumnoSeleccionado.id_alumno;
        } else {
            titulo.textContent = `Seleccione el grupo al que quiere asignar a este alumno`;
        }
        
        gruposContainer.innerHTML = `
            <div class="progress">
                <div class="progress-bar progress-bar-striped progress-bar-animated" style="width: 75%;"></div>
            </div>`;
            
        // 🔹 2. Cargar grupos desde PHP
        try {
            const resp = await fetch('../php/listar_grupos.php', { cache: "no-store" });
            const grupos = await resp.json();
            gruposContainer.innerHTML = '';
            
            if (!Array.isArray(grupos) || grupos.length === 0) {
                gruposContainer.innerHTML = `<div class="alert alert-info">No hay grupos disponibles.</div>`;
                return;
            }

            grupos.forEach(g => {
                const item = document.createElement('div');
                item.className = 'grupo-item card m-2 p-3 text-center';
                item.style.cursor = 'pointer';
                item.dataset.id = g.id_grupo;
                item.innerHTML = `
                    <strong>${g.grado} ${g.nombre}</strong><br>
                    <small>${g.especificacion ?? ''} ${g.turno ? '- ' + g.turno : ''}</small>
                `;
                
                // 🔹 3. Seleccionar visualmente un grupo
                item.addEventListener('click', () => {
                    document.querySelectorAll('.grupo-item').forEach(el => el.classList.remove('grupo-seleccionado'));
                    item.classList.add('grupo-seleccionado');
                    inputIdGrupo.value = g.id_grupo;
                    grupoSeleccionado = g;
                    window.grupoSeleccionadoTemporal = g;
                    btnConfirmar.disabled = false;
                });

                gruposContainer.appendChild(item);
            });
            
        } catch (err) {
            console.error('Error cargando grupos:', err);
            gruposContainer.innerHTML = `<div class="alert alert-warning">Error al cargar los grupos.</div>`;
        }
    });
    
    // 🔹 4. Confirmar y enviar formulario clásico
    btnConfirmar.addEventListener('click', (e) => {
        e.preventDefault();

        const alumno = window.alumnoSeleccionado;
        const grupo = grupoSeleccionado;

        if (!grupo) {
            Swal.fire('Error', 'Debe seleccionar un grupo antes de continuar.', 'error');
            return;
        }
        
        Swal.fire({
            title: '¿Asignar grupo?',
            html: `¿Desea asignar al alumno <b>${alumno.nombre} ${alumno.apellido}</b> al grupo <b>${grupo.grado} ${grupo.nombre} ${grupo.especificacion ?? ''}</b>?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, asignar',
            cancelButtonText: 'Cancelar'
        }).then(result => {
            if (result.isConfirmed) {
                // Actualizar la interfaz (sin recargar todavía)
                if (msgSinGrupo) msgSinGrupo.classList.add('d-none');
                if (textoGrupo) {
                    textoGrupo.textContent = `El alumno ${alumno.nombre} ${alumno.apellido} se encuentra en el grupo ${grupo.grado} ${grupo.nombre} ${grupo.especificacion ?? ''}.`;
                }
                if (msgGrupo) msgGrupo.classList.remove('d-none');
                
                listaSection.classList.add('d-none');

                // Enviar el formulario al PHP (clásico)
                form.submit();
            }
        });
    });
});
