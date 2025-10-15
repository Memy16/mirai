/*document.addEventListener('DOMContentLoaded', () => {
    const btnConfirmar = document.getElementById('btn-confirmar-asignacion');
    const listaSection = document.getElementById('asignar-grupo');
    const msgSinGrupo = document.getElementById('mensaje-registrado-sin-grupo');
    const msgGrupo = document.getElementById('mensaje-registrado-grupo');
    const textoGrupo = document.getElementById('texto-registrado-grupo');
    
    if (!btnConfirmar) return;
    
    btnConfirmar.addEventListener('click', async () => {
        // Verificar que haya selección
        const grupo = window.grupoSeleccionadoTemporal;
        const alumno = window.alumnoSeleccionado;
        
        if (!alumno || !grupo) {
            Swal.fire('Error', 'Falta seleccionar alumno o grupo.', 'error');
            return;
        }
        
        // Confirmar la acción
        const confirmar = await Swal.fire({
            title: '¿Asignar grupo?',
            html: `¿Desea asignar al alumno <b>${alumno.nombre} ${alumno.apellido}</b> al grupo <b>${grupo.grado} ${grupo.nombre} ${grupo.especificacion ?? ''}</b>?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, asignar',
            cancelButtonText: 'Cancelar'
        });
        
        if (!confirmar.isConfirmed) return;
        
        // Mostrar loader
        Swal.fire({
            title: 'Asignando grupo...',
            text: 'Por favor espere',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
        });
        
        // Enviar datos al servidor
        try {
            const formData = new FormData();
            formData.append('id_alumno', alumno.id_alumno);
            formData.append('id_grupo', grupo.id_grupo);
            
            const resp = await fetch('../php/gestion_alumnos/asignar_grupo.php', {
                method: 'POST',
                body: formData
            });
            
            const data = await resp.json();
            Swal.close();
            
            // Mostrar resultado
            Swal.fire(data.titulo, data.mensaje, data.tipo);
            
            // Si se guardó correctamente, actualizar interfaz
            if (data.success) {
                if (msgSinGrupo) msgSinGrupo.classList.add('d-none');
                if (textoGrupo) {
                    textoGrupo.textContent = `El alumno ${alumno.nombre} ${alumno.apellido} se encuentra en el grupo ${grupo.grado} ${grupo.nombre} ${grupo.especificacion ?? ''}.`;
                }
                if (msgGrupo) msgGrupo.classList.remove('d-none');
                listaSection.classList.add('d-none');
            }
        
        } catch (error) {
            console.error('Error al asignar grupo:', error);
            Swal.close();
            Swal.fire('Error', 'No se pudo conectar con el servidor.', 'error');
        }
    });
});*/