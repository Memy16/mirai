document.addEventListener('DOMContentLoaded', () => {
    const btnAbrir = document.getElementById('btn-asignar-grupo');
    const listaSection = document.getElementById('asignar-grupo');
    const gruposContainer = document.getElementById('grupos-container');
    const titulo = document.getElementById('titulo-asignar');
    const btnConfirmar = document.getElementById('btn-confirmar-asignacion');
    const inputIdAlumno = document.getElementById('input-id-alumno');
    const inputIdGrupo = document.getElementById('input-id-grupo');
    const form = document.getElementById('form-asignar-grupo');
    const btnCambiar = document.getElementById('btn-cambiar-grupo');

    const msgSinGrupo = document.getElementById('mensaje-registrado-sin-grupo');
    const msgGrupo = document.getElementById('mensaje-registrado-grupo');
    const textoGrupo = document.getElementById('texto-registrado-grupo');

    if (!btnConfirmar || !form) return;

    let grupoSeleccionado = null;
    btnConfirmar.disabled = true;
    
    async function abrirSelector(cambiar = false) {
        listaSection.classList.remove('d-none');

        inputIdAlumno.value = window.alumnoSeleccionado?.id_alumno ?? "";

        titulo.textContent = cambiar
            ? `Cambiar alumno ${window.alumnoSeleccionado.nombre} ${window.alumnoSeleccionado.apellido} de grupo`
            : `Asignar alumno ${window.alumnoSeleccionado.nombre} ${window.alumnoSeleccionado.apellido} a un grupo`;

        gruposContainer.innerHTML = `
            <div class="progress">
                <div class="progress-bar progress-bar-striped progress-bar-animated" style="width: 75%;"></div>
            </div>`;

        const resp = await fetch('../php/grupos/listar_grupos.php', { cache: "no-store" });
        const grupos = await resp.json();

        gruposContainer.innerHTML = '';

        grupos.forEach(g => {
            const item = document.createElement('div');
            item.className = 'grupo-item card m-2 p-3 text-center';
            item.style.cursor = 'pointer';
            item.dataset.id = g.id_grupo;

            item.innerHTML = `
                <strong>${g.grado} ${g.nombre}</strong><br>
                <small>${g.especificacion ?? ''} ${g.turno ? '- ' + g.turno : ''}</small>
            `;

            item.addEventListener('click', () => {
                document.querySelectorAll('.grupo-item').forEach(el => el.classList.remove('grupo-seleccionado'));
                item.classList.add('grupo-seleccionado');
                inputIdGrupo.value = g.id_grupo;
                grupoSeleccionado = g;
                btnConfirmar.disabled = false;
            });

            gruposContainer.appendChild(item);
        });

        form.dataset.modo = cambiar ? "cambiar" : "asignar";
    }

    btnAbrir?.addEventListener('click', () => abrirSelector(false));
    btnCambiar?.addEventListener('click', () => abrirSelector(true));
    
    btnConfirmar.addEventListener('click', async (e) => {
        e.preventDefault();

        const alumno = window.alumnoSeleccionado;
        const grupo = grupoSeleccionado;
        const modo = form.dataset.modo;

        if (!grupo) {
            Swal.fire('Error', 'Debe seleccionar un grupo antes de continuar.', 'error');
            return;
        }

        const result = await Swal.fire({
            title: modo === "cambiar" ? '¿Cambiar grupo?' : '¿Asignar grupo?',
            html: `Alumno: <b>${alumno.nombre} ${alumno.apellido}</b><br>
                    Grupo: <b>${grupo.grado} ${grupo.nombre} ${grupo.especificacion ?? ''}</b>`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: modo === "cambiar" ? 'Sí, cambiar' : 'Sí, asignar',
            cancelButtonText: 'Cancelar'
        });

        if (!result.isConfirmed) return;

        const url = modo === "cambiar"
            ? '../php/gestion_alumnos/cambiar_grupo.php'
            : '../php/gestion_alumnos/asignar_grupo.php';

        const formData = new FormData(form);

        const resp = await fetch(url, { method: 'POST', body: formData });

        let data;
        try {
            data = await resp.json();
            console.log(data)
        } catch (error) {
            Swal.fire("Error del servidor", "La respuesta no es JSON válido", "error");
            console.error("Respuesta RAW:", await resp.text());
            return;
        }

        if (!data.success) {
            Swal.fire("Error", data.message ?? "No se pudo asignar el grupo", "error");
            return;
        }
        
        msgSinGrupo?.classList.add('d-none');
        textoGrupo.textContent = `El alumno ${alumno.nombre} ${alumno.apellido} está en el grupo ${grupo.grado} ${grupo.nombre} ${grupo.especificacion ?? ''}.`;
        msgGrupo?.classList.remove('d-none');
        listaSection.classList.add('d-none');

        Swal.fire({
            icon: 'success',
            title: modo === "cambiar" ? 'Grupo actualizado' : 'Grupo asignado',
            html: `El alumno <b>${alumno.nombre} ${alumno.apellido}</b> ahora está en <b>${grupo.grado} ${grupo.nombre}</b>.`,
            confirmButtonText: 'OK'
        });
    });
});
