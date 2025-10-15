document.getElementById('buscarAlumnoForm').addEventListener('submit', function (e) {
    e.preventDefault();
    let formData = new FormData(this);
    
    fetch('../php/gestion_alumnos/buscar_alumno.php', {
            method: 'POST',
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            const alertaDiv = document.getElementById('alertas');
            alertaDiv.innerHTML = '';
            const infoSection = document.getElementById('infoEstudianteSection');
            
            const msgGrupo = document.getElementById('mensaje-registrado-grupo');
            const msgNoReg = document.getElementById('mensaje-no-registrado');
            const msgSinGrupo = document.getElementById('mensaje-registrado-sin-grupo');
            [msgGrupo, msgNoReg, msgSinGrupo].forEach(div => div.classList.add('d-none'));
            
            if (data.registrado) {
                alertaDiv.innerHTML =
                    `<div class="alert alert-dismissible alert-success">
                        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                        <strong>Alumno registrado</strong>
                    </div>`;
                    
                fetch('../php/gestion_alumnos/obtener_info.php', {
                        method: 'POST',
                        body: formData
                    })
                    .then(res => res.json())
                    .then(info => {
                        if (info.existe) {
                            document.getElementById('nombre').value = info.nombre;
                            document.getElementById('apellido').value = info.apellido;
                            document.getElementById('cedula').value = info.ci_alumno;
                            document.getElementById('telefonoReferente').value = info.tel_referente;
                            
                            document.getElementById('infoEstudianteSection').style.display = "block";
                            
                            window.alumnoSeleccionado = {
                                id_alumno: info.id_alumno,
                                nombre: info.nombre,
                                apellido: info.apellido
                            };
                        }
                    });
                    
                    fetch('../php/gestion_alumnos/estado_alumno.php', {
                    method: 'POST',
                    body: formData
                })
                    .then(res => res.json())
                    .then(dataEstado => {
                        if (dataEstado.estado === 'no_registrado') {
                            msgNoReg.classList.remove('d-none');
                        } else if (dataEstado.estado === 'registrado_sin_grupo') {
                            document.getElementById('texto-registrado-sin-grupo').textContent =
                                `El alumno ${dataEstado.nombre} ${dataEstado.apellido} no se encuentra asignado en ningún grupo.`;
                            msgSinGrupo.classList.remove('d-none');
                        } else if (dataEstado.estado === 'registrado_con_grupo') {
                            document.getElementById('texto-registrado-grupo').textContent =
                                `El alumno ${dataEstado.nombre} ${dataEstado.apellido} se encuentra en el grupo ${dataEstado.grupo}.`;
                            msgGrupo.classList.remove('d-none');
                        }
                    })
                    .catch(err => {
                        console.error('Error al obtener estado del alumno:', err);
                    });
                    
            } else {
                alertaDiv.innerHTML =
                    `<div class="alert alert-dismissible alert-danger">
                        <strong>Este alumno no está registrado</strong>
                    </div>`;
                    
                document.getElementById('infoEstudianteSection').style.display = "none";
                
                msgNoReg.classList.remove('d-none');
            }
        });
});