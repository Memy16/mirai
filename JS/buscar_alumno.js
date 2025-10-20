document.addEventListener('DOMContentLoaded', () => {
    const buscarForm = document.getElementById('buscarAlumnoForm');
    if (!buscarForm) return; 

    buscarForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const formData = new FormData(this);

        const alertaDiv = document.getElementById('alertas');
        const infoSection = document.getElementById('infoEstudianteSection');

        const msgGrupo = document.getElementById('mensaje-registrado-grupo');
        const msgNoReg = document.getElementById('mensaje-no-registrado');
        const msgSinGrupo = document.getElementById('mensaje-registrado-sin-grupo');

        
        [msgGrupo, msgNoReg, msgSinGrupo].forEach(div => {
            if (div) div.classList.add('d-none');
        });

        try {
            
            const res = await fetch('../php/gestion_alumnos/buscar_alumno.php', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            console.log(data.registrado);

            if (!alertaDiv) throw new Error("No existe el div de alertas");

            if (data.registrado === true) {
                alertaDiv.innerHTML = `
                    <div class="alert alert-dismissible alert-success">
                        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                        <strong>Alumno registrado</strong>
                    </div>
                `;

                
                const infoRes = await fetch('../php/gestion_alumnos/obtener_info.php', {
                    method: 'POST',
                    body: formData
                });
                const info = await infoRes.json();

                if (info.existe && infoSection) {
                    document.getElementById('nombre').value = info.nombre || '';
                    document.getElementById('apellido').value = info.apellido || '';
                    document.getElementById('cedula').value = info.ci_alumno || '';
                    document.getElementById('telefonoReferente').value = info.tel_referente || '';

                    infoSection.style.display = "block";

                    window.alumnoSeleccionado = {
                        id_alumno: info.id_alumno,
                        nombre: info.nombre,
                        apellido: info.apellido
                    };
                }

                
                const estadoRes = await fetch('../php/gestion_alumnos/estado_alumno.php', {
                    method: 'POST',
                    body: formData
                });
                const dataEstado = await estadoRes.json();

                if (dataEstado) {
                    if (dataEstado.estado === 'no_registrado' && msgNoReg) {
                        msgNoReg.classList.remove('d-none');
                    } else if (dataEstado.estado === 'registrado_sin_grupo' && msgSinGrupo) {
                        const textoSinGrupo = document.getElementById('texto-registrado-sin-grupo');
                        if (textoSinGrupo) {
                            textoSinGrupo.textContent = `El alumno ${dataEstado.nombre} ${dataEstado.apellido} no se encuentra asignado en ningún grupo.`;
                        }
                        msgSinGrupo.classList.remove('d-none');
                    } else if (dataEstado.estado === 'registrado_con_grupo' && msgGrupo) {
                        const textoGrupo = document.getElementById('texto-registrado-grupo');
                        if (textoGrupo) {
                            textoGrupo.textContent = `El alumno ${dataEstado.nombre} ${dataEstado.apellido} se encuentra en el grupo ${dataEstado.grupo}.`;
                        }
                        msgGrupo.classList.remove('d-none');
                    }
                }

            } else {
                alertaDiv.innerHTML = `
                    <div class="alert alert-dismissible alert-danger">
                        <strong>Este alumno no está registrado</strong>
                    </div>
                `;
                if (infoSection) infoSection.style.display = "none";
                if (msgNoReg) msgNoReg.classList.remove('d-none');
            }

        } catch (err) {
            console.error('Error en la búsqueda del alumno:', err);
            if (alertaDiv) {
                alertaDiv.innerHTML = `
                    <div class="alert alert-dismissible alert-danger">
                        <strong>Error al procesar la solicitud</strong>
                    </div>
                `;
            }
        }
    });
});
